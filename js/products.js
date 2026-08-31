// ============================================
// KIPEPEO MARKET — PRODUCT CATALOG
// ============================================
// Find the product grid on the page
const productGrid = document.getElementById("product-grid");
// ============================================
// FETCH PRODUCTS FROM API
// ============================================
async function loadProducts() {
try {
// Request products from our backend API
const response = await fetch("/api/products");
// Check whether the server responded successfully
if (!response.ok) {
throw new Error(`HTTP error: ${response.status}`);
}
// Convert the JSON response into JavaScript data
const products = await response.json();
// Display the products
renderProducts(products);
} catch (error) {
console.error("❌ Error loading products:", error);
productGrid.innerHTML = `
<div class="products-error">
<h3>Unable to load products</h3>
<p>
We couldn't load our products right now.
Please try again later.
</p>
</div>
`;
}
}
// ============================================
// BUILD PRODUCT IMAGE PATH
// ============================================
function getProductImagePath(product) {
return `assets/images/products/${product.category}/${product.image}`;
}
// ============================================
// FORMAT PRICE
// ============================================
function formatPrice(price) {
return new Intl.NumberFormat("en-KE", {
style: "currency",
currency: "KES",
maximumFractionDigits: 0
}).format(price);
}
// ============================================
// RENDER PRODUCTS
// ============================================
function renderProducts(products) {
// Handle an empty product list
if (products.length === 0) {
productGrid.innerHTML = `
<div class="products-empty">
<h3>No products available</h3>
<p>
Please check back later.
</p>
</div>
`;
return;
}
// Create the product cards
productGrid.innerHTML = products.map(product => {
const imagePath = getProductImagePath(product);
return `
<article class="product-card">
<div class="product-image">
<img
src="${imagePath}"
alt="${product.name}"
loading="lazy"
>
</div>
<div class="product-info">
<p class="product-category">
${product.category}
</p>
<h3 class="product-name">
${product.name}
</h3>
<p class="product-description">
${product.description}
</p>
<p class="product-price">
${formatPrice(product.price)}
</p>
</div>
</article>
`;
}).join("");
}
// ============================================
// START PRODUCT LOADING
// ============================================
loadProducts();