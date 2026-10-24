import cartReducer, {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} from './cartSlice';
import { Product } from '@/types';

const mockProduct: Product = {
  id: 101,
  name: 'Varanasi Royal Brocade',
  category: 'Banarasi',
  price: 24999,
  image: '/images/saree_purple_gold.png',
  description: 'Pure silk handloom saree',
  fabric: 'Pure Silk',
  weave: 'Handloom',
  color: 'Purple',
  rating: 4.9,
  reviews: 42,
};

describe('Cart Redux Slice', () => {
  const initialState = {
    items: [],
    isOpen: false,
  };

  it('should handle initial state', () => {
    expect(cartReducer(undefined, { type: 'unknown' }).items).toEqual([]);
  });

  it('should add item to cart', () => {
    const actual = cartReducer(initialState, addToCart({ product: mockProduct, quantity: 1 }));
    expect(actual.items.length).toBe(1);
    expect(actual.items[0].product.name).toBe('Varanasi Royal Brocade');
    expect(actual.items[0].quantity).toBe(1);
  });

  it('should increment quantity if adding identical product', () => {
    const stateWithOne = cartReducer(initialState, addToCart({ product: mockProduct, quantity: 1 }));
    const stateWithTwo = cartReducer(stateWithOne, addToCart({ product: mockProduct, quantity: 2 }));
    expect(stateWithTwo.items.length).toBe(1);
    expect(stateWithTwo.items[0].quantity).toBe(3);
  });

  it('should update quantity correctly', () => {
    const stateWithOne = cartReducer(initialState, addToCart({ product: mockProduct, quantity: 1 }));
    const updated = cartReducer(stateWithOne, updateQuantity({ productId: 101, quantity: 5 }));
    expect(updated.items[0].quantity).toBe(5);
  });

  it('should remove item when quantity set to 0 or negative', () => {
    const stateWithOne = cartReducer(initialState, addToCart({ product: mockProduct, quantity: 1 }));
    const updated = cartReducer(stateWithOne, updateQuantity({ productId: 101, quantity: 0 }));
    expect(updated.items.length).toBe(0);
  });

  it('should remove item by ID', () => {
    const stateWithOne = cartReducer(initialState, addToCart({ product: mockProduct, quantity: 1 }));
    const removed = cartReducer(stateWithOne, removeFromCart(101));
    expect(removed.items.length).toBe(0);
  });

  it('should clear all items in cart', () => {
    const stateWithOne = cartReducer(initialState, addToCart({ product: mockProduct, quantity: 1 }));
    const cleared = cartReducer(stateWithOne, clearCart());
    expect(cleared.items.length).toBe(0);
  });
});
