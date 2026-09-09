import apiClient from './axiosConfig';
import type { User, UserFormData, UserFilters } from '../types/user.types';
import type { PageResponse, ApiResponse } from '../types/employee.types';

function buildParams(filters: UserFilters): Record<string, string | number> {
  const params: Record<string, string | number> = {
    page:    filters.page,
    size:    filters.size,
    sortBy:  filters.sortBy,
    sortDir: filters.sortDir,
  };
  if (filters.search?.trim()) params.search = filters.search.trim();
  return params;
}

export async function getUsers(filters: UserFilters): Promise<PageResponse<User>> {
  const res = await apiClient.get<ApiResponse<PageResponse<User>>>(
    '/users', { params: buildParams(filters) }
  );
  return res.data.data;
}

export async function getUserById(id: string): Promise<User> {
  const res = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
  return res.data.data;
}

export async function createUser(data: UserFormData): Promise<User> {
  const res = await apiClient.post<ApiResponse<User>>('/users', data);
  return res.data.data;
}

export async function updateUser(id: string, data: UserFormData): Promise<User> {
  const res = await apiClient.put<ApiResponse<User>>(`/users/${id}`, data);
  return res.data.data;
}

export async function deleteUser(id: string): Promise<void> {
  await apiClient.delete(`/users/${id}`);
}

export async function toggleUserActive(id: string): Promise<User> {
  const res = await apiClient.patch<ApiResponse<User>>(`/users/${id}/toggle-active`);
  return res.data.data;
}