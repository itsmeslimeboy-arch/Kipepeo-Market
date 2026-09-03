# Kipepeo Market — Quality Checklist
## Code Quality
### JavaScript
- [ ] Variables use `const` and `let` (not `var`)
- [ ] Functions have meaningful names
- [ ] Comments explain complex logic
- [ ] No unused variables
- [ ] Consistent indentation
### HTML
- [ ] Semantic HTML elements (`header`, `nav`, `main`, `section`, `footer`)
- [ ] Images have `alt` text
- [ ] Forms have `label` elements
- [ ] Proper heading hierarchy (h1, h2, h3)
### CSS
- [ ] CSS variables used for colors and fonts
- [ ] No duplicate styles
- [ ] Responsive breakpoints work
- [ ] Consistent spacing
### SQL
- [ ] Parameterized queries used (no string concatenation)
- [ ] Table names are plural
- [ ] Column names are descriptive
## Security
- [ ] Passwords hashed with bcrypt
- [ ] Passwords not returned to frontend
- [ ] Admin routes protected with `requireAdmin`
- [ ] Session secret is configured
- [ ] CORS is not over-permissive
## Performance
- [ ] Images optimized (WebP format considered)
- [ ] Lazy loading for images
- [ ] No large dependencies
## Documentation
- [ ] README is up to date
- [ ] Decisions log is up to date
- [ ] Comments explain code