import React from 'react';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Boxes,
  ShoppingBag,
  Sliders,
  Image as ImageIcon,
  Tag,
  ToggleLeft,
  Users,
  Sparkles,
  ShieldAlert,
  Settings,
  History,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

export interface NavGroup {
  title: string;
  items: {
    id: string;
    label: string;
    icon: React.ReactNode;
    badge?: string;
    superAdminOnly?: boolean;
  }[];
}

interface AdminSidebarProps {
  currentRoute: string;
  isCollapsed: boolean;
  isSuperAdmin: boolean;
  onNavigate: (route: string) => void;
  onToggleCollapse: () => void;
}

export const ADMIN_NAV_GROUPS: NavGroup[] = [
  {
    title: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    ],
  },
  {
    title: 'Products & Stock',
    items: [
      { id: 'products', label: 'Products', icon: <Package className="w-4 h-4" /> },
      { id: 'categories', label: 'Categories', icon: <FolderTree className="w-4 h-4" /> },
      { id: 'inventory', label: 'Manage Stock', icon: <Boxes className="w-4 h-4" />, badge: 'Live' },
    ],
  },
  {
    title: 'Website Content',
    items: [
      { id: 'homepage', label: 'Website Content', icon: <Sliders className="w-4 h-4" /> },
      { id: 'banners', label: 'Banners', icon: <ImageIcon className="w-4 h-4" /> },
      { id: 'promotions', label: 'Offers', icon: <Tag className="w-4 h-4" /> },
      { id: 'features', label: 'Feature Settings', icon: <ToggleLeft className="w-4 h-4" />, badge: 'Dynamic' },
    ],
  },
  {
    title: 'Orders & People',
    items: [
      { id: 'orders', label: 'Orders', icon: <ShoppingBag className="w-4 h-4" /> },
      { id: 'users', label: 'Customers', icon: <Users className="w-4 h-4" /> },
      { id: 'artisans', label: 'Sellers & Artisans', icon: <Sparkles className="w-4 h-4" /> },
    ],
  },
  {
    title: 'Settings & Security',
    items: [
      { id: 'admins', label: 'User Permissions', icon: <ShieldAlert className="w-4 h-4" />, superAdminOnly: true },
      { id: 'audit', label: 'Audit Log', icon: <History className="w-4 h-4" /> },
      { id: 'settings', label: 'Website Settings', icon: <Settings className="w-4 h-4" /> },
    ],
  },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentRoute,
  isCollapsed,
  isSuperAdmin,
  onNavigate,
  onToggleCollapse,
}) => {
  return (
    <aside
      className={`admin-sidebar ${isCollapsed ? 'admin-sidebar--collapsed' : ''} transition-all duration-300`}
      data-lenis-prevent="true"
    >
      {/* Brand Header */}
      <div className="admin-sidebar__header flex items-center justify-between p-4 border-b border-brand-gold/15">
        <button
          type="button"
          className="admin-sidebar__logo flex items-center gap-3 text-left"
          onClick={() => onNavigate('dashboard')}
          title="Khandua Looms Atelier"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-gold to-brand-gold-dark flex items-center justify-center text-brand-purple-dark font-serif font-bold text-sm shadow">
            KL
          </div>
          {!isCollapsed && (
            <div className="admin-sidebar__logo-text">
              <span className="admin-sidebar__logo-main font-serif font-bold text-brand-gold block text-sm leading-tight">
                Khandua Looms
              </span>
              <span className="admin-sidebar__logo-sub text-[10px] text-brand-ivory/50 uppercase tracking-widest block">
                Enterprise Atelier
              </span>
            </div>
          )}
        </button>

        <button
          type="button"
          className="admin-sidebar-toggle-btn text-brand-ivory/60 hover:text-brand-gold p-1.5 rounded-lg hover:bg-white/5 transition-colors hidden md:flex"
          onClick={onToggleCollapse}
          title={isCollapsed ? 'Expand sidebar (Ctrl+B)' : 'Collapse sidebar (Ctrl+B)'}
          aria-label="Toggle navigation width"
        >
          {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Groups */}
      <nav className="admin-sidebar__nav p-3 space-y-4 overflow-y-auto max-h-[calc(100vh-80px)]">
        {ADMIN_NAV_GROUPS.map((group) => {
          const visibleItems = group.items.filter((item) => !item.superAdminOnly || isSuperAdmin);
          if (visibleItems.length === 0) return null;

          return (
            <div key={group.title} className="space-y-1">
              {!isCollapsed && (
                <span className="text-[9px] font-bold uppercase tracking-widest text-brand-gold/50 px-3 block mb-1">
                  {group.title}
                </span>
              )}

              {visibleItems.map((item) => {
                const isActive = currentRoute === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onNavigate(item.id)}
                    title={isCollapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-brand-gold/20 to-brand-gold/5 text-brand-gold border-l-2 border-brand-gold font-semibold shadow-sm'
                        : 'text-brand-ivory/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="shrink-0">{item.icon}</span>
                    {!isCollapsed && (
                      <span className="flex-1 text-left truncate">{item.label}</span>
                    )}
                    {!isCollapsed && item.badge && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-brand-gold/15 text-brand-gold border border-brand-gold/30 shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};
