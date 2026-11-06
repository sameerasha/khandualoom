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
import { MultiStepCheckoutView } from '@/components/checkout/MultiStepCheckoutView';
import { OrderSuccessView } from '@/components/checkout/OrderSuccessView';
import { OrderHistoryView } from '@/components/account/OrderHistoryView';
import { OAuth2RedirectHandler } from '@/components/auth/OAuth2RedirectHandler';

export const routeDefinitions: RouteObject[] = [
  {
    path: '/oauth2/redirect',
    element: <OAuth2RedirectHandler />,
  },
  {
    path: '/admin/*',
    element: <AdminDashboard onBackToStore={() => { window.location.href = '/'; }} />,
  },
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
      { path: 'account/orders', element: <OrderHistoryView /> },
      { path: 'account/*', element: <ProfileDashboard onBackToStore={() => window.history.back()} /> },
    ],
  },
  {
    path: '/checkout',
    element: <CheckoutLayout />,
    children: [
      { index: true, element: <MultiStepCheckoutView /> },
      { path: 'success/:orderId', element: <OrderSuccessView /> },
    ],
  },
];

export const router = createBrowserRouter(routeDefinitions);
