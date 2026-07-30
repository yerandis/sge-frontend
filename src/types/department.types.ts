// Tipos q devuelve el backend DepartmentResponse

/**
 * Representa un departamento tal como lo devuelve la API.
 * Coincide con DepartmentResponse.java del backend.
 *
 * La 'I' de prefijo (IDepartment) es un estilo antiguo de Java/C#.
 * En TypeScript moderno simplemente llamamos al tipo por lo que es: Department.
 */
export interface Department {
  id: string;
  name: string;
  description: string | null;
}

export interface DepartmentFormData {
    name: string;
    description: string|'';
}

export interface DepartmentFilter {
    search?: string;
    name?: string;
    page: number;
    size: number;
    sortBy: string;
    sortDir: 'asc'|'desc';
}