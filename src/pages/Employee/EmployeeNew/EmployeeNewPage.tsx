import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createEmployee } from '../../../services/employeeService';
import { getDepartments } from '../../../services/departmentService';
import type { EmployeeFormData, ValidationErrors } from '../../../types/employee.types';
import EmployeeForm from '../../../components/employees/EmployeeForm/EmployeeForm';
import { useEffect } from 'react';
import styles from '../../../components/employees/EmployeeForm/EmployeeForm.module.css';
import type { Department, DepartmentFilter } from '../../../types/department.types';

  const DEFAULT_FILTERS_DEPARTMENT: DepartmentFilter = {
    search: '',
    name: '',
    page: 0,
    size: 10,
    sortBy: '',
    sortDir: 'asc',
  }

export default function EmployeeNewPage() {
  const navigate = useNavigate();

  const [departments, setDepartments]       = useState<Department[]>([]);
  const [isLoadingDepts, setIsLoadingDepts] = useState(true);
  const [isSubmitting, setIsSubmitting]     = useState(false);
  const [serverErrors, setServerErrors]     = useState<ValidationErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage]     = useState<string | null>(null);

  useEffect(() => {
    getDepartments(DEFAULT_FILTERS_DEPARTMENT)
      .then(data => setDepartments(data.content))
      .catch(() => setErrorMessage('No se pudieron cargar los departamentos.'))
      .finally(() => setIsLoadingDepts(false));
  }, []);

  async function handleSubmit(data: EmployeeFormData) {
    setIsSubmitting(true);
    setServerErrors({});
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const created = await createEmployee(data);
      setSuccessMessage(`¡Empleado ${created.firstName} ${created.lastName} creado exitosamente!`);

      // Redirigir al detalle del nuevo empleado tras 1.5 segundos
      setTimeout(() => {
        navigate(`/employees/${created.id}`);
      }, 1500);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const response = err.response?.data;

      if (err.response?.status === 400 && response?.data) {
        // Errores de validación campo por campo del backend
        setServerErrors(response.data);
        setErrorMessage('Por favor, corrige los errores indicados.');
      } else if (err.response?.status === 409) {
        // Email duplicado u otro conflicto de negocio
        setErrorMessage(response?.message || 'Ya existe un empleado con esos datos.');
      } else {
        setErrorMessage('Error al crear el empleado. Inténtalo de nuevo.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>
      {/* Cabecera */}
      <div className={styles.pageHeader}>
        <Link to="/employees" className={styles.backBtn} title="Volver a la lista">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className={styles.pageTitle}>Nuevo Empleado</h1>
          <p className={styles.pageSubtitle}>Completa el formulario para registrar un nuevo empleado</p>
        </div>
      </div>

      <EmployeeForm
        departments={departments}
        isLoadingDepartments={isLoadingDepts}
        isSubmitting={isSubmitting}
        serverErrors={serverErrors}
        successMessage={successMessage}
        errorMessage={errorMessage}
        onSubmit={handleSubmit}
        cancelTo="/employees"
      />
    </div>
  );
}