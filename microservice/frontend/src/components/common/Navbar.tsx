import React, { useState } from 'react';
import { ShoppingBag, User as UserIcon, Search, Menu, X, Shield, LogOut, Sparkles, Heart, Globe } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { toggleCart } from '@/features/cart/cartSlice';
import { toggleWishlistOpen, selectWishlistTotalItems } from '@/features/wishlist/wishlistSlice';
import { setLanguage, selectCurrentLanguage, selectTranslations } from '@/features/i18n/i18nSlice';
import { LANGUAGE_OPTIONS } from '@/i18n/translations';
import { logout } from '@/features/auth/authSlice';
import { setSearchQuery } from '@/features/products/productsSlice';
import { ThemeSwitcher } from '@/theme/ThemeSwitcher';
import { useTheme } from '@/theme/useTheme';

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
  const { isDark } = useTheme();
  const { items } = useAppSelector((state) => state.cart);
  const { user, isAuthenticated, isAdmin } = useAppSelector((state) => state.auth);
  const currentLang = useAppSelector(selectCurrentLanguage);
  const t = useAppSelector(selectTranslations);
  const wishlistCount = useAppSelector(selectWishlistTotalItems);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

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
    <header
      className={`sticky top-0 z-40 transition-all backdrop-blur-md ${
        isDark
          ? 'bg-[#12051E]/95 border-b border-brand-gold/25 text-brand-ivory shadow-xl'
          : 'bg-white/95 border-b border-slate-200 text-slate-800 shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Logo & Name */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none group shrink-0"
            onClick={handleLogoClick}
            title="Khandua Looms • Return to Home"
          >
            <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-brand-gold via-brand-gold-light to-brand-gold-dark p-0.5 shadow-[0_2px_12px_rgba(197,160,89,0.35)] group-hover:scale-105 transition-transform duration-300">
              <div
                className={`w-full h-full rounded-full flex items-center justify-center overflow-hidden ${
                  isDark ? 'bg-[#12051E]' : 'bg-white'
                }`}
              >
                <img
                  src="/logo.svg"
                  alt="Khandua Looms Logo"
                  className="w-7 h-7 object-contain"
                />
              </div>
            </div>
            <div>
              <span
                className={`font-serif text-2xl tracking-wider font-bold transition-colors block leading-none ${
                  isDark
                    ? 'text-brand-gold group-hover:text-brand-gold-light'
                    : 'text-[#881337] group-hover:text-[#9f1239]'
                }`}
              >
                KHANDUA LOOMS
              </span>
              <p
                className={`text-[9.5px] tracking-[0.18em] uppercase font-sans mt-1 ${
                  isDark ? 'text-brand-gold-light/90' : 'text-slate-500'
                }`}
              >
                {t.brandTagline}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav
            className={`hidden xl:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider ${
              isDark ? 'text-brand-ivory/85' : 'text-slate-700'
            }`}
          >
            <button
              onClick={() => handleScrollTo('collections-section')}
              className={`transition-colors cursor-pointer py-1 border-b-2 border-transparent ${
                isDark
                  ? 'hover:text-brand-gold hover:border-brand-gold'
                  : 'hover:text-[#881337] hover:border-[#881337]'
              }`}
            >
              {t.collections}
            </button>
            <button
              onClick={() => handleScrollTo('catalog-section')}
              className={`transition-colors cursor-pointer py-1 border-b-2 border-transparent ${
                isDark
                  ? 'hover:text-brand-gold hover:border-brand-gold'
                  : 'hover:text-[#881337] hover:border-[#881337]'
              }`}
            >
              {t.shopSarees}
            </button>
            <button
              onClick={() => handleScrollTo('new-arrivals-section')}
              className={`transition-colors cursor-pointer py-1 border-b-2 border-transparent flex items-center gap-1 ${
                isDark
                  ? 'hover:text-brand-gold hover:border-brand-gold'
                  : 'hover:text-[#881337] hover:border-[#881337]'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>{t.newArrivals}</span>
            </button>
            <button
              onClick={() => handleScrollTo('heritage-section')}
              className={`transition-colors cursor-pointer py-1 border-b-2 border-transparent ${
                isDark
                  ? 'hover:text-brand-gold hover:border-brand-gold'
                  : 'hover:text-[#881337] hover:border-[#881337]'
              }`}
            >
              {t.ourHeritage}
            </button>
            <button
              onClick={() => handleScrollTo('why-us-section')}
              className={`transition-colors cursor-pointer py-1 border-b-2 border-transparent ${
                isDark
                  ? 'hover:text-brand-gold hover:border-brand-gold'
                  : 'hover:text-[#881337] hover:border-[#881337]'
              }`}
            >
              {t.whyKhandua}
            </button>
          </nav>

          {/* Search Bar & Suggestion Dialog - Desktop */}
          <div className="hidden lg:block relative flex-1 max-w-xs xl:max-w-sm">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                className={`w-full rounded-full py-2 pl-4 pr-10 text-xs transition-all ${
                  isDark
                    ? 'bg-[#1A072E] border border-brand-gold/30 text-brand-ivory placeholder-brand-ivory/50 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold'
                    : 'bg-slate-100 border border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-slate-400 focus:ring-1 focus:ring-slate-400'
                }`}
              />
              <button
                type="submit"
                className={`absolute right-3 top-2.5 transition-colors ${
                  isDark ? 'text-brand-gold hover:text-brand-gold-light' : 'text-slate-500 hover:text-slate-800'
                }`}
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Quick search suggestion tags popup */}
            {searchFocused && (
              <div
                className={`absolute left-0 right-0 mt-2 rounded-2xl p-4 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 border ${
                  isDark
                    ? 'bg-[#1A072E] border-brand-gold/40 text-brand-ivory'
                    : 'bg-white border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-border">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-text-muted">
                    Popular Searches
                  </span>
                  <button
                    onClick={() => setSearchFocused(false)}
                    className="text-xs text-text-muted hover:text-text-primary"
                  >
                    Close
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Khandua Silk', 'Nuapatna', 'Gitagovinda', 'Red & Yellow', 'Bridal Saree', 'Traditional Border'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleSelectQuickTag(tag)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                        isDark
                          ? 'bg-white/5 hover:bg-brand-gold/20 border-brand-gold/20 hover:border-brand-gold/60 text-brand-ivory/80 hover:text-brand-gold'
                          : 'bg-slate-100 hover:bg-amber-50 border-slate-200 hover:border-amber-300 text-slate-700 hover:text-amber-800'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Theme Switcher Toggle (Desktop & Tablet) */}
            <ThemeSwitcher />

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-full border text-xs font-mono transition-all cursor-pointer shadow-sm ${
                  isDark
                    ? 'border-brand-gold/30 hover:border-brand-gold bg-brand-purple/40 text-brand-gold hover:text-white'
                    : 'border-slate-200 hover:border-slate-400 bg-slate-50 text-slate-700 hover:text-slate-900'
                }`}
                title="Switch Language (English, Odia, Hindi)"
                aria-label="Switch Language"
              >
                <Globe className={`w-3.5 h-3.5 ${isDark ? 'text-brand-gold' : 'text-slate-600'}`} />
                <span className="font-bold text-[11px] sm:text-xs">
                  {LANGUAGE_OPTIONS.find((l) => l.code === currentLang)?.nativeName || 'EN'}
                </span>
              </button>

              {langDropdownOpen && (
                <div
                  className={`absolute right-0 mt-2 w-36 rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1 border ${
                    isDark
                      ? 'bg-[#180B28] border-brand-gold/40 text-brand-ivory'
                      : 'bg-white border-slate-200 text-slate-800 shadow-xl'
                  }`}
                >
                  <div className="px-3 py-1 text-[9px] font-mono uppercase tracking-wider text-text-muted border-b border-border mb-1">
                    Select Language
                  </div>
                  {LANGUAGE_OPTIONS.map((opt) => (
                    <button
                      key={opt.code}
                      onClick={() => {
                        dispatch(setLanguage(opt.code));
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        currentLang === opt.code
                          ? isDark
                            ? 'text-brand-gold font-bold bg-brand-gold/10'
                            : 'text-[#881337] font-bold bg-rose-50'
                          : isDark
                          ? 'text-brand-ivory/80 hover:bg-brand-gold/20'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>{opt.label}</span>
                      <span className="font-mono text-[10px] opacity-70">{opt.nativeName}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Wishlist Trigger */}
            <button
              onClick={() => dispatch(toggleWishlistOpen())}
              className={`relative p-2 transition-colors rounded-full cursor-pointer ${
                isDark
                  ? 'text-brand-ivory hover:text-brand-gold hover:bg-white/5'
                  : 'text-slate-700 hover:text-[#881337] hover:bg-slate-100'
              }`}
              aria-label="Open Wishlist"
              title="Saved Masterpieces"
            >
              <Heart
                className={`w-5 h-5 sm:w-6 sm:h-6 ${
                  wishlistCount > 0
                    ? isDark
                      ? 'text-brand-gold fill-brand-gold/30'
                      : 'text-[#881337] fill-[#881337]/20'
                    : isDark
                    ? 'text-brand-gold'
                    : 'text-slate-700'
                }`}
              />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-crimson text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-surface shadow">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => dispatch(toggleCart())}
              className={`relative p-2 transition-colors rounded-full cursor-pointer ${
                isDark
                  ? 'text-brand-ivory hover:text-brand-gold hover:bg-white/5'
                  : 'text-slate-700 hover:text-[#881337] hover:bg-slate-100'
              }`}
              aria-label="Open cart"
              title="Shopping Bag"
            >
              <ShoppingBag
                className={`w-5 h-5 sm:w-6 sm:h-6 ${isDark ? 'text-brand-gold' : 'text-slate-700'}`}
              />
              {cartItemCount > 0 && (
                <span
                  className={`absolute -top-1 -right-1 text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-surface shadow ${
                    isDark
                      ? 'bg-brand-gold text-brand-purple-dark'
                      : 'bg-[#881337] text-white'
                  }`}
                >
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* User Account / Auth Dropdown */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className={`flex items-center gap-2 p-1.5 rounded-full border text-sm cursor-pointer ${
                    isDark
                      ? 'border-brand-gold/30 hover:border-brand-gold bg-brand-purple/50'
                      : 'border-slate-200 hover:border-slate-400 bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold ${
                      isDark ? 'bg-brand-gold/20 text-brand-gold' : 'bg-[#881337]/10 text-[#881337]'
                    }`}
                  >
                    {user?.firstName ? user.firstName[0].toUpperCase() : 'U'}
                  </div>
                  <span
                    className={`hidden sm:inline text-xs font-medium pr-1 ${
                      isDark ? 'text-brand-gold-light' : 'text-slate-700'
                    }`}
                  >
                    {user?.firstName || t.account}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div
                    className={`absolute right-0 mt-2 w-52 rounded-lg shadow-2xl py-2 z-50 text-sm border ${
                      isDark
                        ? 'bg-brand-purple-dark border-brand-gold/30 text-brand-ivory'
                        : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="px-4 py-2 border-b border-border">
                      <p className={`font-semibold ${isDark ? 'text-brand-gold' : 'text-[#881337]'}`}>
                        {user?.firstName}
                      </p>
                      <p className="text-xs text-text-muted truncate">{user?.email}</p>
                    </div>

                    {isAdmin && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onNavigateAdmin?.();
                        }}
                        className={`w-full text-left px-4 py-2 flex items-center gap-2 cursor-pointer ${
                          isDark
                            ? 'hover:bg-brand-purple text-brand-gold'
                            : 'hover:bg-slate-100 text-[#881337]'
                        }`}
                      >
                        <Shield className="w-4 h-4" />
                        {t.adminDashboard}
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenProfile?.();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-brand-purple text-text-primary flex items-center gap-2 cursor-pointer"
                    >
                      <UserIcon className="w-4 h-4" />
                      {t.myProfile}
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        dispatch(logout());
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-rose-50 dark:hover:bg-brand-crimson/20 text-rose-600 dark:text-brand-crimson flex items-center gap-2 border-t border-border cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      {t.signOut}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className={`hidden sm:flex items-center gap-2 font-medium px-4 py-2 rounded-full text-xs uppercase tracking-wider font-sans transition-all shadow-md cursor-pointer ${
                  isDark
                    ? 'bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-purple-dark hover:brightness-110'
                    : 'bg-[#881337] hover:bg-[#9f1239] text-white'
                }`}
              >
                <UserIcon className="w-3.5 h-3.5" />
                {t.signIn}
              </button>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`xl:hidden p-2 cursor-pointer ${
                isDark ? 'text-brand-gold hover:text-brand-gold-light' : 'text-slate-700 hover:text-slate-900'
              }`}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Slide-down */}
      {mobileMenuOpen && (
        <div
          className={`xl:hidden px-4 pt-3 pb-6 space-y-4 shadow-2xl border-b ${
            isDark
              ? 'bg-[#12051E] border-brand-gold/25 text-brand-ivory'
              : 'bg-white border-slate-200 text-slate-800'
          }`}
        >
          <form onSubmit={handleSearchSubmit} className="relative mt-1">
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className={`w-full rounded-full py-2.5 pl-4 pr-10 text-xs border ${
                isDark
                  ? 'bg-[#1A072E] border-brand-gold/30 text-brand-ivory placeholder-brand-ivory/50'
                  : 'bg-slate-100 border-slate-200 text-slate-800 placeholder-slate-400'
              }`}
            />
            <button
              type="submit"
              className={`absolute right-3.5 top-3 ${isDark ? 'text-brand-gold' : 'text-slate-500'}`}
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Mobile Controls: Language & Theme */}
          <div className="flex items-center justify-between py-1 px-1 border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-text-muted uppercase">Lang:</span>
              <div className="flex gap-1.5">
                {LANGUAGE_OPTIONS.map((opt) => (
                  <button
                    key={opt.code}
                    onClick={() => dispatch(setLanguage(opt.code))}
                    className={`text-xs px-2.5 py-1 rounded-md border font-mono transition-colors ${
                      currentLang === opt.code
                        ? isDark
                          ? 'bg-brand-gold text-brand-purple-dark border-brand-gold font-bold'
                          : 'bg-[#881337] text-white border-[#881337] font-bold'
                        : isDark
                        ? 'bg-white/5 text-brand-ivory/80 border-brand-gold/25'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {opt.nativeName}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Theme Switcher */}
            <ThemeSwitcher variant="detailed" />
          </div>

          <div className="flex flex-col gap-2 pt-2 text-sm font-serif">
            <button
              onClick={() => handleScrollTo('collections-section')}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-brand-gold/10 text-text-primary flex items-center justify-between"
            >
              <span>{t.collections}</span>
              <span className="text-xs font-mono text-text-muted">6 Collections</span>
            </button>
            <button
              onClick={() => handleScrollTo('catalog-section')}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-brand-gold/10 text-text-primary flex items-center justify-between"
            >
              <span>{t.shopSarees}</span>
              <span className="text-xs font-mono text-text-muted">18 Sarees</span>
            </button>
            <button
              onClick={() => handleScrollTo('new-arrivals-section')}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-brand-gold/10 text-text-primary flex items-center justify-between"
            >
              <span>{t.newArrivals}</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </button>
            <button
              onClick={() => handleScrollTo('heritage-section')}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-brand-gold/10 text-text-primary"
            >
              {t.ourHeritage}
            </button>
            <button
              onClick={() => handleScrollTo('why-us-section')}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-brand-gold/10 text-text-primary"
            >
              {t.whyKhandua}
            </button>

            {/* Mobile Wishlist Shortcut */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                dispatch(toggleWishlistOpen());
              }}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-brand-gold/10 text-text-primary flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-600 fill-rose-600" />
                <span>{t.wishlist}</span>
              </div>
              <span className="text-xs font-mono font-bold bg-rose-100 dark:bg-brand-crimson/30 px-2 py-0.5 rounded-full text-rose-700 dark:text-brand-crimson">
                {wishlistCount}
              </span>
            </button>
          </div>

          <div className="flex flex-col gap-2 pt-2 border-t border-border">
            {!isAuthenticated && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className={`w-full mt-2 font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider ${
                  isDark
                    ? 'bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-purple-dark'
                    : 'bg-[#881337] text-white hover:bg-[#9f1239]'
                }`}
              >
                {t.signIn}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
