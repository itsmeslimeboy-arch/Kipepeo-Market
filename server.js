// ============================================
// KIPEPEO MARKET — Express Server
// ============================================

// ============================================
// IMPORT REQUIRED PACKAGES
// ============================================

const session = require("express-session");
const bcrypt = require("bcrypt");
const express = require("express");
const Database = require("better-sqlite3");
const path = require("path");

// ============================================
// CREATE EXPRESS APPLICATION
// ============================================

const app = express();

// Set the port
const PORT = 3000;

// ============================================
// DATABASE CONNECTION
// ============================================

// Build the correct path to the SQLite database
const dbPath = path.join(
  __dirname,
  "database",
  "kipepeo.db"
);

// Connect to the SQLite database
const db = new Database(dbPath);

console.log("✅ Database connected successfully.");
console.log("📍 Database location:", dbPath);

// ============================================
// SERVE FRONTEND FILES
// ============================================

app.use(express.static(__dirname));

// ============================================
// PARSE JSON REQUEST BODIES
// ============================================

app.use(express.json());

// ============================================
// SESSION CONFIGURATION
// ============================================

app.use(
  session({
    secret: "kipepeo-market-development-secret",
    resave: false,
    saveUninitialized: false,

    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);

// ============================================
// GET ALL PRODUCTS
// ============================================

app.get("/api/products", (req, res) => {
  try {

    const products = db
      .prepare(`
        SELECT *
        FROM products
        ORDER BY id
      `)
      .all();

    res.json(products);

  } catch (error) {

    console.error(
      "❌ Error fetching products:",
      error
    );

    res.status(500).json({
      error: "Failed to fetch products."
    });
  }
});

// ============================================
// USER REGISTRATION
// ============================================

app.post("/api/auth/register", async (req, res) => {
  try {

    // Get submitted data
    const {
      name,
      email,
      password
    } = req.body;

    // ========================================
    // VALIDATE REQUIRED FIELDS
    // ========================================

    if (!name || !email || !password) {
      return res.status(400).json({
        error:
          "Name, email and password are required."
      });
    }

    // ========================================
    // NORMALIZE EMAIL
    // ========================================

    const normalizedEmail =
      email.trim().toLowerCase();

    // ========================================
    // CHECK PASSWORD LENGTH
    // ========================================

    if (password.length < 8) {
      return res.status(400).json({
        error:
          "Password must be at least 8 characters."
      });
    }

    // ========================================
    // CHECK IF EMAIL ALREADY EXISTS
    // ========================================

    const existingUser = db
      .prepare(`
        SELECT id
        FROM users
        WHERE email = ?
      `)
      .get(normalizedEmail);

    if (existingUser) {
      return res.status(409).json({
        error:
          "An account with this email already exists."
      });
    }

    // ========================================
    // HASH PASSWORD
    // ========================================

    const hashedPassword =
      await bcrypt.hash(password, 12);

    // ========================================
    // CREATE USER
    // ========================================

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
        name.trim(),
        normalizedEmail,
        hashedPassword,
        "customer"
      );

    // ========================================
    // SEND SUCCESS RESPONSE
    // ========================================

    res.status(201).json({
      message:
        "Account created successfully.",
      userId: result.lastInsertRowid
    });

  } catch (error) {

    console.error(
      "❌ Registration error:",
      error
    );

    res.status(500).json({
      error:
        "Unable to create account."
    });
  }
});

// ============================================
// USER LOGIN
// ============================================

app.post("/api/auth/login", async (req, res) => {
  try {

    const {
      email,
      password
    } = req.body;

    // ========================================
    // VALIDATE INPUT
    // ========================================

    if (!email || !password) {
      return res.status(400).json({
        error:
          "Email and password are required."
      });
    }

    // ========================================
    // NORMALIZE EMAIL
    // ========================================

    const normalizedEmail =
      email.trim().toLowerCase();

    // ========================================
    // FIND USER
    // ========================================

    const user = db
      .prepare(`
        SELECT
          id,
          name,
          email,
          password,
          role
        FROM users
        WHERE email = ?
      `)
      .get(normalizedEmail);

    // ========================================
    // CHECK USER
    // ========================================

    if (!user) {
      return res.status(401).json({
        error:
          "Invalid email or password."
      });
    }

    // ========================================
    // COMPARE PASSWORD
    // ========================================

    const passwordMatches =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatches) {
      return res.status(401).json({
        error:
          "Invalid email or password."
      });
    }

    // ========================================
    // CREATE SESSION
    // ========================================

    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    // ========================================
    // SUCCESS
    // ========================================

    res.json({
      message:
        "Login successful.",

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {

    console.error(
      "❌ Login error:",
      error
    );

    res.status(500).json({
      error:
        "Unable to log in."
    });
  }
});

// ============================================
// GET CURRENT USER
// ============================================

app.get("/api/auth/me", (req, res) => {

  if (!req.session.user) {
    return res.status(401).json({
      error:
        "Not authenticated."
    });
  }

  res.json({
    user: req.session.user
  });
});

// ============================================
// USER LOGOUT
// ============================================

app.post("/api/auth/logout", (req, res) => {

  req.session.destroy((error) => {

    if (error) {

      console.error(
        "❌ Logout error:",
        error
      );

      return res.status(500).json({
        error:
          "Unable to log out."
      });
    }

    res.clearCookie("connect.sid");

    res.json({
      message:
        "Logout successful."
    });
  });
});

// ============================================
// ADMIN AUTHORIZATION MIDDLEWARE
// ============================================

function requireAdmin(req, res, next) {

  // ========================================
  // CHECK AUTHENTICATION
  // ========================================

  if (!req.session.user) {
    return res.status(401).json({
      error:
        "Authentication required."
    });
  }

  // ========================================
  // CHECK ADMIN ROLE
  // ========================================

  if (req.session.user.role !== "admin") {
    return res.status(403).json({
      error:
        "Admin access required."
    });
  }

  // ========================================
  // ADMIN AUTHORIZED
  // ========================================

  next();
}

// ============================================
// ADMIN DASHBOARD
// ============================================

app.get(
  "/api/admin/dashboard",
  requireAdmin,
  (req, res) => {

    try {

      // ====================================
      // COUNT USERS
      // ====================================

      const userCount = db
        .prepare(`
          SELECT COUNT(*) AS total
          FROM users
        `)
        .get();

      // ====================================
      // COUNT PRODUCTS
      // ====================================

      const productCount = db
        .prepare(`
          SELECT COUNT(*) AS total
          FROM products
        `)
        .get();

      // ====================================
      // COUNT ADMINS
      // ====================================

      const adminCount = db
        .prepare(`
          SELECT COUNT(*) AS total
          FROM users
          WHERE role = 'admin'
        `)
        .get();

      // ====================================
      // SEND DASHBOARD DATA
      // ====================================

      res.json({
        statistics: {
          users: userCount.total,
          products: productCount.total,
          admins: adminCount.total
        }
      });

    } catch (error) {

      console.error(
        "❌ Admin dashboard error:",
        error
      );

      res.status(500).json({
        error:
          "Unable to load admin dashboard."
      });
    }
  }
);

// ============================================
// ADMIN — LIST USERS
// ============================================

app.get(
  "/api/admin/users",
  requireAdmin,
  (req, res) => {

    try {

      const users = db
        .prepare(`
          SELECT
            id,
            name,
            email,
            role,
            created_at
          FROM users
          ORDER BY id DESC
        `)
        .all();

      res.json({
        users
      });

    } catch (error) {

      console.error(
        "❌ Admin users error:",
        error
      );

      res.status(500).json({
        error:
          "Unable to load users."
      });
    }
  }
);

// ============================================
// START THE SERVER
// ============================================

app.listen(PORT, () => {

  console.log(
    "============================================"
  );

  console.log(
    "🦋 KIPEPEO MARKET SERVER"
  );

  console.log(
    "============================================"
  );

  console.log(
    `✅ Server running at http://localhost:${PORT}`
  );

  console.log(
    "============================================"
  );
});

// ============================================
// GRACEFUL SHUTDOWN
// ============================================

process.on("SIGINT", () => {

  console.log(
    "\n🛑 Shutting down server..."
  );

  db.close();

  console.log(
    "✅ Database connection closed."
  );

  console.log(
    "👋 Kipepeo Market server stopped."
  );

  process.exit(0);
});