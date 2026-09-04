import { useState, useEffect } from 'react';
import * as roleService from '../../services/roleService';
import type { Role, Permission, RoleFormData, PermissionGroup } from '../../types/role.types';
import ConfirmModal from '../../components/ui/ConfirmModal/ConfirmModal';
import Spinner from '../../components/ui/Spinner/Spinner';
import styles from './RolesPage.module.css';

// ─── Valores iniciales del formulario ────────────────────────────
const EMPTY_FORM: RoleFormData = {
  name: '', description: '', isDefault: false, permissionIds: [],
};

export default function RolesPage() {

  const [roles,       setRoles]       = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [permGroups,  setPermGroups]  = useState<PermissionGroup[]>([]);
  const [isLoading,   setIsLoading]   = useState(true);
  const [error,       setError]       = useState<string | null>(null);

  // ── Estado del modal de formulario ───────────────────────────
  const [modal, setModal] = useState<{
    isOpen:    boolean;
    editRole:  Role | null;
    form:      RoleFormData;
    isSaving:  boolean;
    formError: string | null;
  }>({
    isOpen: false, editRole: null,
    form: EMPTY_FORM, isSaving: false, formError: null,
  });

  // ── Estado del modal de confirmación de eliminación ──────────
  const [deleteModal, setDeleteModal] = useState<{
    isOpen:    boolean;
    role:      Role | null;
    isLoading: boolean;
  }>({ isOpen: false, role: null, isLoading: false });

  // ── Rol expandido (para ver todos los permisos en la tarjeta) ─
  const [expandedRole, setExpandedRole] = useState<string | null>(null);

  // ─── Carga inicial ────────────────────────────────────────────
  useEffect(() => {
    Promise.all([roleService.getRoles(), roleService.getAllPermissions()])
      .then(([rolesData, permsData]) => {
        setRoles(rolesData);
        setPermissions(permsData);
        setPermGroups(roleService.groupPermissionsByModule(permsData));
      })
      .catch(() => setError('Error al cargar los datos. Verifica tu conexión.'))
      .finally(() => setIsLoading(false));
  }, []);

  // ─── Abrir modal para crear ───────────────────────────────────
  function openCreateModal() {
    setModal({ isOpen: true, editRole: null, form: EMPTY_FORM, isSaving: false, formError: null });
  }

  // ─── Abrir modal para editar ──────────────────────────────────
  function openEditModal(role: Role) {
    setModal({
      isOpen: true,
      editRole: role,
      form: {
        name:          role.name,
        description:   role.description ?? '',
        isDefault:     role.isDefault,
        permissionIds: role.permissions.map(p => p.id),
      },
      isSaving: false,
      formError: null,
    });
  }

  function closeModal() {
    setModal(prev => ({ ...prev, isOpen: false }));
  }

  // ─── Cambiar campo del formulario ─────────────────────────────
  function handleFormChange(field: keyof RoleFormData, value: string | boolean | string[]) {
    setModal(prev => ({
      ...prev,
      form: { ...prev.form, [field]: value },
      formError: null,
    }));
  }

  // ─── Toggle de permiso individual ────────────────────────────
  function togglePermission(permId: string) {
    const current = modal.form.permissionIds;
    const next = current.includes(permId)
      ? current.filter(id => id !== permId)
      : [...current, permId];
    handleFormChange('permissionIds', next);
  }

  // ─── Seleccionar/deseleccionar todos los permisos de un módulo
  function toggleModule(group: PermissionGroup) {
    const groupIds  = group.permissions.map(p => p.id);
    const current   = modal.form.permissionIds;
    const allSelected = groupIds.every(id => current.includes(id));

    const next = allSelected
      ? current.filter(id => !groupIds.includes(id))   // deseleccionar todos del módulo
      : [...new Set([...current, ...groupIds])];         // agregar todos del módulo

    handleFormChange('permissionIds', next);
  }

  // ─── Seleccionar/deseleccionar TODOS los permisos ────────────
  function toggleAllPermissions() {
    const allIds = permissions.map(p => p.id);
    const allSelected = allIds.every(id => modal.form.permissionIds.includes(id));
    handleFormChange('permissionIds', allSelected ? [] : allIds);
  }

  // ─── Guardar (crear o actualizar) ─────────────────────────────
  async function handleSave() {
    if (!modal.form.name.trim()) {
      setModal(prev => ({ ...prev, formError: 'El nombre del rol es obligatorio.' }));
      return;
    }

    setModal(prev => ({ ...prev, isSaving: true, formError: null }));
    try {
      let saved: Role;
      if (modal.editRole) {
        saved = await roleService.updateRole(modal.editRole.id, modal.form);
        setRoles(prev => prev.map(r => r.id === saved.id ? saved : r));
      } else {
        saved = await roleService.createRole(modal.form);
        setRoles(prev => [...prev, saved]);
      }
      closeModal();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const msg = err.response?.data?.message ?? 'Error al guardar el rol.';
      setModal(prev => ({ ...prev, formError: msg, isSaving: false }));
    }
  }

  // ─── Eliminar ─────────────────────────────────────────────────
  function openDeleteModal(role: Role) {
    setDeleteModal({ isOpen: true, role, isLoading: false });
  }

  async function handleConfirmDelete() {
    if (!deleteModal.role) return;
    setDeleteModal(prev => ({ ...prev, isLoading: true }));
    try {
      await roleService.deleteRole(deleteModal.role.id);
      setRoles(prev => prev.filter(r => r.id !== deleteModal.role!.id));
      setDeleteModal({ isOpen: false, role: null, isLoading: false });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const msg = err.response?.data?.message ?? 'Error al eliminar.';
      alert(msg);
      setDeleteModal(prev => ({ ...prev, isLoading: false }));
    }
  }

  // ─── RENDER ───────────────────────────────────────────────────
  if (isLoading) return <Spinner message="Cargando roles y permisos..." />;

  const totalPerms = permissions.length;
  const selectedCount = modal.form.permissionIds.length;

  return (
    <div className={styles.page}>

      {/* Cabecera */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Roles y Permisos</h1>
          <p className={styles.pageSubtitle}>
            {roles.length} rol{roles.length !== 1 ? 'es' : ''} · {totalPerms} permisos disponibles
          </p>
        </div>
        <button className={styles.btnPrimary} onClick={openCreateModal}>
          <svg style={{ width: '1rem', height: '1rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Rol
        </button>
      </div>

      {error && (
        <div style={{ color: 'var(--color-danger)', padding: '1rem',
          background: 'var(--color-danger-light)', borderRadius: 'var(--radius-md)' }}>
          {error}
        </div>
      )}

      {/* Grid de tarjetas de roles */}
      <div className={styles.rolesGrid}>
        {roles.map(role => {
          const isExpanded   = expandedRole === role.id;
          const visiblePerms = isExpanded ? role.permissions : role.permissions.slice(0, 6);
          const hiddenCount  = role.permissions.length - 6;

          return (
            <div key={role.id} className={styles.roleCard}>

              {/* Header de la tarjeta */}
              <div className={styles.roleCardHeader}>
                <div>
                  <div className={styles.roleNameRow}>
                    <span className={styles.roleName}>{role.name}</span>
                    {role.isSystem  && <span className={styles.badgeSystem}>Sistema</span>}
                    {role.isDefault && <span className={styles.badgeDefault}>Por defecto</span>}
                  </div>
                </div>
                <div className={styles.roleActions}>
                  <button
                    className={`${styles.actionBtn} ${styles.actionBtnEdit}`}
                    onClick={() => openEditModal(role)}
                    title="Editar rol"
                  >
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                    </svg>
                  </button>
                  {!role.isSystem && (
                    <button
                      className={`${styles.actionBtn} ${styles.actionBtnDelete}`}
                      onClick={() => openDeleteModal(role)}
                      title="Eliminar rol"
                    >
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Descripción */}
              <div className={styles.roleDescription}>
                {role.description ?? <span style={{ fontStyle: 'italic', opacity: 0.5 }}>Sin descripción</span>}
              </div>

              {/* Permisos */}
              <div className={styles.rolePermsSection}>
                <div className={styles.rolePermsHeader}>
                  <span className={styles.rolePermsTitle}>Permisos</span>
                  <span className={styles.rolePermsCount}>{role.permissionCount}</span>
                </div>
                <div className={styles.permTagsWrapper}>
                  {role.permissionCount === 0 && (
                    <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-disabled)', fontStyle: 'italic' }}>
                      Sin permisos asignados
                    </span>
                  )}
                  {visiblePerms.map(p => (
                    <span key={p.id} className={styles.permTag} title={p.name}>
                      {p.code}
                    </span>
                  ))}
                  {!isExpanded && hiddenCount > 0 && (
                    <button
                      className={styles.permTagMore}
                      onClick={() => setExpandedRole(role.id)}
                    >
                      +{hiddenCount} más
                    </button>
                  )}
                  {isExpanded && (
                    <button
                      className={styles.permTagMore}
                      onClick={() => setExpandedRole(null)}
                    >
                      Mostrar menos
                    </button>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* ── MODAL: Crear / Editar Rol ────────────────────────────── */}
      {modal.isOpen && (
        <div className={styles.modalOverlay} onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className={styles.modalPanel}>

            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {modal.editRole ? `Editar: ${modal.editRole.name}` : 'Nuevo Rol'}
              </h2>
              <button className={styles.modalCloseBtn} onClick={closeModal}>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className={styles.modalBody}>

              {/* Nombre */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Nombre del rol <span style={{ color: 'var(--color-danger)' }}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.input}
                  value={modal.form.name}
                  onChange={e => handleFormChange('name', e.target.value)}
                  placeholder="Ej: Responsable de Ventas"
                  maxLength={100}
                />
                {modal.formError && <span className={styles.errorMsg}>{modal.formError}</span>}
              </div>

              {/* Descripción */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Descripción</label>
                <textarea
                  className={styles.textarea}
                  value={modal.form.description}
                  onChange={e => handleFormChange('description', e.target.value)}
                  placeholder="Describe qué puede hacer este rol..."
                  maxLength={500}
                  rows={2}
                />
              </div>

              {/* Default */}
              <div className={styles.formGroup}>
                <label className={styles.checkboxRow} style={{ cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={modal.form.isDefault}
                    onChange={e => handleFormChange('isDefault', e.target.checked)}
                  />
                  <div>
                    <div className={styles.checkboxLabel}>Rol por defecto</div>
                    <div className={styles.checkboxHint}>
                      Se asignará automáticamente a los nuevos usuarios
                    </div>
                  </div>
                </label>
              </div>

              {/* Selector de permisos */}
              <div className={styles.permissionsSection}>
                <div className={styles.permissionsSectionTitle}>
                  <span>
                    Permisos
                    {' '}
                    <span style={{ fontWeight: 400, color: 'var(--color-text-secondary)' }}>
                      ({selectedCount} de {totalPerms} seleccionados)
                    </span>
                  </span>
                  <button className={styles.selectAllBtn} onClick={toggleAllPermissions}>
                    {selectedCount === totalPerms ? 'Deseleccionar todos' : 'Seleccionar todos'}
                  </button>
                </div>

                {permGroups.map(group => {
                  const groupIds      = group.permissions.map(p => p.id);
                  const selectedInGrp = groupIds.filter(id => modal.form.permissionIds.includes(id)).length;
                  const allInGrp      = selectedInGrp === groupIds.length;

                  return (
                    <div key={group.module} className={styles.moduleGroup}>
                      <div
                        className={styles.moduleHeader}
                        onClick={() => toggleModule(group)}
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                      >
                        <span>{group.module}</span>
                        {selectedInGrp > 0 && (
                          <span className={styles.moduleSelectedCount}>
                            {selectedInGrp}/{groupIds.length}
                          </span>
                        )}
                      </div>

                      {group.permissions.map(perm => (
                        <label key={perm.id} className={styles.permissionCheckbox}>
                          <input
                            type="checkbox"
                            checked={modal.form.permissionIds.includes(perm.id)}
                            onChange={() => togglePermission(perm.id)}
                          />
                          <div className={styles.permissionInfo}>
                            <div className={styles.permissionName}>{perm.name}</div>
                            <div className={styles.permissionCode}>{perm.code}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  );
                })}
              </div>

            </div>

            <div className={styles.modalFooter}>
              <button className={styles.btnCancel} onClick={closeModal} disabled={modal.isSaving}>
                Cancelar
              </button>
              <button className={styles.btnSave} onClick={handleSave} disabled={modal.isSaving}>
                {modal.isSaving
                  ? <><Spinner size="sm" /> Guardando...</>
                  : modal.editRole ? 'Guardar cambios' : 'Crear rol'
                }
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── MODAL: Confirmar eliminación ─────────────────────────── */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Eliminar rol"
        message={deleteModal.role
          ? `¿Estás seguro de que deseas eliminar el rol "${deleteModal.role.name}"? Los usuarios que tengan este rol perderán los permisos asociados.`
          : ''}
        confirmLabel="Sí, eliminar"
        isLoading={deleteModal.isLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, role: null, isLoading: false })}
      />

    </div>
  );
}