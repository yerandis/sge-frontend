import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getEmployeeById, deleteEmployee } from '../../../services/employeeService';
import type { Employee } from '../../../types/employee.types';
import Badge from '../../../components/ui/Badge/Badge';
import Spinner from '../../../components/ui/Spinner/Spinner';
import ConfirmModal from '../../../components/ui/ConfirmModal/ConfirmModal';
import { formatCurrency, formatDate, formatDateTime, getInitials } from '../../../utils/formatters';
import styles from './EmployeeDetailPage.module.css';
// import Breadcrumb from '../../../components/ui/Breadcrumb/Breadcrumb';
// import { useBreadcrumb } from '../../../hooks/useBreadcrumb';

export default function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [employee,      setEmployee]    = useState<Employee | null>(null);
  const [isLoading,     setIsLoading]   = useState(true);
  const [error,         setError]       = useState<string | null>(null);
  const [deleteModal,   setDeleteModal] = useState({ isOpen: false, isLoading: false });

// const breadcrumb = useBreadcrumb(
//   employee ? `${employee.firstName} ${employee.lastName}` : undefined
// );

  useEffect(() => {
    if (!id) return;
    getEmployeeById(id)
      .then(setEmployee)
      .catch(() => setError('Empleado no encontrado o eliminado.'))
      .finally(() => setIsLoading(false));
  }, [id]);

  async function handleDelete() {
    if (!employee) return;
    setDeleteModal(prev => ({ ...prev, isLoading: true }));
    try {
      await deleteEmployee(employee.id);
      navigate('/employees');
    } catch {
      setDeleteModal({ isOpen: false, isLoading: false });
      alert('Error al eliminar el empleado.');
    }
  }

  if (isLoading) return <Spinner message="Cargando empleado..." />;
  if (error || !employee) {
    return (
      <div>
        <p style={{ color: 'var(--color-danger)', marginBottom: '1rem' }}>{error}</p>
        <Link to="/employees">← Volver a la lista</Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* <Breadcrumb items={breadcrumb} /> */}

      {/* ── CABECERA ──────────────────────────────────────── */}
      <div className={styles.pageHeader}>
        <Link to="/employees" className={styles.backBtn}>
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className={styles.headerInfo}>
          <h1 className={styles.pageTitle}>{employee.firstName} {employee.lastName}</h1>
          <p className={styles.pageSubtitle}>Ficha del empleado · ID #{employee.id}</p>
        </div>
        <div className={styles.headerActions}>
          <Link to={`/employees/${employee.id}/edit`} className={styles.btnEdit}>
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
          {getInitials(employee.firstName, employee.lastName)}
        </div>
        <div>
          <div className={styles.profileName}>{employee.firstName} {employee.lastName}</div>
          <div className={styles.profilePosition}>{employee.position} · {employee.department.name}</div>
          <div className={styles.profileBadge}><Badge status={employee.status} /></div>
        </div>
      </div>

      {/* ── INFORMACIÓN DE CONTACTO ────────────────────── */}
      <div className={styles.detailCard}>
        <div className={styles.detailHeader}>Información de contacto</div>
        <div className={styles.detailGrid}>
          <div className={styles.detailItem}>
            <div className={styles.detailLabel}>Email</div>
            <div className={styles.detailValue}>{employee.email}</div>
          </div>
          <div className={styles.detailItem}>
            <div className={styles.detailLabel}>Teléfono</div>
            <div className={`${styles.detailValue} ${!employee.phone ? styles.detailValueMuted : ''}`}>
              {employee.phone || '—'}
            </div>
          </div>
        </div>
      </div>

      {/* ── INFORMACIÓN LABORAL ────────────────────────── */}
      <div className={styles.detailCard}>
        <div className={styles.detailHeader}>Información laboral</div>
        <div className={styles.detailGrid}>
          <div className={styles.detailItem}>
            <div className={styles.detailLabel}>Cargo</div>
            <div className={styles.detailValue}>{employee.position}</div>
          </div>
          <div className={styles.detailItem}>
            <div className={styles.detailLabel}>Departamento</div>
            <div className={styles.detailValue}>{employee.department.name}</div>
          </div>
          <div className={styles.detailItem}>
            <div className={styles.detailLabel}>Salario bruto anual</div>
            <div className={`${styles.detailValue} ${styles.salaryValue}`}>
              {formatCurrency(employee.salary)}
            </div>
          </div>
          <div className={styles.detailItem}>
            <div className={styles.detailLabel}>Fecha de contratación</div>
            <div className={styles.detailValue}>{formatDate(employee.hireDate)}</div>
          </div>
          <div className={styles.detailItem}>
            <div className={styles.detailLabel}>Estado</div>
            <div className={styles.detailValue}><Badge status={employee.status} /></div>
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
              {formatDateTime(employee.createdAt)}
            </div>
          </div>
          <div className={styles.detailItem}>
            <div className={styles.detailLabel}>Última modificación</div>
            <div className={`${styles.detailValue} ${styles.detailValueMuted}`}>
              {formatDateTime(employee.updatedAt)}
            </div>
          </div>
        </div>
      </div>

      {/* ── MODAL DE ELIMINACIÓN ───────────────────────── */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Eliminar empleado"
        message={`¿Estás seguro de que deseas eliminar a ${employee.firstName} ${employee.lastName}? Esta acción no se puede deshacer.`}
        confirmLabel="Sí, eliminar"
        isLoading={deleteModal.isLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ isOpen: false, isLoading: false })}
      />
    </div>
  );
}