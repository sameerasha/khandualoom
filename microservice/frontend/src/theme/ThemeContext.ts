import { createContext } from 'react';
import { ThemeContextValue } from './theme.types';

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
