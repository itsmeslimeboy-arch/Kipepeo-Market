// ============================================
// KIPEPEO MARKET — CHECK PRODUCTS SCHEMA
// ============================================
const Database = require("better-sqlite3");
const path = require("path");
const dbPath = path.join(
__dirname,
"kipepeo.db"
);
const db = new Database(dbPath);
console.log(
"✅ Database connected successfully."
);
const columns = db
.prepare("PRAGMA table_info(products)")
.all();
console.log("\n📦 PRODUCTS TABLE SCHEMA:\n");
console.table(columns);
db.close();
console.log(
"✅ Database connection closed."
);