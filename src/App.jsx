import { useState, useEffect } from "react";
import CartModal from "./components/CartModal";
import ProductCard from "./components/ProductCard";
import products from "./data";
import "./App.css";

export default function App() {
  // Get unique brands from the products array
  const allBrands = [...new Set(products.map((p) => p.brand))];

  // Theme state: defaults to dark or stored user preference
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("techstore_theme") || "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("techstore_theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }

  // State variables
  const [cartItems, setCartItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [sortBy, setSortBy] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Add to cart handler
  function addToCart(product) {
    const existingItem = cartItems.find((item) => item.id === product.id);

    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  }

  // Increase quantity handler
  function increaseQuantity(productId) {
    setCartItems(
      cartItems.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  }

  // Decrease quantity handler (removes item if quantity reaches 0)
  function decreaseQuantity(productId) {
    setCartItems(
      cartItems
        .map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  // Remove from cart handler
  function removeFromCart(productId) {
    setCartItems(cartItems.filter((item) => item.id !== productId));
  }

  // Wishlist toggle handler
  function toggleWishlist(productID) {
    if (wishlist.includes(productID)) {
      setWishlist(wishlist.filter((id) => id !== productID));
    } else {
      setWishlist([...wishlist, productID]);
    }
  }

  // Calculate total cart quantity
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Calculate total cart price
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      const matchesBrand =
        selectedBrand === "All" || product.brand === selectedBrand;

      const search = searchTerm.toLowerCase();

      const matchesSearch =
        product.brand.toLowerCase().includes(search) ||
        product.name.toLowerCase().includes(search);

      return matchesBrand && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;

        case "price-desc":
          return b.price - a.price;

        case "rating":
          return b.rating - a.rating;

        default:
          return 0;
      }
    });

  // Search, brand, and sorting handlers
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleBrandChange = (e) => {
    setSelectedBrand(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <>
      {/* Cart Sidebar */}
      {isCartOpen && (
        <CartModal
          cartItems={cartItems}
          cartTotal={cartTotal}
          cartCount={cartCount}
          onClose={() => setIsCartOpen(false)}
          onIncrease={increaseQuantity}
          onDecrease={decreaseQuantity}
          onRemove={removeFromCart}
        />
      )}

      {/* Header */}
      <header className="site-header">
        <nav className="navbar" aria-label="Main navigation">
          <a className="brand" href="#home">
            <span className="brand-icon" aria-hidden="true">
              💻
            </span>
            TechStore
          </a>

          <div className="nav-links">
            <a href="#products">Products</a>
            <a href="#deals">Deals</a>
            <a href="#support">Support</a>
            <a href="#about">About</a>
          </div>

          <div className="nav-actions">
            <button
              type="button"
              className="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              title={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
            >
              {theme === "dark" ? (
                <svg
                  className="theme-icon sun-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg
                  className="theme-icon moon-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>

            <button
              type="button"
              className="nav-cart"
              onClick={() => setIsCartOpen(true)}
              aria-label={`View cart, ${cartCount} items`}
            >
              <svg
                className="nav-cart-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <span className="nav-cart-count">{cartCount}</span>
            </button>

            <button
              type="button"
              className="nav-wishlist"
              onClick={() => {}}
              aria-label={`View wishlist, ${wishlist.length} items`}
            >
              <span className="nav-wishlist-icon">
                {wishlist.length > 0 ? "❤️" : "🤍"}
              </span>
              <span className="nav-wishlist-count">{wishlist.length}</span>
            </button>

            <a className="nav-shop-button" href="#products">
              Shop Now
            </a>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero" id="home">
          <div className="hero-content">
            <span className="hero-badge">Discover our latest collection</span>

            <h1>
              Experience the
              <br />
              <span>Future of Tech</span>
            </h1>

            <p className="hero-description">
              Explore laptops, smartphones, tablets, and accessories for work,
              creativity, and entertainment.
            </p>

            <div className="hero-buttons">
              <a className="primary-button" href="#products">
                Explore Products
              </a>

              <a className="secondary-button" href="#about">
                Learn More
              </a>
            </div>

            <div className="hero-stats">
              <div>
                <strong>{products.length}</strong>
                <span>Products to explore</span>
              </div>

              <div>
                <strong>4</strong>
                <span>Product categories</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <span className="hero-visual-label">FEATURED COLLECTION</span>

            {products.length > 0 && (
              <img src={products[0].image} alt={products[0].name} />
            )}

            <p>Upgrade your everyday experience.</p>
          </div>
        </section>

        {/* Products Section */}
        <section className="products-section" id="products">
          <div className="section-heading">
            <span className="section-label">OUR COLLECTION</span>

            <h2>Discover Your Next Upgrade</h2>

            <p>Browse our collection and find your favourite product.</p>
          </div>

          {/* Search, Brand Filter, and Sorting */}
          <div className="product-controls">
            <input
              type="text"
              placeholder="Search products or brands..."
              value={searchTerm}
              onChange={handleSearchChange}
              aria-label="Search products"
            />

            <select
              value={selectedBrand}
              onChange={handleBrandChange}
              aria-label="Filter by brand"
            >
              <option value="All">All Brands</option>

              {allBrands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={handleSortChange}
              aria-label="Sort products"
            >
              <option value="">Default Sorting</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rating</option>
            </select>
          </div>

          {/* Blue Cart Summary Bar */}
          <section className="cart-summary-bar" id="cart">
            <button
              type="button"
              className="cart-summary-info"
              onClick={() => setIsCartOpen(true)}
              aria-label="Open shopping cart"
            >
              <svg
                className="cart-summary-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <span>Cart: {cartCount} items</span>
            </button>

            <div className="cart-summary-total">
              ₹{cartTotal.toLocaleString("en-IN")}
            </div>
          </section>

          {/* Product Cards */}
          <div className="products-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  brand={product.brand}
                  name={product.name}
                  image={product.image}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  discount={product.discount}
                  rating={product.rating}
                  bestseller={product.bestseller}
                  isWishlisted={wishlist.includes(product.id)}
                  onAddToCart={() => addToCart(product)}
                  onToggleWishlist={() => toggleWishlist(product.id)}
                />
              ))
            ) : (
              <p>No products found.</p>
            )}
          </div>
        </section>

        {/* Deals Section */}
        <section className="information-section" id="deals">
          <span className="section-label">PRODUCT OFFERS</span>

          <h2>Discover More Value</h2>

          <p>
            Look for discount badges on selected products. Each card displays
            its current price and, where applicable, its original price.
          </p>

          <a className="text-link" href="#products">
            Browse Products →
          </a>
        </section>

        {/* About Section */}
        <section className="information-section" id="about">
          <span className="section-label">ABOUT THIS PROJECT</span>

          <h2>Welcome to TechStore</h2>

          <p>
            TechStore is a React practice project built using reusable
            components, props, arrays, objects, conditional rendering, and the
            map method.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer" id="support">
        <a className="brand" href="#home">
          <span className="brand-icon" aria-hidden="true">
            ⚡
          </span>
          TechStore
        </a>

        <p>Class 8 React Product Listing Project</p>

        <a className="support-link" href="mailto:support@example.com">
          support@example.com
        </a>

        <p className="copyright">
          © {new Date().getFullYear()} TechStore. All rights reserved.
        </p>
      </footer>
    </>
  );
}
