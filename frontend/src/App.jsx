import { useState, useEffect } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import About from './components/About';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import CartSidebar from './components/CartSidebar';
import ProfileDashboard from './admin/ProfileDashboard';
import ProductDetails from './components/ProductDetails';

// Admin Pages & Layouts
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import ProductManager from './admin/ProductManager';
import ProductEditor from './admin/ProductEditor';
import UserManager from './admin/UserManager';

function ToastContainer() {
  const { toasts, dismissToast } = useCart();

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast">
          <span className="toast-icon">🛒</span>
          <span className="toast-message">{toast.message}</span>
          <button className="toast-close" onClick={() => dismissToast(toast.id)} aria-label="Close notification">×</button>
        </div>
      ))}
    </div>
  );
}

function parseHashRoute() {
  const hash = window.location.hash;
  if (!hash || hash === '#/') return { path: '', id: null };
  
  const cleanHash = hash.replace(/^#\//, ''); // e.g. "admin/products/edit/123"
  
  if (cleanHash.startsWith('admin/products/edit/')) {
    const parts = cleanHash.split('/');
    const id = parts[parts.length - 1];
    return { path: 'admin/products/edit', id };
  }

  if (cleanHash.startsWith('product/')) {
    const parts = cleanHash.split('/');
    const id = parts[parts.length - 1];
    return { path: 'product', id: parseInt(id, 10) };
  }
  
  return { path: cleanHash, id: null };
}

function AppContent() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { isAdmin, isCustomerLoggedIn } = useAuth();
  const [route, setRoute] = useState(() => parseHashRoute());

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(parseHashRoute());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (path) => {
    window.location.hash = path ? `#/${path}` : '#/';
  };

  // Route Guard for admin portal
  useEffect(() => {
    if (!isAdmin && route.path.startsWith('admin') && route.path !== 'admin') {
      handleNavigate('admin');
    }
    if (isAdmin && route.path === 'admin') {
      handleNavigate('admin/dashboard');
    }
  }, [route.path, isAdmin]);

  // Handle open auth modal
  const openAuth = (tabName = 'login') => {
    setAuthTab(tabName);
    setIsAuthOpen(true);
  };

  // Render pages based on route
  if (route.path === 'admin') {
    return <AdminLogin onNavigate={handleNavigate} />;
  }

  if (route.path.startsWith('admin')) {
    if (!isAdmin) {
      return <AdminLogin onNavigate={handleNavigate} />;
    }

    let adminChild = null;
    if (route.path === 'admin/dashboard') {
      adminChild = <AdminDashboard onNavigate={handleNavigate} />;
    } else if (route.path === 'admin/products') {
      adminChild = <ProductManager onNavigate={handleNavigate} />;
    } else if (route.path === 'admin/products/new') {
      adminChild = <ProductEditor onNavigate={handleNavigate} />;
    } else if (route.path === 'admin/products/edit') {
      adminChild = <ProductEditor productId={route.id} onNavigate={handleNavigate} />;
    } else if (route.path === 'admin/users') {
      adminChild = <UserManager />;
    }

    return (
      <AdminLayout currentRoute={route.path} onNavigate={handleNavigate}>
        {adminChild}
      </AdminLayout>
    );
  }

  // Profile Route
  if (route.path === 'profile') {
    if (!isCustomerLoggedIn) {
      handleNavigate('');
      return null;
    }

    return (
      <div className="app">
        <Navbar
          onSignUpClick={() => openAuth('signup')}
          onCartClick={() => setIsCartOpen(true)}
          onNavigate={handleNavigate}
        />
        <main>
          <ProfileDashboard onNavigate={handleNavigate} />
        </main>
        <Footer onSignUpClick={() => openAuth('signup')} onNavigate={handleNavigate} />

        {/* Overlays */}
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} defaultTab={authTab} onNavigate={handleNavigate} />
        <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        <ToastContainer />
      </div>
    );
  }

  // Product Details Route
  if (route.path === 'product') {
    return (
      <div className="app">
        <Navbar
          onSignUpClick={() => openAuth('login')}
          onCartClick={() => setIsCartOpen(true)}
          onNavigate={handleNavigate}
        />
        <main>
          <ProductDetails productId={route.id} onNavigate={handleNavigate} />
        </main>
        <Footer onSignUpClick={() => openAuth('signup')} onNavigate={handleNavigate} />

        {/* Overlays */}
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} defaultTab={authTab} onNavigate={handleNavigate} />
        <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        <ToastContainer />
      </div>
    );
  }

  // Default: Storefront Home (Minimal if signed in)
  const showMinimal = isCustomerLoggedIn;
  return (
    <div className="app">
      <Navbar
        onSignUpClick={() => openAuth('login')}
        onCartClick={() => setIsCartOpen(true)}
        onNavigate={handleNavigate}
      />
      <main>
        {!showMinimal && <Hero onSignUpClick={() => openAuth('signup')} />}
        <ProductGrid onNavigate={handleNavigate} />
        {!showMinimal && <About />}
        {!showMinimal && <Testimonials />}
      </main>
      <Footer onSignUpClick={() => openAuth('signup')} onNavigate={handleNavigate} />

      {/* Overlays */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} defaultTab={authTab} onNavigate={handleNavigate} />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}
