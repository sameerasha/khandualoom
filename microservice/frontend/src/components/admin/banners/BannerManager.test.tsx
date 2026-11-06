import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { BannerManagerView } from './BannerManagerView';

describe('Banner & Content Studio', () => {
  it('renders banner placements and add banner button', () => {
    render(
      <Provider store={store}>
        <BannerManagerView />
      </Provider>
    );
    expect(screen.getByRole('heading', { name: /Banner & Promotional Studio/i })).toBeInTheDocument();
    expect(screen.getByText(/\+ Create New Banner/i)).toBeInTheDocument();
    expect(screen.getByText(/Hero Promotional/i)).toBeInTheDocument();
  });
});
