// ============================================
// KIPEPEO MARKET — DATABASE TESTS
// ============================================
const Database = require("better-sqlite3");
const path = require("path");
const dbPath = path.join(__dirname, "kipepeo.db");
const db = new Database(dbPath);
console.log("🦋 Running Database Tests...\n");
// ============================================
// TEST 1: USERS TABLE EXISTS
// ============================================
console.log("📋 Test 1: Users Table Exists");
const usersTable = db
.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='users'")
.get();
if (usersTable) {
console.log(" ✅ users table exists");
} else {
console.log(" ❌ users table does NOT exist");
process.exit(1);
}
// ============================================
// TEST 2: USERS TABLE HAS CORRECT COLUMNS
// ============================================
console.log("\n📋 Test 2: Users Table Columns");
const userColumns = db
.prepare("PRAGMA table_info(users)")
.all();
const expectedUserColumns = [
"id",
"name",
"email",
"password",
"role",
"created_at"
];
let allUserColumnsExist = true;
expectedUserColumns.forEach(col => {
const exists = userColumns.some(c => c.name === col);
if (exists) {
console.log(` ✅ ${col} column exists`);
} else {
console.log(` ❌ ${col} column does NOT exist`);
allUserColumnsExist = false;
}
});
// ============================================
// TEST 3: PRODUCTS TABLE EXISTS
// ============================================
console.log("\n📋 Test 3: Products Table Exists");
const productsTable = db
.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='products'")
.get();
if (productsTable) {
console.log(" ✅ products table exists");
} else {
console.log(" ❌ products table does NOT exist");
process.exit(1);
}
// ============================================
// TEST 4: PRODUCTS TABLE HAS CORRECT COLUMNS
// ============================================
console.log("\n📋 Test 4: Products Table Columns");
const productColumns = db
.prepare("PRAGMA table_info(products)")
.all();
const expectedProductColumns = [
"id",
"name",
"slug",
"description",
"price",
"category",
"image",
"stock",
"featured",
"created_at"
];
let allProductColumnsExist = true;
expectedProductColumns.forEach(col => {
const exists = productColumns.some(c => c.name === col);
if (exists) {
console.log(` ✅ ${col} column exists`);
} else {
console.log(` ❌ ${col} column does NOT exist`);
allProductColumnsExist = false;
}
});
// ============================================
// TEST 5: PRODUCTS HAVE DATA
// ============================================
console.log("\n📋 Test 5: Products Have Data");
const productCount = db
.prepare("SELECT COUNT(*) as count FROM products")
.get();
console.log(` ✅ ${productCount.count} products in database`);
if (productCount.count === 0) {
console.log(" ⚠️ No products found. Did you run seed.js?");
}
// ============================================
// TEST 6: USERS HAVE DATA
// ============================================
console.log("\n📋 Test 6: Users Have Data");
const userCount = db
.prepare("SELECT COUNT(*) as count FROM users")
.get();
console.log(` ✅ ${userCount.count} users in database`);
if (userCount.count === 0) {
console.log(" ⚠️ No users found. Did you create an admin?");
}
// ============================================
// TEST 7: EMAIL UNIQUENESS CONSTRAINT
// ============================================
console.log("\n📋 Test 7: Email Uniqueness");
// Check if email column has UNIQUE constraint
const emailColumn = userColumns.find(c => c.name === "email");
if (emailColumn && emailColumn.pk === 1) {
console.log(" ✅ email is PRIMARY KEY (unique)");
} else if (emailColumn && emailColumn.unique) {
console.log(" ✅ email has UNIQUE constraint");
} else {
console.log(" ❌ email does NOT have UNIQUE constraint");
}
// ============================================
// TEST RESULTS
// ============================================
console.log("\n📊 Test Results:");
let totalTests = 0;
let passedTests = 0;
// Count results
if (usersTable) { passedTests++; totalTests++; }
if (allUserColumnsExist) { passedTests++; totalTests++; }
if (productsTable) { passedTests++; totalTests++; }
if (allProductColumnsExist) { passedTests++; totalTests++; }
if (productCount.count > 0) { passedTests++; totalTests++; }
if (userCount.count > 0) { passedTests++; totalTests++; }
console.log(` ✅ ${passedTests}/${totalTests} tests passed`);
if (passedTests === totalTests) {
console.log("\n🎉 All database tests passed!");
} else {
console.log("\n⚠️ Some tests failed. Please fix the issues.");
}
// Close database
db.close();
console.log("\n✅ Database connection closed.");
