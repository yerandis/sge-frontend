import apiClient from './axiosConfig';
import type {
  Employee,
  EmployeeFormData,
  EmployeeFilters,
  PageResponse,
  ApiResponse,
  DashboardStats,
} from '../types/employee.types';

/**
 * Capa de servicios: toda la comunicación con la API de empleados.
 *
 * 🔄 Comparación Spring Boot:
 * Este archivo es el equivalente de un @Service en Java.
 * Encapsula la lógica de comunicación con el backend.
 * Los componentes (Pages, Components) NO llaman a axios directamente.
 * Solo llaman a funciones de este servicio.
 *
 * Razón: si cambia la URL de la API o la estructura de la respuesta,
 * solo cambiamos este archivo, no todos los componentes.
 */

/**
 * Convierte los filtros a query parameters de la URL.
 * Omite los valores vacíos para no enviarlos al backend.
 */
function buildParams(filters: EmployeeFilters): Record<string, string | number> {
  const params: Record<string, string | number> = {
    page: filters.page,
    size: filters.size,
    sortBy: filters.sortBy,
    sortDir: filters.sortDir,
  };

  if (filters.search && filters.search.trim() !== '') {
    params.search = filters.search.trim();
  }
  if (filters.status && filters.status.trim() !== '') {
    params.status = filters.status;
  }
  if (filters.departmentId && filters.departmentId !== '') {
    params.departmentId = filters.departmentId;
  }

  return params;
}

/**
 * Obtener lista paginada de empleados con filtros opcionales.
 *
 * async/await: maneja las Promesas de Axios de forma sincrónica y legible.
 * 🔄 Comparación Java: como un método que devuelve un Future<PageResponse<Employee>>
 */
export async function getEmployees(filters: EmployeeFilters
): Promise<PageResponse<Employee>> {
  const params = buildParams(filters);
  const response = await apiClient.get<ApiResponse<PageResponse<Employee>>>(
    '/employees',
    { params }
  );
  // El backend envuelve todo en ApiResponse. Extraemos solo el 'data'.
  return response.data.data;
}

/**
 * Obtener un empleado por ID.
 */
export async function getEmployeeById(id: string): Promise<Employee> {
  //  bucar como convertir el id: string en id: UUID para poder enviarlo a la api

  console.log({ id}); 
  const response = await apiClient.get<ApiResponse<Employee>>(`/employees/${id}`);
  return response.data.data;
}

/**
 * Crear un nuevo empleado.
 * Devuelve el empleado creado (con su ID asignado por la BD).
 */
export async function createEmployee(data: EmployeeFormData): Promise<Employee> {
  const response = await apiClient.post<ApiResponse<Employee>>('/employees', data);
  return response.data.data;
}

/**
 * Actualizar un empleado existente.
 */
export async function updateEmployee(id: string, data: EmployeeFormData): Promise<Employee> {
  const response = await apiClient.put<ApiResponse<Employee>>(
    `/employees/${id}`,
    data
  );
  return response.data.data;
}

/**
 * Eliminar un empleado.
 * El backend devuelve 204 No Content (sin body).
 */
export async function deleteEmployee(id: string): Promise<void> {
  await apiClient.delete(`/employees/${id}`);
}

/**
 * Obtener estadísticas del dashboard.
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await apiClient.get<ApiResponse<DashboardStats>>(
    '/employees/dashboard/stats'
  );
  return response.data.data;
}