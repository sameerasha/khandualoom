import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { CouponsCorner } from './CouponsCorner';
import { TrustAndOfferStrip } from './TrustAndOfferStrip';

describe('Homepage Promotions & Coupons', () => {
  it('renders trust pillars and bank instant offers', () => {
    render(<TrustAndOfferStrip />);
    expect(screen.getByText(/100% HANDLOOM CERTIFIED/i)).toBeInTheDocument();
    expect(screen.getByText(/GI TAG AUTHENTICATED/i)).toBeInTheDocument();
    expect(screen.getAllByText(/10% INSTANT DISCOUNT/i).length).toBeGreaterThan(0);
  });

  it('allows one-click copying and applying coupon code', () => {
    render(
      <Provider store={store}>
        <CouponsCorner />
      </Provider>
    );
    const copyButton = screen.getByRole('button', { name: /KHANDUA500/i });
    expect(copyButton).toBeInTheDocument();
    fireEvent.click(copyButton);
    expect(screen.getByText(/APPLIED/i)).toBeInTheDocument();
  });
});
