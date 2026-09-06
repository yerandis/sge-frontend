import { Link, useNavigate } from "react-router-dom";
import type { DepartmentFormData } from "../../../types/department.types";
import { useState } from "react";
import type { ValidationErrors } from "../../../types/employee.types";
import { createDepartment } from "../../../services/departmentService";
import styles from '../../../components/departments/DepartmentForm.module.css';
import DepartmentForm from "../../../components/departments/DepartmentForm";
import Breadcrumb from "../../../components/ui/Breadcrumb/Breadcrumb";
import { useBreadcrumb } from "../../../hooks/useBreadcrumb";

export default function DepartmentNewPage() {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting]     = useState(false);
  const [serverErrors, setServerErrors]     = useState<ValidationErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage]     = useState<string | null>(null);

  const breadcrumb = useBreadcrumb('Nuevo Departamento');

  async function handleSubmit(data: DepartmentFormData) {
    setIsSubmitting(true);
    setServerErrors({});
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const created = await createDepartment(data);
      setSuccessMessage(`Departamento ${created.name} creado exitosamente!`);

      // Redirigir al detalle del nuevo Department tras 1.5 segundos
      setTimeout(() => {
        navigate(`/departments/${created.id}`);
      }, 1500);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const response = err.response?.data;

      if (err.response?.status === 400 && response?.data) {
        // Errores de validación campo por campo del backend
        setServerErrors(response.data);
        setErrorMessage('Por favor, corrige los errores indicados.');
      } else if (err.response?.status === 409) {
        setErrorMessage(response?.message || 'Ya existe un Departamento con esos datos.');
      } else {
        setErrorMessage('Error al crear el departamento. Inténtalo de nuevo.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>
      <Breadcrumb items={breadcrumb}/>
      {/* Cabecera */}
      <div className={styles.pageHeader}>
        <Link to="/departments" className={styles.backBtn} title="Volver a la lista">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className={styles.pageTitle}>Nuevo Departamento</h1>
          <p className={styles.pageSubtitle}>Completa el formulario para registrar un nuevo departamento</p>
        </div>
      </div>

      <DepartmentForm
        isSubmitting={isSubmitting}
        serverErrors={serverErrors}
        successMessage={successMessage}
        errorMessage={errorMessage}
        onSubmit={handleSubmit}
        cancelTo="/departments"
      />
    </div>
  );
}