import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // 1. Preferencia guardada
    const saved = localStorage.getItem('sge_theme') as Theme | null;
    if (saved) return saved;

    // 2. Preferencia del sistema operativo
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';

    // 3. Default: light
    return 'light';
  });

  useEffect(() => {
    // Aplicar clase al elemento raíz
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

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme fuera de ThemeProvider');
  return ctx;
}