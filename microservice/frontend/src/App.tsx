import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/app/routes';
import { ThemeProvider } from '@/theme/ThemeProvider';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
