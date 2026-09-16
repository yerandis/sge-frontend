import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Spinner from "../ui/Spinner/Spinner";
import type { User, UserFormData } from "../../types/user.types";
import type { Employee, ValidationErrors } from "../../types/employee.types";
import styles from './UsersForm.module.css';
import type { Role } from "../../types/role.types";

interface UserFormProps {
    initialData?:   User;
    employees:      Employee[];
    roles:          Role[];
    isLoadingEmployees: boolean;
    isLoadingRoles: boolean;
    isSubmitting:   boolean;
    serverErrors:   ValidationErrors;   //  errores de validacion en el back
    successMessage: string | null;
    errorMessage:   string | null;      //  error general
    onSubmit:       (data: UserFormData) => void;
    cancelTo:       string;
}

const EMPTY_FORM: UserFormData = {
    username:   '',
    email:      '',
    firstName:  '',
    lastName:   '',
    avatarUrl:  '',
    password:   '',        // vacío = no cambiar (en edición)
    active:     true,
    roleIds:    [],       // UUIDs de roles seleccionados
  employeeId:   '',
}

// ---  Formulario de user reutilizable

export default function UserForm({
    initialData,
    employees,
    roles,
    isLoadingEmployees,
    isLoadingRoles,
    isSubmitting,
    serverErrors,
    successMessage,
    errorMessage,
    onSubmit,
    cancelTo,
}: UserFormProps) {

    const isEditMode = Boolean(initialData);
    //  estado del formulario
    const [formData, setFormData] = useState<UserFormData>(EMPTY_FORM);
    const [clientErrors, setClientErrors] = useState<ValidationErrors>({});

   /**
   * Si hay datos iniciales (modo edición), los cargamos en el formulario.
   * useEffect con [initialData] como dependencia:
   */
  useEffect(() => {
    if (initialData) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData({
          username:   initialData.username,
          email:      initialData.email,
          firstName:  initialData.firstName,
          lastName:   initialData.lastName,
          avatarUrl:  initialData.avatarUrl ?? '',
          password:   '',                              // nunca precargues el hash/valor de password
          active:     initialData.active,
          roleIds:    initialData.roles.map(r => r.id),
          employeeId: initialData.employee?.id ?? '',  // ← null-safe
        });
    }
  }, [initialData]);

 // ─── Toggle de permiso individual ────────────────────────────
  function toggleRoles(roleId: string) {
    const current = formData.roleIds;
    const next = current.includes(roleId)
      ? current.filter(id => id !== roleId)
      : [...current, roleId];

    setFormData(prev => ({ ...prev, ['roleIds']: next }));
  }

  //    Handler generico para inputs y selects
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

  function validate(): boolean {
    const errs: ValidationErrors = {};
    if (!formData.username.trim())                  errs.username = 'El nombre de usuario es obligatorio';
    else if (formData.username.trim().length < 3)   errs.username = 'Mínimo 3 caracteres';
    if (!isEditMode && !formData.password)          errs.password = 'La contraseña es obligatoria al crear';
    if (formData.password && formData.password.length < 6) errs.password = 'Mínimo 6 caracteres';
    if (!formData.email.trim()) {
      errs.email = 'El email es obligatorio';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'El email no tiene un formato válido';
    }
     setClientErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  }

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
                  placeholder="Nombre"
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
                  placeholder="Apellido"
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
  
              {/* username */}
              <div className={styles.field}>
                <label className={styles.label}>Nombre de Usuario</label>
                <input
                  type="text"
                  name="username"
                  className={styles.input}
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Usuario"
                  maxLength={20}
                />
              </div>

            {/* Contraseña */}
            <div className={styles.field}>
                <label className={styles.label}>Contraseña</label>
                <input
                  type="password"
                  name="password"
                  className={styles.input}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="********"
                />
              </div>
            </div>
          </div>
  
          {/* ── SECCIÓN: INFORMACIÓN LABORAL ─────────────── */}
          <div className={styles.cardSection}>
            <h3 className={styles.sectionTitle}>Información laboral</h3>
            <div className={styles.formGrid}>
              {/* Empleado */}
              <div className={styles.field}>
              <label className={styles.label}>
                Empleado<span className={styles.required}>*</span>
              </label>
              <select
                name="employeeId"
                className={`${styles.select} ${errors.employeeId ? styles.inputError : ''}`}
                value={formData.employeeId}
                onChange={handleChange}
                disabled={isLoadingEmployees}
              >
                <option value="">
                  {isLoadingEmployees ? 'Cargando empleado...' : 'Seleccionar empleado'}
                </option>
                  {(employees ?? []).map(e => (
                    <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>
                  ))}
              </select>
              {errors.employeeId && <span className={styles.errorMsg}>{errors.employeeId}</span>}
            </div>

            {/* Activar */}
            <label className={styles.checkboxRow} style={{ cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={e => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                />
                <span className={styles.checkboxLabel}>Usuario activo</span>
            </label>

            {/* Roles */}
            <div className={styles.field}>
                <label className={styles.label}>Roles</label>
                <div className={styles.rolesSelector}>
                  {roles.length === 0
                    ? <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                        No hay roles disponibles.
                      </p>
                    : roles.map(role => {
                        const isSelected = formData.roleIds.includes(role.id);
                        return (
                          <label key={role.id}
                            className={`${styles.roleOption} ${isSelected ? styles.roleOptionSelected : ''}`}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleRoles(role.id)}
                              // disabled={isLoadingRoles}

                            />
                            <div>
                              <div className={styles.roleOptionName}>{role.name}</div>
                              {role.description && (
                                <div className={styles.roleOptionDesc}>{role.description}</div>
                              )}
                            </div>
                          </label>
                        );
                      })
                  }
                </div>
              </div>

              {/* avatarUrl */}

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