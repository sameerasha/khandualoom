import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { HomepageBuilderView } from './HomepageBuilderView';

describe('Homepage Builder & Section Manager', () => {
  it('renders all configurable sections with reorder controls and preview trigger', () => {
    render(
      <Provider store={store}>
        <HomepageBuilderView />
      </Provider>
    );
    expect(screen.getByRole('heading', { name: /Homepage Visual Builder/i })).toBeInTheDocument();
    expect(screen.getByText(/Hero Promotional Banner/i)).toBeInTheDocument();
    expect(screen.getByText(/Coupons Corner/i)).toBeInTheDocument();
    expect(screen.getByText(/Live Preview/i)).toBeInTheDocument();
  });
});
