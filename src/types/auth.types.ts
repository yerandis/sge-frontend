export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthUser {
  id:            string;
  username:      string;
  email:         string;
  fullName:      string;
  roles:         string[];
  permissions:   string[]; 
  // tenantId:    string | null;
  // isMasterAdmin: boolean;
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