// ============================================
// KIPEPEO MARKET — Database Initialization
// ============================================

// Import the better-sqlite3 package
const Database = require("better-sqlite3");
const path = require("path");

// Connect to the database
// The database will be created inside the database folder
const dbPath = path.join(__dirname, "kipepeo.db");
const db = new Database(dbPath);

console.log("Database connected successfully.");
console.log("Database location:", dbPath);

// ============================================
// CREATE PRODUCTS TABLE
// ============================================

const createProductsTable = `
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    price INTEGER NOT NULL,
    category TEXT NOT NULL,
    image TEXT NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    featured INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`;

db.exec(createProductsTable);

console.log("Products table created successfully.");

// ============================================
// VERIFY THE TABLE EXISTS
// ============================================

const tableCheck = db
  .prepare(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='products'"
  )
  .get();

if (tableCheck) {
  console.log("Products table verified.");
  console.log("Table structure:");
  console.log(" - id (INTEGER, PRIMARY KEY)");
  console.log(" - name (TEXT, NOT NULL)");
  console.log(" - slug (TEXT, NOT NULL, UNIQUE)");
  console.log(" - description (TEXT, NOT NULL)");
  console.log(" - price (INTEGER, NOT NULL)");
  console.log(" - category (TEXT, NOT NULL)");
  console.log(" - image (TEXT, NOT NULL)");
  console.log(" - stock (INTEGER, DEFAULT 0)");
  console.log(" - featured (INTEGER, DEFAULT 0)");
  console.log(" - created_at (TEXT, DEFAULT CURRENT_TIMESTAMP)");
} else {
  console.log("Products table not found.");
}

// ============================================
// CLOSE DATABASE
// ============================================

db.close();

console.log("Database connection closed.");