# Kipepeo Market — Manual Testing Checklist
## Before Testing
- [ ] Server is running (`node server.js`)
- [ ] Database exists (`kipepeo.db`)
- [ ] Products are seeded (5 products minimum)
- [ ] Admin account exists (`admin@kipepeo.local`)
---
## 1. PUBLIC PAGES
### 1.1 Homepage
- [ ] Page loads at `http://localhost:3000`
- [ ] Header is visible
- [ ] Hero section is visible
- [ ] Product section loads with products
- [ ] Product images display
- [ ] Footer is visible
- [ ] "Loading products..." appears briefly
- [ ] No JavaScript errors in console
### 1.2 About Page
- [ ] Page loads at `http://localhost:3000/pages/about.html`
- [ ] Content is readable
- [ ] Navigation works
### 1.3 Contact Page
- [ ] Page loads at `http://localhost:3000/pages/contact.html`
- [ ] Contact form is visible
- [ ] Navigation works
### 1.4 404 Page
- [ ] Invalid URL shows 404 page
- [ ] Navigation works
---
## 2. AUTHENTICATION
### 2.1 Registration
- [ ] Registration page loads at `/pages/register.html`
- [ ] Form has Name, Email, Password, Confirm Password
- [ ] Empty fields show validation
- [ ] Password mismatch shows error
- [ ] Valid registration creates account
- [ ] Duplicate email shows error
- [ ] Success message appears
### 2.2 Login
- [ ] Login page loads at `/pages/login.html`
- [ ] Form has Email and Password
- [ ] Empty fields show validation
- [ ] Wrong password shows error
- [ ] Wrong email shows error
- [ ] Valid credentials log in successfully
- [ ] Redirect to account page
### 2.3 Account
- [ ] Account page loads at `/pages/account.html`
- [ ] Name is displayed
- [ ] Email is displayed
- [ ] Logout button works
### 2.4 Logout
- [ ] Logout redirects to login
- [ ] Account page redirects to login when logged out
- [ ] Admin page redirects to login when logged out
---
## 3. ADMIN
### 3.1 Admin Login
- [ ] Admin can log in with `admin@kipepeo.local`
- [ ] Admin shows "Welcome, Kipepeo Administrator"
### 3.2 Admin Dashboard
- [ ] Dashboard loads at `/pages/admin.html`
- [ ] User count is displayed
- [ ] Product count is displayed
- [ ] Admin count is displayed
- [ ] User list is displayed
- [ ] Passwords are NOT displayed
- [ ] Logout button works
### 3.3 Customer Access
- [ ] Customer cannot access admin page
- [ ] Customer redirected to account page
---
## 4. PRODUCTS
### 4.1 Product Display
- [ ] Products load from API
- [ ] Product names display
- [ ] Product descriptions display
- [ ] Product prices display in KES format
- [ ] Product categories display
- [ ] Product images display
- [ ] Images are not broken
### 4.2 API Response
- [ ] `/api/products` returns JSON
- [ ] JSON contains all product fields
- [ ] Product images path is correct
---
## 5. RESPONSIVE DESIGN
### 5.1 Desktop (1920x1080)
- [ ] 3-column product grid
- [ ] Navigation is visible
- [ ] All content is readable
### 5.2 Tablet (768x1024)
- [ ] 2-column product grid
- [ ] Navigation is visible or hamburger
- [ ] All content is readable
### 5.3 Mobile (375x812)
- [ ] 1-column product grid
- [ ] Navigation collapses to hamburger
- [ ] All content is readable
- [ ] Buttons are tappable
---
## 6. ERROR HANDLING
### 6.1 Server Offline
- [ ] Products show error message
- [ ] API returns error gracefully
### 6.2 Invalid URLs
- [ ] 404 page displays
- [ ] Navigation works
### 6.3 Invalid Data
- [ ] Registration validates data
- [ ] Login validates data
---
## 7. PERFORMANCE
### 7.1 Page Load
- [ ] Homepage loads within 3 seconds
- [ ] Products load within 1 second
### 7.2 Images
- [ ] Images are optimized
- [ ] Lazy loading works
---
## TEST RESULTS
**Date:** _______________
**Tester:** _______________
| Test Area | Pass/Fail | Notes |
|-----------|-----------|-------|
| Public Pages | ___ | ______ |
| Registration | ___ | ______ |
| Login | ___ | ______ |
| Account | ___ | ______ |
| Admin Login | ___ | ______ |
| Admin Dashboard | ___ | ______ |
| Products | ___ | ______ |
| Responsive | ___ | ______ |
| Error Handling | ___ | ______ |
| Performance | ___ | ______ |
**Overall Status:** ___
**Issues Found:**
1. _______________
2. _______________
3. _______________