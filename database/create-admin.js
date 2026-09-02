// ============================================
// KIPEPEO MARKET — CREATE ADMIN ACCOUNT
// ============================================
const Database = require("better-sqlite3");
const bcrypt = require("bcrypt");
const path = require("path");
// ============================================
// DATABASE PATH
// ============================================
const dbPath = path.join(__dirname, "kipepeo.db");
// ============================================
// CONNECT DATABASE
// ============================================
const db = new Database(dbPath);
console.log("✅ Database connected successfully.");
// ============================================
// ADMIN DETAILS
// ============================================
const name = "Kipepeo Administrator";
const email = "admin@kipepeo.local";
const password = "AdminKipepeo123";
// ============================================
// CHECK EXISTING ADMIN
// ============================================
const existingUser = db
.prepare(`
SELECT id, role
FROM users
WHERE email = ?
`)
.get(email);
if (existingUser) {
console.log(
"⚠️ An account with this email already exists."
);
db.close();
process.exit(0);
}
// ============================================
// HASH ADMIN PASSWORD
// ============================================
const hashedPassword = bcrypt.hashSync(
password,
12
);
// ============================================
// CREATE ADMIN
// ============================================
const result = db
.prepare(`
INSERT INTO users (
name,
email,
password,
role
)
VALUES (?, ?, ?, ?)
`)
.run(
name,
email,
hashedPassword,
"admin"
);
console.log("✅ Admin account created.");
console.log(`🆔 Admin ID: ${result.lastInsertRowid}`);
// ============================================
// CLOSE DATABASE
// ============================================
db.close();
console.log("✅ Database connection closed.");s