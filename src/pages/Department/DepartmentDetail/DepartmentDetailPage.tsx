import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { Department } from "../../../types/department.types";
import { deleteDepartment, getDepartmentById } from "../../../services/departmentService";
import Spinner from "../../../components/ui/Spinner/Spinner";
import styles from './DepartmentDetailPage.module.css';
import { getInitials } from "../../../utils/formatters";
import ConfirmModal from "../../../components/ui/ConfirmModal/ConfirmModal";

export default function DepartmentDetailPage() {
    const {id} = useParams<{id: string}> ();
    const navigate = useNavigate();

    const [department, setDepartment]   = useState<Department | null>(null);
    const [isLoading,     setIsLoading]   = useState(true);
    const [error,         setError]       = useState<string | null>(null);
    const [deleteModal,   setDeleteModal] = useState({ isOpen: false, isLoading: false });

  useEffect(() => {
    if (!id) return;
    getDepartmentById(id)
      .then(setDepartment)
      .catch(() => setError('Departamento no encontrado o eliminado.'))
      .finally(() => setIsLoading(false));
  }, [id]);

  async function handleDelete() {
    if (!department) return;
    setDeleteModal(prev => ({ ...prev, isLoading: true }));
    try {
      await deleteDepartment(department.id);
      navigate('/departments');
    } catch {
      setDeleteModal({ isOpen: false, isLoading: false });
      alert('Error al eliminar el departamento.');
    }
  }

  if (isLoading) return <Spinner message="Cargando departamento..." />;
  if (error || !department) {
    return (
      <div>
        <p style={{ color: 'var(--color-danger)', marginBottom: '1rem' }}>{error}</p>
        <Link to="/departments">← Volver a la lista</Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>

      {/* ── CABECERA ──────────────────────────────────────── */}
      <div className={styles.pageHeader}>
        <Link to="/departments" className={styles.backBtn}>
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className={styles.headerInfo}>
          <h1 className={styles.pageTitle}>{department.name} </h1>
        </div>
        <div className={styles.headerActions}>
          <Link to={`/departments/${department.id}/edit`} className={styles.btnEdit}>
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
          {getInitials(department.name, '')}
        </div>
        <div>
          <div className={styles.profileName}>{department.name} </div>
          <div className={styles.profilePosition}>{department.description} </div>
        </div>
      </div>

      {/* ── MODAL DE ELIMINACIÓN ───────────────────────── */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Eliminar departamento"
        message={`¿Estás seguro de que deseas eliminar el departamento ${department.name}? Esta acción no se puede deshacer.`}
        confirmLabel="Sí, eliminar"
        isLoading={deleteModal.isLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ isOpen: false, isLoading: false })}
      />
    </div>
  );
}