import React, { useState } from 'react';
import { ShoppingBag, User as UserIcon, Search, Menu, X, Shield, Sparkles, LogOut } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { toggleCart } from '@/features/cart/cartSlice';
import { logout } from '@/features/auth/authSlice';
import { setSearchQuery, setSelectedCategory } from '@/features/products/productsSlice';

interface NavbarProps {
  onOpenAuth: () => void;
  onNavigateAdmin?: () => void;
  onOpenProfile?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  onNavigateAdmin,
  onOpenProfile,
}) => {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.cart);
  const { user, isAuthenticated, isAdmin } = useAppSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setSearchQuery(searchInput.trim()));
  };

  const handleCategorySelect = (category: string) => {
    dispatch(setSelectedCategory(category));
    setMobileMenuOpen(false);
    window.scrollTo({ top: 750, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-brand-purple-dark/95 backdrop-blur-md border-b border-brand-gold/20 text-brand-ivory transition-all shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-full border border-brand-gold/40 flex items-center justify-center bg-gradient-to-tr from-brand-purple to-brand-gold/30 shadow-inner">
              <Sparkles className="w-5 h-5 text-brand-gold-light animate-pulse" />
            </div>
            <div>
              <span className="font-serif text-2xl tracking-wider text-brand-gold font-bold">
                VASTRALOOM
              </span>
              <p className="text-[10px] tracking-widest text-brand-gold-light/80 uppercase font-sans -mt-1">
                Pure Handloom Heritage
              </p>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center relative w-72 lg:w-96"
          >
            <input
              type="text"
              placeholder="Search Banarasi, Kanjivaram, Silk..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-brand-purple/60 border border-brand-gold/30 rounded-full py-2 pl-4 pr-10 text-sm text-brand-ivory placeholder-brand-ivory/50 focus:outline-none focus:border-brand-gold transition-colors"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-3 text-brand-gold hover:text-brand-gold-light"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            <button
              onClick={() => handleCategorySelect('All')}
              className="hover:text-brand-gold transition-colors"
            >
              All Sarees
            </button>
            <button
              onClick={() => handleCategorySelect('Banarasi')}
              className="hover:text-brand-gold transition-colors"
            >
              Banarasi
            </button>
            <button
              onClick={() => handleCategorySelect('Kanjivaram')}
              className="hover:text-brand-gold transition-colors"
            >
              Kanjivaram
            </button>
            <button
              onClick={() => handleCategorySelect('Chanderi')}
              className="hover:text-brand-gold transition-colors"
            >
              Chanderi
            </button>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-4">
            {/* Cart Trigger */}
            <button
              onClick={() => dispatch(toggleCart())}
              className="relative p-2 text-brand-ivory hover:text-brand-gold transition-colors rounded-full hover:bg-white/5"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-6 h-6 text-brand-gold" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-crimson text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-brand-purple-dark shadow">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* User Account / Auth Dropdown */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full border border-brand-gold/30 hover:border-brand-gold bg-brand-purple/50 text-sm"
                >
                  <div className="w-7 h-7 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold font-bold">
                    {user?.firstName ? user.firstName[0].toUpperCase() : 'U'}
                  </div>
                  <span className="hidden sm:inline text-xs font-medium text-brand-gold-light pr-1">
                    {user?.firstName || 'Account'}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-brand-purple-dark border border-brand-gold/30 rounded-lg shadow-2xl py-2 z-50 text-sm">
                    <div className="px-4 py-2 border-b border-brand-gold/10">
                      <p className="font-semibold text-brand-gold">{user?.firstName}</p>
                      <p className="text-xs text-brand-ivory/60 truncate">{user?.email}</p>
                    </div>

                    {isAdmin && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onNavigateAdmin?.();
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-brand-purple text-brand-gold flex items-center gap-2"
                      >
                        <Shield className="w-4 h-4" />
                        Admin Dashboard
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenProfile?.();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-brand-purple text-brand-ivory/90 flex items-center gap-2"
                    >
                      <UserIcon className="w-4 h-4" />
                      My Profile & Orders
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        dispatch(logout());
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-brand-crimson/20 text-brand-crimson flex items-center gap-2 border-t border-brand-gold/10"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-purple-dark font-medium px-4 py-2 rounded-full text-sm hover:brightness-110 transition-all shadow-md"
              >
                <UserIcon className="w-4 h-4" />
                Sign In
              </button>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-brand-gold hover:text-brand-gold-light"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Slide-down */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-brand-purple-dark border-b border-brand-gold/20 px-4 pt-2 pb-6 space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative mt-2">
            <input
              type="text"
              placeholder="Search Sarees..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-brand-purple border border-brand-gold/30 rounded-full py-2 pl-4 pr-10 text-sm text-brand-ivory"
            />
            <button type="submit" className="absolute right-3 top-2.5 text-brand-gold">
              <Search className="w-4 h-4" />
            </button>
          </form>

          <div className="flex flex-col gap-2 pt-2 border-t border-brand-gold/10">
            {['All', 'Banarasi', 'Kanjivaram', 'Chanderi', 'Tussar'].map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className="text-left py-2 px-3 rounded hover:bg-brand-purple text-brand-ivory hover:text-brand-gold text-sm"
              >
                {cat} Sarees
              </button>
            ))}
            {!isAuthenticated && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full mt-2 bg-brand-gold text-brand-purple-dark font-semibold py-2 rounded-lg text-sm"
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
