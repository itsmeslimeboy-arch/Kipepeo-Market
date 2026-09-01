 Kipepeo Market — Decisions Log

This document records every major decision made during development. Each entry explains:
- What was decided
- Why it was decided
- Alternatives considered
- Trade-offs involved

Chapter 2 — Tooling, Git & Project Scaffold
 Decision: Use Visual Studio Code as the primary development environment
What: VS Code is the primary code editor for this project.

Why:
- Free and open-source
- Works on Windows, Mac, and Linux
- Built-in Git integration
- Integrated terminal
- Support for extensions (Prettier, ESLint, Live Server)
- Industry standard for web development

Alternatives Considered:
- Sublime Text (paid, less built-in features)
- Atom (deprecated)
- WebStorm (paid, heavier)
- Notepad++ (limited features)

Trade-offs:
- VS Code requires some setup (extensions, configuration)
- Some features need extensions
- But provides a complete development environment in one application

 Decision: Use Node.js as the backend JavaScript runtime
What: Node.js will run the Kipepeo Market backend.

Why:
- Allows JavaScript on both frontend and backend
- Has a large ecosystem of packages (npm)
- Excellent for building REST APIs with Express
- Industry standard for JavaScript backends
- Handles asynchronous operations well

Alternatives Considered:
- Python + Flask/Django (different language to learn)
- PHP + Laravel (different language to learn)
- Ruby on Rails (different language to learn)
- Deno (less mature ecosystem)

Trade-offs:
- Node.js is single-threaded (but fine for our use case)
- May need to learn asynchronous patterns
- But keeps the technology stack focused on JavaScript

 Decision: Use Git for version control and GitHub for remote hosting
What: Git tracks changes locally, GitHub stores the repository online.

Why:
- Git is the industry standard for version control
- GitHub is the most popular Git hosting platform
- Easy to collaborate with others
- Provides a public portfolio of work
- Enables deployment via GitHub

Alternatives Considered:
- GitLab (similar, but less widely used)
- Bitbucket (similar, but less widely used)
- No version control (dangerous, no history)

Trade-offs:
- Git has a learning curve
- Requires regular commits
- But provides safety, history, and portfolio value

 Decision: Make the Kipepeo Market repository public
What: The GitHub repository is public, not private.

Why:
- This is a portfolio project
- Employers need to see it
- Demonstrates development process
- Shows code quality and documentation
- Allows others to learn from it

Alternatives Considered:
- Private repository (would need to make public later)
- Private with portfolio screenshots (less transparent)

Trade-offs:
- Anyone can see the code (but it's a portfolio project)
- Need to be careful with security (never commit secrets)
- But maximizes the project's portfolio value

 Decision: Create only README.md and .gitignore initially
What: The initial commit contains only two files: README.md and .gitignore.

Why:
- We're not building the website yet
- We only need these files to establish the project
- The build-first approach introduces files when they're needed
- Keeps the commit clean and focused

Alternatives Considered:
- Creating the full project structure immediately
- Adding configuration files early
- Adding folders for all phases

Trade-offs:
- More files will be added later
- The repository is minimal now
- But each chapter will add what's needed
- This keeps the project easy to understand

Chapter 5 — Product Database

Decision: Use SQLite for product data storage

What:
SQLite is the database for Kipepeo Market products.

Why:

* No separate database server required
* Single file database (kipepeo.db)
* Perfect for development
* Easy to move to PostgreSQL later

Alternatives Considered:

* PostgreSQL (more complex to set up)
* MySQL (more complex to set up)
* MongoDB (different data model)

Trade-offs:

* SQLite is less powerful for large production systems
* But it is perfect for learning and development
* We can migrate to PostgreSQL later

Decision: Use better-sqlite3 as the Node.js database driver

What:
better-sqlite3 connects Node.js to SQLite.

Why:

* Synchronous API (easier to understand)
* Fast performance
* Well-documented
* Actively maintained

Alternatives Considered:

* sqlite3 (asynchronous, more complex)
* knex.js (query builder, more overhead)

Trade-offs:

* Synchronous database operations can block Node.js for heavy or slow database work
* But it is much easier to learn and understand
* Fine for our current use case

Decision: Store prices as integers (Kenyan Shillings)

What:
Prices are stored as whole numbers. For example, 4500 represents KSh 4,500.

Why:

* Easier to calculate
* No formatting issues
* Currency formatting is handled by the frontend

Alternatives Considered:

* Decimal type (more precise)
* String with "KSh" prefix (hard to calculate)

Trade-offs:

* No fractional shillings
* We do not need fractional shillings for this project
* Simpler data structure

Decision: Store image filenames, not full paths

What:
The database stores product-001.jpg instead of a complete file path.

Why:

* Database should not depend on Windows paths
* Application constructs the full URL or file path
* Works on any operating system

Alternatives Considered:

* Full Windows path (breaks on Linux or Mac)
* Full URL (harder to change)

Trade-offs:

* Application must construct the full path
* But this approach is cleaner and more portable

Decision: Use INSERT OR IGNORE for seeding

What:
The seed script uses INSERT OR IGNORE to prevent duplicate products.

Why:

* Running the seed script multiple times should not create duplicates
* The unique slug prevents duplicate product records

Alternatives Considered:

* INSERT INTO (could create duplicate data)
* DELETE all products first (risk of losing data)

Trade-offs:

* Not all database systems support INSERT OR IGNORE
* SQLite supports it
* It is appropriate for development
* Proper CRUD operations will be used later

Decision: Separate database initialization from seeding

What:
init.js creates the database and table structure, while seed.js adds product data.

Why:

* Clear separation of concerns
* Database can be initialized and seeded separately
* Easier to reset and re-seed during development
* Each script has a specific responsibility

Alternatives Considered:

* One large script (harder to maintain)
* Automated migration system (more complex)

Trade-offs:

* Requires running two scripts instead of one
* But the separation makes the project clearer and easier to maintain

Chapter 6 — Backend API
## Decision: Use Express for the Kipepeo Market backend
**What:** Express is used as the Node.js web framework.
**Why:**
- Simple routing
- Works directly with Node.js
- Easy to understand while learning backend development
- Provides the foundation for future API endpoints
**Alternatives Considered:**
- Fastify (faster but more complex)
- Koa (requires understanding of async/generators)
- Built-in Node.js HTTP module (too low-level)
**Trade-offs:**
- Express requires us to structure more of the application ourselves
- A larger framework could provide more built-in structure
- The simplicity is useful for learning and for this project
---
## Decision: Use `server.js` as the application entry point
**What:** `server.js` is the main Express server file.
**Why:**
- Already established in Chapter 5 through `package.json`
- Provides one clear entry point for the backend
- Allows the project to run with `npm start`
---
## Decision: The first API endpoint is `GET /api/products`
**What:** The endpoint returns all products stored in the SQLite database.
**Why:**
- It creates the first complete database-to-API data flow
- The frontend will consume this endpoint in the next chapter
- It establishes the API pattern we will repeat for future resources
---
## Decision: API responses use JSON
**What:** Product data is returned as JSON.
**Why:**
- JavaScript can consume JSON directly
- JSON is the standard format used by web APIs
- It provides a clean boundary between the backend and frontend
---
## Decision: Use a parameterized database query pattern
**What:** Database queries are prepared through `better-sqlite3`.
**Why:**
- Keeps database access structured
- Builds on the parameterized query practice introduced in Chapter 5
- Provides a safe foundation for future API routes
---
## Decision: Graceful shutdown is implemented
**What:** The server closes the database connection when stopped.
**Why:**
- Prevents database locks
- Prevents memory leaks
- Professional production practice
---
## Decision: CORS is not added yet
**What:** No CORS configuration is added at this stage.
**Why:**
- The frontend and API will be served from the same origin
- CORS will be added when cross-origin requests are required
- Simplifies the learning process
**Trade-offs:**
- This approach only works when the frontend is served from the same origin
- In production, we may need to configure CORS
- But it avoids unnecessary complexity at this stage

Chapter 7 — Frontend Integration
## Decision: Use fetch() for frontend API communication
**What:** JavaScript uses the Fetch API to request product data from the Express backend.
**Why:**
- Built into modern browsers
- No additional dependency required
- Works naturally with JSON APIs
- Easy to understand while learning frontend/backend integration
**Alternatives Considered:**
- Axios (requires installation)
- XMLHttpRequest (older, more complex)
- jQuery AJAX (requires jQuery)
**Trade-offs:**
- Error handling must be implemented manually
- More advanced applications may use additional data-fetching libraries
- The native Fetch API is sufficient for the current project
---
## Decision: Serve the frontend through Express
**What:** Express serves the Kipepeo Market frontend files.
**Why:**
- Frontend and API use the same server
- Avoids unnecessary CORS configuration
- Creates a simple local development environment
- Prepares the project for integrated frontend/backend deployment
**Alternatives Considered:**
- Separate frontend server (requires CORS)
- Static hosting only (no API)
**Trade-offs:**
- One server serves both frontend and backend
- Works for development, may need separation in production
---
## Decision: Product data is rendered dynamically
**What:** Product cards are generated from API data instead of being hardcoded into HTML.
**Why:**
- Products already exist in SQLite
- The API provides the single source of product data
- Product changes can be made in the database
- The frontend automatically reflects database changes
**Trade-offs:**
- Requires JavaScript to be enabled
- Initial load shows "Loading..."
- But provides a more dynamic experience
---
## Decision: Product image paths are generated from category and filename
**What:** JavaScript builds the product image path using the product category and image filename.
**Why:**
- Keeps the database image field simple
- Matches the existing asset folder structure
- Keeps product assets organized by category
- Avoids storing full frontend paths inside the database
**Trade-offs:**
- The frontend must know the folder structure
- If the folder structure changes, the code must change
---
## Decision: Handle loading, empty and error states
**What:** The product catalog displays appropriate messages while loading, when no products exist, and when the API fails.
**Why:**
- Prevents a blank interface
- Provides useful feedback to customers
- Demonstrates real-world frontend error handling
**Trade-offs:**
- More code to write and maintain
- Better user experience

Chapter 8 — User Authentication
## Decision: Use bcrypt for password hashing
**What:** User passwords are hashed with bcrypt before being stored in SQLite.
**Why:**
- Passwords must never be stored as plain text
- bcrypt is designed for password hashing
- Provides a secure foundation for user authentication
- Works directly with Node.js
**Alternatives Considered:**
- Plain-text passwords — rejected because they are insecure
- SHA-256 — not designed specifically for password storage
- Argon2 — strong alternative, but bcrypt keeps the current learning path simple
**Trade-offs:**
- Password hashing requires additional processing
- bcrypt is slower than general-purpose hashing algorithms
- The additional processing is intentional because password hashing should be difficult to brute-force
---
## Decision: Use email as the unique login identifier
**What:** Each user account has a unique email address.
**Why:**
- Email addresses are familiar to customers
- Provides a simple login identifier
- SQLite UNIQUE constraint prevents duplicate accounts
---
## Decision: Use express-session for authentication sessions
**What:** Logged-in customers are tracked using server-side sessions.
**Why:**
- Simple to understand
- Works naturally with Express
- Allows the server to identify authenticated users
- Provides the foundation for protected routes
**Trade-offs:**
- Sessions require server-side session management
- Production deployment requires appropriate session configuration
- The development secret will later be moved to an environment variable
---
## Decision: Validate authentication on both frontend and backend
**What:** Registration and login data are validated in JavaScript and Express.
**Why:**
- Frontend validation improves user experience
- Backend validation protects the application
- Client-side validation alone cannot be trusted
---
## Decision: Use a protected /api/auth/me endpoint
**What:** The frontend uses `/api/auth/me` to determine whether a customer is authenticated.
**Why:**
- Keeps authentication decisions on the server
- Allows the frontend to retrieve the current authenticated user
- Provides a reusable pattern for future protected features
---
## Decision: Authentication uses the existing SQLite database
**What:** User accounts are stored in the existing `kipepeo.db` database.
**Why:**
- Products and users belong to the same application
- Keeps the current architecture simple
- Allows future orders to reference users
