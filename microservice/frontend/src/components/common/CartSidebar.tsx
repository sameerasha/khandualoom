import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  setCartOpen,
  updateQuantity,
  removeFromCart,
  clearCart,
} from '@/features/cart/cartSlice';

interface CartSidebarProps {
  onProceedToCheckout: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({
  onProceedToCheckout,
}) => {
  const dispatch = useAppDispatch();
  const { items, isOpen } = useAppSelector((state) => state.cart);

  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = subtotal > 5000 || subtotal === 0 ? 0 : 250;
  const total = subtotal + shipping;

  const handleCheckoutClick = () => {
    dispatch(setCartOpen(false));
    onProceedToCheckout();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => dispatch(setCartOpen(false))}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-brand-purple-dark border-l border-brand-gold/30 text-brand-ivory flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-brand-gold/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-gold" />
              <h2 className="font-serif text-xl font-bold text-brand-ivory">
                Your Bag ({items.reduce((acc, i) => acc + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => dispatch(setCartOpen(false))}
              className="p-1 rounded-full text-brand-gold hover:text-white hover:bg-white/10"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-brand-purple/60 border border-brand-gold/20 flex items-center justify-center mx-auto text-brand-gold">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <p className="font-serif text-lg text-brand-ivory">Your bag is empty</p>
                <p className="text-xs text-brand-ivory/60 max-w-xs mx-auto">
                  Browse our handloom collection and drape yourself in pure silk luxury.
                </p>
                <button
                  onClick={() => dispatch(setCartOpen(false))}
                  className="mt-4 px-6 py-2.5 rounded-full bg-brand-gold text-brand-purple-dark text-xs font-bold hover:brightness-110"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex gap-4 p-3 rounded-xl bg-brand-purple/40 border border-brand-gold/15"
                >
                  <img
                    src={product.image || '/images/saree_crimson_red.png'}
                    alt={product.name}
                    className="w-20 h-24 object-cover rounded-lg border border-brand-gold/20"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif font-bold text-sm text-brand-ivory line-clamp-1">
                          {product.name}
                        </h4>
                        <button
                          onClick={() => dispatch(removeFromCart(product.id))}
                          className="text-brand-ivory/40 hover:text-brand-crimson p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-brand-gold-light/70">{product.fabric}</p>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center gap-2 border border-brand-gold/30 rounded-lg px-2 py-0.5 bg-brand-purple-dark/80">
                        <button
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                productId: product.id,
                                quantity: quantity - 1,
                              })
                            )
                          }
                          className="text-brand-gold hover:text-white p-0.5"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold px-1">{quantity}</span>
                        <button
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                productId: product.id,
                                quantity: quantity + 1,
                              })
                            )
                          }
                          className="text-brand-gold hover:text-white p-0.5"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="font-serif font-bold text-sm text-brand-gold">
                        ₹{(product.price * quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Order Summary */}
          {items.length > 0 && (
            <div className="p-6 border-t border-brand-gold/20 bg-brand-purple/20 space-y-3">
              <div className="flex justify-between text-xs text-brand-ivory/80">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-xs text-brand-ivory/80">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="text-emerald-400 font-bold">FREE</span> : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-brand-gold border-t border-brand-gold/15 pt-2">
                <span>Total Amount</span>
                <span className="font-serif text-lg">₹{total.toLocaleString('en-IN')}</span>
              </div>

              <button
                onClick={handleCheckoutClick}
                className="w-full mt-3 bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-purple-dark font-serif font-bold py-3.5 rounded-full flex items-center justify-center gap-2 hover:brightness-110 shadow-lg text-sm"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => dispatch(clearCart())}
                className="w-full text-center text-xs text-brand-ivory/40 hover:text-brand-ivory/80 pt-1"
              >
                Clear Bag
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
