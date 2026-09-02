import { useEffect, useState } from "react";
import type { Department, DepartmentFormData } from "../../types/department.types";
import type { ValidationErrors } from "../../types/employee.types";
import styles from './DepartmentForm.module.css';
import { Link } from "react-router-dom";
import Spinner from "../ui/Spinner/Spinner";

interface DepartmentFormProps {
  /** Si se pasa, el formulario está en modo edición y carga estos datos */
  initialData?: Department;
  isSubmitting: boolean;
  /** Errores de validación del backend (campo → mensaje) */
  serverErrors: ValidationErrors;
  /** Mensaje de éxito tras guardar */
  successMessage: string | null;
  /** Mensaje de error general */
  errorMessage: string | null;
  onSubmit: (data: DepartmentFormData) => void;
  cancelTo: string;
}

/** Estado vacío del formulario */
const EMPTY_FORM: DepartmentFormData = {
  name: '',
  description: '',
};

/**
 * Formulario de empleado reutilizable.
 *
 * Patrón "formulario controlado": cada campo del formulario está
 * vinculado a una variable de estado de React (formData).
 * Cuando el usuario escribe, React actualiza el estado.
 * Cuando el estado cambia, React re-renderiza el input con el nuevo valor.
 *
 * 🔄 Comparación Java:
 * Es como un formulario Thymeleaf con th:field, donde el objeto del modelo
 * está siempre sincronizado con los campos del HTML.
 * Aquí el "modelo" es el estado de React.
 */
export default function DepartmentForm({
  initialData,
  isSubmitting,
  serverErrors,
  successMessage,
  errorMessage,
  onSubmit,
  cancelTo,
}: DepartmentFormProps) {
  const isEditMode = Boolean(initialData);

  // Estado del formulario
  const [formData, setFormData] = useState<DepartmentFormData>(EMPTY_FORM);
  // Errores de validación en cliente
  const [clientErrors, setClientErrors] = useState<ValidationErrors>({});

  /**
   * Si hay datos iniciales (modo edición), los cargamos en el formulario.
   * useEffect con [initialData] como dependencia: se ejecuta cada vez
   * que initialData cambia (es decir, cuando el backend responde con el empleado).
   */
  useEffect(() => {
    if (initialData) {

// Error: Calling setState synchronously within an effect can trigger cascading renders

// Effects are intended to synchronize state between React and external systems such as manually updating the DOM, state management libraries, or other platform APIs. In general, the body of an effect should do one or both of the following:
// * Update external systems with the latest state from React.
// * Subscribe for updates from some external system, calling setState in a callback function when external state changes.

// Calling setState synchronously within an effect body causes cascading renders that can hurt performance, and is not recommended. (https://react.dev/learn/you-might-not-need-an-effect).

// C:\Users\uyera\IdeaProjects\React\Sistema-Gestion-Empleados\sge-frontend\src\components\employees\EmployeeForm\EmployeeForm.tsx:74:7
//   72 |   useEffect(() => {
//   73 |     if (initialData) {
// > 74 |       setFormData({
//      |       ^^^^^^^^^^^ Avoid calling setState() directly within an effect
//   75 |         firstName: initialData.firstName,
//   76 |         lastName: initialData.lastName,
//   77 |         email: initialData.email,
//  *******   por el error anterior se tuvo que agregar la linea siguiente

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: initialData.name,
        description: initialData.description,
      });
    }
  }, [initialData]);

  /**
   * Handler genérico para inputs y selects.
   *
   * En lugar de un handler por campo (handleFirstName, handleLastName, etc.),
   * usamos el atributo 'name' del input para actualizar el campo correcto.
   *
   * Spread operator (...prev): crea una copia del objeto anterior
   * y sobreescribe solo la propiedad con el nombre del campo.
   *
   * [e.target.name]: computed property key. Usa el valor de e.target.name
   * como nombre de la propiedad. Equivale a: obj[campo] = valor
   */
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar el error de ese campo cuando el usuario empieza a corregirlo
    if (clientErrors[name]) {
      setClientErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }

  /** Validación en el cliente antes de enviar */
  function validate(): boolean {
    const errors: ValidationErrors = {};

    if (!formData.name.trim()) errors.name = 'El nombre es obligatorio';
    
    setClientErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); // Previene el comportamiento nativo del navegador (recarga)
    if (!validate()) return;
    onSubmit(formData);
  }

  /**
   * Combina errores del cliente y del servidor.
   * Si ambos tienen un error para el mismo campo, el del servidor tiene prioridad.
   */
  const errors = { ...clientErrors, ...serverErrors };

  return (
    <form onSubmit={handleSubmit} noValidate>

      {/* ── BANNER DE ÉXITO ──────────────────────────────── */}
      {successMessage && (
        <div className={styles.successBanner}>
          <svg className={styles.successIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {successMessage}
        </div>
      )}

      {/* ── BANNER DE ERROR GENERAL ──────────────────────── */}
      {errorMessage && (
        <div className={styles.errorBanner}>
          <svg style={{ width: '1.125rem', height: '1.125rem', flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          {errorMessage}
        </div>
      )}

      <div className={styles.card}>

        {/* ── SECCIÓN: INFORMACIÓN PERSONAL ────────────── */}
        <div className={styles.cardSection}>
          <h3 className={styles.sectionTitle}>Información personal</h3>
          <div className={styles.formGrid}>

            {/* Nombre */}
            <div className={styles.field}>
              <label className={styles.label}>
                Nombre<span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="name"
                className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
                value={formData.name}
                onChange={handleChange}
                placeholder="Nombre del departamento"
                maxLength={100}
              />
              {errors.name && <span className={styles.errorMsg}>{errors.name}</span>}
            </div>

            {/* Descripcion */}
            <div className={styles.field}>
              <label className={styles.label}>
                Descripcion
              </label>
              <input
                type="text"
                name="description"
                className={`${styles.input} ${errors.description ? styles.inputError : ''}`}
                value={formData.description}
                onChange={handleChange}
                placeholder="Descripcion del departamento"
                maxLength={100}
              />
              {errors.description && <span className={styles.errorMsg}>{errors.description}</span>}
            </div>

          </div>
        </div>

        {/* ── FOOTER CON ACCIONES ───────────────────────── */}
        <div className={styles.formFooter}>
          <Link to={cancelTo} className={styles.btnCancel}>
            Cancelar
          </Link>
          <button
            type="submit"
            className={styles.btnSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner size="sm" />
                {isEditMode ? 'Guardando...' : 'Creando...'}
              </>
            ) : (
              isEditMode ? 'Guardar cambios' : 'Crear departamento'
            )}
          </button>
        </div>

      </div>
    </form>
  );
}