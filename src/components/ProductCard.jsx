import "./ProductCard.css";

export default function ProductCard({
  id,
  brand,
  name,
  image,
  price,
  originalPrice,
  discount,
  rating,
  bestseller,
  isWishlisted,
  onAddToCart,
  onToggleWishlist,
}) {
  return (
    <article className="product-card">
      <div className="product-image-container">
        {discount > 0 && (
          <span className="discount-badge">{discount}% OFF</span>
        )}

        <button
          className={`wishlisted ${isWishlisted ? "active" : ""}`}
          type="button"
          onClick={onToggleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isWishlisted ? "❤️" : "🤍"}
        </button>

        <img className="product-image" src={image} alt={name} loading="lazy" />
      </div>

      <div className="product-details">
        <div className="product-label">
          {bestseller && <span className="bestseller-badge">Bestseller</span>}
        </div>

        <p className="product-brand">{brand}</p>

        <h3 className="product-name">{name}</h3>

        <div className="product-rating">
          <span className="rating-star" aria-hidden="true">
            ★
          </span>

          <span>{rating} / 5</span>
        </div>

        <div className="product-prices">
          <span className="current-price">
            ₹{price.toLocaleString("en-IN")}
          </span>

          {originalPrice > 0 && (
            <span className="original-price">
              ₹{originalPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        <button
          className="add-to-cart-button"
          type="button"
          onClick={onAddToCart}
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
}
