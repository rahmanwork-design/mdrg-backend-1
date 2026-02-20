const express = require('express');
const { dbQuery, dbGet, dbRun } = require('../src/database');

const router = express.Router();

// Get all clients
router.get('/', async (req, res) => {
  try {
    const clients = await dbQuery(
      `SELECT client_id, email, first_name, last_name, company_name, phone, 
              status, total_debt, amount_paid, balance_due, original_creditor, account_reference, 
              created_at, last_login 
       FROM clients ORDER BY created_at DESC`
    );

    res.json({
      success: true,
      count: clients.length,
      data: clients
    });

  } catch (error) {
    console.error('Fetch clients error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching clients.',
      error: error.message
    });
  }
});

// Get single client by ID
router.get('/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;
    
    const client = await dbGet(
      `SELECT client_id, email, first_name, last_name, company_name, phone, address, city, postcode,
              status, total_debt, amount_paid, balance_due, order_type, hearing_court, 
              hearing_date, warrant_issued_date, created_at, last_login 
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
      data: client
    });

  } catch (error) {
    console.error('Fetch client error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching client.',
      error: error.message
    });
  }
});

// Get client's cases
router.get('/:clientId/cases', async (req, res) => {
  try {
    const { clientId } = req.params;
    
    const cases = await dbQuery(
      'SELECT * FROM cases WHERE client_id = ? ORDER BY created_at DESC',
      [clientId]
    );

    res.json({
      success: true,
      count: cases.length,
      data: cases
    });

  } catch (error) {
    console.error('Fetch cases error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching cases.',
      error: error.message
    });
  }
});

// Create new case for client
router.post('/:clientId/cases', async (req, res) => {
  try {
    const { clientId } = req.params;
    const { debtor_name, debtor_email, debtor_phone, debtor_address, amount_owed, notes } = req.body;

    // Verify client exists
    const client = await dbGet('SELECT client_id FROM clients WHERE client_id = ?', [clientId]);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found.'
      });
    }

    // Generate case ID
    const caseId = 'CASE' + Date.now();

    // Create case
    await dbRun(
      `INSERT INTO cases (case_id, client_id, debtor_name, debtor_email, debtor_phone, debtor_address, amount_owed, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [caseId, clientId, debtor_name, debtor_email, debtor_phone, debtor_address, amount_owed, notes]
    );

    res.status(201).json({
      success: true,
      message: 'Case created successfully.',
      data: {
        case_id: caseId,
        client_id: clientId,
        debtor_name,
        amount_owed
      }
    });

  } catch (error) {
    console.error('Create case error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating case.',
      error: error.message
    });
  }
});

module.exports = router;
