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
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => dispatch(setCartOpen(false))}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-surface border-l border-border text-text-primary flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-accent" />
              <h2 className="font-serif text-xl font-bold text-text-primary">
                Your Bag ({items.reduce((acc, i) => acc + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => dispatch(setCartOpen(false))}
              className="p-1 rounded-full text-text-muted hover:text-text-primary hover:bg-background-secondary transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-background-secondary border border-border flex items-center justify-center mx-auto text-text-muted">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <p className="font-serif text-lg text-text-primary">Your Bag is Empty</p>
                <p className="text-xs text-text-muted max-w-xs mx-auto">
                  Explore our authentic handwoven sarees made by skilled weavers of Odisha.
                </p>
                <button
                  onClick={() => dispatch(setCartOpen(false))}
                  className="mt-4 px-6 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 p-3.5 rounded-2xl bg-background-secondary border border-border hover:border-accent transition-all group"
                >
                  <img
                    src={item.product.image || '/images/products/p1/front.jpg'}
                    alt={item.product.name}
                    className="w-20 h-24 object-cover rounded-xl border border-border bg-surface shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-serif text-sm font-semibold text-text-primary line-clamp-1">
                          {item.product.name}
                        </h3>
                        <button
                          onClick={() => dispatch(removeFromCart(item.product.id))}
                          className="text-text-muted hover:text-red-500 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-text-muted mt-0.5">
                        ₹{item.product.price.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center gap-2 border border-border rounded-lg bg-surface px-2 py-0.5">
                        <button
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                productId: item.product.id,
                                quantity: Math.max(1, item.quantity - 1),
                              })
                            )
                          }
                          className="text-text-secondary hover:text-text-primary disabled:opacity-30"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-mono font-bold text-text-primary px-1">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                productId: item.product.id,
                                quantity: item.quantity + 1,
                              })
                            )
                          }
                          className="text-text-secondary hover:text-text-primary"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="font-serif font-bold text-sm text-text-primary">
                        ₹{(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Authoritative Total */}
          {items.length > 0 && (
            <div className="p-6 border-t border-border bg-surface space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-text-secondary">
                  <span>Subtotal</span>
                  <span className="font-mono">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>Delivery</span>
                  <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-text-primary pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="font-mono text-base text-text-primary">
                    ₹{total.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => dispatch(clearCart())}
                  className="px-3 py-3 rounded-xl border border-border text-text-muted hover:text-red-500 text-xs font-bold transition-all"
                  title="Clear all bag items"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCheckoutClick}
                  className="flex-1 py-3.5 px-6 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs uppercase tracking-widest shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[10px] text-center text-text-muted">
                100% Genuine Handwoven Sarees • Free Insured Delivery
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
