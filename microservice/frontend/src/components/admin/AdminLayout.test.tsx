import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { store } from '@/app/store';
import { AdminLayout } from './AdminLayout';

describe('Admin Layout & Navigation Frame', () => {
  it('renders command header with store link and collapsible sidebar', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/admin']}>
          <AdminLayout currentRoute="dashboard" onNavigate={() => {}} onBackToStore={() => {}}>
            <div>Admin Content</div>
          </AdminLayout>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getAllByText(/Khandua Looms/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Dashboard/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Admin Content/i)).toBeInTheDocument();
    expect(screen.getByText(/Back to Store/i)).toBeInTheDocument();
  });
});
