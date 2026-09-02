// ============================================
// KIPEPEO MARKET — CHECK USERS
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
// GET ALL USERS
// ============================================

const users = db
  .prepare(`
    SELECT
      id,
      name,
      email,
      password,
      role,
      created_at
    FROM users
    ORDER BY id
  `)
  .all();

// ============================================
// DISPLAY USERS
// ============================================

console.log("\n👤 USERS:\n");

console.table(users);

// ============================================
// DISPLAY TOTAL USERS
// ============================================

console.log(`\n✅ Total users: ${users.length}`);

// ============================================
// CLOSE DATABASE
// ============================================

db.close();

console.log("✅ Database connection closed.");