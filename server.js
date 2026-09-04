// ============================================
// KIPEPEO MARKET — EXPRESS SERVER
// ============================================

// ============================================
// IMPORT REQUIRED PACKAGES
// ============================================

const crypto = require("crypto");
const session = require("express-session");
const bcrypt = require("bcrypt");
const express = require("express");
const Database = require("better-sqlite3");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// ============================================
// CREATE EXPRESS APPLICATION
// ============================================

const app = express();

// ============================================
// SERVER PORT
// ============================================

const PORT = process.env.PORT || 3000;

// ============================================
// DATABASE CONNECTION
// ============================================

// Use DATABASE_PATH when provided.
// Otherwise use the local SQLite database.
//
// Local:
// database/kipepeo.db
//
// Deployment:
// /var/data/kipepeo.db

const databasePath =
  process.env.DATABASE_PATH ||
  path.join(__dirname, "database", "kipepeo.db");

// Connect to SQLite
const db = new Database(databasePath);

console.log("✅ Database connected successfully.");
console.log("📍 Database location:", databasePath);

// ============================================
// SECURITY — HELMET
// ============================================

app.use(
  helmet({
    contentSecurityPolicy: false
  })
);

// ============================================
// GENERAL RATE LIMITING
// ============================================

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: "Too many requests. Please try again later."
  }
});

app.use(generalLimiter);

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
// AUTHENTICATION RATE LIMITING
// ============================================

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error:
      "Too many authentication attempts. Please try again later."
  }
});

// ============================================
// CSRF TOKEN ENDPOINT
// ============================================

app.get("/api/auth/csrf-token", (req, res) => {
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto
      .randomBytes(32)
      .toString("hex");
  }

  res.json({
    csrfToken: req.session.csrfToken
  });
});

// ============================================
// CSRF PROTECTION MIDDLEWARE
// ============================================

function requireCsrfToken(req, res, next) {
  const requestToken = req.get("X-CSRF-Token");
  const sessionToken = req.session.csrfToken;

  // ========================================
  // CHECK TOKEN EXISTS
  // ========================================

  if (!requestToken || !sessionToken) {
    return res.status(403).json({
      error: "CSRF token required."
    });
  }

  // ========================================
  // CHECK TOKEN MATCHES
  // ========================================

  if (requestToken !== sessionToken) {
    return res.status(403).json({
      error: "Invalid CSRF token."
    });
  }

  // ========================================
  // CSRF AUTHORIZED
  // ========================================

  next();
}

// ============================================
// BASIC TEST ROUTE
// ============================================

app.get("/", (req, res) => {
  res.send("Kipepeo Market API Server is running.");
});

// ============================================
// HEALTH CHECK
// ============================================

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Kipepeo Market",
    timestamp: new Date().toISOString()
  });
});

// ============================================
// GET ALL PRODUCTS
// ============================================

app.get("/api/products", (req, res) => {
  try {
    // Query products using a prepared statement.
    const products = db
      .prepare(`
        SELECT *
        FROM products
        ORDER BY id
      `)
      .all();

    // Return products as JSON
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

app.post(
  "/api/auth/register",
  authLimiter,
  requireCsrfToken,
  async (req, res) => {
    try {
      // ========================================
      // GET AND NORMALIZE USER INPUT
      // ========================================

      const name = String(
        req.body.name || ""
      ).trim();

      const email = String(
        req.body.email || ""
      )
        .trim()
        .toLowerCase();

      const password = String(
        req.body.password || ""
      );

      // ========================================
      // VALIDATE REQUIRED FIELDS
      // ========================================

      if (!name || !email || !password) {
        return res.status(400).json({
          error:
            "Name, email, and password are required."
        });
      }

      // ========================================
      // VALIDATE NAME
      // ========================================

      if (name.length < 2) {
        return res.status(400).json({
          error:
            "Name must contain at least 2 characters."
        });
      }

      // ========================================
      // VALIDATE EMAIL FORMAT
      // ========================================

      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(email)) {
        return res.status(400).json({
          error:
            "Please provide a valid email address."
        });
      }

      // ========================================
      // VALIDATE PASSWORD LENGTH
      // ========================================

      if (password.length < 8) {
        return res.status(400).json({
          error:
            "Password must contain at least 8 characters."
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
        .get(email);

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
      //
      // IMPORTANT:
      // The role is NOT accepted from req.body.
      // Every public registration creates a
      // customer account.
      //

      const insertUser = db.prepare(`
        INSERT INTO users (
          name,
          email,
          password,
          role
        )
        VALUES (?, ?, ?, ?)
      `);

      const result = insertUser.run(
        name,
        email,
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
        error: "Unable to create account."
      });
    }
  }
);

// ============================================
// USER LOGIN
// ============================================

app.post(
  "/api/auth/login",
  authLimiter,
  requireCsrfToken,
  async (req, res) => {
    try {
      // ========================================
      // GET AND NORMALIZE INPUT
      // ========================================

      const email = String(
        req.body.email || ""
      )
        .trim()
        .toLowerCase();

      const password = String(
        req.body.password || ""
      );

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
      // VALIDATE EMAIL FORMAT
      // ========================================

      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(email)) {
        return res.status(400).json({
          error:
            "Please provide a valid email address."
        });
      }

      // ========================================
      // FIND USER
      // ========================================
      //
      // Parameterized query protects against
      // SQL injection.
      //

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
        .get(email);

      // ========================================
      // CHECK USER
      // ========================================

      if (!user) {
        return res.status(401).json({
          error: "Invalid email or password."
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
          error: "Invalid email or password."
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
      // SUCCESS RESPONSE
      // ========================================

      res.json({
        message: "Login successful.",
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
        error: "Unable to log in."
      });
    }
  }
);

// ============================================
// GET CURRENT USER
// ============================================

app.get("/api/auth/me", (req, res) => {
  // ========================================
  // CHECK AUTHENTICATION
  // ========================================

  if (!req.session.user) {
    return res.status(401).json({
      error: "Not authenticated."
    });
  }

  // ========================================
  // RETURN CURRENT USER
  // ========================================

  res.json({
    user: req.session.user
  });
});

// ============================================
// USER LOGOUT
// ============================================

app.post(
  "/api/auth/logout",
  requireCsrfToken,
  (req, res) => {
    req.session.destroy((error) => {
      if (error) {
        console.error(
          "❌ Logout error:",
          error
        );

        return res.status(500).json({
          error: "Unable to log out."
        });
      }

      res.clearCookie("connect.sid");

      res.json({
        message: "Logout successful."
      });
    });
  }
);

// ============================================
// ADMIN AUTHORIZATION MIDDLEWARE
// ============================================

function requireAdmin(req, res, next) {
  // ========================================
  // CHECK AUTHENTICATION
  // ========================================

  if (!req.session.user) {
    return res.status(401).json({
      error: "Authentication required."
    });
  }

  // ========================================
  // RE-CHECK CURRENT ROLE IN DATABASE
  // ========================================

  const user = db
    .prepare(`
      SELECT
        id,
        name,
        email,
        role
      FROM users
      WHERE id = ?
    `)
    .get(req.session.user.id);

  // ========================================
  // CHECK USER STILL EXISTS
  // ========================================

  if (!user) {
    return res.status(401).json({
      error: "Authentication required."
    });
  }

  // ========================================
  // CHECK ADMIN ROLE
  // ========================================

  if (user.role !== "admin") {
    return res.status(403).json({
      error: "Admin access required."
    });
  }

  // ========================================
  // STORE CURRENT ADMIN
  // ========================================

  req.admin = user;

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
        error: "Unable to load users."
      });
    }
  }
);

// ============================================
// START THE SERVER
// ============================================

app.listen(PORT, "0.0.0.0", () => {
  console.log("============================================");
  console.log("🦋 KIPEPEO MARKET SERVER");
  console.log("============================================");
  console.log(
    `✅ Server running at http://localhost:${PORT}`
  );
  console.log("============================================");
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