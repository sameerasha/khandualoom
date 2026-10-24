import React, { useState, useEffect, useLayoutEffect, useMemo } from 'react';
import {
  Star,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  ArrowLeft,
  ZoomIn,
  Sparkles,
  Award,
  ChevronRight,
  Heart,
  Share2,
  CheckCircle2,
  Feather,
  Clock,
  Shield,
  Home,
} from 'lucide-react';
import { Product } from '@/types';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { addToCart, setCartOpen } from '@/features/cart/cartSlice';
import { useGetProductsQuery } from '@/features/products/productsApi';
import { fallbackProducts } from '@/data/fallbackProducts';

interface ProductDetailsProps {
  product: Product;
  onClose: () => void;
  onProceedToCheckout?: () => void;
  onSelectProduct?: (product: Product) => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  onClose,
  onProceedToCheckout,
  onSelectProduct,
}) => {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.cart);
  const cartItem = items.find((item) => item.product.id === product.id);
  const isInCart = Boolean(cartItem);

  const [selectedQty, setSelectedQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(product.image || '/images/saree_crimson_red.png');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Zoom state for inspecting silk weave (desktop only)
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({
    transformOrigin: 'center center',
    transform: 'scale(1)',
  });
  const [isZooming, setIsZooming] = useState(false);

  // Fetch all products for Related Masterpieces
  const { data: allProducts } = useGetProductsQuery({});
  const catalogPool = allProducts && allProducts.length > 0 ? allProducts : fallbackProducts;

  // Curate Related Masterpieces: 4 items
  const relatedProducts = useMemo(() => {
    const isSameCategory = (p: Product) =>
      String(p.id) !== String(product.id) &&
      p.category?.toLowerCase() === product.category?.toLowerCase();

    const isSimilarFabric = (p: Product) =>
      String(p.id) !== String(product.id) &&
      p.fabric?.toLowerCase() === product.fabric?.toLowerCase();

    const matchesCategory = catalogPool.filter(isSameCategory);
    const matchesFabric = catalogPool.filter(
      (p) => isSimilarFabric(p) && !matchesCategory.some((m) => String(m.id) === String(p.id))
    );
    const remaining = catalogPool.filter(
      (p) =>
        String(p.id) !== String(product.id) &&
        !matchesCategory.some((m) => String(m.id) === String(p.id)) &&
        !matchesFabric.some((m) => String(m.id) === String(p.id))
    );

    return [...matchesCategory, ...matchesFabric, ...remaining].slice(0, 10);
  }, [catalogPool, product]);

  // Guarantee viewport always starts from the absolute top before paint
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [product.id]);

  // Auto-record in recent views & reset active image on product change
  useEffect(() => {
    try {
      const stored = localStorage.getItem('vastraloom_recent_products');
      let list: Product[] = stored ? JSON.parse(stored) : [];
      list = [product, ...list.filter((p) => p.id !== product.id)].slice(0, 8);
      localStorage.setItem('vastraloom_recent_products', JSON.stringify(list));
    } catch {
      // Ignore storage errors
    }
    setActiveImage(product.image || '/images/saree_crimson_red.png');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [product]);

  // Curated gallery angles
  const galleryImages = [
    product.image || '/images/saree_crimson_red.png',
    '/images/saree_master_pallu.png',
    '/images/saree_master_border.png',
    '/images/saree_master_back.png',
  ];

  // Mouse move zoom handler (Desktop fine pointer only)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Disable hover-zoom calculations on mobile touch devices to ensure 100% fluid touch scrolling
    if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) {
      return;
    }
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${Math.max(0, Math.min(100, x))}% ${Math.max(0, Math.min(100, y))}%`,
      transform: 'scale(2.2)',
    });
    setIsZooming(true);
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transformOrigin: 'center center',
      transform: 'scale(1)',
    });
    setIsZooming(false);
  };

  const handleAdd = () => {
    dispatch(addToCart({ product, quantity: selectedQty }));
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  const handleBuyNow = () => {
    dispatch(addToCart({ product, quantity: selectedQty }));
    onProceedToCheckout?.();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Behold this masterwork from Vastraloom: ${product.name}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  return (
    <div className="w-full min-h-screen bg-[#0A0311] text-brand-ivory selection:bg-brand-gold selection:text-brand-purple-dark pb-20 overflow-x-hidden touch-pan-y">
      {/* Enriched Luxury Sticky Breadcrumb Bar */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-[#140624]/95 via-[#0D0216]/95 to-[#140624]/95 backdrop-blur-xl border-b border-brand-gold/30 shadow-[0_10px_30px_rgba(0,0,0,0.85)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3">
          
          {/* Left: Enhanced Royal Return Action */}
          <button
            onClick={onClose}
            className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-brand-gold/15 border border-brand-gold/30 hover:border-brand-gold text-brand-gold hover:text-white transition-all shadow-sm shrink-0 cursor-pointer"
            title="Return to Collections"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span className="font-serif text-xs font-semibold tracking-wide hidden sm:inline">Gallery</span>
          </button>

          {/* Center: Enriched Editorial Breadcrumb Trail (Desktop) */}
          <nav aria-label="Breadcrumb" className="hidden md:flex items-center gap-2 text-xs font-mono min-w-0">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 text-brand-ivory/60 hover:text-brand-gold transition-colors cursor-pointer shrink-0"
              title="Atelier Home"
            >
              <Home className="w-3.5 h-3.5 text-brand-gold/70" />
              <span>Atelier</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-brand-gold/40 shrink-0" />
            <span className="px-2.5 py-0.5 rounded-full bg-brand-gold/15 border border-brand-gold/30 text-brand-gold text-[11px] font-semibold uppercase tracking-wider shrink-0">
              {product.category} Silk
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-brand-gold/40 shrink-0" />
            <span className="font-serif font-bold text-xs text-white truncate max-w-[200px] lg:max-w-xs">
              {product.name}
            </span>
            {product.badge && (
              <span className="hidden lg:inline-flex items-center gap-1 text-[10px] font-mono text-brand-crimson bg-brand-crimson/15 border border-brand-crimson/30 px-2 py-0.5 rounded-full shrink-0">
                <Sparkles className="w-2.5 h-2.5" />
                {product.badge}
              </span>
            )}
          </nav>

          {/* Center: Mobile Compact Breadcrumb */}
          <div className="flex md:hidden items-center gap-1.5 text-[11px] font-mono min-w-0 truncate">
            <span className="text-brand-gold font-bold uppercase tracking-wider shrink-0 text-[10px] bg-brand-gold/10 px-1.5 py-0.5 rounded border border-brand-gold/20">
              {product.category}
            </span>
            <ChevronRight className="w-3 h-3 text-brand-gold/40 shrink-0" />
            <span className="font-serif text-xs text-white truncate font-medium">
              {product.name}
            </span>
          </div>

          {/* Right: Enriched Royal Tools */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Bag Counter Pill */}
            <button
              onClick={() => dispatch(setCartOpen(true))}
              className="relative p-2 rounded-xl bg-white/[0.04] hover:bg-brand-gold/15 border border-brand-gold/30 hover:border-brand-gold text-brand-gold hover:text-white transition-all shadow-sm flex items-center justify-center cursor-pointer"
              title="Open Shopping Bag"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-crimson text-white text-[9px] font-mono font-bold rounded-full w-4 h-4 flex items-center justify-center border border-[#0D0316] shadow-sm">
                  {items.reduce((acc, i) => acc + i.quantity, 0)}
                </span>
              )}
            </button>

            {/* Share Tool */}
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-brand-gold/15 border border-brand-gold/30 hover:border-brand-gold text-brand-gold hover:text-white transition-all shadow-sm cursor-pointer"
              title="Share Masterpiece"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>

            {/* Wishlist Tool */}
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={`p-2 rounded-xl border transition-all shadow-sm cursor-pointer ${
                isWishlisted
                  ? 'border-brand-crimson bg-brand-crimson/25 text-brand-crimson shadow-brand-crimson/20'
                  : 'border-brand-gold/30 bg-white/[0.04] hover:bg-brand-gold/15 text-brand-gold hover:text-white'
              }`}
              title="Add to Wishlist"
            >
              <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {copiedLink && (
        <div className="fixed bottom-6 right-6 z-50 bg-brand-gold text-brand-purple-dark px-4 py-2 rounded-full text-xs font-bold shadow-2xl animate-fade-in flex items-center gap-1.5">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>Product link copied to clipboard</span>
        </div>
      )}

      {/* Main Layout Container - Compact & Vibrant */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-5 sm:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* ==================== LEFT COLUMN: GALLERY & ZOOM (5 COLS) ==================== */}
          {/* lg:sticky lg:top-20 ensures on mobile it flows normally so touch scrolling is 100% smooth */}
          <div className="lg:col-span-5 flex flex-col items-center lg:sticky lg:top-20 touch-pan-y">
            {/* Master Zoomable Viewport */}
            <div
              className="relative aspect-[3/3.7] w-full max-w-md rounded-2xl overflow-hidden border border-brand-gold/30 shadow-2xl bg-[#08020D] lg:cursor-crosshair group touch-pan-y"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src={activeImage}
                alt={product.name}
                style={zoomStyle}
                className="w-full h-full object-cover object-top transition-transform duration-150 will-change-transform touch-pan-y pointer-events-auto"
              />

              {/* Interactive Zoom Pill Notice (Desktop Only) */}
              <div
                className={`hidden md:flex absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-brand-gold/40 text-[10px] text-brand-gold-light items-center gap-1.5 transition-opacity duration-300 pointer-events-none shadow-lg ${
                  isZooming ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <ZoomIn className="w-3 h-3 text-brand-gold" />
                <span className="font-mono">Hover to inspect silk weave (2.2×)</span>
              </div>

              {/* Top Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
                {product.badge && (
                  <span className="bg-brand-crimson/95 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow">
                    {product.badge}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="bg-brand-gold text-brand-purple-dark text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow w-fit">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Gallery Angle Thumbnails */}
            <div className="mt-3.5 flex items-center gap-2.5 overflow-x-auto pb-1 w-full max-w-md justify-start sm:justify-center">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-16 h-20 sm:w-18 sm:h-22 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                    activeImage === img
                      ? 'border-brand-gold scale-105 shadow-md shadow-brand-gold/30'
                      : 'border-brand-gold/20 opacity-60 hover:opacity-100 hover:border-brand-gold/50'
                  }`}
                >
                  <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Authenticity Certificate Badges */}
            <div className="mt-4 w-full max-w-md grid grid-cols-2 gap-2.5">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-brand-purple-dark/50 border border-brand-gold/20 shadow-sm">
                <Award className="w-4 h-4 text-brand-gold shrink-0" />
                <div>
                  <p className="text-[11px] font-bold text-white leading-tight">Silk Mark India</p>
                  <p className="text-[9px] text-brand-ivory/60">100% Pure Silk Certified</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-brand-purple-dark/50 border border-brand-gold/20 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-[11px] font-bold text-white leading-tight">GI Tag Certified</p>
                  <p className="text-[9px] text-brand-ivory/60">Authentic Geographical Origin</p>
                </div>
              </div>
            </div>
          </div>

          {/* ==================== RIGHT COLUMN: COMPACT & VIBRANT DOSSIER (7 COLS) ==================== */}
          <div className="lg:col-span-7 flex flex-col space-y-4 bg-gradient-to-br from-[#190A2A]/90 via-[#11031D]/85 to-[#0A0112]/95 border border-brand-gold/30 rounded-3xl p-5 sm:p-7 shadow-[0_15px_45px_rgba(0,0,0,0.6)] backdrop-blur-md">
            
            {/* Header: Category & Saree Title */}
            <div>
              <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                <span className="text-[11px] uppercase tracking-wider text-brand-gold font-mono font-bold bg-brand-gold/10 px-2.5 py-0.5 rounded-full border border-brand-gold/25">
                  {product.category} Royal Atelier
                </span>
                <span className="text-[10px] text-brand-gold-light/70 font-mono">
                  Lot #{String(product.id).slice(0, 8).toUpperCase()}
                </span>
                <span className="text-[10px] text-emerald-400 font-mono font-medium ml-auto flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  In Stock & Ready to Dispatch
                </span>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                {product.name}
              </h1>

              {/* Star Ratings & Appraisals */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(product.rating || 5) ? 'fill-current' : 'opacity-30'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-white">
                  {product.rating ? product.rating.toFixed(1) : '4.9'}
                </span>
                <span className="text-brand-ivory/30">|</span>
                <span className="text-[11px] text-brand-gold-light/80">
                  {product.reviews || 88} Verified Patron Appraisals
                </span>
              </div>
            </div>

            {/* Price & Savings Block - Vibrant */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-gold/15 via-white/[0.03] to-transparent border border-brand-gold/30 flex flex-col gap-1.5">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-brand-gold">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-base text-brand-ivory/40 line-through font-mono">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] font-bold text-brand-crimson bg-brand-crimson/15 border border-brand-crimson/30 px-2.5 py-0.5 rounded-full">
                      Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')} ({discountPercent}% OFF)
                    </span>
                  </>
                )}
              </div>
              <div className="flex items-center justify-between text-[11px] text-brand-ivory/60 pt-1 border-t border-brand-gold/10">
                <span>Inclusive of all GST taxes & royal velvet chest</span>
                <span className="text-emerald-400 font-semibold">Free Pan-India Insured Dispatch</span>
              </div>
            </div>

            {/* The Loom Narrative */}
            <div className="space-y-1.5">
              <h3 className="font-serif text-sm font-bold text-brand-gold flex items-center gap-1.5">
                <Feather className="w-3.5 h-3.5 text-brand-gold" />
                <span>The Loom Narrative</span>
              </h3>
              <p className="text-xs text-brand-ivory/80 leading-relaxed font-sans font-light">
                {product.description}
              </p>
            </div>

            {/* Compact Specifications Dossier */}
            <div className="rounded-2xl border border-brand-gold/25 bg-black/30 p-4 shadow-inner">
              <h4 className="font-serif text-xs font-bold text-brand-gold uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                <span>Handloom Specification Dossier</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-[11px] font-sans">
                <div className="flex justify-between py-1 border-b border-brand-gold/10">
                  <span className="text-brand-ivory/60">Fabric:</span>
                  <span className="font-semibold text-white">{product.fabric || 'Pure Mulberry Silk'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-brand-gold/10">
                  <span className="text-brand-ivory/60">Weaving:</span>
                  <span className="font-semibold text-white">{product.weave || 'Interlocking Kadwa'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-brand-gold/10">
                  <span className="text-brand-ivory/60">Zari:</span>
                  <span className="font-semibold text-brand-gold-light">24K Electroplated Silver Thread</span>
                </div>
                <div className="flex justify-between py-1 border-b border-brand-gold/10">
                  <span className="text-brand-ivory/60">Color:</span>
                  <span className="font-semibold text-white">{product.color || 'Imperial Heritage Tone'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-brand-gold/10">
                  <span className="text-brand-ivory/60">Saree Length:</span>
                  <span className="font-semibold text-white">5.5 Metres Standard</span>
                </div>
                <div className="flex justify-between py-1 border-b border-brand-gold/10">
                  <span className="text-brand-ivory/60">Blouse Piece:</span>
                  <span className="font-semibold text-emerald-400">Included (0.8m Silk)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-brand-gold/10">
                  <span className="text-brand-ivory/60">Weaving Time:</span>
                  <span className="font-semibold text-white">18 - 24 Days Pitloom</span>
                </div>
                <div className="flex justify-between py-1 border-b border-brand-gold/10">
                  <span className="text-brand-ivory/60">Care:</span>
                  <span className="font-semibold text-amber-300">Dry Clean Only</span>
                </div>
              </div>
            </div>

            {/* Interactive Actions: Quantity + Add to Bag + Buy Now */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                {/* Quantity Counter */}
                <div className="flex items-center border border-brand-gold/40 rounded-xl px-2.5 py-2 bg-black/40 shrink-0">
                  <button
                    onClick={() => setSelectedQty(Math.max(1, selectedQty - 1))}
                    className="text-brand-gold px-2 text-sm font-bold hover:text-white transition-colors cursor-pointer"
                  >
                    −
                  </button>
                  <span className="text-xs font-bold px-2.5 font-mono text-white">{selectedQty}</span>
                  <button
                    onClick={() => setSelectedQty(selectedQty + 1)}
                    className="text-brand-gold px-2 text-sm font-bold hover:text-white transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Add to Bag / Go to Cart Button */}
                {added || isInCart ? (
                  <button
                    onClick={() => dispatch(setCartOpen(true))}
                    className="flex-1 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border bg-emerald-600 hover:bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-600/30 active:scale-95 transition-all cursor-pointer"
                    title="Item in Cart • Click to View Bag"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Go to Cart</span>
                  </button>
                ) : (
                  <button
                    onClick={handleAdd}
                    className="flex-1 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border bg-gradient-to-r from-brand-gold/20 via-brand-gold/10 to-transparent border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-purple-dark active:scale-95 transition-all shadow-md cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag</span>
                  </button>
                )}
              </div>

              {/* Instant Checkout Button */}
              <button
                onClick={handleBuyNow}
                className="w-full py-3.5 px-5 rounded-xl font-serif font-bold text-sm bg-gradient-to-r from-brand-gold via-amber-400 to-brand-gold text-brand-purple-dark hover:brightness-110 shadow-xl shadow-brand-gold/20 transition-all duration-300 transform active:scale-[0.99] cursor-pointer"
              >
                Proceed to Secure Checkout
              </button>

              {/* Trust Row */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-[10px] text-center">
                <div className="flex flex-col items-center p-2 rounded-xl bg-white/[0.03] border border-brand-gold/15">
                  <ShieldCheck className="w-4 h-4 text-brand-gold mb-1" />
                  <span className="font-bold text-white">Silk Mark Verified</span>
                </div>
                <div className="flex flex-col items-center p-2 rounded-xl bg-white/[0.03] border border-brand-gold/15">
                  <Truck className="w-4 h-4 text-brand-gold mb-1" />
                  <span className="font-bold text-white">Insured Courier</span>
                </div>
                <div className="flex flex-col items-center p-2 rounded-xl bg-white/[0.03] border border-brand-gold/15">
                  <RotateCcw className="w-4 h-4 text-brand-gold mb-1" />
                  <span className="font-bold text-white">7-Day Guarantee</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ==================== CRAFT & ARTISAN HERITAGE STORY ==================== */}
        <div className="mt-14 sm:mt-16 pt-8 border-t border-brand-gold/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-brand-purple-dark/50 border border-brand-gold/20 flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-xl bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center text-brand-gold mb-3">
                  <Feather className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-base font-bold text-white">Kadwa Weaving Tradition</h3>
                <p className="mt-1.5 text-xs text-brand-ivory/70 leading-relaxed font-light">
                  Every booti is separately hand-woven with pure zari shuttles, leaving zero raw floating threads on the backside.
                </p>
              </div>
              <span className="text-[10px] font-mono text-brand-gold mt-3 block">Varanasi Chowk Guild</span>
            </div>

            <div className="p-5 rounded-2xl bg-brand-purple-dark/50 border border-brand-gold/20 flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-xl bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center text-brand-gold mb-3">
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-base font-bold text-white">200+ Man Hours on Pitloom</h3>
                <p className="mt-1.5 text-xs text-brand-ivory/70 leading-relaxed font-light">
                  Two master craftsmen collaborate synchronously across the warp frame, guiding flying shuttles with millimeter accuracy.
                </p>
              </div>
              <span className="text-[10px] font-mono text-brand-gold mt-3 block">Zero Powerloom Shortcuts</span>
            </div>

            <div className="p-5 rounded-2xl bg-brand-purple-dark/50 border border-brand-gold/20 flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-xl bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center text-brand-gold mb-3">
                  <Shield className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-base font-bold text-white">Heirloom Preservation</h3>
                <p className="mt-1.5 text-xs text-brand-ivory/70 leading-relaxed font-light">
                  Delivered in our bespoke royal velvet chest lined with pure muslin to protect the zari sheen across generations.
                </p>
              </div>
              <span className="text-[10px] font-mono text-brand-gold mt-3 block">Imperial Atelier Standard</span>
            </div>
          </div>
        </div>

        {/* ==================== PATRON REVIEWS & APPRAISALS ==================== */}
        <div className="mt-12 pt-8 border-t border-brand-gold/20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
            <div>
              <span className="text-xs uppercase tracking-widest text-brand-gold font-mono font-semibold">
                Patron Appraisals
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-white mt-0.5">
                Connoisseur Testimonials
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-brand-gold-light">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-bold text-white text-base">{product.rating ? product.rating.toFixed(1) : '4.9'}</span>
              <span>out of 5.0 (98% Recommendation Rate)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-brand-purple-dark/40 border border-brand-gold/15 space-y-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-current" />
                ))}
              </div>
              <p className="text-xs text-brand-ivory/80 italic leading-relaxed">
                "The zari shine is regal without being loud. The silk falls like liquid gold. Wore this to my brother’s wedding and received non-stop compliments."
              </p>
              <div className="pt-2 border-t border-brand-gold/10 flex items-center justify-between text-[10px]">
                <span className="font-bold text-white">Radhika M.</span>
                <span className="text-emerald-400">Verified Buyer • Mumbai</span>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-brand-purple-dark/40 border border-brand-gold/15 space-y-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-current" />
                ))}
              </div>
              <p className="text-xs text-brand-ivory/80 italic leading-relaxed">
                "The velvet chest packaging itself is a work of art. You can immediately feel the density of pure silk. The Silk Mark tag gave complete confidence."
              </p>
              <div className="pt-2 border-t border-brand-gold/10 flex items-center justify-between text-[10px]">
                <span className="font-bold text-white">Ananya S.</span>
                <span className="text-emerald-400">Verified Buyer • Bangalore</span>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-brand-purple-dark/40 border border-brand-gold/15 space-y-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-current" />
                ))}
              </div>
              <p className="text-xs text-brand-ivory/80 italic leading-relaxed">
                "True Kadwa weaving. No floating threads on the reverse side whatsoever. It is a genuine heirloom piece that will stay in the family for decades."
              </p>
              <div className="pt-2 border-t border-brand-gold/10 flex items-center justify-between text-[10px]">
                <span className="font-bold text-white">Meenakshi I.</span>
                <span className="text-emerald-400">Verified Buyer • Chennai</span>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== RELATED MASTERPIECES GRID ==================== */}
        {relatedProducts.length > 0 && (
          <div className="mt-14 pt-8 border-t border-brand-gold/20">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
              <div>
                <span className="text-xs uppercase tracking-widest text-brand-gold font-mono font-semibold">
                  From The Imperial Handlooms
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mt-0.5">
                  More Masterpieces You May Adore
                </h3>
              </div>
              <button
                onClick={onClose}
                className="self-start sm:self-auto px-4 py-1.5 rounded-full border border-brand-gold/40 text-brand-gold hover:bg-brand-gold/10 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer"
              >
                Explore Full Catalog →
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
              {relatedProducts.map((rel: Product) => {
                const relInCart = items.some((item) => item.product.id === rel.id);
                return (
                  <div
                    key={rel.id}
                    onClick={() => onSelectProduct?.(rel)}
                    className="group rounded-2xl border border-brand-gold/20 overflow-hidden bg-brand-purple-dark/60 hover:border-brand-gold/60 cursor-pointer transition-all hover:shadow-xl hover:shadow-brand-gold/15 flex flex-col"
                  >
                    <div className="aspect-[3/3.8] w-full overflow-hidden bg-black relative">
                      <img
                        src={rel.image || '/images/saree_crimson_red.png'}
                        alt={rel.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      {rel.badge && (
                        <span className="absolute top-2.5 left-2.5 bg-brand-crimson text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase shadow">
                          {rel.badge}
                        </span>
                      )}
                      {relInCart && (
                        <div className="absolute top-2.5 right-2.5 bg-emerald-600 text-white rounded-full p-1 shadow-md border border-emerald-400/40 flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  <div className="p-2.5 sm:p-3.5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-brand-gold uppercase tracking-wider block font-mono">
                        {rel.category}
                      </span>
                      <h4 className="font-serif text-xs sm:text-sm font-bold text-white truncate mt-0.5 group-hover:text-brand-gold transition-colors">
                        {rel.name}
                      </h4>
                    </div>
                    <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-brand-gold/10">
                      <span className="font-serif text-sm sm:text-base font-bold text-brand-gold">
                        ₹{rel.price.toLocaleString('en-IN')}
                      </span>
                      <ChevronRight className="w-4 h-4 text-brand-gold opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              );
            })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
