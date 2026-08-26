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
