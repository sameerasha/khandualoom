import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  toggleFeature,
  saveFeatureConfiguration,
  resetFeatures,
  FeatureFlags,
} from '@/features/admin/featureSlice';
import {
  ToggleLeft,
  ToggleRight,
  Save,
  RotateCcw,
  CheckCircle,
} from 'lucide-react';

interface FeatureMeta {
  key: keyof FeatureFlags;
  title: string;
  category: 'commerce' | 'sensory' | 'marketing';
  description: string;
  impact: string;
}

const FEATURE_METADATA: FeatureMeta[] = [
  {
    key: 'coupons',
    title: 'Promotional Coupons & Coupons Corner',
    category: 'commerce',
    description: 'Displays the Myntra-style Coupons Corner on the homepage and enables discount coupon redemption in the shopping bag.',
    impact: 'Controls discount computation in Cart and visibility of promo banners.',
  },
  {
    key: 'weaverDonation',
    title: 'Weaver Welfare Contribution Tile',
    category: 'commerce',
    description: 'Interactive tipping options (₹10, ₹20, ₹50, ₹100) supporting Odisha weaver handloom cooperatives.',
    impact: 'Affects Cart subtotal calculations and order line items.',
  },
  {
    key: 'guestCheckout',
    title: 'Guest Checkout Mode',
    category: 'commerce',
    description: 'Allows patrons to enter delivery and payment details without requiring mandatory upfront password creation.',
    impact: 'Reduces cart abandonment for first-time buyers.',
  },
  {
    key: 'wishlist',
    title: 'Patron Wishlist Drawer',
    category: 'commerce',
    description: 'Enables saree bookmarking from catalog cards and PDP into an interactive slide-over drawer.',
    impact: 'Saves items to patron session storage.',
  },
  {
    key: 'threeDSheenCanvas',
    title: '3D WebGL Silk Sheen Fabric Inspector',
    category: 'sensory',
    description: 'Interactive 3D Three.js canvas displaying authentic luster, grain, and drape on the Product Details Page.',
    impact: 'Automatically falls back to 2D high-res zoom when disabled or on low-power devices.',
  },
  {
    key: 'pincodeChecker',
    title: 'Real-Time Delivery ETA Pincode Checker',
    category: 'sensory',
    description: 'Queries 6-digit Indian postal code directory to calculate serviceability, delivery speed, and COD availability.',
    impact: 'Prevents unserviceable shipments before order placement.',
  },
  {
    key: 'recentViews',
    title: 'Recently Viewed Masterpieces',
    category: 'sensory',
    description: 'Displays browsing history strip at the bottom of the storefront and PDP.',
    impact: 'Aids patron comparison between sarees.',
  },
  {
    key: 'bankDiscounts',
    title: 'Instant Bank Partner Offer Strip',
    category: 'marketing',
    description: 'Renders the ticker of promotional bank partnerships (HDFC, Kotak, ICICI, Axis, Paytm).',
    impact: 'Builds payment trust on Homepage and PDP.',
  },
  {
    key: 'reviewsAndRatings',
    title: 'Verified Buyer Reviews & Ratings',
    category: 'marketing',
    description: 'Enables product rating badges (e.g. 4.5 ★ | 320) and customer testimonials.',
    impact: 'Enhances social proof across product cards.',
  },
  {
    key: 'maintenanceMode',
    title: 'Storefront Maintenance Mode',
    category: 'marketing',
    description: 'Shows a royal maintenance screen to public visitors while granting unrestricted access to authenticated administrators.',
    impact: 'Stops customer traffic during scheduled database migrations.',
  },
];

export const FeatureManagerView: React.FC = () => {
  const dispatch = useAppDispatch();
  const { features, hasUnsavedChanges } = useAppSelector((state) => state.features);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    dispatch(saveFeatureConfiguration());
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('Reset all website feature toggles to factory defaults?')) {
      dispatch(resetFeatures());
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header & Save Bar */}
      <div className="p-6 rounded-2xl bg-[#170928] border border-brand-gold/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-brand-gold/70 block">
            Configuration Engine
          </span>
          <h2 className="font-serif text-2xl font-bold text-brand-gold">
            Dynamic Feature Management
          </h2>
          <p className="text-xs text-brand-ivory/60 mt-1">
            Enable, disable, and configure supported storefront features without requiring source code deployment.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {hasUnsavedChanges && (
            <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold animate-pulse">
              Unsaved Changes
            </span>
          )}

          {saveSuccess && (
            <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Published to Store</span>
            </span>
          )}

          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 rounded-xl bg-[#140622] border border-brand-gold/25 text-brand-ivory/70 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={!hasUnsavedChanges}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
              hasUnsavedChanges
                ? 'bg-gradient-to-r from-brand-gold to-brand-gold-light text-brand-purple-dark hover:brightness-110'
                : 'bg-brand-gold/20 text-brand-ivory/40 cursor-not-allowed border border-brand-gold/15'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>Save & Apply</span>
          </button>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FEATURE_METADATA.map((meta) => {
          const isEnabled = features[meta.key];
          const isMaintenance = meta.key === 'maintenanceMode';

          return (
            <div
              key={meta.key}
              className={`p-5 rounded-2xl border transition-all ${
                isEnabled
                  ? isMaintenance
                    ? 'bg-rose-950/20 border-rose-500/40 shadow-rose-950/20'
                    : 'bg-[#170928] border-brand-gold/30 shadow-lg'
                  : 'bg-[#130720]/60 border-brand-gold/10 opacity-70'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        meta.category === 'commerce'
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                          : meta.category === 'sensory'
                          ? 'bg-purple-950/60 text-purple-300 border border-purple-500/30'
                          : 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {meta.category}
                    </span>

                    <span className="font-mono text-[10px] text-brand-ivory/40">
                      {meta.key}
                    </span>
                  </div>

                  <h3 className="font-serif text-base font-bold text-brand-gold">
                    {meta.title}
                  </h3>
                  <p className="text-xs text-brand-ivory/70 mt-1">
                    {meta.description}
                  </p>
                </div>

                {/* Toggle Button */}
                <button
                  type="button"
                  onClick={() => dispatch(toggleFeature(meta.key))}
                  className="shrink-0 p-1 rounded-lg hover:bg-white/5 transition-transform active:scale-95 cursor-pointer"
                  title={`Toggle ${meta.title}`}
                  aria-label={`Toggle ${meta.title}`}
                >
                  {isEnabled ? (
                    <ToggleRight className={`w-8 h-8 ${isMaintenance ? 'text-rose-400' : 'text-brand-gold'}`} />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-brand-ivory/30" />
                  )}
                </button>
              </div>

              {/* Impact Footer */}
              <div className="mt-4 pt-3 border-t border-brand-gold/10 flex items-center justify-between text-[11px] text-brand-ivory/50">
                <span>{meta.impact}</span>
                <span
                  className={`font-bold uppercase tracking-wider text-[10px] ${
                    isEnabled
                      ? isMaintenance
                        ? 'text-rose-400'
                        : 'text-emerald-400'
                      : 'text-brand-ivory/40'
                  }`}
                >
                  {isEnabled ? (isMaintenance ? 'LOCKDOWN ACTIVE' : 'ENABLED') : 'DISABLED'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
