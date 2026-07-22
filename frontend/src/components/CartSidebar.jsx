import { useCart } from '../context/CartContext';
import './CartSidebar.css';

export default function CartSidebar({ isOpen, onClose, onCheckout }) {
  const { cartItems, removeFromCart, updateQuantity, totalPrice } = useCart();

  return (
    <>
      <div className={`cart-overlay ${isOpen ? 'cart-overlay--visible' : ''}`} onClick={onClose}></div>
      <aside className={`cart-sidebar ${isOpen ? 'cart-sidebar--open' : ''}`} id="cart-sidebar">
        {/* Header */}
        <div className="cart-sidebar__header">
          <div>
            <h2 className="cart-sidebar__title">Your Cart</h2>
            <p className="cart-sidebar__count">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</p>
          </div>
          <button className="cart-sidebar__close" onClick={onClose} aria-label="Close cart" id="close-cart">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="cart-sidebar__items">
          {cartItems.length === 0 ? (
            <div className="cart-sidebar__empty">
              <span className="cart-sidebar__empty-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-400)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
              </span>
              <p className="cart-sidebar__empty-title">Your cart is empty</p>
              <p className="cart-sidebar__empty-text">Discover our exquisite handloom collection</p>
              <button className="cart-sidebar__browse-btn" onClick={onClose}>Browse Collections</button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item" id={`cart-item-${item.id}`}>
                <div className="cart-item__image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="cart-item__info">
                  <h4 className="cart-item__name">{item.name}</h4>
                  <p className="cart-item__category">{item.category}</p>
                  <div className="cart-item__bottom">
                    <div className="cart-item__quantity">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label="Decrease quantity">−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="Increase quantity">+</button>
                    </div>
                    <span className="cart-item__price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <button className="cart-item__remove" onClick={() => removeFromCart(item.id)} aria-label="Remove item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="cart-sidebar__footer">
            <div className="cart-sidebar__total">
              <span>Total</span>
              <span className="cart-sidebar__total-price">₹{totalPrice.toLocaleString('en-IN')}</span>
            </div>
            <button className="cart-sidebar__checkout" id="checkout-btn" onClick={onCheckout}>
              <span>Proceed to Checkout</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <p className="cart-sidebar__shipping">Free shipping on orders above ₹5,000</p>
          </div>
        )}
      </aside>
    </>
  );
}
