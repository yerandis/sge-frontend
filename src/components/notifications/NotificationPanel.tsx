// src/components/notifications/NotificationPanel.tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNotificationContext } from '../../hooks/useNotificationContext';
import NotificationItem from './NotificationItem';
import Spinner from '../ui/Spinner/Spinner';
import styles from './Notifications.module.css';

type Filter = 'all' | 'unread';

/** Agrupa por Hoy / Ayer / Anteriores conservando el orden recibido del backend */
function groupByDay<T extends { createdAt: string }>(items: T[]) {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startOfYesterday = new Date(startOfToday.getTime() - 86_400_000);

  const groups: { label: string; items: T[] }[] = [
    { label: 'Hoy', items: [] },
    { label: 'Ayer', items: [] },
    { label: 'Anteriores', items: [] },
  ];

  for (const item of items) {
    const t = new Date(item.createdAt).getTime();
    if (t >= startOfToday.getTime()) groups[0].items.push(item);
    else if (t >= startOfYesterday.getTime()) groups[1].items.push(item);
    else groups[2].items.push(item);
  }

  return groups.filter(g => g.items.length > 0);
}

export default function NotificationPanel() {
  const {
    notifications, unreadCount, isLoading, isPanelOpen,
    hasMore, markAsRead, markAllAsRead, closePanel, loadMore,
  } = useNotificationContext();

  const [filter, setFilter] = useState<Filter>('all');
  const panelRef = useRef<HTMLDivElement>(null);

  // Cerrar con Escape + bloquear scroll del fondo + foco en el panel
  useEffect(() => {
    if (!isPanelOpen) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') closePanel();
    }
    document.addEventListener('keydown', onKeyDown);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isPanelOpen, closePanel]);

  // Al cerrar, volver al filtro por defecto
  useEffect(() => {
    if (!isPanelOpen) setFilter('all');
  }, [isPanelOpen]);

  const visible = useMemo(
    () => (filter === 'unread' ? notifications.filter(n => !n.read) : notifications),
    [notifications, filter],
  );

  const groups = useMemo(() => groupByDay(visible), [visible]);

  if (!isPanelOpen) return null;

  const showInitialLoading = isLoading && notifications.length === 0;
  const showEmpty = !isLoading && visible.length === 0;

  return (
    <>
      <div className={styles.overlay} onClick={closePanel} />

      <aside
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label="Panel de notificaciones"
        tabIndex={-1}
      >
        {/* Header */}
        <div className={styles.panelHeader}>
          <div className={styles.panelHeaderTop}>
            <h2 className={styles.panelTitle}>
              Notificaciones
              {unreadCount > 0 && (
                <span className={styles.panelCount}>{unreadCount > 99 ? '99+' : unreadCount}</span>
              )}
            </h2>

            <div className={styles.panelHeaderActions}>
              {unreadCount > 0 && (
                <button type="button" className={styles.markAllBtn} onClick={markAllAsRead}>
                  Marcar todas leídas
                </button>
              )}
              <button
                type="button"
                className={styles.closeBtn}
                onClick={closePanel}
                aria-label="Cerrar panel de notificaciones"
                title="Cerrar (Esc)"
              >
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Filtros */}
          <div className={styles.filterTabs} role="tablist" aria-label="Filtrar notificaciones">
            <button
              type="button"
              role="tab"
              aria-selected={filter === 'all'}
              className={`${styles.filterTab} ${filter === 'all' ? styles.filterTabActive : ''}`}
              onClick={() => setFilter('all')}
            >
              Todas
              <span className={styles.filterTabCount}>{notifications.length}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={filter === 'unread'}
              className={`${styles.filterTab} ${filter === 'unread' ? styles.filterTabActive : ''}`}
              onClick={() => setFilter('unread')}
            >
              Sin leer
              <span className={styles.filterTabCount}>{unreadCount}</span>
            </button>
          </div>
        </div>

        {/* Lista */}
        <div className={styles.panelList}>
          {showInitialLoading && (
            <>
              <div className={styles.skeletonList} aria-hidden="true">
                {[0, 1, 2, 3, 4].map(i => (
                  <div className={styles.skeletonItem} key={i}>
                    <div className={styles.skeletonAvatar} />
                    <div className={styles.skeletonLines}>
                      <div className={styles.skeletonLine} />
                      <div className={`${styles.skeletonLine} ${styles.skeletonLineShort}`} />
                    </div>
                  </div>
                ))}
              </div>
              <span className={styles.srOnly}>
                <Spinner message="Cargando notificaciones..." />
              </span>
            </>
          )}

          {showEmpty && (
            <div className={styles.panelEmpty}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              <p className={styles.panelEmptyTitle}>
                {filter === 'unread' ? 'Todo al día' : 'No hay notificaciones'}
              </p>
              <p className={styles.panelEmptyHint}>
                {filter === 'unread'
                  ? 'No te queda ninguna notificación sin leer.'
                  : 'Aquí aparecerán los avisos sobre empleados y el sistema.'}
              </p>
            </div>
          )}

          {groups.map(group => (
            <section key={group.label} className={styles.group}>
              <h3 className={styles.groupHeader}>{group.label}</h3>
              {group.items.map(n => (
                <NotificationItem
                  key={n.id}
                  notification={n}
                  onMarkRead={markAsRead}
                  onClose={closePanel}
                />
              ))}
            </section>
          ))}

          {isLoading && notifications.length > 0 && (
            <div className={styles.inlineLoading}>Cargando...</div>
          )}

          {hasMore && filter === 'all' && (
            <button
              type="button"
              className={styles.loadMoreBtn}
              onClick={loadMore}
              disabled={isLoading}
            >
              {isLoading ? 'Cargando...' : 'Cargar más notificaciones'}
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
