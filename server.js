// ============================================
// KIPEPEO MARKET — Express Server
// ============================================

// Import required packages
const express = require("express");
const Database = require("better-sqlite3");
const path = require("path");

// ============================================
// CREATE EXPRESS APPLICATION
// ============================================

const app = express();

// Set the port
const PORT = 3000;

// ============================================
// DATABASE CONNECTION
// ============================================

// Build the correct path to the SQLite database
const dbPath = path.join(__dirname, "database", "kipepeo.db");

// Connect to the SQLite database
const db = new Database(dbPath);

console.log("✅ Database connected successfully.");
console.log("📍 Database location:", dbPath);

// ============================================
// BASIC TEST ROUTE
// ============================================

app.get("/", (req, res) => {
  res.send("Kipepeo Market API Server is running.");
});

// ============================================
// GET ALL PRODUCTS
// ============================================

app.get("/api/products", (req, res) => {
  try {
    // Query the database for all products
    const products = db
      .prepare(`
        SELECT *
        FROM products
        ORDER BY id
      `)
      .all();

    // Send the products as JSON
    res.json(products);
  } catch (error) {
    // Log the actual error in the terminal
    console.error("❌ Error fetching products:", error);

    // Send an error response to the client
    res.status(500).json({
      error: "Failed to fetch products."
    });
  }
});

// ============================================
// GRACEFUL SHUTDOWN
// ============================================

process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down Kipepeo Market server...");

  db.close();

  console.log("✅ Database connection closed.");
  process.exit(0);
});

// ============================================
// START THE SERVER
// ============================================

app.listen(PORT, () => {
  console.log("============================================");
  console.log("🦋 KIPEPEO MARKET SERVER");
  console.log("============================================");
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log("============================================");
});

// ============================================
// GRACEFUL SHUTDOWN
// ============================================
process.on("SIGINT", () => {
console.log("\n🛑 Shutting down server...");
db.close();
console.log("✅ Database connection closed.");
console.log("👋 Kipepeo Market server stopped.");
process.exit(0);
});