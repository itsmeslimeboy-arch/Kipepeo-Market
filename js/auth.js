// ============================================
// KIPEPEO MARKET — AUTHENTICATION
// ============================================
console.log("🦋 Kipepeo Market auth.js loaded.");
// ============================================
// REGISTRATION
// ============================================
const registerForm = document.getElementById("register-form");
if (registerForm) {
registerForm.addEventListener("submit", async (event) => {
event.preventDefault();
const name = document.getElementById("name").value.trim();
const email = document.getElementById("email").value.trim();
const password = document.getElementById("password").value;
const confirmPassword =
document.getElementById("confirm-password").value;
const message =
document.getElementById("auth-message");
// ========================================
// FRONTEND VALIDATION
// ========================================
if (password !== confirmPassword) {
message.textContent =
"Passwords do not match.";
return;
}
try {
// ====================================
// SEND REGISTRATION REQUEST
// ====================================
const response = await fetch(
"/api/auth/register",
{
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
name,
email,
password
})
}
);
const data = await response.json();
if (!response.ok) {
message.textContent =
data.error || "Registration failed.";
return;
}
// ====================================
// REGISTRATION SUCCESS
// ====================================
message.textContent =
"Account created successfully.";
registerForm.reset();
} catch (error) {
console.error(
"❌ Registration error:",
error
);
message.textContent =
"Unable to create account. Please try again.";
}
});
}

// ============================================
// LOGIN
// ============================================
const loginForm = document.getElementById("login-form");
if (loginForm) {
loginForm.addEventListener("submit", async (event) => {
event.preventDefault();
const email =
document.getElementById("login-email")
.value
.trim();
const password =
document.getElementById("login-password")
.value;
const message =
document.getElementById("login-message");
try {
const response = await fetch(
"/api/auth/login",
{
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
email,
password
})
}
);
const data = await response.json();
if (!response.ok) {
message.textContent =
data.error || "Login failed.";
return;
}
message.textContent =
"Login successful.";
window.location.href =
"/pages/account.html";
} catch (error) {
console.error(
"❌ Login error:",
error
);
message.textContent =
"Unable to log in. Please try again.";
}
});
}

// ============================================
// ACCOUNT PAGE
// ============================================
const accountDetails =
document.getElementById("account-details");
if (accountDetails) {
async function loadAccount() {
try {
const response = await fetch(
"/api/auth/me"
);
const data =
await response.json();
if (!response.ok) {
window.location.href =
"/pages/login.html";
return;
}
accountDetails.innerHTML = `
<p>
<strong>Name:</strong>
${data.user.name}
</p>
<p>
<strong>Email:</strong>
${data.user.email}
</p>
`;
} catch (error) {
console.error(
"❌ Account loading error:",
error
);
accountDetails.textContent =
"Unable to load account information.";
}
}
loadAccount();
}

// ============================================
// LOGOUT
// ============================================
const logoutButton =
document.getElementById("logout-button");
if (logoutButton) {
logoutButton.addEventListener(
"click",
async () => {
try {
const response = await fetch(
"/api/auth/logout",
{
method: "POST"
}
);
const data =
await response.json();
if (!response.ok) {
console.error(
data.error
);
return;
}
window.location.href =
"/pages/login.html";
} catch (error) {
console.error(
"❌ Logout error:",
error
);
}
}
);
}

// ============================================
// ADMIN DASHBOARD
// ============================================
const adminWelcome =
document.getElementById("admin-welcome");
const userCount =
document.getElementById("user-count");
const productCount =
document.getElementById("product-count");
const adminCount =
document.getElementById("admin-count");
const userList =
document.getElementById("user-list");
if (
adminWelcome &&
userCount &&
productCount &&
adminCount
) {
async function loadAdminDashboard() {
try {
// ====================================
// VERIFY CURRENT USER
// ====================================
const meResponse =
await fetch("/api/auth/me");
const meData =
await meResponse.json();
if (!meResponse.ok) {
window.location.href =
"/pages/login.html";
return;
}
// ====================================
// VERIFY ADMIN ROLE
// ====================================
if (meData.user.role !== "admin") {
alert(
"You do not have permission to access the admin dashboard."
);
window.location.href =
"/pages/account.html";
return;
}
adminWelcome.textContent =
`Welcome, ${meData.user.name}.`;
// ====================================
// LOAD DASHBOARD
// ====================================
const dashboardResponse =
await fetch(
"/api/admin/dashboard"
);
const dashboardData =
await dashboardResponse.json();
if (!dashboardResponse.ok) {
adminWelcome.textContent =
"Unable to load dashboard.";
return;
}
// ====================================
// DISPLAY STATISTICS
// ====================================
userCount.textContent =
dashboardData.statistics.users;
productCount.textContent =
dashboardData.statistics.products;
adminCount.textContent =
dashboardData.statistics.admins;
// ====================================
// LOAD USERS
// ====================================
const usersResponse =
await fetch(
"/api/admin/users"
);
const usersData =
await usersResponse.json();
if (usersResponse.ok) {
userList.innerHTML =
usersData.users
.map(user => `
<div class="admin-user">
<strong>
${user.name}
</strong>
<span>
${user.email}
</span>
<span>
Role:
${user.role}
</span>
</div>
`)
.join("");
}
} catch (error) {
console.error(
"❌ Admin dashboard error:",
error
);
adminWelcome.textContent =
"Unable to load admin dashboard.";
}
}
loadAdminDashboard();
}

// ============================================
// ADMIN LOGOUT
// ============================================
const adminLogoutButton =
document.getElementById(
"admin-logout-button"
);
if (adminLogoutButton) {
adminLogoutButton.addEventListener(
"click",
async () => {
try {
const response =
await fetch(
"/api/auth/logout",
{
method: "POST"
}
);
const data =
await response.json();
if (!response.ok) {
console.error(
data.error
);
return;
}
window.location.href =
"/pages/login.html";
} catch (error) {
console.error(
"❌ Admin logout error:",
error
);
}
}
);
}