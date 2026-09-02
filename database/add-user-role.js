// ============================================
// KIPEPEO MARKET — ADD USER ROLE
// ============================================
const Database = require("better-sqlite3");
const path = require("path");
// ============================================
// DATABASE PATH
// ============================================
const dbPath = path.join(__dirname, "kipepeo.db");
// ============================================
// CONNECT TO DATABASE
// ============================================
const db = new Database(dbPath);
console.log("✅ Database connected successfully.");
// ============================================
// CHECK WHETHER ROLE COLUMN EXISTS
// ============================================
const columns = db
.prepare("PRAGMA table_info(users)")
.all();
const roleExists = columns.some(
column => column.name === "role"
);
// ============================================
// ADD ROLE COLUMN
// ============================================
if (!roleExists) {
db.exec(`
ALTER TABLE users
ADD COLUMN role TEXT NOT NULL DEFAULT 'customer'
`);
console.log("✅ Role column added successfully.");
} else {
console.log("ℹ️ Role column already exists.");
}
// ============================================
// CLOSE DATABASE
// ============================================
db.close();
console.log("✅ Database connection closed.");
