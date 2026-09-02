import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { Department, DepartmentFormData } from "../../../types/department.types";
import type { ValidationErrors } from "../../../types/employee.types";
import { getDepartmentById, updateDepartment } from "../../../services/departmentService";
import Spinner from "../../../components/ui/Spinner/Spinner";
import styles from "../../../components/departments/DepartmentForm.module.css";
import DepartmentForm from "../../../components/departments/DepartmentForm";

export default function DepartmentEditPage() {
  const { id } = useParams<{ id: string }>();   // extrae el :id de la URL
  const navigate = useNavigate();

  const [department,     setDepartment]       = useState<Department | null>(null);
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

    const departmentId = id;

    Promise.all([
      getDepartmentById(departmentId),
    ])
      .then(([dep]) => {
        setDepartment(dep);
      })
      .catch(() => {
        setErrorMessage('No se pudo cargar la información del departamento.');
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  async function handleSubmit(data: DepartmentFormData) {
    if (!id) return;

    setIsSubmitting(true);
    setServerErrors({});
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const updated = await updateDepartment(id, data);
      setDepartment(updated); // actualiza los datos del formulario
      setSuccessMessage('Departamento actualizado exitosamente!');

      setTimeout(() => {
        navigate(`/departments/${id}`);
      }, 1500);

    } catch (err: any) {
      const response = err.response?.data;

      if (err.response?.status === 400 && response?.data) {
        setServerErrors(response.data);
        setErrorMessage('Por favor, corrige los errores indicados.');
      } else if (err.response?.status === 409) {
        setErrorMessage(response?.message || 'Conflicto con los datos ingresados.');
      } else if (err.response?.status === 404) {
        setErrorMessage('El departamento no existe o fue eliminado.');
      } else {
        setErrorMessage('Error al actualizar el departamento. Inténtalo de nuevo.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) return <Spinner message="Cargando departamento..." />;

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <Link to={`/departments/${id}`} className={styles.backBtn} title="Volver al detalle">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className={styles.pageTitle}>Editar Departamento</h1>
          <p className={styles.pageSubtitle}>
            {department ? `${department.name}` : ''}
          </p>
        </div>
      </div>

      <DepartmentForm
        initialData={department ?? undefined}
        isSubmitting={isSubmitting}
        serverErrors={serverErrors}
        successMessage={successMessage}
        errorMessage={errorMessage}
        onSubmit={handleSubmit}
        cancelTo={`/departments/${id}`}
      />
    </div>
  );
}