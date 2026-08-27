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
- [ ] Chapter 7 — Database Integration
- [ ] Chapter 8 — User Authentication
- [ ] Chapter 9 — Admin Dashboard
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

