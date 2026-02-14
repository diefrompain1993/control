import { hasRole } from './roles';
import { useAuth } from './authContext';
import type { Role } from './types';

interface RequireRoleProps {
  roles: Role[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

function DefaultAccessDenied() {
  return (
    <div className="bg-white border border-border rounded-lg p-6">
      <h2 className="text-lg font-semibold text-foreground mb-2">Доступ запрещён</h2>
      <p className="text-sm text-muted-foreground">
        У вас нет прав для просмотра этой страницы.
      </p>
    </div>
  );
}

export function RequireRole({ roles, children, fallback }: RequireRoleProps) {
  const { user } = useAuth();

  if (!hasRole(user, roles)) {
    return <>{fallback ?? <DefaultAccessDenied />}</>;
  }

  return <>{children}</>;
}
