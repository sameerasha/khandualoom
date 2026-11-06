import React, { useState } from 'react';
import { Star, CheckCircle, ThumbsUp, MessageSquarePlus, X } from 'lucide-react';
import { Product } from '@/types';

interface Review {
  id: string;
  name: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  helpfulCount: number;
}

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    name: 'Sasmita Mohanty',
    rating: 5,
    date: '28 Oct 2026',
    title: 'Breathtaking handloom drape and pure silk texture',
    comment:
      'The silk lustre and Gitagovinda calligraphy weaving are even more magnificent in person. Truly proud to wear authentic Odisha heritage. Delivered neatly with Silk Mark certification.',
    verified: true,
    helpfulCount: 24,
  },
  {
    id: 'rev-2',
    name: 'Ananya Pattnaik',
    rating: 5,
    date: '15 Oct 2026',
    title: 'Exquisite craftsmanship & lightweight feel',
    comment:
      'Wore this for my sister’s wedding ceremony and received endless compliments. The drape falls effortlessly and the zari border has a very sophisticated, subtle glow.',
    verified: true,
    helpfulCount: 18,
  },
  {
    id: 'rev-3',
    name: 'Priyanka Das',
    rating: 4,
    date: '02 Oct 2026',
    title: 'Very authentic handwoven piece',
    comment:
      'Beautiful saree with original ikat motifs. The delivery was fast and the packaging was premium. Highly recommended for handloom lovers.',
    verified: true,
    helpfulCount: 9,
  },
];

interface ProductReviewsSectionProps {
  product: Product;
}

export const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({ product }) => {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [newName, setNewName] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const averageRating =
    reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
  const totalReviewsCount = (product.reviews || 84) + reviews.length - 3;

  // Breakdown distribution
  const ratingDistribution = [
    { stars: 5, pct: 78, count: Math.round(totalReviewsCount * 0.78) },
    { stars: 4, pct: 15, count: Math.round(totalReviewsCount * 0.15) },
    { stars: 3, pct: 4, count: Math.round(totalReviewsCount * 0.04) },
    { stars: 2, pct: 2, count: Math.round(totalReviewsCount * 0.02) },
    { stars: 1, pct: 1, count: Math.round(totalReviewsCount * 0.01) },
  ];

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newComment.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      name: newName.trim(),
      rating: newRating,
      date: 'Just now',
      title: newTitle.trim() || 'Verified Purchase',
      comment: newComment.trim(),
      verified: true,
      helpfulCount: 0,
    };

    setReviews([newRev, ...reviews]);
    setSubmitSuccess(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setSubmitSuccess(false);
      setNewName('');
      setNewTitle('');
      setNewComment('');
      setNewRating(5);
    }, 2000);
  };

  return (
    <div className="py-8 border-t border-border space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-text-primary tracking-wide">
            Ratings & Customer Reviews
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            Verified feedback from genuine handloom patrons
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-border rounded-md bg-surface hover:bg-background-secondary text-text-primary text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <MessageSquarePlus className="w-4 h-4 text-primary" />
          <span>Write a Review</span>
        </button>
      </div>

      {/* Rating Score & Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 rounded-xl bg-background-secondary border border-border items-center">
        {/* Left: Overall Score (4 cols) */}
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center md:border-r md:border-border md:pr-6">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-extrabold text-text-primary">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-lg text-text-muted font-bold">/ 5</span>
          </div>

          <div className="flex items-center gap-1 my-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.round(averageRating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-border'
                }`}
              />
            ))}
          </div>

          <span className="text-xs text-text-secondary font-medium">
            Based on {totalReviewsCount} Verified Reviews
          </span>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> 96% of customers recommend this saree
          </span>
        </div>

        {/* Right: 5-to-1 Star Progress Bars (8 cols) */}
        <div className="md:col-span-8 space-y-2">
          {ratingDistribution.map((row) => (
            <div key={row.stars} className="flex items-center gap-3 text-xs">
              <span className="w-12 font-semibold text-text-secondary flex items-center gap-1">
                {row.stars} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              </span>

              <div className="flex-1 h-2 rounded-full bg-border overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${row.pct}%` }}
                />
              </div>

              <span className="w-12 text-right text-text-muted font-mono text-[11px]">
                {row.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4 pt-2">
        {reviews.slice(0, visibleCount).map((review) => (
          <div
            key={review.id}
            className="p-5 rounded-lg bg-surface border border-border shadow-xs space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-600 text-white font-bold text-xs">
                  <span>{review.rating}</span>
                  <Star className="w-3 h-3 fill-white text-white" />
                </span>
                <span className="font-bold text-text-primary text-sm">{review.title}</span>
              </div>
              <span className="text-xs text-text-muted font-mono">{review.date}</span>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed font-normal">
              {review.comment}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-border text-xs text-text-muted">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-text-primary">{review.name}</span>
                {review.verified && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    <CheckCircle className="w-3 h-3" />
                    Verified Buyer
                  </span>
                )}
              </div>

              <button
                type="button"
                className="flex items-center gap-1 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                title="Mark review as helpful"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Helpful ({review.helpfulCount})</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {visibleCount < reviews.length && (
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => prev + 3)}
            className="px-6 py-2 border border-border rounded-md text-xs font-semibold text-text-secondary hover:bg-background-secondary transition-colors cursor-pointer uppercase tracking-wider"
          >
            Load More Reviews
          </button>
        </div>
      )}

      {/* Write a Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-border">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h4 className="font-bold text-text-primary text-base">Write a Customer Review</h4>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-text-muted hover:text-text-primary p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                <h5 className="font-bold text-text-primary text-base">Thank you for your review!</h5>
                <p className="text-xs text-text-muted">
                  Your feedback has been verified and added to this saree.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
                {/* Rating Picker */}
                <div>
                  <label className="block font-semibold text-text-secondary mb-1.5">
                    Your Rating*
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="p-1 cursor-pointer focus:outline-none"
                      >
                        <Star
                          className={`w-6 h-6 transition-colors ${
                            star <= (hoverRating ?? newRating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-border'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 font-bold text-text-primary">
                      {(hoverRating ?? newRating)} Stars
                    </span>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block font-semibold text-text-secondary mb-1">
                    Your Name*
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sasmita Mohanty"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-input-background border border-input-border rounded px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-accent"
                  />
                </div>

                {/* Review Headline */}
                <div>
                  <label className="block font-semibold text-text-secondary mb-1">
                    Review Title
                  </label>
                  <input
                    type="text"
                    placeholder="Summarize your experience..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-input-background border border-input-border rounded px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-accent"
                  />
                </div>

                {/* Comment */}
                <div>
                  <label className="block font-semibold text-text-secondary mb-1">
                    Review Details*
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Share details about the fabric purity, drape, weave craftsmanship, and delivery..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full bg-input-background border border-input-border rounded px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-accent resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-border rounded text-text-secondary text-xs font-semibold hover:bg-background-secondary cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors shadow-xs"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
