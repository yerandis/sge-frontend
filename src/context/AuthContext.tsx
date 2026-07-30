import {
  createContext, useContext, useState, useEffect, useCallback,
  type ReactNode
} from 'react';
import type { AuthUser } from '../types/auth.types';
import type { LoginCredentials } from '../types/auth.types';
import {
  login as loginService,
  logout as logoutService,
  getSavedUser,
  isSessionActive,
} from '../services/authService';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: 'ADMIN' | 'USER' | 'VIEWER') => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

/**
 * AuthProvider: envuelve la aplicación y provee el estado de autenticación.
 *
 * 🔄 Comparación Spring: es como un @Bean Singleton que guarda el usuario
 * autenticado y lo expone a toda la aplicación.
 * Cualquier componente puede "inyectarlo" con useAuth().
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Al montar: verificar si hay sesión guardada
  useEffect(() => {
    if (isSessionActive()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(getSavedUser());
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const response = await loginService(credentials);
    setUser(response.user);
  }, []);

  const logout = useCallback(async () => {
    await logoutService();
    setUser(null);
  }, []);

  const hasRole = useCallback((role: 'ADMIN' | 'USER' | 'VIEWER') => {
    if (!user) return false;
    const hierarchy = { ADMIN: 3, USER: 2, VIEWER: 1 };
    return hierarchy[user.role] >= hierarchy[role];
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      logout,
      hasRole,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth: hook para consumir el contexto en cualquier componente.
 * Lanza error si se usa fuera del AuthProvider.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  }
  return context;
}