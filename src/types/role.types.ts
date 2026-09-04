// ════  TIPOS: Roles y Permisos  ════════════

export interface Permission {
  id:          string;
  code:        string;   // EMPLOYEE_READ, DEPARTMENT_DELETE, etc.
  name:        string;   // "Ver empleados", "Eliminar departamentos"
  description: string | null;
  module:      string;   // EMPLOYEES, DEPARTMENTS, USERS, ROLES, REPORTS, SYSTEM
}

/**
 * Permisos agrupados por módulo para la UI.
 * El selector de permisos los muestra así:
 *
 * EMPLOYEES
 *   [ ] Ver empleados
 *   [x] Crear empleados
 *   [ ] Editar empleados
 *   [ ] Eliminar empleados
 *
 * DEPARTMENTS
 *   [x] Ver departamentos
 *   [ ] Crear departamentos
 *   ...
 */
export interface PermissionGroup {
  module:      string;
  permissions: Permission[];
}

export interface Role {
  id:              string;
  name:            string;
  description:     string | null;
  isDefault:       boolean;
  isSystem:        boolean;
  permissions:     Permission[];
  permissionCount: number;
  createdAt:       string;
  updatedAt:       string;
}

export interface RoleFormData {
  name:          string;
  description:   string;
  isDefault:     boolean;
  permissionIds: string[];  // UUIDs de los permisos seleccionados
}