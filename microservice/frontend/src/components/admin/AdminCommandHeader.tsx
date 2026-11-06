import React from 'react';
import { ExternalLink, ShieldCheck, Activity, LogOut, User as UserIcon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { logout } from '@/features/auth/authSlice';

interface AdminCommandHeaderProps {
  currentRoute: string;
  onBackToStore: () => void;
  serverStatus: 'checking' | 'online' | 'offline';
  latencyMs: number | null;
}

const ROUTE_TITLES: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: 'Atelier Dashboard', subtitle: 'Real-time sales, order volume, and key revenue metrics' },
  products: { title: 'Product Catalog Atelier', subtitle: 'Masterpieces curation, pricing, and handloom attributes' },
  categories: { title: 'Categories & Navigation', subtitle: 'Manage mega-menu taxonomy, hierarchy, and category banners' },
  inventory: { title: 'Stock Ledger & Reconciliation', subtitle: 'SKU availability, single-piece locks, and audited adjustments' },
  homepage: { title: 'Homepage Visual Builder', subtitle: 'Drag-and-drop section ordering, banners, and responsive live preview' },
  banners: { title: 'Banner & Promotional Studio', subtitle: 'Hero carousel, festive sales, and sticky promotional tabs' },
  promotions: { title: 'Coupons & Bank Campaigns', subtitle: 'Discount codes, usage limits, and banking partner offers' },
  features: { title: 'Dynamic Feature Management', subtitle: 'Toggle website capabilities and storefront modules without code updates' },
  orders: { title: 'Orders & Dispatches', subtitle: 'Order fulfillment saga, courier tracking, and printable invoices' },
  users: { title: 'Patron Registry', subtitle: 'Customer profiles, order frequency, and address books' },
  artisans: { title: 'Artisan Masters', subtitle: 'Loom cooperative verifications and GI Tag accreditations' },
  admins: { title: 'RBAC Administrators', subtitle: 'Role permissions matrix and security governance' },
  audit: { title: 'Administrative Audit Trail', subtitle: 'Immutable operational history and change tracking' },
  settings: { title: 'Store Settings & Brand', subtitle: 'Global configurations, currency, and maintenance mode' },
};

export const AdminCommandHeader: React.FC<AdminCommandHeaderProps> = ({
  currentRoute,
  onBackToStore,
  serverStatus,
  latencyMs,
}) => {
  const dispatch = useAppDispatch();
  const { user, role } = useAppSelector((state) => state.auth);

  const routeInfo = ROUTE_TITLES[currentRoute] || {
    title: 'Atelier Administration',
    subtitle: 'Enterprise e-commerce operations',
  };

  return (
    <header className="border-b border-brand-gold/15 bg-[#170928]/90 backdrop-blur-md px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-30">
      {/* Route Title & Breadcrumbs */}
      <div>
        <div className="flex items-center gap-2 text-[11px] text-brand-gold/60 uppercase font-semibold tracking-wider">
          <span>Admin</span>
          <span>/</span>
          <span className="text-brand-gold">{routeInfo.title}</span>
        </div>
        <h1 className="font-serif text-xl sm:text-2xl font-bold text-brand-gold tracking-wide">
          {routeInfo.title}
        </h1>
        <p className="text-xs text-brand-ivory/60 mt-0.5">
          {routeInfo.subtitle}
        </p>
      </div>

      {/* Action Strip: Back to Store, Server Pulse, User Info */}
      <div className="flex items-center gap-3 self-end md:self-auto">
        {/* Gateway Health Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#140622] border border-brand-gold/20 text-xs text-brand-ivory/70">
          <Activity
            className={`w-3.5 h-3.5 ${
              serverStatus === 'online' ? 'text-emerald-400 animate-pulse' : 'text-amber-400'
            }`}
          />
          <span className="font-mono text-[11px]">
            {serverStatus === 'online' ? `Gateway 200 OK (${latencyMs ?? 18}ms)` : 'Gateway Checking'}
          </span>
        </div>

        {/* Back to Live Store Button */}
        <button
          type="button"
          onClick={onBackToStore}
          className="px-3.5 py-1.5 rounded-full bg-brand-gold/15 border border-brand-gold/30 text-brand-gold hover:bg-brand-gold/25 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <span>Back to Store</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>

        {/* Active Admin Profile */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-brand-gold/20">
          <div className="w-8 h-8 rounded-full bg-brand-gold/20 border border-brand-gold/40 flex items-center justify-center text-brand-gold font-bold text-xs">
            <UserIcon className="w-4 h-4" />
          </div>

          <div className="hidden lg:block text-left">
            <span className="text-xs font-bold text-brand-ivory block leading-tight">
              {user?.username || 'Super Administrator'}
            </span>
            <span className="text-[10px] text-brand-gold/70 uppercase tracking-wider font-semibold block">
              {role || 'ROLE_SUPER_ADMIN'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => dispatch(logout())}
            title="Sign out from administrative session"
            className="p-1.5 rounded-lg text-brand-ivory/50 hover:text-rose-400 hover:bg-rose-950/20 transition-colors ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
