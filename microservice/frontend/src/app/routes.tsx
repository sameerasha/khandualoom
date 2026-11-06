import React from 'react';
import { RouteObject, createBrowserRouter } from 'react-router-dom';
import { StoreLayout } from '@/components/layout/StoreLayout';
import { CheckoutLayout } from '@/components/layout/CheckoutLayout';
import { ContactPage } from '@/components/common/ContactPage';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { ProfileDashboard } from '@/components/profile/ProfileDashboard';
import { HomepageView } from '@/components/home/HomepageView';
import { CatalogView } from '@/components/catalog/CatalogView';
import { ProductDetailsView } from '@/components/product/ProductDetailsView';
import { ShoppingBagView } from '@/components/cart/ShoppingBagView';

// Placeholder / interim components until tasks 2-7 complete their views
const HomePlaceholder: React.FC = () => (
  <div className="py-12 px-4 max-w-7xl mx-auto">
    <h1 className="text-3xl font-serif text-brand-gold">Khandua Looms Heritage Storefront</h1>
    <p className="text-brand-ivory/70 mt-2">Authenticated GI-Tagged Odisha Handlooms</p>
  </div>
);

const CatalogPlaceholder: React.FC = () => (
  <div className="py-12 px-4 max-w-7xl mx-auto">
    <h1 className="text-3xl font-serif text-brand-gold">Handloom Sarees Collection</h1>
  </div>
);

const ProductDetailsPlaceholder: React.FC = () => (
  <div className="py-12 px-4 max-w-7xl mx-auto">
    <h1 className="text-3xl font-serif text-brand-gold">Saree Details</h1>
  </div>
);

const CartPlaceholder: React.FC = () => (
  <div className="py-12 px-4 max-w-7xl mx-auto">
    <h1 className="text-3xl font-serif text-brand-gold">Shopping Bag</h1>
  </div>
);

const CheckoutPlaceholder: React.FC = () => (
  <div className="py-12 px-4 max-w-7xl mx-auto">
    <h1 className="text-3xl font-serif text-brand-gold">Secure Checkout</h1>
  </div>
);

export const routeDefinitions: RouteObject[] = [
  {
    path: '/',
    element: <StoreLayout />,
    children: [
      { index: true, element: <HomepageView /> },
      { path: 'catalog', element: <CatalogView /> },
      { path: 'collections/:category', element: <CatalogView /> },
      { path: 'products/:id', element: <ProductDetailsView /> },
      { path: 'cart', element: <ShoppingBagView /> },
      { path: 'contact', element: <ContactPage onBackToStore={() => window.history.back()} /> },
      { path: 'account/*', element: <ProfileDashboard onBackToStore={() => window.history.back()} /> },
      { path: 'admin/*', element: <AdminDashboard onBackToStore={() => window.history.back()} /> },
    ],
  },
  {
    path: '/checkout',
    element: <CheckoutLayout />,
    children: [
      { index: true, element: <CheckoutPlaceholder /> },
      { path: 'success/:orderId', element: <div className="py-12 text-center text-brand-gold font-serif text-2xl">Order Placed Successfully</div> },
    ],
  },
];

export const router = createBrowserRouter(routeDefinitions);
