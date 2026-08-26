// ============================================
// KIPEPEO MARKET — Database Seeding
// ============================================

const Database = require("better-sqlite3");
const path = require("path");

// Connect to the database
const dbPath = path.join(__dirname, "kipepeo.db");
const db = new Database(dbPath);

console.log("Database connected successfully.");

// ============================================
// PRODUCT DATA
// ============================================

const products = [
  {
    name: "Wireless Headphones",
    slug: "wireless-headphones",
    description:
      "Comfortable wireless headphones designed for everyday listening. Long battery life and lightweight design.",
    price: 4500,
    category: "electronics",
    image: "product-001.jpg",
    stock: 25,
    featured: 1,
  },

  {
    name: "Smart Watch",
    slug: "smart-watch",
    description:
      "A modern smartwatch for everyday activity tracking, smartphone notifications, and timekeeping.",
    price: 6500,
    category: "electronics",
    image: "product-002.jpg",
    stock: 18,
    featured: 1,
  },

  {
    name: "Classic Backpack",
    slug: "classic-backpack",
    description:
      "A practical everyday backpack suitable for work, school and travel. Durable material with multiple compartments.",
    price: 3200,
    category: "fashion",
    image: "product-003.jpg",
    stock: 30,
    featured: 0,
  },

  {
    name: "Ceramic Coffee Mug",
    slug: "ceramic-coffee-mug",
    description:
      "A simple ceramic mug designed for everyday coffee and tea. Dishwasher and microwave safe.",
    price: 1200,
    category: "home",
    image: "product-004.jpg",
    stock: 40,
    featured: 1,
  },

  {
    name: "LED Desk Lamp",
    slug: "led-desk-lamp",
    description:
      "A compact LED desk lamp for focused work and study. Adjustable brightness and flexible neck.",
    price: 2800,
    category: "home",
    image: "product-005.jpg",
    stock: 22,
    featured: 0,
  },
];

// ============================================
// INSERT PRODUCTS
// ============================================

const insertProduct = db.prepare(`
  INSERT OR IGNORE INTO products (
    name,
    slug,
    description,
    price,
    category,
    image,
    stock,
    featured
  )
  VALUES (
    @name,
    @slug,
    @description,
    @price,
    @category,
    @image,
    @stock,
    @featured
  )
`);

const insertMany = db.transaction((products) => {
  for (const product of products) {
    insertProduct.run(product);
  }
});

insertMany(products);

console.log(`${products.length} products processed successfully.`);

// ============================================
// VERIFY PRODUCTS
// ============================================

const count = db
  .prepare("SELECT COUNT(*) AS count FROM products")
  .get();

console.log(`Total products in database: ${count.count}`);

// ============================================
// DISPLAY PRODUCTS
// ============================================

const allProducts = db
  .prepare(`
    SELECT id, name, price, category, stock, featured
    FROM products
    ORDER BY id
  `)
  .all();

console.table(allProducts);

// ============================================
// CLOSE DATABASE
// ============================================

db.close();

console.log("Database connection closed.");