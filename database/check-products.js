// ============================================
// KIPEPEO MARKET — Check Products
// ============================================

const Database = require("better-sqlite3");
const path = require("path");

// Connect to the database
const dbPath = path.join(__dirname, "kipepeo.db");
const db = new Database(dbPath);

console.log("Database connected successfully.");
console.log("All products:\n");

// Get all products
const products = db
  .prepare("SELECT * FROM products ORDER BY id")
  .all();

console.table(products);

console.log(`\nTotal products: ${products.length}`);

// Close database
db.close();

console.log("Database connection closed.");