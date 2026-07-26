import { useState, useEffect } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import About from './components/About';
import Testimonials from './components/Testimonials';
import RecentViews from './components/RecentViews';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import CartSidebar from './components/CartSidebar';
import ContactPage from './components/ContactPage';
import ProfileDashboard from './admin/ProfileDashboard';
import ProductDetails from './components/ProductDetails';
import OAuth2RedirectHandler from './components/OAuth2RedirectHandler';
import Checkout from './components/Checkout';

// Admin Pages & Layouts
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import ProductManager from './admin/ProductManager';
import ProductEditor from './admin/ProductEditor';
import UserManager from './admin/UserManager';
import StoreSettings from './admin/StoreSettings';
import OrderManager from './admin/OrderManager';
import AdminManager from './admin/AdminManager';

function ToastContainer() {
  const { toasts, dismissToast } = useCart();

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast--${toast.type || 'success'}`}>
          <span className="toast-icon">{toast.type === 'error' ? '⚠️' : '🛒'}</span>
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
  
  if (cleanHash === 'checkout') {
    return { path: 'checkout', id: null };
  }
  
  return { path: cleanHash, id: null };
}

function AppContent() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login');
  const { isCartOpen, setIsCartOpen } = useCart();
  const { isAdmin, isSuperAdmin, isCustomerLoggedIn } = useAuth();
  const [route, setRoute] = useState(() => parseHashRoute());

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(parseHashRoute());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (path, replace = false) => {
    if (replace) {
      window.location.replace(window.location.pathname + window.location.search + (path ? `#/${path}` : '#/'));
    } else {
      window.location.hash = path ? `#/${path}` : '#/';
    }
  };

  // Route Guard for admin portal & expired customer sessions
  useEffect(() => {
    if (!isAdmin && route.path.startsWith('admin') && route.path !== 'admin') {
      handleNavigate('admin', true);
    }
    if (isAdmin && route.path === 'admin') {
      handleNavigate('admin/dashboard', true);
    }
    if ((route.path === 'profile' || route.path === 'checkout') && !isCustomerLoggedIn) {
      handleNavigate('', true);
    }
  }, [route.path, isAdmin, isCustomerLoggedIn]);

  // Handle open auth modal
  const openAuth = (tabName = 'login') => {
    setAuthTab(tabName);
    setIsAuthOpen(true);
  };

  useEffect(() => {
    const handleForceSignup = () => {
      openAuth('signup');
    };
    const handleForceLogin = () => {
      openAuth('login');
    };
    window.addEventListener('force-signup', handleForceSignup);
    window.addEventListener('force-login', handleForceLogin);
    return () => {
      window.removeEventListener('force-signup', handleForceSignup);
      window.removeEventListener('force-login', handleForceLogin);
    };
  }, []);

  useEffect(() => {
    if (isCustomerLoggedIn) {
      const redirectTarget = sessionStorage.getItem('redirectAfterAuth');
      if (redirectTarget) {
        sessionStorage.removeItem('redirectAfterAuth');
        handleNavigate(redirectTarget, true);
      }
    }
  }, [isCustomerLoggedIn]);

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    if (!isCustomerLoggedIn) {
      sessionStorage.setItem('redirectAfterAuth', 'checkout');
      openAuth('login');
    } else {
      handleNavigate('checkout');
    }
  };

  // Check for OAuth2 Redirect via pathname (since backend redirects normally, not via hash)
  if (window.location.pathname.startsWith('/oauth2/redirect')) {
    return <OAuth2RedirectHandler />;
  }

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
    } else if (route.path === 'admin/settings') {
      adminChild = <StoreSettings />;
    } else if (route.path === 'admin/orders') {
      adminChild = <OrderManager onNavigate={handleNavigate} />;
    } else if (route.path === 'admin/admins') {
      if (isSuperAdmin) {
        adminChild = <AdminManager />;
      } else {
        adminChild = <AdminDashboard onNavigate={handleNavigate} />;
      }
    }

    return (
      <>
        <AdminLayout currentRoute={route.path} onNavigate={handleNavigate}>
          {adminChild}
        </AdminLayout>
        <ToastContainer />
      </>
    );
  }

  // Profile Route
  if (route.path === 'profile') {
    if (!isCustomerLoggedIn) {
      return null;
    }

    return (
      <div className="app">
        <Navbar
          onSignUpClick={() => openAuth('signup')}
          onCartClick={() => setIsCartOpen(true)}
          onContactClick={() => handleNavigate('contact')}
          onNavigate={handleNavigate}
          currentRoute={route.path}
        />
        <main>
          <ProfileDashboard onNavigate={handleNavigate} />
        </main>
        <Footer onContactClick={() => handleNavigate('contact')} onSignUpClick={() => openAuth('signup')} onNavigate={handleNavigate} />

        {/* Overlays */}
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} defaultTab={authTab} onNavigate={handleNavigate} />
        <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onCheckout={handleCheckoutClick} />
        <ToastContainer />
      </div>
    );
  }

  // Checkout Route
  if (route.path === 'checkout') {
    if (!isCustomerLoggedIn) {
      return null;
    }

    return (
      <div className="app">
        <Navbar
          onSignUpClick={() => openAuth('signup')}
          onCartClick={() => setIsCartOpen(true)}
          onContactClick={() => handleNavigate('contact')}
          onNavigate={handleNavigate}
          currentRoute={route.path}
        />
        <main>
          <Checkout onNavigate={handleNavigate} />
        </main>
        <Footer onContactClick={() => handleNavigate('contact')} onSignUpClick={() => openAuth('signup')} onNavigate={handleNavigate} />

        {/* Overlays */}
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} defaultTab={authTab} onNavigate={handleNavigate} />
        <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onCheckout={handleCheckoutClick} />
        <ToastContainer />
      </div>
    );
  }

  // Product Details Route
  if (route.path === 'product') {
    return (
      <div className="app">
        <Navbar 
          onSignUpClick={() => openAuth('signup')}
          onContactClick={() => handleNavigate('contact')}
          onCartClick={() => setIsCartOpen(true)}
          onNavigate={handleNavigate}
          currentRoute={route.path}
        />
        <main>
          <ProductDetails productId={route.id} onNavigate={handleNavigate} onCheckout={handleCheckoutClick} />
        </main>
        <Footer onContactClick={() => handleNavigate('contact')} onSignUpClick={() => openAuth('signup')} onNavigate={handleNavigate} />

        {/* Overlays */}
        <AuthModal 
          isOpen={isAuthOpen} 
          onClose={() => setIsAuthOpen(false)} 
          defaultTab={authTab} 
          onNavigate={handleNavigate} 
        />
        <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onCheckout={handleCheckoutClick} />
        <ToastContainer />
      </div>
    );
  }

  // Contact Route
  if (route.path === 'contact') {
    return (
      <div className="app">
        <Navbar 
          onSignUpClick={() => openAuth('signup')}
          onContactClick={() => handleNavigate('contact')}
          onCartClick={() => setIsCartOpen(true)}
          onNavigate={handleNavigate}
          currentRoute={route.path}
        />
        <main>
          <ContactPage />
        </main>
        <Footer onContactClick={() => handleNavigate('contact')} onSignUpClick={() => openAuth('signup')} onNavigate={handleNavigate} />

        {/* Overlays */}
        <AuthModal 
          isOpen={isAuthOpen} 
          onClose={() => setIsAuthOpen(false)} 
          defaultTab={authTab} 
          onNavigate={handleNavigate} 
        />
        <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onCheckout={handleCheckoutClick} />
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
        onContactClick={() => handleNavigate('contact')}
        onNavigate={handleNavigate}
        currentRoute={route.path}
      />
      <main className={showMinimal ? "main-minimal" : ""}>
        {!showMinimal && <Hero onSignUpClick={() => openAuth('signup')} />}
        <ProductGrid onNavigate={handleNavigate} />
        {!showMinimal && <About />}
        {!showMinimal && <Testimonials />}
        <RecentViews onNavigate={handleNavigate} />
      </main>
      <Footer onContactClick={() => handleNavigate('contact')} onSignUpClick={() => openAuth('signup')} onNavigate={handleNavigate} />

      {/* Overlays */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} defaultTab={authTab} onNavigate={handleNavigate} />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onCheckout={handleCheckoutClick} />
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
