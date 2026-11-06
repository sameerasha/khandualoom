import React from 'react';
import { ExternalLink, Activity, LogOut, User as UserIcon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { logout } from '@/features/auth/authSlice';

interface AdminCommandHeaderProps {
  currentRoute: string;
  onBackToStore: () => void;
  serverStatus: 'checking' | 'online' | 'offline';
  latencyMs: number | null;
}

const ROUTE_TITLES: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'View sales, orders, and revenue statistics' },
  products: { title: 'Products', subtitle: 'Add, edit, and organize sarees and handloom products' },
  categories: { title: 'Categories', subtitle: 'Manage product categories and menu order' },
  inventory: { title: 'Manage Stock', subtitle: 'Check inventory levels and update stock count' },
  homepage: { title: 'Website Content', subtitle: 'Customize homepage sections, layout, and texts' },
  banners: { title: 'Banners', subtitle: 'Manage promotional banners and advertisements' },
  promotions: { title: 'Offers', subtitle: 'Create coupon codes, discounts, and festive offers' },
  features: { title: 'Feature Settings', subtitle: 'Enable or disable website features easily' },
  orders: { title: 'Orders', subtitle: 'View customer orders, status, and shipping details' },
  users: { title: 'Customers', subtitle: 'View registered customers and contact information' },
  artisans: { title: 'Sellers & Artisans', subtitle: 'Manage weavers, craft societies, and GI certificates' },
  admins: { title: 'User Permissions', subtitle: 'Manage admin accounts, access rights, and security' },
  audit: { title: 'Audit Log', subtitle: 'View system activity history and operational logs' },
  settings: { title: 'Website Settings', subtitle: 'Configure store details, currency, and maintenance' },
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
