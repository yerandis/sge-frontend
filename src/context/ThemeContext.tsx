
import { createContext, useState, useEffect, type ReactNode } from 'react';

type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme:       Theme;
  toggleTheme: () => void;
  isDark:      boolean;
}

// Exportamos el contexto para que el hook separado lo consuma
export const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // 1. Preferencia guardada en localStorage
    const saved = localStorage.getItem('sge_theme') as Theme | null;
    if (saved) return saved;

    // 2. Preferencia del sistema operativo
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';

    // 3. Default
    return 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sge_theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
}