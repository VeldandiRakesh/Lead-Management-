import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcrypt';
import { env } from './env.js';

// Resolve directory and create if it does not exist
const resolvedDbPath = path.resolve(env.dbPath);
const dbDirectory = path.dirname(resolvedDbPath);

if (!fs.existsSync(dbDirectory)) {
  fs.mkdirSync(dbDirectory, { recursive: true });
  console.log(`[Database] Created directory structure for database at: ${dbDirectory}`);
}

let db;

try {
  // Establish connection using built-in node:sqlite
  db = new DatabaseSync(resolvedDbPath);

  // Enable foreign keys constraint and WAL journal mode
  db.exec('PRAGMA foreign_keys = ON;');
  db.exec('PRAGMA journal_mode = WAL;');

  console.log(`[Database] Native SQLite connected successfully at: ${resolvedDbPath}`);

  // 1. Create users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      avatar TEXT,
      is_active INTEGER DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // 2. Create leads table
  db.exec(`
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      company TEXT,
      email TEXT,
      phone TEXT,
      source TEXT,
      status TEXT,
      assigned_to INTEGER,
      created_by INTEGER,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (assigned_to) REFERENCES users (id) ON DELETE SET NULL,
      FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE SET NULL
    );
  `);

  // 3. Create lead_notes table
  db.exec(`
    CREATE TABLE IF NOT EXISTS lead_notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lead_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      note TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (lead_id) REFERENCES leads (id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );
  `);

  // 4. Create lead_activity table
  db.exec(`
    CREATE TABLE IF NOT EXISTS lead_activity (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lead_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      action TEXT NOT NULL,
      old_value TEXT,
      new_value TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (lead_id) REFERENCES leads (id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );
  `);

  // Automatically insert default users if table is empty
  const countStmt = db.prepare('SELECT COUNT(*) as count FROM users');
  const countResult = countStmt.get();

  if (countResult.count === 0) {
    console.log('[Database] Users table is empty. Seeding default Admin and Member...');
    
    const salt = bcrypt.genSaltSync(10);
    const adminHash = bcrypt.hashSync('Admin123', salt);
    const memberHash = bcrypt.hashSync('Member123', salt);
    const now = new Date().toISOString();

    const insertStmt = db.prepare(`
      INSERT INTO users (full_name, email, password, role, avatar, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 1, ?, ?)
    `);

    // Insert Admin
    insertStmt.run(
      'Administrator',
      'admin@leadflow.com',
      adminHash,
      'admin',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      now,
      now
    );

    // Insert Member
    insertStmt.run(
      'Sales Member',
      'member@leadflow.com',
      memberHash,
      'member',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      now,
      now
    );

    console.log('[Database] Seeding default users complete.');
  }

} catch (error) {
  console.error(`[Database] SQLite initialization failure: ${error.message}`);
  process.exit(1);
}

export default db;
