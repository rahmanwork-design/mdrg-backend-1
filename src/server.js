const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { initDatabase } = require('./database');
const authRoutes = require('../routes/auth');
const clientRoutes = require('../routes/clients');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware - allow all origins for now (can be restricted later)
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'MDRG API is running.',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Dashboard stats endpoint
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const { dbQuery, dbGet } = require('./database');
    
    const totalClients = await dbGet('SELECT COUNT(*) as count FROM clients');
    const totalCases = await dbGet('SELECT COUNT(*) as count FROM cases');
    const activeCases = await dbGet("SELECT COUNT(*) as count FROM cases WHERE status = 'in_progress'");
    const pendingCases = await dbGet("SELECT COUNT(*) as count FROM cases WHERE status = 'pending'");
    const resolvedCases = await dbGet("SELECT COUNT(*) as count FROM cases WHERE status = 'resolved'");
    const totalPayments = await dbGet("SELECT SUM(amount) as total FROM payments WHERE status = 'completed'");

    res.json({
      success: true,
      data: {
        totalClients: totalClients.count,
        totalCases: totalCases.count,
        activeCases: activeCases.count,
        pendingCases: pendingCases.count,
        resolvedCases: resolvedCases.count,
        totalCollected: totalPayments.total || 0
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard stats.',
      error: error.message
    });
  }
});

// Recent activity endpoint
app.get('/api/activity/recent', async (req, res) => {
  try {
    const { dbQuery } = require('./database');
    
    const activities = await dbQuery(
      `SELECT a.*, c.first_name, c.last_name, c.company_name
       FROM activity_log a
       LEFT JOIN clients c ON a.user_id = c.client_id
       ORDER BY a.created_at DESC
       LIMIT 50`
    );

    res.json({
      success: true,
      data: activities
    });
  } catch (error) {
    console.error('Activity fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching activity.',
      error: error.message
    });
  }
});

// ============================================
// PAYTIA INTEGRATION API
// ============================================

// Paytia API Authentication Middleware
const paytiaAuth = (req, res, next) => {
  const apiKey = req.headers['x-paytia-api-key'];
  const expectedApiKey = process.env.PAYTIA_API_KEY || 'paytia-test-key-2026';
  
  if (!apiKey || apiKey !== expectedApiKey) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized. Invalid or missing API key.'
    });
  }
  next();
};

// Paytia: Verify Account and Get Balance
// POST /api/paytia/verify
// Body: { accountNumber: "MDRG-12345" }
app.post('/api/paytia/verify', paytiaAuth, async (req, res) => {
  try {
    const { accountNumber } = req.body;
    
    if (!accountNumber) {
      return res.status(400).json({
        success: false,
        message: 'Account number is required.'
      });
    }
    
    const { dbGet, dbQuery } = require('./database');
    
    // Look up the case by account/reference number
    const caseData = await dbGet(
      `SELECT c.*, cl.first_name, cl.last_name, cl.company_name, cl.email, cl.phone
       FROM cases c
       JOIN clients cl ON c.client_id = cl.client_id
       WHERE c.reference_number = ? OR c.case_id = ?`,
      [accountNumber, accountNumber]
    );
    
    if (!caseData) {
      return res.status(404).json({
        success: false,
        message: 'Account not found.',
        exists: false
      });
    }
    
    // Calculate total payments made
    const paymentData = await dbGet(
      `SELECT SUM(amount) as total_paid 
       FROM payments 
       WHERE case_id = ? AND status = 'completed'`,
      [caseData.case_id]
    );
    
    const totalPaid = paymentData.total_paid || 0;
    const outstandingBalance = caseData.amount - totalPaid;
    
    // Log the lookup for audit
    await dbQuery(
      `INSERT INTO activity_log (user_id, action, details, ip_address) 
       VALUES (?, 'paytia_account_lookup', ?, ?)`,
      [caseData.client_id, `Account ${accountNumber} looked up via Paytia`, req.ip]
    );
    
    res.json({
      success: true,
      exists: true,
      accountNumber: accountNumber,
      caseReference: caseData.reference_number,
      customerName: caseData.company_name || `${caseData.first_name} ${caseData.last_name}`,
      totalAmount: caseData.amount,
      totalPaid: totalPaid,
      outstandingBalance: outstandingBalance,
      status: outstandingBalance <= 0 ? 'paid' : caseData.status,
      currency: 'GBP'
    });
    
  } catch (error) {
    console.error('Paytia verify error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying account.',
      error: error.message
    });
  }
});

// Paytia: Record Payment (after successful payment)
// POST /api/paytia/payment
// Body: { accountNumber: "MDRG-12345", amount: 250.00, transactionId: "TXN-123", paymentMethod: "card" }
app.post('/api/paytia/payment', paytiaAuth, async (req, res) => {
  try {
    const { accountNumber, amount, transactionId, paymentMethod } = req.body;
    
    if (!accountNumber || !amount || !transactionId) {
      return res.status(400).json({
        success: false,
        message: 'Account number, amount, and transaction ID are required.'
      });
    }
    
    const { dbGet, dbRun } = require('./database');
    
    // Find the case
    const caseData = await dbGet(
      `SELECT c.*, cl.client_id, cl.email
       FROM cases c
       JOIN clients cl ON c.client_id = cl.client_id
       WHERE c.reference_number = ? OR c.case_id = ?`,
      [accountNumber, accountNumber]
    );
    
    if (!caseData) {
      return res.status(404).json({
        success: false,
        message: 'Account not found.'
      });
    }
    
    // Record the payment
    const result = await dbRun(
      `INSERT INTO payments (case_id, client_id, amount, payment_date, payment_method, 
       transaction_reference, status, notes) 
       VALUES (?, ?, ?, datetime('now'), ?, ?, 'completed', ?)`,
      [caseData.case_id, caseData.client_id, amount, paymentMethod || 'card', 
       transactionId, `Payment via Paytia IVR`]
    );
    
    // Update case status if fully paid
    const paymentData = await dbGet(
      `SELECT SUM(amount) as total_paid 
       FROM payments 
       WHERE case_id = ? AND status = 'completed'`,
      [caseData.case_id]
    );
    
    const totalPaid = paymentData.total_paid || 0;
    const newBalance = caseData.amount - totalPaid;
    
    if (newBalance <= 0) {
      await dbRun(
        `UPDATE cases SET status = 'resolved', updated_at = datetime('now') 
         WHERE case_id = ?`,
        [caseData.case_id]
      );
    }
    
    res.json({
      success: true,
      message: 'Payment recorded successfully.',
      paymentId: result.lastID,
      transactionId: transactionId,
      amount: amount,
      newBalance: newBalance > 0 ? newBalance : 0,
      status: newBalance <= 0 ? 'paid_in_full' : 'partial_payment'
    });
    
  } catch (error) {
    console.error('Paytia payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error recording payment.',
      error: error.message
    });
  }
});

// Paytia: Health Check
// GET /api/paytia/health
app.get('/api/paytia/health', (req, res) => {
  res.json({
    success: true,
    message: 'Paytia API is ready.',
    timestamp: new Date().toISOString(),
    endpoints: [
      'POST /api/paytia/verify - Verify account and get balance',
      'POST /api/paytia/payment - Record a payment'
    ]
  });
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../public')));

// API routes should be before the catch-all
// Catch-all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  // Don't handle API routes here
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      success: false,
      message: 'API endpoint not found.'
    });
  }
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Note: 404 handler moved to catch-all route above

// Initialize database and start server
const startServer = async () => {
  try {
    await initDatabase();
    
    app.listen(PORT, () => {
      console.log('='.repeat(50));
      console.log('MDRG Backend Server');
      console.log('='.repeat(50));
      console.log(`Server running on port ${PORT}`);
      console.log(`API URL: http://localhost:${PORT}/api`);
      console.log(`Health Check: http://localhost:${PORT}/api/health`);
      console.log('='.repeat(50));
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
