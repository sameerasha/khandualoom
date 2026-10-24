import React, { useState } from 'react';
import { ShoppingBag, User as UserIcon, Search, Menu, X, Shield, LogOut, MessageSquare, Share2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { toggleCart } from '@/features/cart/cartSlice';
import { logout } from '@/features/auth/authSlice';
import { setSearchQuery } from '@/features/products/productsSlice';

interface NavbarProps {
  onOpenAuth: () => void;
  onNavigateAdmin?: () => void;
  onOpenProfile?: () => void;
  onOpenContact?: () => void;
  onOpenSocial?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  onNavigateAdmin,
  onOpenProfile,
  onOpenContact,
  onOpenSocial,
}) => {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.cart);
  const { user, isAuthenticated, isAdmin } = useAppSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    dispatch(setSearchQuery(searchInput.trim()));
    setSearchFocused(false);
    document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectQuickTag = (tag: string) => {
    setSearchInput(tag);
    dispatch(setSearchQuery(tag));
    setSearchFocused(false);
    document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-brand-purple-dark/95 backdrop-blur-md border-b border-brand-gold/20 text-brand-ivory transition-all shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img
              src="/logo.svg"
              alt="Vastraloom Imperial Logo"
              className="w-11 h-11 object-contain drop-shadow-[0_2px_10px_rgba(197,160,89,0.4)]"
            />
            <div>
              <span className="font-serif text-2xl tracking-wider text-brand-gold font-bold">
                VASTRALOOM
              </span>
              <p className="text-[10px] tracking-widest text-brand-gold-light/80 uppercase font-sans -mt-1">
                Pure Handloom Heritage
              </p>
            </div>
          </div>

          {/* Search Bar & Suggestion Dialog - Desktop */}
          <div className="hidden md:block relative w-72 lg:w-96">
            <form onSubmit={handleSearchSubmit} className="flex items-center relative">
              <input
                type="text"
                placeholder="Search Banarasi, Kanjivaram, Silk..."
                value={searchInput}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-[#160726]/80 border border-brand-gold/30 hover:border-brand-gold/60 focus:border-brand-gold rounded-full py-2 pl-4 pr-16 text-sm text-brand-ivory placeholder-brand-ivory/50 focus:outline-none focus:ring-1 focus:ring-brand-gold/40 transition-all shadow-inner"
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
                  <span>Popular Weave Traditions</span>
                  <button
                    onClick={() => setSearchFocused(false)}
                    className="text-brand-ivory/40 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {['Banarasi Kadwa', 'Kanjeevaram Silk', 'Chanderi Tissue', 'Royal Shikargah', 'Paithani Gold', 'Pure Zari'].map(
                    (tag) => (
                      <button
                        key={tag}
                        onClick={() => handleSelectQuickTag(tag)}
                        className="text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-brand-gold/20 border border-brand-gold/20 hover:border-brand-gold/60 text-brand-ivory/80 hover:text-brand-gold transition-all"
                      >
                        {tag}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            <button
              onClick={onOpenContact}
              className="hover:text-brand-gold transition-colors flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5 text-brand-gold" />
              <span>Contact</span>
            </button>
            <button
              onClick={onOpenSocial}
              className="hover:text-brand-gold transition-colors text-brand-gold/90 hover:text-brand-gold p-1.5 rounded-full hover:bg-white/5 flex items-center gap-1.5"
              title="Social Salon & Stories"
            >
              <Share2 className="w-4 h-4" />
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
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenContact?.();
              }}
              className="text-left py-2 px-3 rounded hover:bg-brand-purple text-brand-ivory hover:text-brand-gold text-sm flex items-center justify-between"
            >
              <span>Concierge Contact</span>
              <MessageSquare className="w-4 h-4 text-brand-gold" />
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSocial?.();
              }}
              className="text-left py-2 px-3 rounded hover:bg-brand-purple text-brand-ivory hover:text-brand-gold text-sm flex items-center justify-between"
            >
              <span>Community & Socials</span>
              <Share2 className="w-4 h-4 text-brand-gold" />
            </button>
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
