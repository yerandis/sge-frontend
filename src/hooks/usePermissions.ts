import { useAuth } from '../context/AuthContext';

export function usePermissions() {
  const { user } = useAuth();
  const permissions = user?.permissions ?? [];

  function can(permission: string): boolean {
    return permissions.includes(permission);
  }

  function canAny(...perms: string[]): boolean {
    return perms.some(p => permissions.includes(p));
  }

  return { can, canAny, permissions };
}