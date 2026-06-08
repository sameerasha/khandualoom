import { useState } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import About from './components/About';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import SignUpModal from './components/SignUpModal';
import CartSidebar from './components/CartSidebar';

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

function AppContent() {
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="app">
      <Navbar
        onSignUpClick={() => setIsSignUpOpen(true)}
        onCartClick={() => setIsCartOpen(true)}
      />
      <main>
        <Hero onSignUpClick={() => setIsSignUpOpen(true)} />
        <ProductGrid />
        <About />
        <Testimonials />
      </main>
      <Footer onSignUpClick={() => setIsSignUpOpen(true)} />

      {/* Overlays */}
      <SignUpModal isOpen={isSignUpOpen} onClose={() => setIsSignUpOpen(false)} />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
