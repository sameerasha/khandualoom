import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { Product } from '@/types';
import { useAppDispatch } from '@/app/hooks';
import { addToCart } from '@/features/cart/cartSlice';
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
  const [selectedQty, setSelectedQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(product.image || '/images/saree_crimson_red.png');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Zoom state for inspecting silk weave
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({
    transformOrigin: 'center center',
    transform: 'scale(1)',
  });
  const [isZooming, setIsZooming] = useState(false);

  // Fetch all products for Related Masterpieces
  const { data: allProducts } = useGetProductsQuery({});
  const catalogPool = allProducts && allProducts.length > 0 ? allProducts : fallbackProducts;

  const relatedProducts = catalogPool
    .filter((p) => p.id !== product.id && (p.category === product.category || p.fabric === product.fabric))
    .slice(0, 4);

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product]);

  // Curated gallery angles
  const galleryImages = [
    product.image || '/images/saree_crimson_red.png',
    '/images/saree_master_pallu.png',
    '/images/saree_master_border.png',
    '/images/saree_master_back.png',
  ];

  // Mouse move zoom handler (2.2x magnification)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
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
    <div className="min-h-screen bg-[#0D0515] text-brand-ivory selection:bg-brand-gold selection:text-brand-purple-dark pb-24">
      {/* Top Sticky Breadcrumb Bar */}
      <div className="sticky top-0 z-40 bg-[#13091B]/95 backdrop-blur-md border-b border-brand-gold/20 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          {/* Back Action */}
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-brand-gold hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="font-serif">Back to Atelier Collections</span>
          </button>

          {/* Breadcrumb Path */}
          <div className="hidden md:flex items-center gap-2 text-xs text-brand-ivory/60 font-mono">
            <span>Vastraloom</span>
            <span>/</span>
            <span className="text-brand-gold">{product.category}</span>
            <span>/</span>
            <span className="text-brand-ivory truncate max-w-xs">{product.name}</span>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-full border border-brand-gold/25 hover:border-brand-gold hover:bg-brand-gold/10 text-brand-gold transition-all"
              title="Share Masterpiece"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={`p-2 rounded-full border transition-all ${
                isWishlisted
                  ? 'border-brand-crimson bg-brand-crimson/20 text-brand-crimson'
                  : 'border-brand-gold/25 hover:border-brand-gold hover:bg-brand-gold/10 text-brand-gold'
              }`}
              title="Add to Wishlist"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {copiedLink && (
        <div className="fixed bottom-6 right-6 z-50 bg-brand-gold text-brand-purple-dark px-4 py-2 rounded-full text-xs font-bold shadow-2xl animate-fade-in flex items-center gap-1.5">
          <Check className="w-4 h-4" />
          <span>Product link copied to clipboard</span>
        </div>
      )}

      {/* Main Full-Screen Layout Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* ==================== LEFT COLUMN: MULTI-ANGLE GALLERY & ZOOM (6 COLS) ==================== */}
          <div className="lg:col-span-6 flex flex-col items-center sticky top-20">
            {/* Master Zoomable Viewport */}
            <div
              className="relative aspect-[3/4] w-full max-w-lg rounded-3xl overflow-hidden border border-brand-gold/30 shadow-2xl bg-[#08020D] cursor-crosshair group"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src={activeImage}
                alt={product.name}
                style={zoomStyle}
                className="w-full h-full object-cover object-top transition-transform duration-150 will-change-transform"
              />

              {/* Interactive Zoom Pill Notice */}
              <div
                className={`absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-brand-gold/40 text-[11px] text-brand-gold-light flex items-center gap-2 transition-opacity duration-300 pointer-events-none shadow-lg ${
                  isZooming ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <ZoomIn className="w-3.5 h-3.5 text-brand-gold animate-pulse" />
                <span className="font-sans font-medium">Hover cursor to inspect pure silk weave (2.2×)</span>
              </div>

              {/* Top Luxury Ribbon Badge */}
              {product.badge && (
                <span className="absolute top-4 left-4 bg-brand-crimson/95 backdrop-blur-md text-white text-[11px] font-bold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-lg">
                  {product.badge}
                </span>
              )}

              {/* Discount Ribbon */}
              {discountPercent > 0 && (
                <span className="absolute top-4 right-4 bg-brand-gold text-brand-purple-dark text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Gallery Angle Selector Thumbnails */}
            <div className="mt-5 flex items-center gap-3 overflow-x-auto pb-2 w-full max-w-lg justify-start sm:justify-center">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-24 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${
                    activeImage === img
                      ? 'border-brand-gold scale-105 shadow-xl shadow-brand-gold/25'
                      : 'border-brand-gold/25 opacity-60 hover:opacity-100 hover:border-brand-gold/50'
                  }`}
                >
                  <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Authenticity Certificate Badges */}
            <div className="mt-6 w-full max-w-lg grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-brand-purple-dark/60 border border-brand-gold/20">
                <Award className="w-5 h-5 text-brand-gold shrink-0" />
                <div>
                  <p className="text-xs font-bold text-white">Silk Mark India</p>
                  <p className="text-[10px] text-brand-ivory/60">100% Guaranteed Pure Silk</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-brand-purple-dark/60 border border-brand-gold/20">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-white">GI Tag Certified</p>
                  <p className="text-[10px] text-brand-ivory/60">Authentic Heritage Origin</p>
                </div>
              </div>
            </div>
          </div>

          {/* ==================== RIGHT COLUMN: DOSSIER, SPECS & ACTIONS (6 COLS) ==================== */}
          <div className="lg:col-span-6 flex flex-col space-y-6">
            
            {/* Category Heritage Header */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs uppercase tracking-widest text-brand-gold font-mono font-semibold">
                  {product.category} Royal Atelier
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-gold/40" />
                <span className="text-xs text-brand-gold-light font-mono">
                  Loom Lot #{String(product.id).slice(0, 8).toUpperCase()}
                </span>
              </div>

              {/* Saree Master Title */}
              <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white leading-tight">
                {product.name}
              </h1>

              {/* Star Ratings & Patron Feedback */}
              <div className="flex items-center gap-3 mt-3.5">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating || 5) ? 'fill-current' : 'opacity-30'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-white">
                  {product.rating ? product.rating.toFixed(1) : '4.9'}
                </span>
                <span className="text-brand-ivory/40">|</span>
                <span className="text-xs text-brand-gold-light font-medium">
                  {product.reviews || 88} Verified Patron Appraisals
                </span>
                <span className="text-brand-ivory/40">|</span>
                <span className="text-xs text-emerald-400 font-medium">In Stock & Ready to Dispatch</span>
              </div>
            </div>

            {/* Price Row */}
            <div className="p-5 rounded-2xl bg-brand-purple-dark/50 border border-brand-gold/20 flex flex-wrap items-baseline gap-4">
              <span className="font-serif text-3xl sm:text-4xl font-bold text-brand-gold">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-lg text-brand-ivory/40 line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-bold text-brand-crimson bg-brand-crimson/15 border border-brand-crimson/30 px-3 py-1 rounded-full">
                    Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')} ({discountPercent}% OFF)
                  </span>
                </>
              )}
              <div className="w-full text-xs text-brand-ivory/60 mt-1 flex items-center justify-between">
                <span>Inclusive of all GST taxes & royal velvet chest packaging</span>
                <span className="text-emerald-400 font-medium">Free Pan-India Delivery</span>
              </div>
            </div>

            {/* Editorial Description */}
            <div className="space-y-3">
              <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                <Feather className="w-4 h-4 text-brand-gold" />
                The Loom Narrative
              </h3>
              <p className="text-sm text-brand-ivory/80 leading-relaxed font-sans font-light">
                {product.description}
              </p>
            </div>

            {/* Full Specifications Table */}
            <div className="rounded-2xl border border-brand-gold/25 bg-brand-purple/20 p-5 sm:p-6 shadow-inner">
              <h4 className="font-serif text-sm font-bold text-brand-gold uppercase tracking-wider flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-brand-gold" />
                Handloom Specification Dossier
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 text-xs font-sans">
                <div className="flex justify-between py-1.5 border-b border-brand-gold/10">
                  <span className="text-brand-ivory/60">Fabric Composition:</span>
                  <span className="font-semibold text-white">{product.fabric || '100% Pure Mulberry Silk'}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-brand-gold/10">
                  <span className="text-brand-ivory/60">Weaving Technique:</span>
                  <span className="font-semibold text-white">{product.weave || 'Traditional Interlocking Kadwa'}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-brand-gold/10">
                  <span className="text-brand-ivory/60">Zari Specification:</span>
                  <span className="font-semibold text-brand-gold-light">24K Gold Electroplated Silver Thread</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-brand-gold/10">
                  <span className="text-brand-ivory/60">Color Palette:</span>
                  <span className="font-semibold text-white">{product.color || 'Imperial Heritage Tone'}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-brand-gold/10">
                  <span className="text-brand-ivory/60">Saree Length:</span>
                  <span className="font-semibold text-white">5.5 Metres Standard Drape</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-brand-gold/10">
                  <span className="text-brand-ivory/60">Blouse Piece:</span>
                  <span className="font-semibold text-emerald-400">Included (0.8m Matching Running Silk)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-brand-gold/10">
                  <span className="text-brand-ivory/60">Weaving Time:</span>
                  <span className="font-semibold text-white">18 - 24 Days on Pit Loom</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-brand-gold/10">
                  <span className="text-brand-ivory/60">Care Instructions:</span>
                  <span className="font-semibold text-amber-300">Dry Clean Only • Muslin Storage</span>
                </div>
              </div>
            </div>

            {/* Interactive Actions: Quantity + Add To Cart + Instant Checkout */}
            <div className="space-y-4 pt-4 border-t border-brand-gold/20">
              <div className="flex items-center gap-4">
                {/* Quantity Counter */}
                <div className="flex items-center border border-brand-gold/40 rounded-xl px-3 py-2.5 bg-brand-purple-dark/80 shrink-0">
                  <span className="text-xs text-brand-ivory/60 mr-3 font-medium">Qty:</span>
                  <button
                    onClick={() => setSelectedQty(Math.max(1, selectedQty - 1))}
                    className="text-brand-gold px-2.5 text-base font-bold hover:text-white transition-colors"
                  >
                    −
                  </button>
                  <span className="text-sm font-bold px-3 font-mono text-white">{selectedQty}</span>
                  <button
                    onClick={() => setSelectedQty(selectedQty + 1)}
                    className="text-brand-gold px-2.5 text-base font-bold hover:text-white transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* Add to Bag Button */}
                <button
                  onClick={handleAdd}
                  className={`flex-1 py-4 px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2.5 border transition-all shadow-lg ${
                    added
                      ? 'bg-emerald-600 border-emerald-500 text-white'
                      : 'bg-brand-purple/70 border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-purple-dark'
                  }`}
                >
                  {added ? <Check className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
                  <span className="font-serif text-base">{added ? 'Added to Bag' : 'Add to Bag'}</span>
                </button>
              </div>

              {/* Instant Checkout Button */}
              <button
                onClick={handleBuyNow}
                className="w-full py-4 px-6 rounded-xl font-serif font-bold text-base bg-gradient-to-r from-brand-gold via-brand-gold-light to-brand-gold-dark text-brand-purple-dark hover:brightness-110 shadow-2xl transition-all duration-300 transform active:scale-[0.99]"
              >
                Proceed to Secure Checkout
              </button>

              {/* Trust Guarantees Row */}
              <div className="grid grid-cols-3 gap-3 pt-4 text-[11px] text-center">
                <div className="flex flex-col items-center p-3 rounded-2xl bg-white/5 border border-brand-gold/15">
                  <ShieldCheck className="w-5 h-5 text-brand-gold mb-1.5" />
                  <span className="font-bold text-white">Silk Mark Verified</span>
                  <span className="text-[10px] text-brand-ivory/60 mt-0.5">Zero Synthetic Fibers</span>
                </div>
                <div className="flex flex-col items-center p-3 rounded-2xl bg-white/5 border border-brand-gold/15">
                  <Truck className="w-5 h-5 text-brand-gold mb-1.5" />
                  <span className="font-bold text-white">Insured Transit</span>
                  <span className="text-[10px] text-brand-ivory/60 mt-0.5">Free Pan-India Delivery</span>
                </div>
                <div className="flex flex-col items-center p-3 rounded-2xl bg-white/5 border border-brand-gold/15">
                  <RotateCcw className="w-5 h-5 text-brand-gold mb-1.5" />
                  <span className="font-bold text-white">7-Day Guarantee</span>
                  <span className="text-[10px] text-brand-ivory/60 mt-0.5">Hassle-Free Return</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ==================== CRAFT & ARTISAN HERITAGE STORY SECTION ==================== */}
        <div className="mt-20 pt-12 border-t border-brand-gold/20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-3xl bg-brand-purple-dark/50 border border-brand-gold/20 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center text-brand-gold mb-4">
                  <Feather className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-white">Kadwa Weaving Tradition</h3>
                <p className="mt-2 text-xs text-brand-ivory/70 leading-relaxed">
                  Unlike printing or jacquard powerlooms, every floral booti in this saree is separately hand-woven using pure zari shuttles, leaving zero raw floating threads on the backside.
                </p>
              </div>
              <span className="text-[11px] font-mono text-brand-gold-light mt-4 block">Varanasi Chowk Guild</span>
            </div>

            <div className="p-6 rounded-3xl bg-brand-purple-dark/50 border border-brand-gold/20 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center text-brand-gold mb-4">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-white">200+ Man Hours on Pitloom</h3>
                <p className="mt-2 text-xs text-brand-ivory/70 leading-relaxed">
                  Two master craftsmen collaborate synchronously across the warp frame, guiding flying shuttles to achieve millimeter precision in pattern symmetry.
                </p>
              </div>
              <span className="text-[11px] font-mono text-brand-gold-light mt-4 block">Zero Automated Shortcuts</span>
            </div>

            <div className="p-6 rounded-3xl bg-brand-purple-dark/50 border border-brand-gold/20 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center text-brand-gold mb-4">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-white">Heirloom Preservation</h3>
                <p className="mt-2 text-xs text-brand-ivory/70 leading-relaxed">
                  Delivered in our bespoke royal velvet chest lined with pure cotton muslin to protect the zari patina for brides, daughters, and granddaughters.
                </p>
              </div>
              <span className="text-[11px] font-mono text-brand-gold-light mt-4 block">Imperial Atelier Standard</span>
            </div>
          </div>
        </div>

        {/* ==================== PATRON REVIEWS & APPRAISALS ==================== */}
        <div className="mt-16 pt-12 border-t border-brand-gold/20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-brand-gold font-mono">
                Patron Appraisals
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
                Connoisseur Testimonials
              </h2>
            </div>
            <div className="flex items-center gap-2 text-sm text-brand-gold-light">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-white text-lg">{product.rating ? product.rating.toFixed(1) : '4.9'}</span>
              <span>out of 5.0 (98% Recommendation Rate)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-brand-purple-dark/40 border border-brand-gold/15 space-y-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-brand-ivory/80 italic leading-relaxed">
                "The zari shine is regal without being loud. The silk falls like liquid gold. Wore this to my brother’s wedding and received non-stop compliments."
              </p>
              <div className="pt-2 border-t border-brand-gold/10 flex items-center justify-between text-[11px]">
                <span className="font-bold text-white">Radhika M.</span>
                <span className="text-emerald-400">Verified Buyer • Mumbai</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-brand-purple-dark/40 border border-brand-gold/15 space-y-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-brand-ivory/80 italic leading-relaxed">
                "The velvet chest packaging itself is a work of art. You can immediately feel the density of pure silk. The Silk Mark tag gave complete confidence."
              </p>
              <div className="pt-2 border-t border-brand-gold/10 flex items-center justify-between text-[11px]">
                <span className="font-bold text-white">Ananya S.</span>
                <span className="text-emerald-400">Verified Buyer • Bangalore</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-brand-purple-dark/40 border border-brand-gold/15 space-y-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-brand-ivory/80 italic leading-relaxed">
                "True Kadwa weaving. No floating threads on the reverse side whatsoever. It is a genuine heirloom piece that will stay in the family for decades."
              </p>
              <div className="pt-2 border-t border-brand-gold/10 flex items-center justify-between text-[11px]">
                <span className="font-bold text-white">Meenakshi I.</span>
                <span className="text-emerald-400">Verified Buyer • Chennai</span>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== RELATED MASTERPIECES GRID ==================== */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-brand-gold/20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs uppercase tracking-widest text-brand-gold font-mono">
                  From The Same Handlooms
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
                  Related {product.category} Sarees
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectProduct?.(rel)}
                  className="group rounded-3xl border border-brand-gold/20 overflow-hidden bg-brand-purple-dark/60 hover:border-brand-gold/60 cursor-pointer transition-all hover:shadow-2xl hover:shadow-brand-gold/10 flex flex-col"
                >
                  <div className="aspect-[3/4] w-full overflow-hidden bg-black relative">
                    <img
                      src={rel.image || '/images/saree_crimson_red.png'}
                      alt={rel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {rel.badge && (
                      <span className="absolute top-3 left-3 bg-brand-crimson text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase shadow">
                        {rel.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-brand-gold uppercase tracking-wider block font-mono">
                        {rel.category}
                      </span>
                      <h4 className="font-serif text-sm font-bold text-white truncate mt-1 group-hover:text-brand-gold transition-colors">
                        {rel.name}
                      </h4>
                    </div>
                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-brand-gold/10">
                      <span className="font-serif text-base font-bold text-brand-gold">
                        ₹{rel.price.toLocaleString('en-IN')}
                      </span>
                      <ChevronRight className="w-4 h-4 text-brand-gold opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
