import { useAuth } from '../context/AuthContext';
import './AdminLayout.css';

export default function AdminLayout({ children, currentRoute, onNavigate }) {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    onNavigate('');
  };

  const navItems = [
    { id: 'admin/dashboard', label: 'Dashboard', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></svg>
    )},
    { id: 'admin/products', label: 'Products', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>
    )},
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__header">
          <button className="admin-sidebar__logo" onClick={() => onNavigate('admin/dashboard')}>
            <span className="admin-sidebar__logo-icon">✦</span>
            <div className="admin-sidebar__logo-text">
              <span className="admin-sidebar__logo-main">Vastra Loom</span>
              <span className="admin-sidebar__logo-sub">Admin Panel</span>
            </div>
          </button>
        </div>

        <nav className="admin-sidebar__nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`admin-sidebar__link ${currentRoute === item.id ? 'admin-sidebar__link--active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <button className="admin-sidebar__link" onClick={() => onNavigate('')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" /></svg>
            <span>View Store</span>
          </button>
          <button className="admin-sidebar__link admin-sidebar__link--danger" onClick={handleLogout}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" /></svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <div className="admin-main__content">
          {children}
        </div>
      </main>
    </div>
  );
}
