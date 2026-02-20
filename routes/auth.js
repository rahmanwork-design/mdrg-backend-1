const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { dbQuery, dbGet, dbRun } = require('../src/database');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Generate JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token.'
    });
  }
};

// Generate 8-digit numeric client ID
const generateClientId = async () => {
  let clientId;
  let exists = true;
  
  while (exists) {
    clientId = Math.floor(10000000 + Math.random() * 90000000).toString();
    const existing = await dbGet('SELECT client_id FROM clients WHERE client_id = ?', [clientId]);
    exists = !!existing;
  }
  
  return clientId;
};

// Register new client
router.post('/register', async (req, res) => {
  try {
    const { 
      email, 
      password, 
      first_name, 
      last_name, 
      company_name, 
      phone, 
      address, 
      city, 
      postcode,
      total_debt,
      order_type,
      hearing_court,
      hearing_date,
      warrant_issued_date
    } = req.body;

    // Validation
    if (!email || !password || !first_name || !last_name) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, first name, and last name are required.'
      });
    }

    // Check if email already exists
    const existingUser = await dbGet('SELECT email FROM clients WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.'
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate unique 8-digit client ID
    const clientId = await generateClientId();
    
    // Set debt amount
    const debtAmount = total_debt ? parseFloat(total_debt) : 0;

    // Insert new client
    await dbRun(
      `INSERT INTO clients (client_id, email, password, first_name, last_name, company_name, phone, address, city, postcode, total_debt, balance_due, order_type, hearing_court, hearing_date, warrant_issued_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [clientId, email, hashedPassword, first_name, last_name, company_name, phone, address, city, postcode, debtAmount, debtAmount, order_type || '', hearing_court || '', hearing_date || '', warrant_issued_date || '']
    );

    // Generate token
    const token = generateToken({
      client_id: clientId,
      email,
      first_name,
      last_name
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful.',
      data: {
        client_id: clientId,
        email,
        first_name,
        last_name,
        company_name,
        total_debt: debtAmount,
        balance_due: debtAmount,
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during registration.',
      error: error.message
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    // Find user with debt info
    const user = await dbGet(
      `SELECT client_id, email, password, first_name, last_name, company_name, phone, status, 
              total_debt, amount_paid, balance_due, last_login 
       FROM clients WHERE email = ?`,
      [email]
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Update last login
    await dbRun('UPDATE clients SET last_login = CURRENT_TIMESTAMP WHERE client_id = ?', [user.client_id]);

    // Generate token
    const token = generateToken({
      client_id: user.client_id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name
    });

    res.json({
      success: true,
      message: 'Login successful.',
      data: {
        client_id: user.client_id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        company_name: user.company_name,
        phone: user.phone,
        total_debt: user.total_debt || 0,
        amount_paid: user.amount_paid || 0,
        balance_due: user.balance_due || 0,
        payment_status: (user.balance_due || 0) <= 0 ? 'PAID' : 'OUTSTANDING',
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during login.',
      error: error.message
    });
  }
});

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await dbGet(
      `SELECT client_id, email, first_name, last_name, company_name, phone, address, city, postcode,
              total_debt, amount_paid, balance_due, status, created_at 
       FROM clients WHERE client_id = ?`,
      [req.user.client_id]
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile.',
      error: error.message
    });
  }
});

// Record payment (for IVR system integration)
router.post('/payment', async (req, res) => {
  try {
    const { client_id, amount, payment_method, reference } = req.body;
    
    if (!client_id || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Client ID and amount are required.'
      });
    }
    
    // Find client
    const client = await dbGet('SELECT balance_due, amount_paid FROM clients WHERE client_id = ?', [client_id]);
    
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found.'
      });
    }
    
    const paymentAmount = parseFloat(amount);
    const newAmountPaid = (client.amount_paid || 0) + paymentAmount;
    const newBalance = (client.balance_due || 0) - paymentAmount;
    
    // Update client payment info
    await dbRun(
      'UPDATE clients SET amount_paid = ?, balance_due = ?, updated_at = CURRENT_TIMESTAMP WHERE client_id = ?',
      [newAmountPaid, newBalance, client_id]
    );
    
    // Record payment in payments table
    const paymentId = 'PAY' + Date.now();
    await dbRun(
      `INSERT INTO payments (payment_id, client_id, case_id, amount, payment_method, reference, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [paymentId, client_id, 'N/A', paymentAmount, payment_method || 'IVR', reference || '', 'completed']
    );
    
    res.json({
      success: true,
      message: 'Payment recorded successfully.',
      data: {
        payment_id: paymentId,
        client_id,
        amount_paid: paymentAmount,
        total_paid: newAmountPaid,
        balance_due: newBalance,
        payment_status: newBalance <= 0 ? 'PAID IN FULL' : 'PARTIAL PAYMENT'
      }
    });
    
  } catch (error) {
    console.error('Payment recording error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while recording payment.',
      error: error.message
    });
  }
});

// Get client payment info (for IVR lookup)
router.get('/payment-info/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;
    
    const client = await dbGet(
      `SELECT client_id, first_name, last_name, total_debt, amount_paid, balance_due 
       FROM clients WHERE client_id = ?`,
      [clientId]
    );
    
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found.'
      });
    }
    
    res.json({
      success: true,
      data: {
        client_id: client.client_id,
        name: `${client.first_name} ${client.last_name}`,
        total_debt: client.total_debt || 0,
        amount_paid: client.amount_paid || 0,
        balance_due: client.balance_due || 0,
        payment_status: (client.balance_due || 0) <= 0 ? 'PAID' : 'OUTSTANDING'
      }
    });
    
  } catch (error) {
    console.error('Payment info error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred.',
      error: error.message
    });
  }
});

module.exports = router;
