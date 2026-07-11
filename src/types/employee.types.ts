// ═══════════════════════════════════════════════════════════════
// TIPOS DEL SISTEMA DE GESTIÓN DE EMPLEADOS
// Estos tipos reflejan exactamente la estructura de datos
// que devuelve el backend (EmployeeResponse.java, etc.)
// ═══════════════════════════════════════════════════════════════

import type { ZodUUID } from "zod";

/**
 * Los dos posibles estados de un empleado.
 * Coincide con el enum EmployeeStatus.java del backend.
 *
 * 'ACTIVE' | 'INACTIVE' significa: solo puede ser uno de estos dos valores.
 */
export type EmployeeStatus = 'ACTIVE' | 'INACTIVE';

/**
 * Representa un departamento tal como lo devuelve la API.
 * Coincide con DepartmentResponse.java del backend.
 *
 * La 'I' de prefijo (IDepartment) es un estilo antiguo de Java/C#.
 * En TypeScript moderno simplemente llamamos al tipo por lo que es: Department.
 */
export interface Department {
  id: number;
  name: string;
  description: string | null;
}

/**
 * Representa un empleado tal como lo devuelve la API.
 * Coincide con EmployeeResponse.java del backend.
 *
 *  'department' es un objeto Department completo. 
 *  El backend ya hace el join.
 */
export interface Employee {
  id: ZodUUID;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  position: string;
  department: Department;
  salary: number;
  status: EmployeeStatus;
  hireDate: string;       // ISO date: "2024-01-15"
  createdAt: string;      // ISO datetime: "2024-01-15T10:30:00"
  updatedAt: string;
}

/**
 * Los datos que enviamos al backend para crear o actualizar un empleado.
 * Coincide con EmployeeRequest.java del backend.
 *
 * Nota: aquí 'departmentId' es un number (el ID), no un Department completo.
 * El backend solo necesita el ID para hacer el JOIN internamente.
 */
export interface EmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  departmentId: number | '';   // '' para el estado inicial del select vacío
  salary: number | '';         // '' para el estado inicial del input vacío
  status: EmployeeStatus | '';
  hireDate: string;
}

/**
 * Respuesta paginada del backend.
 * Coincide con PageResponse.java del backend.
 *
 * Generic <T>: igual que en Java, T puede ser cualquier tipo.
 * PageResponse<Employee> significa: una página de Employees.
 * PageResponse<Department> sería una página de Departments.
 *
 * Comparación Java:
 * public class PageResponse<T> { ... }
 * TypeScript:
 * interface PageResponse<T> { ... }
 */
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

/**
 * La envoltura estándar de todas las respuestas de la API.
 * Coincide con ApiResponse.java del backend.
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

/**
 * Parámetros para buscar/filtrar empleados.
 * Se convierten en query params de la URL.
 */
export interface EmployeeFilters {
  search?: string;
  status?: EmployeeStatus | '';
  departmentId?: number | '';
  page: number;
  size: number;
  sortBy: string;
  sortDir: 'asc' | 'desc';
}

/**
 * Estadísticas para el Dashboard.
 * Coincide con lo que devuelve /api/v1/employees/dashboard/stats
 */
export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  totalDepartments: number;
}

/**
 * Errores de validación que devuelve el backend cuando un campo es inválido.
 * Es el 'data' de ApiResponse cuando hay un error 400.
 *
 * Record<string, string>: un objeto donde las claves son strings (nombres de campo)
 * y los valores son strings (mensajes de error).
 * Ejemplo: { "email": "El email no es válido", "salary": "Debe ser positivo" }
 *
 * 🔄 Comparación Java: equivalente a Map<String, String>
 */
export type ValidationErrors = Record<string, string>;