const path = require('path');
const Database = require('better-sqlite3');

function initializeSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      role TEXT NOT NULL DEFAULT 'user',
      status TEXT NOT NULL DEFAULT 'active',
      lastLogin TEXT,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      action TEXT NOT NULL,
      resource TEXT NOT NULL,
      details TEXT,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS dashboard_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      label TEXT NOT NULL UNIQUE,
      value TEXT NOT NULL,
      change REAL NOT NULL DEFAULT 0,
      period TEXT NOT NULL DEFAULT 'month',
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

module.exports = { initializeSchema };
