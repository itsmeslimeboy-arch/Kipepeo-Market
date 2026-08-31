// ============================================
// KIPEPEO MARKET — Express Server
// ============================================
// Import required packages
const express = require("express");
const Database = require("better-sqlite3");
const path = require("path");
// Create the Express application
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
// SERVE FRONTEND FILES
// ============================================
app.use(express.static(__dirname));
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
// If something goes wrong, log the error
console.error("❌ Error fetching products:", error);
// Send an error response
res.status(500).json({
error: "Failed to fetch products."
});
}
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