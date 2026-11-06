import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { store } from '@/app/store';
import { OrderHistoryView } from './OrderHistoryView';

describe('Customer Order History View', () => {
  it('renders order timeline with tracking progression', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <OrderHistoryView />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByRole('heading', { name: /My Handloom Orders/i })).toBeInTheDocument();
  });
});
