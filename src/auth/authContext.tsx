import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { User } from './types';
import * as authService from './authService';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isAuthReady: boolean;
  login: (email: string, password: string) => User;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const session = authService.getValidSession();
    if (session) {
      setUser(session.user);
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
    setIsAuthReady(true);
  }, []);

  const login = (email: string, password: string) => {
    const { user: loggedUser } = authService.login(email, password);
    setUser(loggedUser);
    setIsAuthenticated(true);
    setIsAuthReady(true);
    return loggedUser;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setIsAuthReady(true);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      isAuthReady,
      login,
      logout
    }),
    [user, isAuthenticated, isAuthReady]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
