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

const PORT = 3000;

// ============================================
// DATABASE CONNECTION
// ============================================

const dbPath = path.join(
  __dirname,
  "database",
  "kipepeo.db"
);

const db = new Database(dbPath);

console.log("✅ Database connected successfully.");
console.log("📍 Database location:", dbPath);

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

  if (!requestToken || !sessionToken) {
    return res.status(403).json({
      error: "CSRF token required."
    });
  }

  if (requestToken !== sessionToken) {
    return res.status(403).json({
      error: "Invalid CSRF token."
    });
  }

  next();
}

// ============================================
// BASIC TEST ROUTE
// ============================================

app.get("/", (req, res) => {
  res.send("Kipepeo Market API Server is running.");
});

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
      error: "Unable to load products."
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
      // NORMALIZE INPUT
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
      // REQUIRED FIELD VALIDATION
      // ========================================

      if (!name || !email || !password) {
        return res.status(400).json({
          error:
            "Name, email, and password are required."
        });
      }

      // ========================================
      // NAME VALIDATION
      // ========================================

      if (name.length < 2) {
        return res.status(400).json({
          error:
            "Name must contain at least 2 characters."
        });
      }

      // ========================================
      // EMAIL VALIDATION
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
      // PASSWORD VALIDATION
      // ========================================

      if (password.length < 8) {
        return res.status(400).json({
          error:
            "Password must contain at least 8 characters."
        });
      }

      // ========================================
      // CHECK EXISTING USER
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
      // INSERT CUSTOMER
      // ========================================
      //
      // NEVER accept role from req.body.
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
      // SUCCESS
      // ========================================

      res.status(201).json({
        message:
          "Account created successfully.",
        userId: result.lastInsertRowid
      });
    } catch (error) {
      // Technical details stay in server logs.
      console.error(
        "❌ Internal registration error:",
        error
      );

      // Generic message goes to client.
      res.status(500).json({
        error:
          "An unexpected server error occurred."
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
      // NORMALIZE INPUT
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
      // REQUIRED FIELD VALIDATION
      // ========================================

      if (!email || !password) {
        return res.status(400).json({
          error:
            "Email and password are required."
        });
      }

      // ========================================
      // EMAIL VALIDATION
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
        "❌ Internal login error:",
        error
      );

      res.status(500).json({
        error:
          "An unexpected server error occurred."
      });
    }
  }
);

// ============================================
// GET CURRENT USER
// ============================================

app.get("/api/auth/me", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({
      error: "Not authenticated."
    });
  }

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
          "❌ Internal logout error:",
          error
        );

        return res.status(500).json({
          error:
            "An unexpected server error occurred."
        });
      }

      res.clearCookie("connect.sid");

      res.json({
        message:
          "Logout successful."
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
      error:
        "Authentication required."
    });
  }

  // ========================================
  // VERIFY CURRENT USER IN DATABASE
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
  // USER NO LONGER EXISTS
  // ========================================

  if (!user) {
    return res.status(401).json({
      error:
        "Authentication required."
    });
  }

  // ========================================
  // CHECK CURRENT DATABASE ROLE
  // ========================================

  if (user.role !== "admin") {
    return res.status(403).json({
      error:
        "Admin access required."
    });
  }

  // ========================================
  // STORE VERIFIED ADMIN
  // ========================================

  req.admin = user;

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
        "❌ Internal admin dashboard error:",
        error
      );

      res.status(500).json({
        error:
          "An unexpected server error occurred."
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
        "❌ Internal admin users error:",
        error
      );

      res.status(500).json({
        error:
          "An unexpected server error occurred."
      });
    }
  }
);

// ============================================
// START THE SERVER
// ============================================

app.listen(PORT, () => {
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