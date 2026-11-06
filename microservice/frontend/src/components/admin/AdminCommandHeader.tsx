import React from 'react';
import { ExternalLink, Activity, LogOut, User as UserIcon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { logout } from '@/features/auth/authSlice';
import { ThemeSwitcher } from '@/theme/ThemeSwitcher';
import { useTheme } from '@/theme/useTheme';

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
  const { isDark } = useTheme();
  const { user, role } = useAppSelector((state) => state.auth);

  const routeInfo = ROUTE_TITLES[currentRoute] || {
    title: 'Atelier Administration',
    subtitle: 'Enterprise e-commerce operations',
  };

  return (
    <header
      className={`border-b px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-30 transition-colors backdrop-blur-md ${
        isDark
          ? 'border-brand-gold/15 bg-[#170928]/90 text-brand-ivory'
          : 'border-slate-200 bg-white/90 text-slate-800 shadow-xs'
      }`}
    >
      {/* Route Title & Breadcrumbs */}
      <div>
        <div
          className={`flex items-center gap-2 text-[11px] uppercase font-semibold tracking-wider ${
            isDark ? 'text-brand-gold/60' : 'text-slate-500'
          }`}
        >
          <span>Admin</span>
          <span>/</span>
          <span className={isDark ? 'text-brand-gold' : 'text-[#881337]'}>{routeInfo.title}</span>
        </div>
        <h1
          className={`font-serif text-xl sm:text-2xl font-bold tracking-wide ${
            isDark ? 'text-brand-gold' : 'text-slate-900'
          }`}
        >
          {routeInfo.title}
        </h1>
        <p className={`text-xs mt-0.5 ${isDark ? 'text-brand-ivory/60' : 'text-slate-500'}`}>
          {routeInfo.subtitle}
        </p>
      </div>

      {/* Action Strip: Theme Switcher, Back to Store, Server Pulse, User Info */}
      <div className="flex items-center gap-3 self-end md:self-auto">
        {/* Gateway Health Indicator */}
        <div
          className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs ${
            isDark
              ? 'bg-[#140622] border-brand-gold/20 text-brand-ivory/70'
              : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}
        >
          <Activity
            className={`w-3.5 h-3.5 ${
              serverStatus === 'online' ? 'text-emerald-500 animate-pulse' : 'text-amber-500'
            }`}
          />
          <span className="font-mono text-[11px]">
            {serverStatus === 'online' ? `Gateway 200 OK (${latencyMs ?? 18}ms)` : 'Gateway Checking'}
          </span>
        </div>

        {/* Theme Switcher Toggle */}
        <ThemeSwitcher />

        {/* Back to Live Store Button */}
        <button
          type="button"
          onClick={onBackToStore}
          className={`px-3.5 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer ${
            isDark
              ? 'bg-brand-gold/15 border-brand-gold/30 text-brand-gold hover:bg-brand-gold/25'
              : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <span>Back to Store</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>

        {/* Active Admin Profile */}
        <div
          className={`flex items-center gap-2.5 pl-2 border-l ${
            isDark ? 'border-brand-gold/20' : 'border-slate-200'
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs ${
              isDark
                ? 'bg-brand-gold/20 border-brand-gold/40 text-brand-gold'
                : 'bg-slate-100 border-slate-300 text-slate-700'
            }`}
          >
            <UserIcon className="w-4 h-4" />
          </div>

          <div className="hidden lg:block text-left">
            <span
              className={`text-xs font-bold block leading-tight ${
                isDark ? 'text-brand-ivory' : 'text-slate-800'
              }`}
            >
              {user?.username || 'Super Administrator'}
            </span>
            <span
              className={`text-[10px] uppercase tracking-wider font-semibold block ${
                isDark ? 'text-brand-gold/70' : 'text-[#881337]'
              }`}
            >
              {role || 'ROLE_SUPER_ADMIN'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => dispatch(logout())}
            title="Sign out from administrative session"
            className={`p-1.5 rounded-lg transition-colors ml-1 cursor-pointer ${
              isDark
                ? 'text-brand-ivory/50 hover:text-rose-400 hover:bg-rose-950/20'
                : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
            }`}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
