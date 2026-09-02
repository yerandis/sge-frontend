// import { useNotificationContext } from '../../context/NotificationContext';
import { useNotificationContext } from '../../hooks/useNotificationContext';
import styles from './Notifications.module.css';

export default function NotificationToast() {
  const { toastNotification, dismissToast } = useNotificationContext();

  if (!toastNotification) return null;

  const icons: Record<string, string> = {
    EMPLOYEE_CREATED: '✅',
    EMPLOYEE_UPDATED: '✏️',
    EMPLOYEE_DELETED: '🗑️',
    SYSTEM: 'ℹ️',
  };

  return (
    <div className={styles.toastContainer}>
      <div className={styles.toast} style={{ position: 'relative', overflow: 'hidden' }}>
        <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>
          {icons[toastNotification.type] || '🔔'}
        </span>
        <div className={styles.toastContent}>
          <div className={styles.toastTitle}>{toastNotification.title}</div>
          <div className={styles.toastMessage}>{toastNotification.message}</div>
        </div>
        <button className={styles.toastClose} onClick={dismissToast}>
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className={styles.toastBar} />
      </div>
    </div>
  );
}