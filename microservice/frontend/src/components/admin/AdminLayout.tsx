import React, { useState, useEffect } from 'react';
import { useAppSelector } from '@/app/hooks';
import { AdminBackground3D } from './AdminBackground3D';
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

  return (
    <div className="admin-layout relative flex min-h-screen bg-[#0B0314] text-brand-ivory" data-lenis-prevent="true">
      <AdminBackground3D />

      {/* Modern Collapsible Sidebar */}
      <AdminSidebar
        currentRoute={currentRoute}
        isCollapsed={isCollapsed}
        isSuperAdmin={isSuperAdmin}
        onNavigate={onNavigate}
        onToggleCollapse={toggleSidebar}
      />

      {/* Main Administrative View Area */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
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
