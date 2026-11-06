import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import { ThemeContextValue } from './theme.types';
import { DEFAULT_THEME } from './theme.config';

const fallbackThemeValue: ThemeContextValue = {
  theme: DEFAULT_THEME,
  isDark: DEFAULT_THEME === 'dark',
  setTheme: () => {},
  toggleTheme: () => {},
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  return context || fallbackThemeValue;
};
