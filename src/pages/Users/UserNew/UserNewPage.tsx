import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getEmployees } from '../../../services/employeeService';
import type { Employee, EmployeeFilters, ValidationErrors } from '../../../types/employee.types';
import { useEffect } from 'react';
import styles from '../../../components/employees/EmployeeForm/EmployeeForm.module.css';
import { useBreadcrumb } from '../../../hooks/useBreadcrumb';
import Breadcrumb from '../../../components/ui/Breadcrumb/Breadcrumb';
import { createUser } from '../../../services/userServices';
import type { UserFormData } from '../../../types/user.types';
import UserForm from '../../../components/users/UsersForm';
import type { Role } from '../../../types/role.types';
import { getRoles } from '../../../services/roleService';

const DEFAUL_FILTERS_EMPLOYEES: EmployeeFilters = {
    search:         '',
    status:         'ACTIVE',
    departmentId:   '',
    page:           0,
    size:           10,
    sortBy:         '',
    sortDir:        'asc',
}

export default function UserNewPage () {
    const navigate = useNavigate();

    const [employees, setEmployees]                     = useState<Employee[]>([]);
    const [roleIds, setRolesIds]                        = useState<Role[]>([]);
    const [isLoadingEmployees, setIsLoadingEmployees]   = useState(true);
    const [isLoadingRoleIds, setIsLoadingRoleIds]       = useState(true);
    const [isSubmitting, setIsSubmitting]               = useState(false);
    const [serverErrors, setServerErrors]               = useState<ValidationErrors>({});
    const [successMessage, setSuccessMessage]           = useState<string | null>(null);
    const [errorMessage, setErrorMessage]               = useState<string | null>(null);

    const breadcrumb = useBreadcrumb('Nuevo usuario');

    useEffect(() => {
        getEmployees(DEFAUL_FILTERS_EMPLOYEES)
        .then(data => setEmployees(data.content))
        .catch(() => setErrorMessage('No se pudo cargar la lista de empleados'))
        .finally(() => setIsLoadingEmployees(false));
    }, []);

    useEffect(() => {
        getRoles()
        .then(data => setRolesIds(data))
        .catch(() => setErrorMessage('No se pudo cargar la lista de roles'))
        .finally(() => setIsLoadingRoleIds(false));
    }, []);

    async function handleSubmit(data: UserFormData){
        setIsSubmitting(true);
        setServerErrors({});
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            const created = await createUser(data);
            setSuccessMessage(`Usuario ${created.firstName} ${created.lastName} creado exitosamente!`);
            setTimeout(() => {
                navigate(`/users/${created.id}`);
            }, 1500);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any){
            const response = err.response?.data;

            if (err.response?.status === 400 && response?.data) {
            // Errores de validación campo por campo del backend
            setServerErrors(response.data);
            setErrorMessage('Por favor, corrige los errores indicados.');
        } else if (err.response?.status === 409) {
            // Email duplicado u otro conflicto de negocio
            setErrorMessage(response?.message || 'Ya existe un usuario con esos datos.');
        } else {
            setErrorMessage('Error al crear el usuario. Inténtalo de nuevo.');
        }
        } finally {
        setIsSubmitting(false);
        }
    }

    return (
    <div className={styles.page}>
      <Breadcrumb items={breadcrumb} />
      {/* Cabecera */}
      <div className={styles.pageHeader}>
        <Link to="/users" className={styles.backBtn} title="Volver a la lista">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className={styles.pageTitle}>Nuevo Usuario</h1>
          <p className={styles.pageSubtitle}>Completa el formulario para registrar un nuevo usuario</p>
        </div>
      </div>

      <UserForm
        employees={employees}
        roles={roleIds}
        isLoadingEmployees={isLoadingEmployees}
        isLoadingRoles={isLoadingRoleIds}
        isSubmitting={isSubmitting}
        serverErrors={serverErrors}
        successMessage={successMessage}
        errorMessage={errorMessage}
        onSubmit={handleSubmit}
        cancelTo="/users"
      />
    </div>
  );

}