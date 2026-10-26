import { useEffect } from "react";
import "./CartModal.css";

export default function CartModal({
  cartItems,
  cartTotal,
  cartCount,
  onClose,
  onIncrease,
  onDecrease,
  onRemove,
}) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const totalItems =
    cartCount ??
    cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="cart-sidebar-backdrop" onClick={onClose}>
      <aside
        className="cart-sidebar"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Shopping Cart"
        aria-modal="true"
      >
        <header className="cart-sidebar-header">
          <div className="cart-sidebar-title">
            <h2>Your Cart</h2>
            <span className="cart-sidebar-badge">{totalItems} items</span>
          </div>
          <button
            type="button"
            className="cart-sidebar-close"
            onClick={onClose}
            aria-label="Close cart"
          >
            ✕
          </button>
        </header>

        {cartItems.length === 0 ? (
          <div className="cart-sidebar-empty">
            <div className="empty-cart-icon-wrapper">
              <svg
                className="empty-icon-svg"
                viewBox="0 0 24 24"
                width="48"
                height="48"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </div>
            <h3>Your cart is empty</h3>
            <p>Explore our collection and add items to your cart.</p>
            <button
              type="button"
              className="continue-shopping-button"
              onClick={onClose}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="cart-sidebar-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-sidebar-item">
                  <div className="cart-item-image-wrapper">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="cart-item-image"
                    />
                  </div>

                  <div className="cart-item-info">
                    {item.brand && (
                      <span className="cart-item-brand">{item.brand}</span>
                    )}
                    <h4 className="cart-item-name">{item.name}</h4>
                    <span className="cart-item-unit-price">
                      ₹{item.price.toLocaleString("en-IN")} each
                    </span>

                    <div className="cart-item-controls">
                      <div className="quantity-controller">
                        <button
                          type="button"
                          className="qty-btn minus"
                          onClick={() => onDecrease(item.id)}
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          −
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button
                          type="button"
                          className="qty-btn plus"
                          onClick={() => onIncrease(item.id)}
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          +
                        </button>
                      </div>

                      <span className="cart-item-subtotal">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="cart-item-remove"
                    onClick={() => onRemove(item.id)}
                    aria-label={`Remove ${item.name} from cart`}
                    title="Remove item"
                  >
                    🗑
                  </button>
                </div>
              ))}
            </div>

            <footer className="cart-sidebar-footer">
              <div className="cart-sidebar-summary">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="summary-row shipping">
                  <span>Shipping</span>
                  <span className="free-shipping">FREE</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span className="total-amount">
                    ₹{cartTotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="checkout-button"
                onClick={() => alert("Proceeding to checkout!")}
              >
                Proceed to Checkout
              </button>

              <button
                type="button"
                className="view-products-link"
                onClick={onClose}
              >
                Continue Shopping
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
