import wishlistReducer, {
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  clearWishlist,
  setWishlistOpen,
  toggleWishlistOpen,
} from './wishlistSlice';
import { Product } from '@/types';

const mockProduct: Product = {
  id: 101,
  name: 'Nuapatna Khandua Pata',
  price: 18500,
  category: 'Khandua Pata',
  description: 'Heritage Khandua saree',
  image: '/images/khandua_1.jpg',
  fabric: 'Pure Mulberry Silk',
  weave: 'Calligraphic Ikat',
  color: 'Crimson & Gold',
  rating: 4.9,
  reviews: 24,
  badge: 'GI Tagged',
};

describe('Wishlist Redux Slice', () => {
  const initialState = { items: [], isOpen: false };

  it('should handle adding item to wishlist', () => {
    const nextState = wishlistReducer(initialState, addToWishlist(mockProduct));
    expect(nextState.items).toHaveLength(1);
    expect(nextState.items[0].id).toBe(101);
  });

  it('should not add duplicate item to wishlist', () => {
    const stateWithItem = { items: [mockProduct], isOpen: false };
    const nextState = wishlistReducer(stateWithItem, addToWishlist(mockProduct));
    expect(nextState.items).toHaveLength(1);
  });

  it('should handle removing item from wishlist', () => {
    const stateWithItem = { items: [mockProduct], isOpen: false };
    const nextState = wishlistReducer(stateWithItem, removeFromWishlist(101));
    expect(nextState.items).toHaveLength(0);
  });

  it('should toggle item in and out of wishlist', () => {
    // Toggle in
    const state1 = wishlistReducer(initialState, toggleWishlist(mockProduct));
    expect(state1.items).toHaveLength(1);

    // Toggle out
    const state2 = wishlistReducer(state1, toggleWishlist(mockProduct));
    expect(state2.items).toHaveLength(0);
  });

  it('should clear all items in wishlist', () => {
    const stateWithItems = { items: [mockProduct, { ...mockProduct, id: 102 }], isOpen: false };
    const nextState = wishlistReducer(stateWithItems, clearWishlist());
    expect(nextState.items).toHaveLength(0);
  });

  it('should handle opening and closing wishlist drawer', () => {
    const state1 = wishlistReducer(initialState, setWishlistOpen(true));
    expect(state1.isOpen).toBe(true);

    const state2 = wishlistReducer(state1, setWishlistOpen(false));
    expect(state2.isOpen).toBe(false);

    const state3 = wishlistReducer(state2, toggleWishlistOpen());
    expect(state3.isOpen).toBe(true);
  });
});
