const express = require('express');
const cors = require('cors');
const path = require('path');
const { db } = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const authRoutes = require('../routes/auth');
const clientRoutes = require('../routes/clients');

// Use routes
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

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'MDRG Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      clients: '/api/clients'
    }
  });
});

// Dashboard stats endpoint
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const { dbQuery, dbGet } = require('./database');
    
    const totalClients = await dbGet('SELECT COUNT(*) as count FROM clients');
    const totalCases = await dbGet('SELECT COUNT(*) as count FROM cases');
    const totalPayments = await dbGet("SELECT SUM(amount) as total FROM payments WHERE status = 'completed'");
    const totalDebt = await dbGet('SELECT SUM(total_debt) as total FROM clients');
    const totalOutstanding = await dbGet('SELECT SUM(balance_due) as total FROM clients');
    const paidClients = await dbGet('SELECT COUNT(*) as count FROM clients WHERE balance_due <= 0');
    const outstandingClients = await dbGet('SELECT COUNT(*) as count FROM clients WHERE balance_due > 0');

    res.json({
      success: true,
      data: {
        totalClients: totalClients.count,
        totalCases: totalCases.count,
        totalCollected: totalPayments.total || 0,
        totalDebt: totalDebt.total || 0,
        totalOutstanding: totalOutstanding.total || 0,
        paidClients: paidClients.count,
        outstandingClients: outstandingClients.count
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

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found.'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error.',
    error: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log('==================================================');
  console.log('MDRG Backend Server');
  console.log('==================================================');
  console.log(`Server running on port ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}/api`);
  console.log(`Health Check: http://localhost:${PORT}/api/health`);
  console.log('==================================================');
});

module.exports = app;
