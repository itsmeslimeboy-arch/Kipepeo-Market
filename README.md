 Kipepeo Market
 Shop Smart. Live Better.
Kipepeo Market is a full-stack e-commerce platform being built as a real-project learning environment. This project demonstrates a complete web application from planning through deployment.

 Project Goal
Build a production-ready e-commerce system where:
Customers can:
- Browse products across multiple categories
- View detailed product information
- Search and filter products
- Add products to a shopping cart
- Complete checkout
- Create and manage accounts
- View order history
Administrators can:
- Manage products (add, edit, delete)
- Manage inventory (stock levels, SKU)
- Manage orders (process, ship, cancel)
- Manage customers
- View dashboard statistics

 Technology Stack
| Layer | Technology |
|-------|------------|
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js, Express.js |
| Database | SQLite (development) → PostgreSQL (production) |
| Authentication | bcrypt, express-session |
| Version Control | Git, GitHub |
| Deployment | Render |
| Testing | Jest |

Development Approach
This project follows a build-first, real-project approach:
1. Every concept is learned because the current project feature requires it
2. New technologies are introduced only when needed
3. No abstract exercises — everything is immediately applied to Kipepeo Market
4. Every chapter ends with a working feature and a Git commit

 Project Structure kipepeo-market/ ├── client/ # Frontend ├── server/ # Backend API ├── database/ # Database schema ├── assets/ # Images, videos, icons └── docs/ # Documentation text

 Project Status
  Current Phase: Chapter 2 — Tooling, Git & Project Scaffold
- [x] Chapter 1 — Discovery, Sitemap & Content Plan
- [x] Chapter 2 — Tooling, Git & Project Scaffold
- [x] Chapter 3 — Design System & Homepage
- [x] Chapter 4 — Product Catalog
- [x] Chapter 5 — Shopping Cart
- [x] Chapter 6 — Backend API
- [x] Chapter 7 — Database Integration
- [x] Chapter 8 — User Authentication
- [x] Chapter 9 — Admin Dashboard
- [ ] Chapter 10 — Testing & Quality
- [ ] Chapter 11 — Security
- [ ] Chapter 12 — Deployment

Contact
For questions about this project, please open an issue on GitHub.

Built with ❤️ and real project development.

Chapter 5: Product Database

What Was Built:

* Node.js project initialized with package.json
* better-sqlite3 installed for database access
* SQLite database (kipepeo.db) created
* Products table created with a proper schema
* 5 initial products seeded
* Database verification and query scripts created

Database Structure:

Column: id
Type: INTEGER
Purpose: Unique product ID

Column: name
Type: TEXT
Purpose: Product name

Column: slug
Type: TEXT
Purpose: URL-friendly product name

Column: description
Type: TEXT
Purpose: Product description

Column: price
Type: INTEGER
Purpose: Product price in KSh

Column: category
Type: TEXT
Purpose: Product category

Column: image
Type: TEXT
Purpose: Product image filename

Column: stock
Type: INTEGER
Purpose: Available product quantity

Column: featured
Type: INTEGER
Purpose: Featured product status

Column: created_at
Type: TEXT
Purpose: Product creation timestamp

Files Created:

* database/init.js — Creates the database and products table structure
* database/seed.js — Seeds the initial product data
* database/check-products.js — Verifies all products
* database/query-products.js — Queries product information and summary statistics
* database/find-product.js — Finds a single product by ID

Products Seeded:

1. Wireless Headphones
   Category: Electronics
   Price: KSh 4,500

2. Smart Watch
   Category: Electronics
   Price: KSh 6,500

3. Classic Backpack
   Category: Fashion
   Price: KSh 3,200

4. Ceramic Coffee Mug
   Category: Home
   Price: KSh 1,200

5. LED Desk Lamp
   Category: Home
   Price: KSh 2,800

Chapter 7: Frontend Integration
**What Was Built:**
- Express configured to serve frontend files
- Homepage served through Express
- `js/products.js` created
- Fetch API connected to `/api/products`
- Product JSON converted into JavaScript data
- Product cards generated dynamically
- Product images connected to local assets
- Product prices formatted in KES
- Loading state implemented
- Empty product state implemented
- API error state implemented
- Responsive product grid implemented
- Real Unsplash product images added
- Asset register updated
**Frontend → Backend Flow:**
```text
Homepage
↓
products.js
↓
fetch("/api/products")
↓
Express
↓
SQLite
↓
JSON
↓
products.js
↓
Product Cards Files Created:  js/products.js Files Updated:  index.html  css/style.css  server.js  docs/asset-register.md
 docs/decisions-log.md  README.md text
---
## 💾 STEP 18: COMMIT AND PUSH
### 18.1 — Check Git Status
```cmd
git status You should see: text
modified: README.md
modified: css/style.css
modified: docs/asset-register.md
modified: docs/decisions-log.md
modified: index.html
modified: server.js
new file: assets/images/products/electronics/product-001.jpg
new file: assets/images/products/electronics/product-002.jpg
new file: assets/images/products/fashion/product-003.jpg
new file: assets/images/products/home/product-004.jpg
new file: assets/images/products/home/product-005.jpg
new file: js/products.js You should NOT see: text
kipepeo.db
node_modules/
Chapter 8: User Authentication
**What Was Built:**
- Users table created
- User registration implemented
- Email uniqueness implemented
- Password validation implemented
- bcrypt installed
- Password hashing implemented
- Registration API created
- Login page created
- Login API created
- bcrypt password comparison implemented
- express-session installed
- Authentication sessions implemented
- `/api/auth/me` endpoint created
- Protected account functionality implemented
- Logout functionality implemented
- Authentication tested in browser
- Authentication tested with Thunder Client
- Authentication tested with Windows curl
- User verification script created
**Authentication Endpoints:**
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/register` | Create a customer account |
| POST | `/api/auth/login` | Authenticate a customer |
| GET | `/api/auth/me` | Get the current authenticated user |
| POST | `/api/auth/logout` | End the current session |
**Files Created:**
- `database/create-users-table.js`
- `database/check-users.js`
- `js/auth.js`
- `pages/register.html`
- `pages/login.html`
- `pages/account.html`
**Files Updated:**
- `server.js`
- `css/style.css`
- `index.html`
- `docs/decisions-log.md`
- `README.md`
**Dependencies Added:**
- `bcrypt`
- `express-session`

Chapter 9: Admin Dashboard
**What Was Built:**
- User roles introduced
- Customer role implemented
- Admin role implemented
- Existing users preserved as customers
- Admin account creation script created
- Login session updated with user role
- Admin authorization middleware created
- Admin dashboard API created
- Customer management API created
- Protected admin dashboard created
- Admin dashboard statistics implemented
- Admin customer list implemented
- Admin access tested
- Customer access restriction tested
- Logged-out access restriction tested
- Admin logout implemented
- Product database schema verification implemented
**Authorization Rules:**
| User State | Admin API |
|------------|-----------|
| Logged out | 401 |
| Customer | 403 |
| Admin | 200 |
**Admin Endpoints:**
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/admin/dashboard` | Dashboard statistics |
| GET | `/api/admin/users` | View users |
**Files Created:**
- `database/add-user-role.js`
- `database/create-admin.js`
- `database/check-products-schema.js`
- `pages/admin.html`
**Files Updated:**
- `server.js`
- `js/auth.js`
- `css/style.css`
- `database/check-users.js`
- `docs/decisions-log.md`
- `README.md`
**Authentication Dependencies:**
- `bcrypt`
- `express-session`

## Security
Kipepeo Market includes application security controls covering:
- Environment-based secrets
- Secure session cookies
- Session fixation protection
- Password hashing with bcrypt
- Server-side input validation
- SQL injection protection through parameterized queries
- XSS-conscious frontend rendering
- CSRF protection
- HTTP security headers
- Rate limiting
- Role-based authorization
- Safe error handling
Security documentation is located at:
docs/security-checklist.md Update project progress: markdown
## Project Progress
- Chapter 1 — Project Foundation
- Chapter 2 — Frontend Structure
- Chapter 3 — Responsive Design
- Chapter 4 — Product Interface
- Chapter 5 — SQLite Database
- Chapter 6 — Backend API
- Chapter 7 — Frontend ↔ Backend Integration
- Chapter 8 — User Authentication
- Chapter 9 — Admin Dashboard & Authorization
- Chapter 10 — Testing & Quality
- Chapter 11 — Security & Application Hardening
- Chapter 12 — Deployment