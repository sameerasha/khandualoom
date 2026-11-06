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
    <header className="border-b border-[#374151] px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-30 transition-colors backdrop-blur-md bg-[#111827]/95 text-[#F9FAFB]">
      {/* Route Title & Breadcrumbs */}
      <div>
        <div className="flex items-center gap-2 text-[11px] uppercase font-semibold tracking-wider text-[#9CA3AF]">
          <span>Admin</span>
          <span>/</span>
          <span className="text-[#DFBF7A]">{routeInfo.title}</span>
        </div>
        <h1 className="font-sans text-xl sm:text-2xl font-bold tracking-wide text-[#F9FAFB]">
          {routeInfo.title}
        </h1>
        <p className="text-xs mt-0.5 text-[#9CA3AF]">
          {routeInfo.subtitle}
        </p>
      </div>

      {/* Action Strip: Back to Store, Server Pulse, User Info (No Theme Switcher in Admin) */}
      <div className="flex items-center gap-3 self-end md:self-auto">
        {/* Gateway Health Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs bg-[#1F2937] border-[#374151] text-[#D1D5DB]">
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
          className="px-3.5 py-1.5 rounded-full border border-[rgba(223,191,122,0.3)] bg-[rgba(223,191,122,0.12)] text-[#DFBF7A] hover:bg-[rgba(223,191,122,0.22)] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <span>Back to Store</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>

        {/* Active Admin Profile */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-[#374151]">
          <div className="w-8 h-8 rounded-full border border-[rgba(223,191,122,0.4)] bg-[rgba(223,191,122,0.15)] text-[#DFBF7A] flex items-center justify-center font-bold text-xs">
            <UserIcon className="w-4 h-4" />
          </div>

          <div className="hidden lg:block text-left">
            <span className="text-xs font-bold block leading-tight text-[#F9FAFB]">
              {user?.username || 'Super Administrator'}
            </span>
            <span className="text-[10px] uppercase tracking-wider font-semibold block text-[#DFBF7A]">
              {role || 'ROLE_SUPER_ADMIN'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => dispatch(logout())}
            title="Sign out from administrative session"
            className="p-1.5 rounded-lg transition-colors ml-1 cursor-pointer text-[#9CA3AF] hover:text-rose-400 hover:bg-rose-950/20"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
