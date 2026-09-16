import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {  getEmployees } from '../../../services/employeeService';
import type { Employee, EmployeeFilters,  ValidationErrors } from '../../../types/employee.types';
import Spinner from '../../../components/ui/Spinner/Spinner';
import styles from '../../../components/employees/EmployeeForm/EmployeeForm.module.css';
import { useBreadcrumb } from '../../../hooks/useBreadcrumb';
import Breadcrumb from '../../../components/ui/Breadcrumb/Breadcrumb';
import type { User, UserFormData } from '../../../types/user.types';
import type { Role } from '../../../types/role.types';
import { getUserById, updateUser } from '../../../services/userServices';
import { getRoles } from '../../../services/roleService';
import UserForm from '../../../components/users/UsersForm';

const DEFAULT_FILTERS_EMPLOYEE: EmployeeFilters = {
    search:         '',
    status:         'ACTIVE',
    departmentId:   '',
    page:           0,
    size:           10,
    sortBy:         'firstName',
    sortDir:        'asc',
}

export default function UserEditPage() {
    const { id } = useParams<{ id: string}> (); //  id de la url
    const navigate = useNavigate();

    const [ user, setUsers]          = useState<User | null>(null);
    const [ employee, setEmployees]  = useState<Employee[]>([]);
    const [ role, setRole]           = useState<Role[]>([]);
    const [ isLoading, setIsLoading] = useState(true);
    const [ isSubmitting, setIsSubmitting] = useState(false);
    const [ serverErrors, setServerErrors] = useState<ValidationErrors>({});
    const [ successMessage, setSuccessMessage] = useState<string | null>(null);
    const [ errorMessage, setErrorMessage]     = useState<string | null>(null);

    const breadcrumb = useBreadcrumb(
        user ? `${user.firstName} ${user.lastName}` : undefined
    );

    useEffect(() => {
        if(!id) return;

        const userId = id;

        Promise.all([
              getUserById(userId),
              getEmployees(DEFAULT_FILTERS_EMPLOYEE),
              getRoles(),
            ])
              .then(([user, emp, roles]) => {
                setUsers(user)
                setEmployees(emp.content);
                console.log(emp)
                setRole(roles);
              })
              .catch(() => {
                setErrorMessage('No se pudo cargar la información del usuario.');
              })
              .finally(() => setIsLoading(false));
          }, [id]);
    
        async function handleSubmit(data: UserFormData) {
            if (!id) return;

            setIsSubmitting(true);
            setServerErrors({});
            setErrorMessage(null);
            setSuccessMessage(null);

            try {
            const updated = await updateUser(id, data);
            setUsers(updated); // actualiza los datos del formulario
            setSuccessMessage('Usuario actualizado exitosamente!');

            setTimeout(() => {
                navigate(`/users/${id}`);
            }, 1500);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
            const response = err.response?.data;

            if (err.response?.status === 400 && response?.data) {
                setServerErrors(response.data);
                setErrorMessage('Por favor, corrige los errores indicados.');
            } else if (err.response?.status === 409) {
                setErrorMessage(response?.message || 'Conflicto con los datos ingresados.');
            } else if (err.response?.status === 404) {
                setErrorMessage('El usuario no existe o fue eliminado.');
            } else {
                setErrorMessage('Error al actualizar el usuario. Inténtalo de nuevo.');
            }
            } finally {
            setIsSubmitting(false);
            }
        }

        if (isLoading) return <Spinner message="Cargando usario..." />;
        
        return (
            <div className={styles.page}>
            <Breadcrumb items={breadcrumb} />
            <div className={styles.pageHeader}>
                <Link to={`/users/${id}`} className={styles.backBtn} title="Volver al detalle">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                </Link>
                <div>
                <h1 className={styles.pageTitle}>Editar Usuario</h1>
                <p className={styles.pageSubtitle}>
                    {user ? `${user.firstName} ${user.lastName}` : ''}
                </p>
                </div>
            </div>

            <UserForm
                initialData={user ?? undefined}
                employees={employee}
                roles={role}
                isLoadingEmployees={false}
                isLoadingRoles={false}
                isSubmitting={isSubmitting}
                serverErrors={serverErrors}
                successMessage={successMessage}
                errorMessage={errorMessage}
                onSubmit={handleSubmit}
                cancelTo={`/users/${id}`}
            />
            </div>
        );
}