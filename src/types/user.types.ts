import type { Role } from './role.types';

// Reutilizamos el tipo Role del módulo de roles
export type { Role as UserRole };

export interface UserEmployee {
  id:        string;
  firstName: string;
  lastName:  string;
  email:     string;
  position:  string;
}

export interface User {
  id:        string;
  username:  string;
  active:    boolean;
  roles:     Role[];
  employee:  UserEmployee | null;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserFormData {
  username:   string;
  password:   string;        // vacío = no cambiar (en edición)
  active:     boolean;
  roleIds:    string[];      // UUIDs de roles seleccionados
  employeeId: string | '';   // UUID del empleado vinculado (opcional)
}

export interface UserFilters {
  search:  string;
  page:    number;
  size:    number;
  sortBy:  string;
  sortDir: 'asc' | 'desc';
}