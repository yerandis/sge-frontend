import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Employee, EmployeeFormData, Department, ValidationErrors } from '../../../types/employee.types';
import Spinner from '../../ui/Spinner/Spinner';
import styles from './EmployeeForm.module.css';

interface EmployeeFormProps {
  /** Si se pasa, el formulario está en modo edición y carga estos datos */
  initialData?: Employee;
  departments: Department[];
  isLoadingDepartments: boolean;
  isSubmitting: boolean;
  /** Errores de validación del backend (campo → mensaje) */
  serverErrors: ValidationErrors;
  /** Mensaje de éxito tras guardar */
  successMessage: string | null;
  /** Mensaje de error general */
  errorMessage: string | null;
  onSubmit: (data: EmployeeFormData) => void;
  cancelTo: string;
}

/** Estado vacío del formulario */
const EMPTY_FORM: EmployeeFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  position: '',
  departmentId: '',
  salary: '',
  status: 'ACTIVE',
  hireDate: '',
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
export default function EmployeeForm({
  initialData,
  departments,
  isLoadingDepartments,
  isSubmitting,
  serverErrors,
  successMessage,
  errorMessage,
  onSubmit,
  cancelTo,
}: EmployeeFormProps) {
  const isEditMode = Boolean(initialData);

  // Estado del formulario
  const [formData, setFormData] = useState<EmployeeFormData>(EMPTY_FORM);
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
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        email: initialData.email,
        phone: initialData.phone ?? '',
        position: initialData.position,
        departmentId: initialData.department.id,
        salary: initialData.salary,
        status: initialData.status,
        hireDate: initialData.hireDate,
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

    if (!formData.firstName.trim()) errors.firstName = 'El nombre es obligatorio';
    if (!formData.lastName.trim())  errors.lastName  = 'El apellido es obligatorio';
    if (!formData.email.trim()) {
      errors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'El email no tiene un formato válido';
    }
    if (!formData.position.trim()) errors.position = 'El cargo es obligatorio';
    if (!formData.departmentId) errors.departmentId = 'El departamento es obligatorio';
    if (!formData.salary || Number(formData.salary) <= 0) {
      errors.salary = 'El salario debe ser mayor a cero';
    }
    if (!formData.status) errors.status = 'El estado es obligatorio';
    if (!formData.hireDate) errors.hireDate = 'La fecha de contratación es obligatoria';

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
                name="firstName"
                className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Nombre de Empleado"
                maxLength={100}
              />
              {errors.firstName && <span className={styles.errorMsg}>{errors.firstName}</span>}
            </div>

            {/* Apellido */}
            <div className={styles.field}>
              <label className={styles.label}>
                Apellido<span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="lastName"
                className={`${styles.input} ${errors.lastName ? styles.inputError : ''}`}
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Apellido de Empleado"
                maxLength={100}
              />
              {errors.lastName && <span className={styles.errorMsg}>{errors.lastName}</span>}
            </div>

            {/* Email */}
            <div className={styles.field}>
              <label className={styles.label}>
                Email<span className={styles.required}>*</span>
              </label>
              <input
                type="email"
                name="email"
                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                value={formData.email}
                onChange={handleChange}
                placeholder="nombre.apellido@empresa.com"
                maxLength={255}
              />
              {errors.email && <span className={styles.errorMsg}>{errors.email}</span>}
            </div>

            {/* Teléfono */}
            <div className={styles.field}>
              <label className={styles.label}>Teléfono</label>
              <input
                type="tel"
                name="phone"
                className={styles.input}
                value={formData.phone}
                onChange={handleChange}
                placeholder="+12 012 345 678"
                maxLength={20}
              />
            </div>

          </div>
        </div>

        {/* ── SECCIÓN: INFORMACIÓN LABORAL ─────────────── */}
        <div className={styles.cardSection}>
          <h3 className={styles.sectionTitle}>Información laboral</h3>
          <div className={styles.formGrid}>

            {/* Cargo */}
            <div className={styles.field}>
              <label className={styles.label}>
                Cargo<span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="position"
                className={`${styles.input} ${errors.position ? styles.inputError : ''}`}
                value={formData.position}
                onChange={handleChange}
                placeholder="Cargo"
                maxLength={150}
              />
              {errors.position && <span className={styles.errorMsg}>{errors.position}</span>}
            </div>

            {/* Departamento */}
            <div className={styles.field}>
              <label className={styles.label}>
                Departamento<span className={styles.required}>*</span>
              </label>
              <select
                name="departmentId"
                className={`${styles.select} ${errors.departmentId ? styles.inputError : ''}`}
                value={formData.departmentId}
                onChange={handleChange}
                disabled={isLoadingDepartments}
              >
                <option value="">
                  {isLoadingDepartments ? 'Cargando departamentos...' : 'Seleccionar departamento'}
                </option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
              {errors.departmentId && <span className={styles.errorMsg}>{errors.departmentId}</span>}
            </div>

            {/* Salario */}
            <div className={styles.field}>
              <label className={styles.label}>
                Salario ($)<span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                name="salary"
                className={`${styles.input} ${errors.salary ? styles.inputError : ''}`}
                value={formData.salary}
                onChange={handleChange}
                placeholder="45000"
                min="0.01"
                step="0.01"
              />
              {errors.salary && <span className={styles.errorMsg}>{errors.salary}</span>}
            </div>

            {/* Estado */}
            <div className={styles.field}>
              <label className={styles.label}>
                Estado<span className={styles.required}>*</span>
              </label>
              <select
                name="status"
                className={`${styles.select} ${errors.status ? styles.inputError : ''}`}
                value={formData.status}
                onChange={handleChange}
              >
                <option value="ACTIVE">Activo</option>
                <option value="INACTIVE">Inactivo</option>
              </select>
              {errors.status && <span className={styles.errorMsg}>{errors.status}</span>}
            </div>

            {/* Fecha de contratación */}
            <div className={styles.field}>
              <label className={styles.label}>
                Fecha de contratación<span className={styles.required}>*</span>
              </label>
              <input
                type="date"
                name="hireDate"
                className={`${styles.input} ${errors.hireDate ? styles.inputError : ''}`}
                value={formData.hireDate}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]} // no puede ser futura
              />
              {errors.hireDate && <span className={styles.errorMsg}>{errors.hireDate}</span>}
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
              isEditMode ? 'Guardar cambios' : 'Crear empleado'
            )}
          </button>
        </div>

      </div>
    </form>
  );
}