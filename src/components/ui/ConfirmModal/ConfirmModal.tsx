import styles from './ConfirmModal.module.css';
import Spinner from '../Spinner/Spinner';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Modal de confirmación genérico.
 * Se usa antes de cualquier acción destructiva (eliminar).
 *
 * Nunca elimines directamente. Siempre pide confirmación.
 * Esto evita eliminaciones accidentales y es una práctica UX fundamental.
 *
 * El modal se "monta/desmonta" del DOM basado en 'isOpen'.
 * Cuando isOpen=false, el modal no existe en el DOM.
 */
export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Eliminar',
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  // Si no está abierto, no renderizamos nada
  if (!isOpen) return null;

  /**
   * Cierra el modal al hacer clic en el overlay (fuera del panel).
   * stopPropagation en el panel evita que el clic en el panel propague al overlay.
   */
  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  }

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.panel}>

        {/* Icono de advertencia */}
        <div className={styles.iconWrapper}>
          <svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>

        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>

        <div className={styles.actions}>
          <button
            className={styles.btnCancel}
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            className={styles.btnConfirm}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner size="sm" />
                Eliminando...
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>

      </div>
    </div>
  );
}