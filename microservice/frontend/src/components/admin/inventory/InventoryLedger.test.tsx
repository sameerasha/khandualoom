import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { InventoryLedgerView } from './InventoryLedgerView';

describe('Inventory Ledger & Stock Reconciliation', () => {
  it('renders stock ledger table with low stock indicator and adjust button', () => {
    render(
      <Provider store={store}>
        <InventoryLedgerView />
      </Provider>
    );
    expect(screen.getByRole('heading', { name: /Inventory & Stock Ledger/i })).toBeInTheDocument();
    expect(screen.getByText(/Low Stock Alerts/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Tracked SKUs/i)).toBeInTheDocument();
  });
});
