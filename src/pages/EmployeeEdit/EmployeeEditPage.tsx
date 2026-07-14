import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getEmployeeById, updateEmployee } from '../../services/employeeService';
import { getDepartments } from '../../services/departmentService';
import type { Employee, Department, EmployeeFormData, ValidationErrors } from '../../types/employee.types';
import EmployeeForm from '../../components/employees/EmployeeForm/EmployeeForm';
import Spinner from '../../components/ui/Spinner/Spinner';
import styles from '../../components/employees/EmployeeForm/EmployeeForm.module.css';

export default function EmployeeEditPage() {
  const { id } = useParams<{ id: string }>();   // extrae el :id de la URL
  const navigate = useNavigate();

  const [employee,       setEmployee]       = useState<Employee | null>(null);
  const [departments,    setDepartments]    = useState<Department[]>([]);
  const [isLoading,      setIsLoading]      = useState(true);
  const [isSubmitting,   setIsSubmitting]   = useState(false);
  const [serverErrors,   setServerErrors]   = useState<ValidationErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage,   setErrorMessage]   = useState<string | null>(null);

  /**
   * Carga paralela: el empleado y los departamentos se cargan al mismo tiempo.
   * Promise.all espera a que AMBAS promesas se resuelvan.
   * Más eficiente que hacerlas secuencialmente.
   */
  useEffect(() => {
    if (!id) return;

    const employeeId = id;

    Promise.all([
      getEmployeeById(employeeId),
      getDepartments(),
    ])
      .then(([emp, depts]) => {
        setEmployee(emp);
        setDepartments(depts);
      })
      .catch(() => {
        setErrorMessage('No se pudo cargar la información del empleado.');
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  async function handleSubmit(data: EmployeeFormData) {
    if (!id) return;

    setIsSubmitting(true);
    setServerErrors({});
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const updated = await updateEmployee(id, data);
      setEmployee(updated); // actualiza los datos del formulario
      setSuccessMessage('¡Empleado actualizado exitosamente!');

      setTimeout(() => {
        navigate(`/employees/${id}`);
      }, 1500);

    } catch (err: any) {
      const response = err.response?.data;

      if (err.response?.status === 400 && response?.data) {
        setServerErrors(response.data);
        setErrorMessage('Por favor, corrige los errores indicados.');
      } else if (err.response?.status === 409) {
        setErrorMessage(response?.message || 'Conflicto con los datos ingresados.');
      } else if (err.response?.status === 404) {
        setErrorMessage('El empleado no existe o fue eliminado.');
      } else {
        setErrorMessage('Error al actualizar el empleado. Inténtalo de nuevo.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) return <Spinner message="Cargando empleado..." />;

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <Link to={`/employees/${id}`} className={styles.backBtn} title="Volver al detalle">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className={styles.pageTitle}>Editar Empleado</h1>
          <p className={styles.pageSubtitle}>
            {employee ? `${employee.firstName} ${employee.lastName}` : ''}
          </p>
        </div>
      </div>

      <EmployeeForm
        initialData={employee ?? undefined}
        departments={departments}
        isLoadingDepartments={false}
        isSubmitting={isSubmitting}
        serverErrors={serverErrors}
        successMessage={successMessage}
        errorMessage={errorMessage}
        onSubmit={handleSubmit}
        cancelTo={`/employees/${id}`}
      />
    </div>
  );
}