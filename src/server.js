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
    const totalDebt = await dbGet('SELECT SUM(total_debt) as total FROM clients');
    const totalOutstanding = await dbGet('SELECT SUM(balance_due) as total FROM clients');
    const paidClients = await dbGet('SELECT COUNT(*) as count FROM clients WHERE balance_due <= 0');
    const outstandingClients = await dbGet('SELECT COUNT(*) as count FROM clients WHERE balance_due > 0');

    res.json({
      success: true,
      data: {
        totalClients: totalClients.count,
        totalCases: totalCases.count,
        activeCases: activeCases.count,
        pendingCases: pendingCases.count,
        resolvedCases: resolvedCases.count,
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

// Root endpoint - API info
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'MDRG Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      clients: '/api/clients',
      dashboard: '/api/dashboard/stats'
    }
  });
});

// 404 handler for API routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found.'
  });
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
