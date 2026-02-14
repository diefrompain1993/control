import { useEffect } from 'react';
import { useAuth } from './authContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  onRedirect?: (path: string) => void;
}

export function ProtectedRoute({ children, onRedirect }: ProtectedRouteProps) {
  const { isAuthenticated, isAuthReady } = useAuth();

  useEffect(() => {
    if (isAuthReady && !isAuthenticated && onRedirect) {
      onRedirect('/login');
    }
  }, [isAuthReady, isAuthenticated, onRedirect]);

  if (!isAuthReady) return null;
  if (!isAuthenticated) return null;

  return <>{children}</>;
}
