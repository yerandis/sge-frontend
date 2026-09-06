import type { Permission } from "./role.types";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthUser {
  id:          string;
  username:    string;
  email:       string;
  fullName:    string;
  tenantId:    string | null;
  isMasterAdmin: boolean;
  roles:       string[];        // ← Ahora lista de nombres de rol
  permissions: Permission[];    // ← los permisos granulares del usuario
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface AuthState {
  user: AuthUser | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}