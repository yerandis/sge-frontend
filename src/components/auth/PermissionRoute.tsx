import { Navigate, Outlet } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';

export default function PermissionRoute({ permission }: { permission: string }) {
  const { can } = usePermissions();
  return can(permission) ? <Outlet /> : <Navigate to="/dashboard" replace />;
}