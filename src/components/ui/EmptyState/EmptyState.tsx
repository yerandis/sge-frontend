import type { ReactNode } from 'react';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
    title?:         string;
    description?:   string;
    action?:        ReactNode;
}

export default function EmptyState({
  title = 'Sin resultados',
  description = 'No se encontraron registros con los criterios de búsqueda actuales.',
  action,
}: EmptyStateProps) {
  return (
    <div className={styles.wrapper}>
      {/* Icono de bandeja vacía */}
      <svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}