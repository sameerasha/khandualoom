import { render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { routeDefinitions } from '@/app/routes';

describe('Route Navigation & Layouts', () => {
  it('renders StoreLayout with header and footer on root path /', () => {
    const router = createMemoryRouter(routeDefinitions, { initialEntries: ['/'] });
    render(
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    );
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('renders CheckoutLayout with minimal stepper header on /checkout', () => {
    const router = createMemoryRouter(routeDefinitions, { initialEntries: ['/checkout'] });
    render(
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    );
    expect(screen.getByText(/100% SECURE/i)).toBeInTheDocument();
  });

  it('renders Admin Vault gate on /admin path', () => {
    const router = createMemoryRouter(routeDefinitions, { initialEntries: ['/admin'] });
    render(
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    );
    expect(screen.getByText(/Khandua Looms Vault/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Unlock Admin Atelier/i })).toBeInTheDocument();
  });
});
