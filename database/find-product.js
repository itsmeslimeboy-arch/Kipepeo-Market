// ============================================
// KIPEPEO MARKET — Find a Product
// ============================================

const Database = require("better-sqlite3");
const path = require("path");

// Connect to the database
const dbPath = path.join(__dirname, "kipepeo.db");
const db = new Database(dbPath);

console.log("Database connected successfully.");

// ============================================
// FIND PRODUCT BY ID
// ============================================

const productId = 1;

console.log(
  `Searching for product with ID ${productId}...\n`
);

const product = db
  .prepare(`
    SELECT *
    FROM products
    WHERE id = ?
  `)
  .get(productId);

// ============================================
// DISPLAY PRODUCT
// ============================================

if (product) {
  console.log("Product found:");
  console.log("ID:", product.id);
  console.log("Name:", product.name);
  console.log("Slug:", product.slug);
  console.log("Description:", product.description);
  console.log("Price: KSh", product.price);
  console.log("Category:", product.category);
  console.log("Image:", product.image);
  console.log("Stock:", product.stock);
  console.log(
    "Featured:",
    product.featured === 1 ? "Yes" : "No"
  );
  console.log("Created:", product.created_at);
} else {
  console.log(
    `Product with ID ${productId} not found.`
  );
}

// ============================================
// CLOSE DATABASE
// ============================================

db.close();

console.log("\nDatabase connection closed.");