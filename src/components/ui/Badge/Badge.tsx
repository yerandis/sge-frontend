import type { EmployeeStatus } from '../../../types/employee.types';
import styles from './Badge.module.css';

interface BadgeProps {
  status: EmployeeStatus;
}

/**
 * Badge: muestra el estado del empleado con un punto de color.
 *
 * Props tipadas con TypeScript: 'status' solo puede ser 'ACTIVE' o 'INACTIVE'.
 * TypeScript no compilará si pasas cualquier otro valor.
 *
 * 🔄 Comparación Java:
 * Props en React ≈ parámetros de un método en Java.
 * BadgeProps ≈ una clase de parámetros o un record de Java 16+.
 */

export default function Badge({ status }: BadgeProps) {
  const isActive = status === 'ACTIVE';

  return (
    <span className={`${styles.badge} ${isActive ? styles.active : styles.inactive}`}>
      <span className={styles.dot} />
      {isActive ? 'Activo' : 'Inactivo'}
    </span>
  );
}