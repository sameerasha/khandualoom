import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ProductMediaGallery } from './ProductMediaGallery';
import { PincodeDeliveryChecker } from './PincodeDeliveryChecker';
import { HandloomSpecifications } from './HandloomSpecifications';
import { ProductReviewsSection } from './ProductReviewsSection';
import { RecentlyViewedSection } from './RecentlyViewedSection';
import { useGetProductByIdQuery, useGetProductsQuery } from '@/features/products/productsApi';
import { fallbackProducts } from '@/data/fallbackProducts';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { addToCart } from '@/features/cart/cartSlice';
import { toggleWishlist } from '@/features/wishlist/wishlistSlice';
import { ShoppingBag, Heart, Star, Sparkles, Tag, ArrowLeft, Plus, Minus, Check } from 'lucide-react';
import { CatalogProductCard } from '@/components/catalog/CatalogProductCard';

export const ProductDetailsView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const productId = Number(id) || 1;

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState('standard');
  const [addedNotice, setAddedNotice] = useState(false);

  const { data: fetchedProduct } = useGetProductByIdQuery(productId);
  const { data: allProducts } = useGetProductsQuery({});

  const product =
    fetchedProduct ||
    fallbackProducts.find((p) => p.id === productId) ||
    fallbackProducts[0];

  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const features = useAppSelector((state) => state.features.features);
  const isWishlisted = wishlistItems.some((item) => item.id === product.id);

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }));
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  const handleWishlist = () => {
    dispatch(toggleWishlist(product));
  };

  const scrollToReviews = () => {
    document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Related sarees in same category / weave
  const relatedSarees = (allProducts || fallbackProducts)
    .filter((p) => p.id !== product.id && (p.category === product.category || p.weave === product.weave))
    .slice(0, 4);

  return (
    <div className="bg-background min-h-screen text-text-primary pb-20 md:pb-12 transition-colors">
      <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Breadcrumb & Back Navigation */}
        <div className="flex items-center justify-between mb-6 text-xs text-text-muted">
          <div className="flex items-center gap-2 flex-wrap">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link to="/catalog" className="hover:text-primary transition-colors">Sarees</Link>
            <span>/</span>
            <Link to={`/collections/${encodeURIComponent(product.category)}`} className="hover:text-primary transition-colors">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-text-primary font-medium truncate max-w-xs">{product.name}</span>
          </div>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-text-secondary hover:text-primary transition-colors cursor-pointer font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
        </div>

        {/* Main 2-Column PDP Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Media Gallery (6 cols) */}
          <div className="lg:col-span-6 lg:sticky lg:top-24">
            <ProductMediaGallery product={product} />
          </div>

          {/* Right Column: Pricing & Purchase Specifications (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              {/* Artisan Society & Brand */}
              <p className="text-xs font-bold uppercase tracking-wider text-accent mb-1">
                {product.artisanSociety || `${product.weave || 'Heritage'} Weavers Cooperative`}
              </p>

              {/* Saree Full Title */}
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary leading-snug">
                {product.name}
              </h1>

              {/* Rating Callout */}
              {features.reviewsAndRatings && (
                <button
                  type="button"
                  onClick={scrollToReviews}
                  className="mt-2.5 inline-flex items-center gap-2 border border-border px-3 py-1 rounded-md bg-surface text-xs text-text-primary hover:border-border-strong transition-colors cursor-pointer"
                >
                  <span className="font-bold text-text-primary">
                    {product.rating ? product.rating.toFixed(1) : '4.8'}
                  </span>
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-border">|</span>
                  <span className="text-text-muted font-normal">
                    {product.reviews || 84} Ratings & Reviews
                  </span>
                </button>
              )}
            </div>

            {/* Pricing Box */}
            <div className="p-4 rounded-xl bg-background-secondary border border-border">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-text-primary">
                  ₹{product.price.toLocaleString()}
                </span>

                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-sm text-text-muted line-through">
                      MRP ₹{product.originalPrice.toLocaleString()}
                    </span>
                    <span className="text-sm font-bold text-rose-600 dark:text-rose-400">
                      ({discountPercent}% OFF)
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold tracking-wide mt-1">
                inclusive of all taxes
              </p>
            </div>

            {/* Saree Size & Blouse Variant Selector */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-text-secondary uppercase tracking-wider block">
                Length & Blouse
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedVariant('standard')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    selectedVariant === 'standard'
                      ? 'border-primary bg-primary/10 text-primary shadow-xs'
                      : 'border-border bg-surface text-text-primary hover:border-border-strong'
                  }`}
                >
                  Standard (5.5m Saree + 0.8m Blouse Piece)
                </button>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-text-secondary uppercase tracking-wider block">
                Quantity
              </span>
              <div className="inline-flex items-center border border-border rounded-lg bg-surface">
                <button
                  type="button"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-text-secondary hover:text-text-primary disabled:opacity-40 transition-colors cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 py-2 text-xs font-bold font-mono text-text-primary">
                  {quantity}
                </span>
                <button
                  type="button"
                  disabled={quantity >= 5}
                  onClick={() => setQuantity((q) => Math.min(5, q + 1))}
                  className="px-3 py-2 text-text-secondary hover:text-text-primary disabled:opacity-40 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Stock Status Badge */}
            {product.stock && product.stock <= 2 ? (
              <div className="px-4 py-2 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center gap-2 text-xs text-amber-700 dark:text-amber-300 font-medium">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <span>
                  <strong>Only {product.stock} left in stock!</strong> Order soon before it sells out.
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                <span>In Stock • Ready to Dispatch in 24 Hours</span>
              </div>
            )}

            {/* Primary CTA Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full py-4 rounded-lg bg-primary hover:bg-primary-hover text-white font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {addedNotice ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>ADDED TO BAG!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>ADD TO BAG</span>
                  </>
                )}
              </button>

              {features.wishlist && (
                <button
                  type="button"
                  onClick={handleWishlist}
                  className={`w-full py-4 rounded-lg font-bold text-xs uppercase tracking-wider border transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                    isWishlisted
                      ? 'bg-rose-500/15 border-rose-500/40 text-rose-600 dark:text-rose-400'
                      : 'bg-surface border-border text-text-primary hover:bg-background-secondary'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{isWishlisted ? 'IN WISHLIST' : 'WISHLIST'}</span>
                </button>
              )}
            </div>

            {/* Delivery & Pincode Checker */}
            {features.pincodeChecker && <PincodeDeliveryChecker />}

            {/* Bank Discounts & Offers Box */}
            {features.bankDiscounts && (
              <div className="p-4 rounded-xl bg-background-secondary border border-border text-xs space-y-2">
                <div className="flex items-center gap-1.5 font-bold uppercase text-text-primary text-[11px]">
                  <Tag className="w-3.5 h-3.5 text-accent" />
                  <span>Special Offers & Discounts</span>
                </div>
                <ul className="space-y-1.5 text-text-secondary text-[11px] list-disc list-inside">
                  <li>Flat ₹500 OFF with coupon code <strong className="text-primary font-bold">KHANDUA500</strong></li>
                  <li>10% Instant Discount on HDFC & ICICI Bank Cards</li>
                  <li>Free Silk Mark Authentication Certificate included with every order</li>
                </ul>
              </div>
            )}

            {/* Product Description */}
            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
                Product Description
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed font-normal">
                {product.description ||
                  `This authentic ${product.category} handloom saree is woven with traditional precision in Odisha. Featuring traditional border motifs, pure silk texture, and artisanal craftsmanship passed down through generations. Perfect for weddings, ceremonies, and festive occasions.`}
              </p>
            </div>

            {/* Handloom Specifications 2-Column Table */}
            <HandloomSpecifications product={product} />
          </div>
        </div>

        {/* Customer Reviews & Ratings Section */}
        {features.reviewsAndRatings && (
          <div id="reviews-section" className="mt-16">
            <ProductReviewsSection product={product} />
          </div>
        )}

        {/* Similar Products Recommendation Section */}
        {relatedSarees.length > 0 && (
          <section className="mt-16 pt-10 border-t border-border">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-text-primary tracking-tight">
                You May Also Like
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                Similar traditional sarees from our handloom collection
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedSarees.map((saree) => (
                <CatalogProductCard key={`related-${saree.id}`} product={saree} />
              ))}
            </div>
          </section>
        )}

        {/* Recently Viewed Section */}
        <RecentlyViewedSection currentProductId={productId} currentProduct={product} />
      </div>

      {/* Mobile Sticky Add to Bag Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface p-3 border-t border-border md:hidden flex items-center gap-3 shadow-lg">
        <button
          type="button"
          onClick={handleWishlist}
          className="p-3 rounded-lg border border-border text-text-primary hover:bg-background-secondary"
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex-1 py-3 px-4 rounded-lg bg-primary text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{addedNotice ? 'ADDED!' : 'ADD TO BAG'}</span>
        </button>
      </div>
    </div>
  );
};
