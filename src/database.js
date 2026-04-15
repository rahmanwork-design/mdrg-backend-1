const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '../database/mdrg.db');

// Create database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Helper to check if column exists
const columnExists = (tableName, columnName) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT COUNT(*) as count FROM pragma_table_info(?) WHERE name = ?`,
      [tableName, columnName],
      (err, row) => {
        if (err) reject(err);
        else resolve(row.count > 0);
      }
    );
  });
};

// Helper to add column if not exists
const addColumnIfNotExists = async (tableName, columnName, columnDef) => {
  try {
    const exists = await columnExists(tableName, columnName);
    if (!exists) {
      // Remove UNIQUE constraint for ALTER TABLE (SQLite limitation)
      const cleanDef = columnDef.replace(/UNIQUE/g, '');
      await dbRun(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${cleanDef}`);
      console.log(`✅ Added column ${columnName} to ${tableName}`);
    } else {
      console.log(`ℹ️ Column ${columnName} already exists`);
    }
  } catch (err) {
    // Column might already exist, just log and continue
    console.log(`ℹ️ Column ${columnName}: ${err.message}`);
  }
};

// Generate unique 8-digit reference number
const generateReferenceNumber = async () => {
  let reference;
  let exists = true;
  
  while (exists) {
    // Generate random 8-digit number (between 10000000 and 99999999)
    reference = Math.floor(10000000 + Math.random() * 90000000).toString();
    
    // Check if this reference already exists
    const row = await dbGet('SELECT reference_number FROM clients WHERE reference_number = ?', [reference]);
    exists = !!row;
  }
  
  return reference;
};

// Initialize tables
const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(async () => {
      // Clients table
      db.run(`
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
          reference_number TEXT UNIQUE,
          original_creditor TEXT,
          account_reference TEXT,
          total_debt REAL DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          last_login DATETIME
        )
      `, async (err) => {
        if (err) {
          console.error('Error creating clients table:', err);
        } else {
          // Add new columns if they don't exist (migration)
          // Note: SQLite can't add UNIQUE columns to existing tables
          await addColumnIfNotExists('clients', 'reference_number', 'TEXT');
          await addColumnIfNotExists('clients', 'original_creditor', 'TEXT');
          await addColumnIfNotExists('clients', 'account_reference', 'TEXT');
          await addColumnIfNotExists('clients', 'total_debt', 'REAL DEFAULT 0');
        }
      });

      // Debts/Cases table
      db.run(`
        CREATE TABLE IF NOT EXISTS cases (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          case_id TEXT UNIQUE NOT NULL,
          client_id TEXT NOT NULL,
          debtor_name TEXT NOT NULL,
          debtor_company TEXT,
          debtor_email TEXT,
          debtor_phone TEXT,
          debtor_address TEXT,
          amount_owed REAL NOT NULL,
          currency TEXT DEFAULT 'GBP',
          debt_type TEXT,
          description TEXT,
          status TEXT DEFAULT 'pending',
          priority TEXT DEFAULT 'medium',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          assigned_to TEXT,
          notes TEXT,
          FOREIGN KEY (client_id) REFERENCES clients(client_id)
        )
      `);

      // Payments table
      db.run(`
        CREATE TABLE IF NOT EXISTS payments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          payment_id TEXT UNIQUE NOT NULL,
          case_id TEXT NOT NULL,
          client_id TEXT NOT NULL,
          amount REAL NOT NULL,
          payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
          payment_method TEXT,
          status TEXT DEFAULT 'completed',
          reference TEXT,
          notes TEXT,
          FOREIGN KEY (case_id) REFERENCES cases(case_id),
          FOREIGN KEY (client_id) REFERENCES clients(client_id)
        )
      `);

      // Activity log table
      db.run(`
        CREATE TABLE IF NOT EXISTS activity_log (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id TEXT NOT NULL,
          user_type TEXT DEFAULT 'client',
          action TEXT NOT NULL,
          details TEXT,
          ip_address TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Client documents/files table
      db.run(`
        CREATE TABLE IF NOT EXISTS client_documents (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          document_id TEXT UNIQUE NOT NULL,
          client_id TEXT NOT NULL,
          case_id TEXT,
          document_type TEXT NOT NULL,
          file_name TEXT NOT NULL,
          file_content TEXT,
          file_size INTEGER,
          mime_type TEXT DEFAULT 'text/html',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (client_id) REFERENCES clients(client_id),
          FOREIGN KEY (case_id) REFERENCES cases(case_id)
        )
      `, (err) => {
        if (err) {
          reject(err);
        } else {
          console.log('Database tables initialized successfully.');
          resolve();
        }
      });
    });
  });
};

// Helper functions for database operations
const dbQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
};

const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

module.exports = {
  db,
  initDatabase,
  generateReferenceNumber,
  dbQuery,
  dbRun,
  dbGet
};
