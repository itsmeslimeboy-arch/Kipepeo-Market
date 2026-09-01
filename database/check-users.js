// ============================================
// KIPEPEO MARKET — CHECK USERS
// ============================================
const Database = require("better-sqlite3");
const path = require("path");
const dbPath = path.join(__dirname, "kipepeo.db");
const db = new Database(dbPath);
console.log("✅ Database connected successfully.");
const users = db
.prepare(`
SELECT
id,
name,
email,
password,
created_at
FROM users
ORDER BY id
`)
.all();
console.log("\n👤 USERS:\n");
console.table(users);
console.log(`\n✅ Total users: ${users.length}`);
db.close();
console.log("✅ Database connection closed.");