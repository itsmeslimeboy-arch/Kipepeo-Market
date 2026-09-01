// ============================================
// KIPEPEO MARKET — CREATE USERS TABLE
// ============================================
const Database = require("better-sqlite3");
const path = require("path");
// Build the correct database path
const dbPath = path.join(__dirname, "kipepeo.db");
// Connect to the database
const db = new Database(dbPath);
console.log("✅ Database connected successfully.");
// ============================================
// CREATE USERS TABLE
// ============================================
db.exec(`
CREATE TABLE IF NOT EXISTS users (
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL,
email TEXT NOT NULL UNIQUE,
password TEXT NOT NULL,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);
console.log("✅ Users table created successfully.");
// Close database connection
db.close();
console.log("✅ Database connection closed.");