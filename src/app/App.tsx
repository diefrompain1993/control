import { Sidebar } from '@/app/components/sidebar';
import { Header } from '@/app/components/header';
import { Dashboard } from '@/app/pages/dashboard';
import { EventsLog } from '@/app/pages/events-log';
import { WhiteList } from '@/app/pages/white-list';
import { BlackList } from '@/app/pages/black-list';
import { Contractors } from '@/app/pages/contractors';
import { Vehicles } from '@/app/pages/vehicles';
import { Users } from '@/app/pages/users';
import { Settings } from '@/app/pages/settings';
import { AuditLog } from '@/app/pages/audit-log';
import { ExportData } from '@/app/pages/export-data';
import { LoginPage } from '@/app/pages/login';
import { AuthProvider, useAuth } from '@/auth/authContext';
import { ProtectedRoute } from '@/auth/ProtectedRoute';
import { RequireRole } from '@/auth/RequireRole';
import {
  DEFAULT_ROUTE_BY_ROLE,
  ROUTE_CONFIG,
  getRoutePath,
  resolveRouteId,
  type RouteId
} from '@/app/routesConfig';
import { useCallback, useEffect, useMemo, useState } from 'react';

function AppShell() {
  const { user, isAuthenticated, isAuthReady, logout } = useAuth();
  const [currentPath, setCurrentPath] = useState(() => {
    const initial = window.location.pathname + window.location.search + window.location.hash;
    return initial || '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      const nextPath = window.location.pathname + window.location.search + window.location.hash;
      setCurrentPath(nextPath || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((path: string, options?: { replace?: boolean }) => {
    const nextPath = path || '/';
    if (options?.replace) {
      window.history.replaceState({}, '', nextPath);
    } else {
      window.history.pushState({}, '', nextPath);
    }
    setCurrentPath(nextPath);
  }, []);

  const normalizedPath = useMemo(() => currentPath.split(/[?#]/)[0], [currentPath]);
  const resolvedRouteId = useMemo(() => resolveRouteId(normalizedPath), [normalizedPath]);
  const defaultRouteId = user ? DEFAULT_ROUTE_BY_ROLE[user.role] : 'dashboard';
  const activeRouteId = resolvedRouteId ?? defaultRouteId;

  useEffect(() => {
    if (normalizedPath !== '/login' && resolvedRouteId === null) {
      navigate(getRoutePath(defaultRouteId), { replace: true });
    }
  }, [normalizedPath, defaultRouteId, navigate, resolvedRouteId]);

  useEffect(() => {
    if (isAuthReady && isAuthenticated && normalizedPath === '/login') {
      navigate(getRoutePath(defaultRouteId), { replace: true });
    }
  }, [normalizedPath, defaultRouteId, isAuthenticated, isAuthReady, navigate]);

  const handleNavigate = useCallback(
    (routeId: RouteId) => {
      navigate(getRoutePath(routeId));
    },
    [navigate]
  );

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login', { replace: true });
  }, [logout, navigate]);

  if (normalizedPath === '/login') {
    return (
      <LoginPage
        onSuccess={(loggedUser) => {
          navigate(getRoutePath(DEFAULT_ROUTE_BY_ROLE[loggedUser.role]), { replace: true });
        }}
      />
    );
  }

  const renderPage = () => {
    switch (activeRouteId) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'events':
        return <EventsLog />;
      case 'white-list':
        return <WhiteList />;
      case 'black-list':
        return <BlackList />;
      case 'contractors':
        return <Contractors />;
      case 'vehicles':
        return <Vehicles />;
      case 'users':
        return <Users />;
      case 'settings':
        return <Settings />;
      case 'audit':
        return <AuditLog />;
      case 'export':
        return <ExportData />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <ProtectedRoute onRedirect={(path) => navigate(path, { replace: true })}>
      <div className="h-screen w-screen flex bg-background overflow-hidden">
        <Sidebar activePage={activeRouteId} onNavigate={handleNavigate} />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header user={user} onLogout={handleLogout} />

          <main className="flex-1 overflow-y-scroll p-8">
            <RequireRole roles={ROUTE_CONFIG[activeRouteId].roles}>{renderPage()}</RequireRole>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
