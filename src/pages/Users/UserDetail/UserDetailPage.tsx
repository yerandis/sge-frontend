import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Badge from "../../../components/ui/Badge/Badge";
import Breadcrumb from "../../../components/ui/Breadcrumb/Breadcrumb";
import ConfirmModal from "../../../components/ui/ConfirmModal/ConfirmModal";
import Spinner from "../../../components/ui/Spinner/Spinner";
import { useBreadcrumb } from "../../../hooks/useBreadcrumb";
import { getInitials, formatDateTime } from "../../../utils/formatters";
import styles from './UserDetailPage.module.css';
import type { User } from "../../../types/user.types";
import { deleteUser, getUserById } from "../../../services/userServices";
import type { EmployeeStatus } from "../../../types/employee.types";

export default function UserDetailPage() {
  const { id }   = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [user,          setUsers]       = useState<User | null>(null);
  const [isLoading,     setIsLoading]   = useState(true);
  const [error,         setError]       = useState<string | null>(null);
  const [deleteModal,   setDeleteModal] = useState({ isOpen: false, isLoading: false });

  const breadcrumb = useBreadcrumb(
    user ? `${user.firstName} ${user.lastName}` : undefined
  );

  // ── Rol expandido (para ver todos los permisos en la tarjeta) ─
  const [expandedRole, setExpandedRole] = useState<string | null>(null);


  useEffect(() => {
    if (!id) return;
    getUserById(id)
      .then(setUsers)
      .catch(() => setError('Usuario no encontrado o eliminado.'))
      .finally(() => setIsLoading(false));
  }, [id]);

  function userStatus(status: boolean): EmployeeStatus {
    return status ? 'ACTIVE' : 'INACTIVE';
  }

  async function handleDelete() {
    if (!user) return;
    setDeleteModal(prev => ({ ...prev, isLoading: true }));
    try {
      await deleteUser(user.id);
      navigate('/users');
    } catch {
      setDeleteModal({ isOpen: false, isLoading: false });
      alert('Error al eliminar el usuario.');
    }
  }

  if (isLoading) return <Spinner message="Cargando usuario..." />;
  if (error || !user) {
    return (
      <div>
        <p style={{ color: 'var(--color-danger)', marginBottom: '1rem' }}>{error}</p>
        <Link to="/users">← Volver a la lista</Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Breadcrumb items={breadcrumb} />

      {/* ── CABECERA ──────────────────────────────────────── */}
      <div className={styles.pageHeader}>
        <Link to="/users" className={styles.backBtn}>
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className={styles.headerInfo}>
          <h1 className={styles.pageTitle}>{user.firstName} {user.lastName}</h1>
          <p className={styles.pageSubtitle}>Ficha del usuario · ID #{user.id}</p>
        </div>
        <div className={styles.headerActions}>
          <Link to={`/users/${user.id}/edit`} className={styles.btnEdit}>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
            </svg>
            Editar
          </Link>
          <button
            className={`${styles.btnEdit}`}
            style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}
            onClick={() => setDeleteModal({ isOpen: true, isLoading: false })}
          >
            Eliminar
          </button>
        </div>
      </div>

      {/* ── TARJETA DE PERFIL ──────────────────────────── */}
      <div className={styles.profileCard}>
        <div className={styles.avatar}>
          {getInitials(user.firstName, user.lastName)}
        </div>
        <div>
          <div className={styles.profileName}>{user.firstName} {user.lastName}</div>
          <div className={styles.profilePosition}>{user.username} · {user.employee?.firstName} · {user.employee?.lastName}</div>
          <div className={styles.profileBadge}><Badge status={userStatus(user.active)} /></div>
        </div>
      </div>

      {/* ── INFORMACIÓN DE CONTACTO ────────────────────── */}
      <div className={styles.detailCard}>
        <div className={styles.detailHeader}>Información de contacto</div>
        <div className={styles.detailGrid}>
          <div className={styles.detailItem}>
            <div className={styles.detailLabel}>Email</div>
            <div className={styles.detailValue}>{user.email}</div>
          </div>
          <div className={styles.detailItem}>
            <div className={styles.detailLabel}>Roles</div>
            <div className={styles.rolesGrid}>
        {user.roles.map(role => {
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
          </div>
        </div>
      </div>

      {/* ── INFORMACIÓN LABORAL ────────────────────────── */}
      <div className={styles.detailCard}>
        <div className={styles.detailHeader}>Información laboral</div>
        <div className={styles.detailGrid}>
          <div className={styles.detailItem}>
            <div className={styles.detailLabel}>Estado</div>
            <div className={styles.detailValue}><Badge status={userStatus(user.active)} /></div>
          </div>
          <div className={styles.detailItem}>
            <div className={styles.detailLabel}>Empleado</div>
            <div className={styles.detailValue}>{user.employee?.firstName} {user.employee?.lastName}</div>
          </div>
        </div>
      </div>

      {/* ── AUDITORÍA ──────────────────────────────────── */}
      <div className={styles.detailCard}>
        <div className={styles.detailHeader}>Registro del sistema</div>
        <div className={styles.detailGrid}>
          <div className={styles.detailItem}>
            <div className={styles.detailLabel}>Fecha de creación</div>
            <div className={`${styles.detailValue} ${styles.detailValueMuted}`}>
              {formatDateTime(user.createdAt)}
            </div>
          </div>
          <div className={styles.detailItem}>
            <div className={styles.detailLabel}>Última modificación</div>
            <div className={`${styles.detailValue} ${styles.detailValueMuted}`}>
              {formatDateTime(user.updatedAt)}
            </div>
          </div>
        </div>
      </div>

      {/* ── MODAL DE ELIMINACIÓN ───────────────────────── */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Eliminar usuario"
        message={`¿Estás seguro de que deseas eliminar a ${user.firstName} ${user.lastName}? Esta acción no se puede deshacer.`}
        confirmLabel="Sí, eliminar"
        isLoading={deleteModal.isLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ isOpen: false, isLoading: false })}
      />
    </div>
  );
}