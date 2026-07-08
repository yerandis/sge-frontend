import styles from './DashboardPage.module.css';
import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: number | null;          // null = cargando
  icon: ReactNode;
  footer?: string;
  accentColor: string;           // color CSS custom property value
  iconBgColor: string;
}

/**
 * Tarjeta de estadística del Dashboard.
 *
 * Cuando value es null, muestra un skeleton de carga.
 * Cuando value está disponible, muestra el número.
 *
 * El accentColor se pasa como variable CSS inline,
 * lo que permite reutilizar el mismo componente con distintos colores.
 */
export default function StatCard({
  label,
  value,
  icon,
  footer,
  accentColor,
  iconBgColor,
}: StatCardProps) {
  /**
   * style={{ '--card-accent': accentColor } as React.CSSProperties}
   * Define variables CSS locales para este elemento y sus descendientes.
   * El CSS del componente usa var(--card-accent) para leer el color.
   * Es un patrón elegante para componentes con variantes de color dinámicas.
   */
  return (
    <div
      className={styles.card}
      style={{
        '--card-accent': accentColor,
        '--card-icon-bg': iconBgColor,
      } as React.CSSProperties}
    >
      <div className={styles.cardHeader}>
        <span className={styles.cardLabel}>{label}</span>
        <div className={styles.cardIcon}>{icon}</div>
      </div>

      {/* Valor o skeleton de carga */}
      {value === null ? (
        <div className={`${styles.skeleton} ${styles.skeletonValue}`} />
      ) : (
        <div className={styles.cardValue}>{value.toLocaleString('es-ES')}</div>
      )}

      {footer && (
        <div className={styles.cardFooter}>{footer}</div>
      )}
    </div>
  );
}