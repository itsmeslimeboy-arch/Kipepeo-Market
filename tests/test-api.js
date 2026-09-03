// ============================================
// KIPEPEO MARKET — API TESTS
// ============================================
console.log("🦋 Running API Tests...");
console.log("⚠️ Note: These tests require the server to be running.");
console.log(" Start the server with: node server.js\n");
// Test configuration
const BASE_URL = "http://localhost:3000";
const ADMIN_EMAIL = "admin@kipepeo.local";
const ADMIN_PASSWORD = "AdminKipepeo123";
const TEST_EMAIL = "apitest@example.com";
const TEST_PASSWORD = "ApiTest123";
// ============================================
// HELPER FUNCTIONS
// ============================================
async function testAPI(endpoint, options = {}) {
const url = `${BASE_URL}${endpoint}`;
const response = await fetch(url, {
headers: {
"Content-Type": "application/json",
...options.headers
},
...options
});
let data = null;
try {
data = await response.json();
} catch {
data = { message: "No JSON response" };
}
return {
status: response.status,
ok: response.ok,
data: data
};
}
// ============================================
// TESTS
// ============================================
async function runTests() {
let passedTests = 0;
let totalTests = 0;
// ============================================
// TEST 1: PUBLIC PAGES
// ============================================
console.log("📋 Test 1: Public Pages");
try {
const response = await fetch(`${BASE_URL}/`);
if (response.ok) {
console.log(" ✅ Homepage loads");
passedTests++;
} else {
console.log(` ❌ Homepage failed: ${response.status}`);
}
totalTests++;
} catch (error) {
console.log(" ❌ Homepage error:", error.message);
totalTests++;
}
// ============================================
// TEST 2: API ROOT (should not exist)
// ============================================
console.log("\n📋 Test 2: Invalid API Route");
try {
const response = await fetch(`${BASE_URL}/api/not-exist`);
if (response.status === 404) {
console.log(" ✅ Invalid API route returns 404");
passedTests++;
} else {
console.log(` ❌ Invalid API route returned ${response.status}`);
}
totalTests++;
} catch (error) {
console.log(" ❌ API root error:", error.message);
totalTests++;
}
// ============================================
// TEST 3: REGISTER
// ============================================
console.log("\n📋 Test 3: User Registration");
try {
const result = await testAPI("/api/auth/register", {
method: "POST",
body: JSON.stringify({
name: "API Test User",
email: TEST_EMAIL,
password: TEST_PASSWORD
})
});
if (result.status === 201) {
console.log(" ✅ Registration successful");
passedTests++;
} else if (result.status === 409) {
console.log(" ⚠️ User already exists (skipping)");
passedTests++;
} else {
console.log(` ❌ Registration failed: ${result.status}`);
console.log(` ${JSON.stringify(result.data)}`);
}
totalTests++;
} catch (error) {
console.log(" ❌ Registration error:", error.message);
totalTests++;
}
// ============================================
// TEST 4: LOGIN
// ============================================
console.log("\n📋 Test 4: User Login");
try {
const result = await testAPI("/api/auth/login", {
method: "POST",
body: JSON.stringify({
email: ADMIN_EMAIL,
password: ADMIN_PASSWORD
})
});
if (result.status === 200) {
console.log(" ✅ Login successful");
console.log(` Welcome, ${result.data.user.name}`);
passedTests++;
} else {
console.log(` ❌ Login failed: ${result.status}`);
console.log(` ${JSON.stringify(result.data)}`);
}
totalTests++;
} catch (error) {
console.log(" ❌ Login error:", error.message);
totalTests++;
}
// ============================================
// TEST 5: AUTHENTICATED USER
// ============================================
console.log("\n📋 Test 5: Get Current User");
try {
// First, login to get session
await testAPI("/api/auth/login", {
method: "POST",
body: JSON.stringify({
email: ADMIN_EMAIL,
password: ADMIN_PASSWORD
})
});
const result = await testAPI("/api/auth/me");
if (result.status === 200) {
console.log(" ✅ Current user retrieved");
console.log(` User: ${result.data.user.name}`);
console.log(` Role: ${result.data.user.role}`);
passedTests++;
} else {
console.log(` ❌ Current user failed: ${result.status}`);
}
totalTests++;
} catch (error) {
console.log(" ❌ Current user error:", error.message);
totalTests++;
}
// ============================================
// TEST 6: PUBLIC PRODUCTS
// ============================================
console.log("\n📋 Test 6: Products API (Public)");
try {
const result = await testAPI("/api/products");
if (result.status === 200) {
console.log(" ✅ Products API works");
const count = result.data.length || 0;
console.log(` ${count} products returned`);
passedTests++;
} else {
console.log(` ❌ Products API failed: ${result.status}`);
}
totalTests++;
} catch (error) {
console.log(" ❌ Products API error:", error.message);
totalTests++;
}
// ============================================
// TEST 7: ADMIN DASHBOARD (WITHOUT LOGIN)
// ============================================
console.log("\n📋 Test 7: Admin Dashboard (Logged Out)");
try {
const result = await testAPI("/api/admin/dashboard");
if (result.status === 401) {
console.log(" ✅ Admin dashboard correctly returns 401 when logged out");
passedTests++;
} else {
console.log(` ❌ Admin dashboard returned ${result.status} (expected 401)`);
}
totalTests++;
} catch (error) {
console.log(" ❌ Admin dashboard error:", error.message);
totalTests++;
}
// ============================================
// TEST 8: ADMIN DASHBOARD (WITH LOGIN)
// ============================================
console.log("\n📋 Test 8: Admin Dashboard (Logged In)");
try {
// Login as admin first
await testAPI("/api/auth/login", {
method: "POST",
body: JSON.stringify({
email: ADMIN_EMAIL,
password: ADMIN_PASSWORD
})
});
const result = await testAPI("/api/admin/dashboard");
if (result.status === 200) {
console.log(" ✅ Admin dashboard accessible");
console.log(` Users: ${result.data.statistics.users}`);
console.log(` Products: ${result.data.statistics.products}`);
console.log(` Admins: ${result.data.statistics.admins}`);
passedTests++;
} else {
console.log(` ❌ Admin dashboard failed: ${result.status}`);
}
totalTests++;
} catch (error) {
console.log(" ❌ Admin dashboard error:", error.message);
totalTests++;
}
// ============================================
// TEST 9: LOGOUT
// ============================================
console.log("\n📋 Test 9: Logout");
try {
const result = await testAPI("/api/auth/logout", {
method: "POST"
});
if (result.status === 200) {
console.log(" ✅ Logout successful");
passedTests++;
} else {
console.log(` ❌ Logout failed: ${result.status}`);
}
totalTests++;
} catch (error) {
console.log(" ❌ Logout error:", error.message);
totalTests++;
}
// ============================================
// RESULTS
// ============================================
console.log("\n📊 Test Results:");
console.log(` ✅ ${passedTests}/${totalTests} tests passed`);
if (passedTests === totalTests) {
console.log("\n🎉 All API tests passed!");
} else {
console.log("\n⚠️ Some tests failed. Please fix the issues.");
}
}
// ============================================
// RUN TESTS
// ============================================
runTests().catch(console.error);