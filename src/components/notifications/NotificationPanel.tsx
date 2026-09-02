// import { useNotificationContext } from '../../context/NotificationContext';
import { useNotificationContext } from '../../hooks/useNotificationContext';
import NotificationItem from './NotificationItem';
import Spinner from '../ui/Spinner/Spinner';
import styles from './Notifications.module.css';

export default function NotificationPanel() {
  const {
    notifications, unreadCount, isLoading, isPanelOpen,
    hasMore, markAsRead, markAllAsRead, closePanel, loadMore,
  } = useNotificationContext();

  if (!isPanelOpen) return null;

  return (
    <>
      {/* Overlay para cerrar al hacer clic fuera */}
      <div className={styles.overlay} onClick={closePanel} />

      <div className={styles.panel}>
        {/* Header */}
        <div className={styles.panelHeader}>
          <div className={styles.panelTitle}>
            Notificaciones
            {unreadCount > 0 && (
              <span style={{
                backgroundColor: 'var(--color-danger)',
                color: '#fff',
                fontSize: '0.6875rem',
                fontWeight: 700,
                padding: '0.125rem 0.4375rem',
                borderRadius: '9999px',
              }}>
                {unreadCount}
              </span>
            )}
          </div>
          <div className={styles.panelHeaderActions}>
            {unreadCount > 0 && (
              <button className={styles.markAllBtn} onClick={markAllAsRead}>
                Marcar todas leídas
              </button>
            )}
            <button className={styles.closeBtn} onClick={closePanel}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Lista */}
        <div className={styles.panelList}>
          {isLoading && notifications.length === 0 && (
            <Spinner message="Cargando notificaciones..." />
          )}

          {!isLoading && notifications.length === 0 && (
            <div className={styles.panelEmpty}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              <p>No hay notificaciones</p>
            </div>
          )}

          {notifications.map(n => (
            <NotificationItem
              key={n.id}
              notification={n}
              onMarkRead={markAsRead}
              onClose={closePanel}
            />
          ))}

          {hasMore && (
            <button className={styles.loadMoreBtn} onClick={loadMore} disabled={isLoading}>
              {isLoading ? 'Cargando...' : 'Cargar más notificaciones'}
            </button>
          )}
        </div>
      </div>
    </>
  );
}