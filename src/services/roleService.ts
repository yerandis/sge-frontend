import apiClient from './axiosConfig';
import type { Role, Permission, RoleFormData } from '../types/role.types';
import type { ApiResponse } from '../types/employee.types';

export async function getRoles(): Promise<Role[]> {
  const res = await apiClient.get<ApiResponse<Role[]>>('/roles');
  return res.data.data;
}

export async function getRoleById(id: string): Promise<Role> {
  const res = await apiClient.get<ApiResponse<Role>>(`/roles/${id}`);
  return res.data.data;
}

export async function createRole(data: RoleFormData): Promise<Role> {
  const res = await apiClient.post<ApiResponse<Role>>('/roles', data);
  return res.data.data;
}

export async function updateRole(id: string, data: RoleFormData): Promise<Role> {
  const res = await apiClient.put<ApiResponse<Role>>(`/roles/${id}`, data);
  return res.data.data;
}

export async function deleteRole(id: string): Promise<void> {
  await apiClient.delete(`/roles/${id}`);
}

export async function getAllPermissions(): Promise<Permission[]> {
  const res = await apiClient.get<ApiResponse<Permission[]>>('/roles/permissions');
  return res.data.data;
}

/**
 * Agrupa los permisos por módulo para la UI del selector.
 */
export function groupPermissionsByModule(permissions: Permission[]) {
  const groups = new Map<string, Permission[]>();

  permissions.forEach(p => {
    if (!groups.has(p.module)) groups.set(p.module, []);
    groups.get(p.module)!.push(p);
  });

  // Convertir a array ordenado por módulo
  return Array.from(groups.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([module, perms]) => ({ module, permissions: perms }));
}