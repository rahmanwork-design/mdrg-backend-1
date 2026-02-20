const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Database directory
const DB_DIR = path.join(__dirname, '../database');

// Create database directory if it doesn't exist
try {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
} catch (err) {
  console.error('Error creating database directory:', err.message);
}

const DB_PATH = path.join(DB_DIR, 'mdrg.db');
console.log('Database path:', DB_PATH);

// Create database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    initializeDatabase();
  }
});

// Promisified database methods
const dbQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

// Initialize database tables
const initializeDatabase = async () => {
  try {
    // Clients table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS clients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_id TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        company_name TEXT,
        phone TEXT,
        address TEXT,
        city TEXT,
        postcode TEXT,
        country TEXT DEFAULT 'UK',
        status TEXT DEFAULT 'active',
        total_debt REAL DEFAULT 0,
        amount_paid REAL DEFAULT 0,
        balance_due REAL DEFAULT 0,
        order_type TEXT,
        hearing_court TEXT,
        hearing_date TEXT,
        warrant_issued_date TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME
      )
    `);

    // Cases table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS cases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        case_id TEXT UNIQUE NOT NULL,
        client_id TEXT NOT NULL,
        debtor_name TEXT NOT NULL,
        debtor_email TEXT,
        debtor_phone TEXT,
        debtor_address TEXT,
        amount_owed REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES clients(client_id)
      )
    `);

    // Payments table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        payment_id TEXT UNIQUE NOT NULL,
        client_id TEXT NOT NULL,
        case_id TEXT,
        amount REAL NOT NULL,
        payment_method TEXT,
        reference TEXT,
        status TEXT DEFAULT 'completed',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES clients(client_id)
      )
    `);

    // Activity log table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS activity_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_id TEXT,
        action TEXT NOT NULL,
        details TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES clients(client_id)
      )
    `);

    console.log('Database tables initialized successfully.');
  } catch (error) {
    console.error('Error initializing database:', error.message);
  }
};

module.exports = {
  db,
  dbQuery,
  dbGet,
  dbRun
};
