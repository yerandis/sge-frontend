import { useLocation, useParams } from 'react-router-dom';
import { useMemo } from 'react';

export interface BreadcrumbItem {
  label: string;
  path?: string;  // undefined = item actual, no clickeable
}

/**
 * Genera el breadcrumb estático.
 * Para el nombre del empleado, necesitas pasarlo como parámetro
 * desde el componente que ya lo tiene cargado.
 */
export function useBreadcrumb(entityName?: string): BreadcrumbItem[] {
  const location = useLocation();
  const { id } = useParams();

  return useMemo(() => {
    const base: BreadcrumbItem = { label: 'Inicio', path: '/dashboard' };
    const path = location.pathname;
    //  --- Inicio  ---
    if (path === '/dashboard') {
      return [{ label: 'Inicio' }];
    }
    //  --- Empleados   ---
    if (path === '/employees') {
      return [base, { label: 'Empleados' }];
    }

    if (path === '/employees/new') {
      return [base, { label: 'Empleados', path: '/employees' }, { label: 'Nuevo empleado' }];
    }

    if (id && path === `/employees/${id}`) {
      return [
        base,
        { label: 'Empleados', path: '/employees' },
        { label: entityName ?? 'Empleado' },
      ];
    }

    if (id && path === `/employees/${id}/edit`) {
      return [
        base,
        { label: 'Empleados', path: '/employees' },
        { label: entityName ?? 'Empleado', path: `/employees/${id}` },
        { label: 'Editar' },
      ];
    }
    //  --- Departamentos   ---
    if (path === '/departments') {
      return [base, { label: 'Departamentos' }];
    }

    if (path === '/departments/new') {
      return [base, { label: 'Departamentos', path: '/departments' }, { label: 'Nuevo departamento' }];
    }

    if (id && path === `/departments/${id}`) {
      return [
        base,
        { label: 'Departamentos', path: '/departments' },
        { label: entityName ?? 'Departamento' },
      ];
    }

    if (id && path === `/departments/${id}/edit`) {
      return [
        base,
        { label: 'Departamentos', path: '/departments' },
        { label: entityName ?? 'Departamento', path: `/departments/${id}` },
        { label: 'Editar' },
      ];
    }

    //  --- Roles   ---

    return [base];
  }, [location.pathname, id, entityName]);
}