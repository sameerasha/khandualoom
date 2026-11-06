import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { CategoryManagerView } from './CategoryManagerView';

describe('Category & Navigation Hierarchy Manager', () => {
  it('renders category taxonomy tree and create root category action', () => {
    render(
      <Provider store={store}>
        <CategoryManagerView />
      </Provider>
    );
    expect(screen.getByRole('heading', { name: /Categories & Navigation/i })).toBeInTheDocument();
    expect(screen.getByText(/\+ Add Category/i)).toBeInTheDocument();
    expect(screen.getByText(/Khandua Silk Sarees/i)).toBeInTheDocument();
  });
});
