import { useState, useEffect, useRef } from 'react';
import * as userService from '../../services/userServices';
import { getRoles } from '../../services/roleService';
import type { User, UserFormData, UserFilters } from '../../types/user.types';
import type { Role } from '../../types/role.types';
import ConfirmModal from '../../components/ui/ConfirmModal/ConfirmModal';
import Spinner from '../../components/ui/Spinner/Spinner';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import Pagination from '../../components/ui/Pagination/Pagination';
import styles from './UsersPage.module.css';

// ─────────────────────────────────────────────────────────────────
function formatLastLogin(date: string | null): string {
  if (!date) return 'Nunca';
  // Calcular la diferencia en el momento en que se llama, no en el render
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return 'ahora mismo';
  if (mins < 60) return `hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `hace ${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `hace ${days}d`;
  return new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
}

function getInitials(username: string): string {
  return username.substring(0, 2).toUpperCase();
}

const DEFAULT_FILTERS: UserFilters = {
  search: '', page: 0, size: 10, sortBy: 'username', sortDir: 'asc',
};

const EMPTY_FORM: UserFormData = {
  username: '', password: '', active: true, roleIds: [], employeeId: '',
};

export default function UsersPage() {

  const [users,       setUsers]       = useState<User[]>([]);
  const [roles,       setRoles]       = useState<Role[]>([]);
  const [isLoading,   setIsLoading]   = useState(true);
  const [error,       setError]       = useState<string | null>(null);
  const [totalPages,  setTotalPages]  = useState(0);
  const [totalElems,  setTotalElems]  = useState(0);
  const [filters,     setFilters]     = useState<UserFilters>(DEFAULT_FILTERS);
  const [searchInput, setSearchInput] = useState('');

  const [modal, setModal] = useState<{
    isOpen:   boolean;
    editUser: User | null;
    form:     UserFormData;
    isSaving: boolean;
    errors:   Partial<Record<keyof UserFormData, string>>;
    apiError: string | null;
  }>({
    isOpen: false, editUser: null, form: EMPTY_FORM,
    isSaving: false, errors: {}, apiError: null,
  });

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean; user: User | null; isLoading: boolean;
  }>({ isOpen: false, user: null, isLoading: false });

  // ─── Cargar roles una sola vez ────────────────────────────────
  useEffect(() => {
    getRoles().then(setRoles).catch(console.error);
  }, []);

  // ─── Debounce del buscador ────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchInput, page: 0 }));
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false; // evitar setState si el componente se desmontó

    async function loadUsers() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await userService.getUsers(filters);
        if (!cancelled) {
          setUsers(data.content);
          setTotalPages(data.totalPages);
          setTotalElems(data.totalElements);
        }
      } catch {
        if (!cancelled) setError('Error al cargar los usuarios.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadUsers();

    return () => { cancelled = true; }; // cleanup: cancelar si filters cambia antes de respuesta
  }, [filters]); // ← depende de filters, no de fetchUsers

  // ─── Funciones de modal ───────────────────────────────────────
  function openCreate() {
    setModal({
      isOpen: true, editUser: null, form: EMPTY_FORM,
      isSaving: false, errors: {}, apiError: null,
    });
  }

  function openEdit(user: User) {
    setModal({
      isOpen: true,
      editUser: user,
      form: {
        username:   user.username,
        password:   '',
        active:     user.active,
        roleIds:    user.roles.map(r => r.id),
        employeeId: user.employee?.id ?? '',
      },
      isSaving: false, errors: {}, apiError: null,
    });
  }

  function closeModal() {
    setModal(prev => ({ ...prev, isOpen: false }));
  }

  function validate(form: UserFormData, isCreate: boolean): Partial<Record<keyof UserFormData, string>> {
    const errs: Partial<Record<keyof UserFormData, string>> = {};
    if (!form.username.trim()) errs.username = 'El nombre de usuario es obligatorio';
    else if (form.username.trim().length < 3) errs.username = 'Mínimo 3 caracteres';
    if (isCreate && !form.password) errs.password = 'La contraseña es obligatoria al crear';
    if (form.password && form.password.length < 6) errs.password = 'Mínimo 6 caracteres';
    return errs;
  }

  async function handleSave() {
    const isCreate = !modal.editUser;
    const errs = validate(modal.form, isCreate);

    if (Object.keys(errs).length > 0) {
      setModal(prev => ({ ...prev, errors: errs }));
      return;
    }

    setModal(prev => ({ ...prev, isSaving: true, apiError: null }));

    try {
      const payload: UserFormData = { ...modal.form, employeeId: modal.form.employeeId || '' };

      let saved: User;
      if (isCreate) {
        saved = await userService.createUser(payload);
        setUsers(prev => [saved, ...prev]);
        setTotalElems(prev => prev + 1);
      } else {
        saved = await userService.updateUser(modal.editUser!.id, payload);
        setUsers(prev => prev.map(u => u.id === saved.id ? saved : u));
      }
      closeModal();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const msg = err.response?.data?.message ?? 'Error al guardar el usuario.';
      setModal(prev => ({ ...prev, apiError: msg, isSaving: false }));
    }
  }

  async function handleToggleActive(user: User) {
    try {
      const updated = await userService.toggleUserActive(user.id);
      setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
    } catch {
      alert('Error al cambiar el estado del usuario.');
    }
  }

  async function handleConfirmDelete() {
    if (!deleteModal.user) return;
    setDeleteModal(prev => ({ ...prev, isLoading: true }));
    try {
      await userService.deleteUser(deleteModal.user.id);
      setUsers(prev => prev.filter(u => u.id !== deleteModal.user!.id));
      setTotalElems(prev => Math.max(0, prev - 1));
      setDeleteModal({ isOpen: false, user: null, isLoading: false });
    } catch {
      alert('Error al eliminar el usuario.');
      setDeleteModal(prev => ({ ...prev, isLoading: false }));
    }
  }

  // ─── Render ───────────────────────────────────────────────────
  return (
    <div className={styles.page}>

      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Usuarios</h1>
          <p className={styles.pageSubtitle}>
            {isLoading
              ? 'Cargando...'
              : `${totalElems} usuario${totalElems !== 1 ? 's' : ''} registrado${totalElems !== 1 ? 's' : ''}`
            }
          </p>
        </div>
        <button className={styles.btnPrimary} onClick={openCreate}>
          <svg style={{ width: '1rem', height: '1rem' }} fill="none" viewBox="0 0 24 24"
               stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Usuario
        </button>
      </div>

      {/* Filtros */}
      <div className={styles.filterPanel}>
        <div className={styles.searchWrapper}>
          <svg className={styles.searchIcon} fill="none" viewBox="0 0 24 24"
               stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Buscar por usuario..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla */}
      <div className={styles.tableCard}>

        {isLoading && <Spinner message="Cargando usuarios..." />}

        {!isLoading && error && (
          <EmptyState title="Error al cargar" description={error}
            action={
              <button className={styles.btnPrimary}
                onClick={() => setFilters(prev => ({ ...prev }))}>
                Reintentar
              </button>
            }
          />
        )}

        {!isLoading && !error && users.length === 0 && (
          <EmptyState
            title={searchInput ? 'Sin resultados' : 'No hay usuarios'}
            description={searchInput
              ? 'Ningún usuario coincide con la búsqueda.'
              : 'Aún no hay usuarios registrados.'}
            action={!searchInput
              ? <button className={styles.btnPrimary} onClick={openCreate}>Crear usuario</button>
              : undefined
            }
          />
        )}

        {!isLoading && !error && users.length > 0 && (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Roles</th>
                  <th>Estado</th>
                  <th>Última sesión</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div className={styles.userCell}>
                        <div className={styles.avatar}>{getInitials(user.username)}</div>
                        <div>
                          <div className={styles.username}>{user.username}</div>
                          {user.employee && (
                            <div className={styles.employeeName}>
                              {user.employee.firstName} {user.employee.lastName}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className={styles.roleTags}>
                        {user.roles.length === 0
                          ? <span className={styles.roleTagEmpty}>Sin roles</span>
                          : user.roles.map(r => (
                              <span key={r.id} className={styles.roleTag}>{r.name}</span>
                            ))
                        }
                      </div>
                    </td>
                    <td>
                      <span className={user.active ? styles.statusActive : styles.statusInactive}>
                        <span className={styles.statusDot} />
                        {user.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--color-text-secondary)', fontSize: '0.8125rem' }}>
                      {/* formatLastLogin está fuera del componente → no es problema */}
                      {formatLastLogin(user.lastLogin)}
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          className={`${styles.actionBtn} ${styles.actionBtnEdit}`}
                          onClick={() => openEdit(user)} title="Editar">
                          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round"
                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                          </svg>
                        </button>
                        <button
                          className={`${styles.actionBtn} ${styles.actionBtnToggle}`}
                          onClick={() => handleToggleActive(user)}
                          title={user.active ? 'Desactivar' : 'Activar'}>
                          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round"
                              d={user.active
                                ? "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                                : "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              } />
                          </svg>
                        </button>
                        <button
                          className={`${styles.actionBtn} ${styles.actionBtnDelete}`}
                          onClick={() => setDeleteModal({ isOpen: true, user, isLoading: false })}
                          title="Eliminar">
                          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && !error && totalPages > 1 && (
          <Pagination
            currentPage={filters.page}
            totalPages={totalPages}
            totalElements={totalElems}
            pageSize={filters.size}
            onPageChange={p => setFilters(prev => ({ ...prev, page: p }))}
          />
        )}
      </div>

      {/* Modal Crear/Editar */}
      {modal.isOpen && (
        <div className={styles.modalOverlay}
          onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className={styles.modalPanel}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {modal.editUser ? `Editar: ${modal.editUser.username}` : 'Nuevo Usuario'}
              </h2>
              <button className={styles.modalCloseBtn} onClick={closeModal}>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className={styles.modalBody}>
              {modal.apiError && (
                <div style={{
                  background: 'var(--color-danger-light)',
                  border: '1px solid #fca5a5',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem 1rem',
                  color: 'var(--color-danger)',
                  fontSize: '0.875rem',
                }}>
                  {modal.apiError}
                </div>
              )}

              <div className={styles.field}>
                <label className={styles.label}>
                  Nombre de usuario<span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={`${styles.input} ${modal.errors.username ? styles.inputError : ''}`}
                  value={modal.form.username}
                  onChange={e => setModal(prev => ({
                    ...prev,
                    form: { ...prev.form, username: e.target.value },
                    errors: { ...prev.errors, username: undefined },
                  }))}
                  placeholder="juan.perez"
                  maxLength={50}
                />
                {modal.errors.username && (
                  <span className={styles.errorMsg}>{modal.errors.username}</span>
                )}
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Contraseña{!modal.editUser && <span className={styles.required}>*</span>}
                </label>
                <input
                  type="password"
                  className={`${styles.input} ${modal.errors.password ? styles.inputError : ''}`}
                  value={modal.form.password}
                  onChange={e => setModal(prev => ({
                    ...prev,
                    form: { ...prev.form, password: e.target.value },
                    errors: { ...prev.errors, password: undefined },
                  }))}
                  placeholder={modal.editUser ? 'Dejar vacío para mantener la actual' : 'Mínimo 6 caracteres'}
                  autoComplete="new-password"
                />
                {modal.errors.password && (
                  <span className={styles.errorMsg}>{modal.errors.password}</span>
                )}
                {modal.editUser && (
                  <span className={styles.hint}>
                    Si dejas vacío este campo, la contraseña no se modifica.
                  </span>
                )}
              </div>

              <label className={styles.checkboxRow} style={{ cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={modal.form.active}
                  onChange={e => setModal(prev => ({
                    ...prev, form: { ...prev.form, active: e.target.checked }
                  }))}
                />
                <span className={styles.checkboxLabel}>Usuario activo</span>
              </label>

              <div className={styles.field}>
                <label className={styles.label}>Roles</label>
                <div className={styles.rolesSelector}>
                  {roles.length === 0
                    ? <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                        No hay roles disponibles.
                      </p>
                    : roles.map(role => {
                        const isSelected = modal.form.roleIds.includes(role.id);
                        return (
                          <label key={role.id}
                            className={`${styles.roleOption} ${isSelected ? styles.roleOptionSelected : ''}`}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {
                                const next = isSelected
                                  ? modal.form.roleIds.filter(id => id !== role.id)
                                  : [...modal.form.roleIds, role.id];
                                setModal(prev => ({ ...prev, form: { ...prev.form, roleIds: next } }));
                              }}
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
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.btnCancel} onClick={closeModal} disabled={modal.isSaving}>
                Cancelar
              </button>
              <button className={styles.btnSave} onClick={handleSave} disabled={modal.isSaving}>
                {modal.isSaving
                  ? <><Spinner size="sm" /> Guardando...</>
                  : modal.editUser ? 'Guardar cambios' : 'Crear usuario'
                }
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Eliminar usuario"
        message={deleteModal.user
          ? `¿Estás seguro de que deseas eliminar al usuario "${deleteModal.user.username}"?`
          : ''}
        confirmLabel="Sí, eliminar"
        isLoading={deleteModal.isLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, user: null, isLoading: false })}
      />
    </div>
  );
}