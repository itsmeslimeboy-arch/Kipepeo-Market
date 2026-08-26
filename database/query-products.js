// ============================================
// KIPEPEO MARKET — Query Products
// ============================================

const Database = require("better-sqlite3");
const path = require("path");

// Connect to the database
const dbPath = path.join(__dirname, "kipepeo.db");
const db = new Database(dbPath);

console.log("Database connected successfully.");
console.log("Product summary:\n");

// ============================================
// GET PRODUCTS
// ============================================

const products = db
  .prepare(`
    SELECT
      id,
      name,
      price,
      category,
      stock,
      CASE
        WHEN featured = 1 THEN 'Featured'
        ELSE 'Regular'
      END AS status
    FROM products
    ORDER BY price DESC
  `)
  .all();

console.table(products);

// ============================================
// SUMMARY STATISTICS
// ============================================

console.log("\nSummary:");
console.log(`Total products: ${products.length}`);

// ============================================
// PRODUCTS BY CATEGORY
// ============================================

const categories = db
  .prepare(`
    SELECT
      category,
      COUNT(*) AS count,
      SUM(stock) AS total_stock
    FROM products
    GROUP BY category
    ORDER BY category
  `)
  .all();

console.log("\nProducts by category:");

categories.forEach((cat) => {
  console.log(
    `- ${cat.category}: ${cat.count} products, ${cat.total_stock} in stock`
  );
});

// ============================================
// CLOSE DATABASE
// ============================================

db.close();

console.log("\nDatabase connection closed.");