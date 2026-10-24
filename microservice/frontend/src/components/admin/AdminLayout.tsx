import React, { useState, useRef, useEffect } from 'react';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { logout } from '@/features/auth/authSlice';
import { AdminBackground3D } from './AdminBackground3D';
import './adminStyles.css';

interface AdminLayoutProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onBackToStore: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentRoute,
  onNavigate,
  onBackToStore,
  children,
}) => {
  const dispatch = useAppDispatch();
  const { role, user } = useAppSelector((state) => state.auth);
  const isSuperAdmin = role === 'ROLE_SUPER_ADMIN' || user?.email === 'superadmin@vastraloom.com';

  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem('vastraloom_admin_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [latencyMs, setLatencyMs] = useState<number | null>(24);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('vastraloom_admin_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  // Keyboard shortcut Ctrl+B or Cmd+B to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside to close mobile dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuRef]);

  // Server Heartbeat Check
  useEffect(() => {
    const checkHealth = async () => {
      const t0 = performance.now();
      try {
        const response = await fetch('/actuator/health', {
          method: 'GET',
          headers: { 'Cache-Control': 'no-cache' },
        });
        const elapsed = Math.round(performance.now() - t0);
        setLatencyMs(elapsed);
        if (response.ok) {
          setServerStatus('online');
        } else {
          // Fallback check to /api/products
          const fallbackRes = await fetch('/api/products', {
            method: 'GET',
            headers: { 'Cache-Control': 'no-cache' },
          });
          setServerStatus(fallbackRes.ok ? 'online' : 'offline');
        }
      } catch (err) {
        setServerStatus('offline');
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    onBackToStore();
  };

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="7" height="9" rx="1" />
          <rect x="14" y="3" width="7" height="5" rx="1" />
          <rect x="14" y="12" width="7" height="9" rx="1" />
          <rect x="3" y="16" width="7" height="5" rx="1" />
        </svg>
      ),
    },
    {
      id: 'products',
      label: 'Products',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
          <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
      ),
    },
    {
      id: 'users',
      label: 'Customers',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87" />
          <path d="M16 3.13a4 4 0 010 7.75" />
        </svg>
      ),
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
      ),
    },
    {
      id: 'settings',
      label: 'Social Media',
      hideOnMobile: true,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="18" cy="5" r="3"></circle>
          <circle cx="6" cy="12" r="3"></circle>
          <circle cx="18" cy="19" r="3"></circle>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
        </svg>
      ),
    },
  ];

  if (isSuperAdmin) {
    navItems.push({
      id: 'admins',
      label: 'Manage Admins',
      hideOnMobile: true,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
      ),
    });
  }

  return (
    <div className="admin-layout relative" data-lenis-prevent="true">
      <AdminBackground3D />

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isCollapsed ? 'admin-sidebar--collapsed' : ''}`} data-lenis-prevent="true">
        <div className="admin-sidebar__header">
          <button className="admin-sidebar__logo" onClick={() => onNavigate('dashboard')} title="Vastra Loom Atelier">
            <img src="/logo.svg" alt="Vastra Loom Logo" className="admin-sidebar__logo-icon" />
            <div className="admin-sidebar__logo-text">
              <span className="admin-sidebar__logo-main">Vastra Loom</span>
              <span className="admin-sidebar__logo-sub">Admin Panel</span>
            </div>
          </button>
          <button
            className="admin-sidebar-toggle-btn hidden md:flex"
            onClick={toggleSidebar}
            title={isCollapsed ? 'Expand sidebar (Ctrl+B)' : 'Collapse sidebar (Ctrl+B)'}
            aria-label="Toggle navigation width"
          >
            {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>

        <nav className="admin-sidebar__nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`admin-sidebar__link ${
                currentRoute === item.id ? 'admin-sidebar__link--active' : ''
              } ${item.hideOnMobile ? 'admin-sidebar__link--desktop-only' : ''}`}
              onClick={() => onNavigate(item.id)}
              title={isCollapsed ? item.label : undefined}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}

          {/* Mobile Profile Menu Button */}
          <div className="admin-mobile-profile" ref={menuRef}>
            <button
              className={`admin-sidebar__link ${showProfileMenu ? 'admin-sidebar__link--active' : ''}`}
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>Profile</span>
            </button>

            {showProfileMenu && (
              <div className="admin-mobile-profile-dropdown">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onNavigate('settings');
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    style={{ marginRight: '8px', verticalAlign: 'middle' }}
                  >
                    <circle cx="18" cy="5" r="3"></circle>
                    <circle cx="6" cy="12" r="3"></circle>
                    <circle cx="18" cy="19" r="3"></circle>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                  </svg>
                  Social Media
                </button>
                {isSuperAdmin && (
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onNavigate('admins');
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      style={{ marginRight: '8px', verticalAlign: 'middle' }}
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                    Manage Admins
                  </button>
                )}
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '4px 0' }}></div>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onBackToStore();
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    style={{ marginRight: '8px', verticalAlign: 'middle' }}
                  >
                    <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" />
                  </svg>
                  View Store
                </button>
                <button
                  className="danger"
                  onClick={() => {
                    setShowProfileMenu(false);
                    handleLogout();
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    style={{ marginRight: '8px', verticalAlign: 'middle' }}
                  >
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>

        <div className="admin-sidebar__footer">
          <button className="admin-sidebar__link" onClick={onBackToStore} title={isCollapsed ? 'View Store' : undefined}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" />
            </svg>
            <span>View Store</span>
          </button>
          <button className="admin-sidebar__link admin-sidebar__link--danger" onClick={handleLogout} title={isCollapsed ? 'Logout' : undefined}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            <span>Logout</span>
          </button>

          <div className="admin-server-health" title={`Server Latency: ${latencyMs ?? 24}ms`}>
            <div className={`health-pulse-dot ${serverStatus}`}></div>
            <span>
              Server{' '}
              {serverStatus === 'checking'
                ? 'Checking...'
                : serverStatus === 'online'
                ? `Online (${latencyMs ?? 24}ms)`
                : 'Offline'}
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main
        className={`admin-main ${isCollapsed ? 'admin-main--collapsed' : ''} relative z-10`}
        data-lenis-prevent="true"
      >
        {/* Sticky Topbar above Content */}
        <div className="admin-topbar">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="admin-topbar-toggle-btn"
              title={isCollapsed ? 'Expand navigation sidebar (Ctrl+B)' : 'Collapse navigation sidebar (Ctrl+B)'}
            >
              {isCollapsed ? (
                <>
                  <PanelLeftOpen className="w-4 h-4 text-brand-gold" />
                  <span className="hidden sm:inline">Expand Menu</span>
                </>
              ) : (
                <>
                  <PanelLeftClose className="w-4 h-4 text-brand-gold" />
                  <span className="hidden sm:inline">Collapse Menu</span>
                </>
              )}
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs text-brand-ivory/60 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold/60" />
              <span>Atelier Command</span>
              <span>/</span>
              <span className="capitalize text-brand-gold font-semibold">{currentRoute}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onBackToStore}
              className="text-xs text-brand-gold hover:text-white transition-colors flex items-center gap-1.5 font-medium px-2.5 py-1 rounded-lg bg-brand-gold/10 border border-brand-gold/20"
              title="View Customer Storefront"
            >
              <span>Storefront</span>
              <span className="text-[10px]">↗</span>
            </button>
            <div className="admin-server-health !mt-0 !pt-0">
              <div className={`health-pulse-dot ${serverStatus}`}></div>
              <span className="text-xs font-mono">
                {serverStatus === 'online' ? `${latencyMs ?? 24}ms` : 'Offline'}
              </span>
            </div>
          </div>
        </div>

        <div className="admin-main__content">{children}</div>
      </main>
    </div>
  );
};
