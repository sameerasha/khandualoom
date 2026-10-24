import React, { useState } from 'react';
import { ShoppingBag, User as UserIcon, Search, Menu, X, Shield, LogOut, Sparkles } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { toggleCart } from '@/features/cart/cartSlice';
import { logout } from '@/features/auth/authSlice';
import { setSearchQuery } from '@/features/products/productsSlice';

interface NavbarProps {
  onOpenAuth: () => void;
  onNavigateAdmin?: () => void;
  onOpenProfile?: () => void;
  onNavigateHome?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  onNavigateAdmin,
  onOpenProfile,
  onNavigateHome,
}) => {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.cart);
  const { user, isAuthenticated, isAdmin } = useAppSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  const handleLogoClick = () => {
    setMobileMenuOpen(false);
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  };

  const handleScrollTo = (elementId: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else if (onNavigateHome) {
      onNavigateHome();
      setTimeout(() => {
        document.getElementById(elementId)?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    dispatch(setSearchQuery(searchInput.trim()));
    setSearchFocused(false);
    handleScrollTo('catalog-section');
  };

  const handleSelectQuickTag = (tag: string) => {
    setSearchInput(tag);
    dispatch(setSearchQuery(tag));
    setSearchFocused(false);
    handleScrollTo('catalog-section');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#12051E]/95 backdrop-blur-md border-b border-brand-gold/25 text-brand-ivory transition-all shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Logo & Name */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none group shrink-0"
            onClick={handleLogoClick}
            title="Khadua Looms • Return to Home"
          >
            <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-brand-gold via-brand-gold-light to-brand-gold-dark p-0.5 shadow-[0_2px_12px_rgba(197,160,89,0.45)] group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full rounded-full bg-[#12051E] flex items-center justify-center overflow-hidden">
                <img
                  src="/logo.svg"
                  alt="Khadua Looms Logo"
                  className="w-7 h-7 object-contain"
                />
              </div>
            </div>
            <div>
              <span className="font-serif text-2xl tracking-wider text-brand-gold font-bold transition-colors group-hover:text-brand-gold-light block leading-none">
                KHADUA LOOMS
              </span>
              <p className="text-[9.5px] tracking-[0.18em] text-brand-gold-light/90 uppercase font-sans mt-1">
                Woven in Tradition. Wrapped in Elegance.
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-brand-ivory/85">
            <button
              onClick={() => handleScrollTo('collections-section')}
              className="hover:text-brand-gold transition-colors cursor-pointer py-1 border-b-2 border-transparent hover:border-brand-gold"
            >
              Collections
            </button>
            <button
              onClick={() => handleScrollTo('catalog-section')}
              className="hover:text-brand-gold transition-colors cursor-pointer py-1 border-b-2 border-transparent hover:border-brand-gold"
            >
              Shop Sarees
            </button>
            <button
              onClick={() => handleScrollTo('new-arrivals-section')}
              className="hover:text-brand-gold transition-colors cursor-pointer py-1 border-b-2 border-transparent hover:border-brand-gold flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-brand-gold" />
              <span>New Arrivals</span>
            </button>
            <button
              onClick={() => handleScrollTo('heritage-section')}
              className="hover:text-brand-gold transition-colors cursor-pointer py-1 border-b-2 border-transparent hover:border-brand-gold"
            >
              Our Heritage
            </button>
            <button
              onClick={() => handleScrollTo('why-us-section')}
              className="hover:text-brand-gold transition-colors cursor-pointer py-1 border-b-2 border-transparent hover:border-brand-gold"
            >
              Why Khadua
            </button>
          </nav>

          {/* Search Bar & Suggestion Dialog - Desktop */}
          <div className="hidden md:block relative w-64 lg:w-80">
            <form onSubmit={handleSearchSubmit} className="flex items-center relative">
              <input
                type="text"
                placeholder="Search Khadua, Sambalpuri, Bomkai..."
                value={searchInput}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-[#18072B]/90 border border-brand-gold/30 hover:border-brand-gold/60 focus:border-brand-gold rounded-full py-2 pl-4 pr-16 text-xs text-brand-ivory placeholder-brand-ivory/50 focus:outline-none focus:ring-1 focus:ring-brand-gold/40 transition-all shadow-inner"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput('');
                    dispatch(setSearchQuery(''));
                  }}
                  className="absolute right-9 text-brand-ivory/50 hover:text-white transition-colors p-1"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-3 text-brand-gold hover:text-brand-gold-light transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Enriched Search Suggestion Dialog */}
            {searchFocused && (
              <div
                className="absolute top-full left-0 right-0 mt-2 p-3.5 bg-gradient-to-b from-[#180B28] via-[#12051E] to-[#0A0212] border border-brand-gold/35 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] z-50 animate-in fade-in slide-in-from-top-2"
                onMouseDown={(e) => e.preventDefault()}
              >
                <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-brand-gold/90 mb-2 px-1">
                  <span>Odisha Handloom Traditions</span>
                  <button
                    onClick={() => setSearchFocused(false)}
                    className="text-brand-ivory/40 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Khadua Silk',
                    'Sambalpuri Ikat',
                    'Bomkai Silk',
                    'Wedding Sarees',
                    'Berhampuri Pata',
                    'Pasapalli',
                    'Kotpad Organic',
                    'Dongria Kondh',
                  ].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleSelectQuickTag(tag)}
                      className="text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-brand-gold/20 border border-brand-gold/20 hover:border-brand-gold/60 text-brand-ivory/80 hover:text-brand-gold transition-all"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Cart Trigger */}
            <button
              onClick={() => dispatch(toggleCart())}
              className="relative p-2 text-brand-ivory hover:text-brand-gold transition-colors rounded-full hover:bg-white/5 cursor-pointer"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-brand-gold" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-crimson text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-brand-purple-dark shadow">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* User Account / Auth Dropdown */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full border border-brand-gold/30 hover:border-brand-gold bg-brand-purple/50 text-sm cursor-pointer"
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
                        className="w-full text-left px-4 py-2 hover:bg-brand-purple text-brand-gold flex items-center gap-2 cursor-pointer"
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
                      className="w-full text-left px-4 py-2 hover:bg-brand-purple text-brand-ivory/90 flex items-center gap-2 cursor-pointer"
                    >
                      <UserIcon className="w-4 h-4" />
                      My Profile & Orders
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        dispatch(logout());
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-brand-crimson/20 text-brand-crimson flex items-center gap-2 border-t border-brand-gold/10 cursor-pointer"
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
                className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-purple-dark font-medium px-4 py-2 rounded-full text-xs uppercase tracking-wider font-sans hover:brightness-110 transition-all shadow-md cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5" />
                Sign In
              </button>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-brand-gold hover:text-brand-gold-light cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Slide-down */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#12051E] border-b border-brand-gold/25 px-4 pt-3 pb-6 space-y-4 shadow-2xl">
          <form onSubmit={handleSearchSubmit} className="relative mt-1">
            <input
              type="text"
              placeholder="Search Khadua, Sambalpuri, Handlooms..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-[#1A072E] border border-brand-gold/30 rounded-full py-2.5 pl-4 pr-10 text-xs text-brand-ivory placeholder-brand-ivory/50"
            />
            <button type="submit" className="absolute right-3.5 top-3 text-brand-gold">
              <Search className="w-4 h-4" />
            </button>
          </form>

          <div className="flex flex-col gap-2 pt-2 border-t border-brand-gold/15 text-sm font-serif">
            <button
              onClick={() => handleScrollTo('collections-section')}
              className="text-left py-2 px-3 rounded-lg hover:bg-brand-gold/10 text-brand-gold flex items-center justify-between"
            >
              <span>Shop by Collection</span>
              <span className="text-xs font-mono text-brand-ivory/50">6 Collections</span>
            </button>
            <button
              onClick={() => handleScrollTo('catalog-section')}
              className="text-left py-2 px-3 rounded-lg hover:bg-brand-gold/10 text-brand-ivory hover:text-brand-gold flex items-center justify-between"
            >
              <span>Shop All Sarees</span>
              <span className="text-xs font-mono text-brand-ivory/50">18 Sarees</span>
            </button>
            <button
              onClick={() => handleScrollTo('new-arrivals-section')}
              className="text-left py-2 px-3 rounded-lg hover:bg-brand-gold/10 text-brand-ivory hover:text-brand-gold flex items-center justify-between"
            >
              <span>New Arrivals</span>
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
            </button>
            <button
              onClick={() => handleScrollTo('heritage-section')}
              className="text-left py-2 px-3 rounded-lg hover:bg-brand-gold/10 text-brand-ivory hover:text-brand-gold"
            >
              Our Odisha Heritage
            </button>
            <button
              onClick={() => handleScrollTo('why-us-section')}
              className="text-left py-2 px-3 rounded-lg hover:bg-brand-gold/10 text-brand-ivory hover:text-brand-gold"
            >
              Why Khadua Looms?
            </button>
          </div>

          <div className="flex flex-col gap-2 pt-2 border-t border-brand-gold/15">
            {!isAuthenticated && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full mt-2 bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-purple-dark font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider"
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
