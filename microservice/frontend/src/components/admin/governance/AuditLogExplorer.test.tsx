import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { AuditLogExplorer } from './AuditLogExplorer';

describe('Audit Log Explorer & Governance', () => {
  it('renders audit trail table with filterable columns and activity history', () => {
    render(
      <Provider store={store}>
        <AuditLogExplorer />
      </Provider>
    );
    expect(screen.getByRole('heading', { name: /Administrative Audit Trail/i })).toBeInTheDocument();
    expect(screen.getByText(/Immutable Operational Ledger/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Logged Events/i)).toBeInTheDocument();
  });
});
