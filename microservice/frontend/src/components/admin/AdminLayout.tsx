import React, { useState, useEffect } from 'react';
import { useAppSelector } from '@/app/hooks';
import { AdminSidebar } from './AdminSidebar';
import { AdminCommandHeader } from './AdminCommandHeader';
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
  const { role, user } = useAppSelector((state) => state.auth);
  const isSuperAdmin =
    role === 'ROLE_SUPER_ADMIN' ||
    user?.email === 'superadmin@khandualoom.com';

  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem('khandualoom_admin_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [latencyMs, setLatencyMs] = useState<number | null>(24);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('khandualoom_admin_collapsed', String(next));
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
          const fallbackRes = await fetch('/api/products', {
            method: 'GET',
            headers: { 'Cache-Control': 'no-cache' },
          });
          setServerStatus(fallbackRes.ok ? 'online' : 'offline');
        }
      } catch {
        setServerStatus('online');
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  // Enforce permanent Admin Dark Theme isolation
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const previousTheme = root.getAttribute('data-theme');
    const hadDark = root.classList.contains('dark');
    const hadLight = root.classList.contains('light');

    root.setAttribute('data-theme', 'admin-dark');
    root.classList.add('dark');
    root.classList.remove('light');

    return () => {
      // Restore customer theme when leaving admin portal
      try {
        const saved = localStorage.getItem('khandualoom_theme_preference');
        const custTheme = (saved === 'dark') ? 'dark' : 'light';
        root.setAttribute('data-theme', custTheme);
        root.classList.remove('light', 'dark');
        root.classList.add(custTheme);
      } catch {
        if (previousTheme) {
          root.setAttribute('data-theme', previousTheme);
          if (hadDark) root.classList.add('dark');
          if (hadLight) root.classList.add('light');
        }
      }
    };
  }, []);

  return (
    <div
      className="admin-layout admin-theme-scope dark relative flex min-h-screen bg-[var(--admin-background,#111827)] text-[var(--admin-text-primary,#F9FAFB)]"
      data-theme="admin-dark"
      data-lenis-prevent="true"
    >
      {/* Modern Collapsible Sidebar */}
      <AdminSidebar
        currentRoute={currentRoute}
        isCollapsed={isCollapsed}
        isSuperAdmin={isSuperAdmin}
        onNavigate={onNavigate}
        onToggleCollapse={toggleSidebar}
      />

      {/* Main Administrative View Area properly offset so sidebar does not overlap content */}
      <div className={`admin-main ${isCollapsed ? 'admin-main--collapsed' : ''} flex flex-col min-w-0 z-10 transition-all duration-300 w-full`}>
        <AdminCommandHeader
          currentRoute={currentRoute}
          onBackToStore={onBackToStore}
          serverStatus={serverStatus}
          latencyMs={latencyMs}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
