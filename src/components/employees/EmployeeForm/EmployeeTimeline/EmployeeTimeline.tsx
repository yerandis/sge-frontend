import { useState, useEffect } from 'react';
import { getEmployeeHistory, type EmployeeHistoryEntry } from '../../../../services/employeeService';
import Spinner from '../../../ui/Spinner/Spinner';
import styles from './EmployeeTimeline.module.css';

// Mapa de etiquetas legibles para campos técnicos
const FIELD_LABELS: Record<string, string> = {
  firstName:    'Nombre',
  lastName:     'Apellido',
  email:        'Email',
  salary:       'Salario',
  position:     'Cargo',
  status:       'Estado',
  phone:        'Teléfono',
  hireDate:     'Fecha contratación',
  departmentId: 'Departamento',
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  if (mins < 60)  return `hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)   return `hace ${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 30)  return `hace ${days} día${days !== 1 ? 's' : ''}`;
  const months = Math.floor(days / 30);
  return `hace ${months} mes${months !== 1 ? 'es' : ''}`;
}

export default function EmployeeTimeline({ employeeId }: { employeeId: string }) {
    
  const [history,   setHistory]   = useState<EmployeeHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState<string | null>(null);

  useEffect(() => {
    getEmployeeHistory(employeeId)
      .then(setHistory)
      .catch(() => setError('No se pudo cargar el historial.'))
      .finally(() => setIsLoading(false));
  }, [employeeId]);

  if (isLoading) return <Spinner message="Cargando historial..." />;
  if (error)     return <p style={{ color: 'var(--color-danger)' }}>{error}</p>;
  if (history.length === 0) return <p style={{ color: 'var(--color-text-secondary)' }}>Sin historial de cambios.</p>;

  return (
    <div className={styles.timeline}>
      {history.map((entry, index) => (
        <div key={entry.id} className={styles.entry}>
          {/* Línea vertical */}
          <div className={styles.lineWrapper}>
            <div className={`${styles.dot} ${entry.action === 'CREATE' ? styles.dotCreate : styles.dotUpdate}`} />
            {index < history.length - 1 && <div className={styles.line} />}
          </div>

          {/* Contenido */}
          <div className={styles.content}>
            <div className={styles.header}>
              <span className={styles.action}>
                {entry.action === 'CREATE' ? 'Creado' : 'Editado'} por{' '}
                <strong>{entry.username}</strong>
              </span>
              <span className={styles.time}>{timeAgo(entry.createdAt)}</span>
            </div>

            {/* Cambios campo a campo */}
            {entry.changes.length > 0 && (
              <ul className={styles.changes}>
                {entry.changes.map(change => (
                  <li key={change.field} className={styles.change}>
                    <span className={styles.fieldName}>
                      {FIELD_LABELS[change.field] ?? change.field}:
                    </span>
                    <span className={styles.oldValue}>{change.oldValue || '—'}</span>
                    <span className={styles.arrow}>→</span>
                    <span className={styles.newValue}>{change.newValue || '—'}</span>
                  </li>
                ))}
              </ul>
            )}

            {entry.action === 'CREATE' && (
              <p className={styles.createMsg}>Empleado registrado en el sistema.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}