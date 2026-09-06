
import { useContext } from 'react';
import { ThemeContext, type ThemeContextType } from '../context/ThemeContext';

export function useTheme(): ThemeContextType {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme debe usarse dentro de <ThemeProvider>');
  return ctx;
}