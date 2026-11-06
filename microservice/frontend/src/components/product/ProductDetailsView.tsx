import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ProductMediaGallery } from './ProductMediaGallery';
import { PincodeDeliveryChecker } from './PincodeDeliveryChecker';
import { HandloomSpecifications } from './HandloomSpecifications';
import { useGetProductByIdQuery, useGetProductsQuery } from '@/features/products/productsApi';
import { fallbackProducts } from '@/data/fallbackProducts';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { addToCart } from '@/features/cart/cartSlice';
import { toggleWishlist } from '@/features/wishlist/wishlistSlice';
import { ShoppingBag, Heart, Star, Sparkles, Tag, ArrowLeft } from 'lucide-react';
import { CatalogProductCard } from '@/components/catalog/CatalogProductCard';

export const ProductDetailsView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const productId = Number(id) || 1;

  const { data: fetchedProduct } = useGetProductByIdQuery(productId);
  const { data: allProducts } = useGetProductsQuery({});

  const product =
    fetchedProduct ||
    fallbackProducts.find((p) => p.id === productId) ||
    fallbackProducts[0];

  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const isWishlisted = wishlistItems.some((item) => item.id === product.id);

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity: 1 }));
  };

  const handleWishlist = () => {
    dispatch(toggleWishlist(product));
  };

  // Related sarees in same category / weave
  const relatedSarees = (allProducts || fallbackProducts)
    .filter((p) => p.id !== product.id && (p.category === product.category || p.weave === product.weave))
    .slice(0, 4);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumb & Back Navigation */}
      <div className="flex items-center justify-between mb-6 text-xs text-brand-ivory/60">
        <div className="flex items-center gap-2">
          <Link to="/" className="hover:text-brand-gold">Home</Link>
          <span>/</span>
          <Link to="/catalog" className="hover:text-brand-gold">Sarees</Link>
          <span>/</span>
          <Link to={`/collections/${encodeURIComponent(product.category)}`} className="hover:text-brand-gold">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-brand-gold truncate max-w-xs">{product.name}</span>
        </div>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-brand-gold hover:text-brand-gold-light transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>
      </div>

      {/* Main 2-Column PDP Section matching Screenshot 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Media Gallery (6 cols) */}
        <div className="lg:col-span-6 lg:sticky lg:top-24">
          <ProductMediaGallery product={product} />
        </div>

        {/* Right Column: Pricing & Purchase Specifications (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            {/* Artisan Society & Brand */}
            <p className="text-xs font-bold uppercase tracking-widest text-brand-gold-light mb-1">
              {product.artisanSociety || `${product.weave || 'Heritage'} Master Cooperative`}
            </p>

            {/* Saree Full Title */}
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-ivory leading-snug">
              {product.name}
            </h1>

            {/* Rating Callout matching Myntra benchmark */}
            <div className="mt-3 inline-flex items-center gap-2 bg-[#1A0A2C] border border-brand-gold/25 px-3 py-1.5 rounded-md text-xs">
              <span className="font-bold text-brand-ivory">{product.rating ? product.rating.toFixed(1) : '4.8'}</span>
              <Star className="w-3.5 h-3.5 fill-brand-gold text-brand-gold" />
              <span className="text-brand-ivory/40">|</span>
              <span className="text-brand-ivory/70">{product.reviews || 84} Verified Connoisseurs</span>
            </div>
          </div>

          {/* Pricing Card */}
          <div className="p-4 rounded-xl bg-[#170928] border border-brand-gold/20">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-brand-gold">
                ₹{product.price.toLocaleString()}
              </span>

              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-sm text-brand-ivory/50 line-through">
                    MRP ₹{product.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-sm font-bold text-orange-400">
                    ({discountPercent}% OFF)
                  </span>
                </>
              )}
            </div>
            <p className="text-[11px] text-emerald-400 font-semibold tracking-wide mt-1">
              inclusive of all taxes
            </p>
          </div>

          {/* Urgency Stock Countdown */}
          {product.stock && product.stock <= 2 && (
            <div className="px-4 py-2.5 rounded-lg bg-orange-950/40 border border-orange-500/30 flex items-center gap-2 text-xs text-orange-300">
              <Sparkles className="w-4 h-4 text-orange-400 shrink-0" />
              <span>
                <strong>Only {product.stock} unique artisan piece remaining.</strong> Handwoven masterworks cannot be duplicated.
              </span>
            </div>
          )}

          {/* Primary CTA Buttons matching Screenshot 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-rose-600 via-rose-700 to-rose-800 hover:from-rose-500 hover:to-rose-700 text-white font-bold text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer border border-rose-400/40"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>ADD TO BAG</span>
            </button>

            <button
              type="button"
              onClick={handleWishlist}
              className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wider border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isWishlisted
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-[#19092B] border-brand-gold/30 text-brand-gold hover:bg-brand-gold/15'
              }`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-400' : ''}`} />
              <span>{isWishlisted ? 'WISHLISTED' : 'WISHLIST'}</span>
            </button>
          </div>

          {/* Delivery & Pincode Checker */}
          <PincodeDeliveryChecker />

          {/* Bank Discounts & Offers Box */}
          <div className="p-4 rounded-xl bg-[#140622] border border-brand-gold/15 text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-bold uppercase text-brand-gold text-[11px]">
              <Tag className="w-3.5 h-3.5" />
              <span>BEST BANK & FESTIVAL OFFERS</span>
            </div>
            <ul className="space-y-1.5 text-brand-ivory/80 text-[11px] list-disc list-inside">
              <li>10% Instant Discount on HDFC Bank Credit & Debit Cards (Max ₹1,500)</li>
              <li>Flat ₹500 OFF with coupon code <strong className="text-brand-gold">KHANDUA500</strong></li>
              <li>Free Silk Mark Authentication Certificate included with every order</li>
            </ul>
          </div>

          {/* Handloom Specifications Table */}
          <HandloomSpecifications product={product} />
        </div>
      </div>

      {/* Similar Sarees Recommendation Section */}
      {relatedSarees.length > 0 && (
        <section className="mt-20 pt-10 border-t border-brand-gold/20">
          <div className="text-center mb-8">
            <span className="text-xs uppercase font-bold text-brand-gold-light tracking-widest block mb-1">
              Curated Masterworks
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-brand-gold font-normal">
              Similar Handloom Creations
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedSarees.map((saree) => (
              <CatalogProductCard key={`related-${saree.id}`} product={saree} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
