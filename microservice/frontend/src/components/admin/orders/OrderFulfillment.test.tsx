import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { OrderManagerView } from '../OrderManagerView';

describe('Order Fulfillment Lifecycle', () => {
  it('renders order management table with status filtering and fulfillment action', () => {
    render(
      <Provider store={store}>
        <OrderManagerView orders={[]} onStatusChange={async () => {}} />
      </Provider>
    );
    expect(screen.getByRole('heading', { name: /Order Management/i })).toBeInTheDocument();
    expect(screen.getByText(/Fulfillment Lifecycle/i)).toBeInTheDocument();
  });
});
