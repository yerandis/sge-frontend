// src/components/notifications/NotificationBell.tsx
import { useEffect, useRef, useState } from 'react';
import { useNotificationContext } from '../../hooks/useNotificationContext';
import styles from './Notifications.module.css';

export default function NotificationBell() {
  const { unreadCount, isPanelOpen, togglePanel } = useNotificationContext();

  // Anima la campana solo cuando LLEGAN nuevas notificaciones (no al leerlas)
  const prevCount = useRef(unreadCount);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (unreadCount > prevCount.current) {
      setShake(true);
      const t = setTimeout(() => setShake(false), 700);
      prevCount.current = unreadCount;
      return () => clearTimeout(t);
    }
    prevCount.current = unreadCount;
  }, [unreadCount]);

  const label = `Notificaciones${unreadCount > 0 ? ` (${unreadCount} sin leer)` : ''}`;

  return (
    <button
      type="button"
      className={[
        styles.bell,
        isPanelOpen ? styles.bellActive : '',
        shake ? styles.bellShake : '',
      ].filter(Boolean).join(' ')}
      onClick={togglePanel}
      title={label}
      aria-label={label}
      aria-haspopup="dialog"
      aria-expanded={isPanelOpen}
    >
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
      </svg>

      {unreadCount > 0 && (
        <>
          <span className={styles.badgePulse} aria-hidden="true" />
          <span className={styles.badge} key={unreadCount}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        </>
      )}
    </button>
  );
}
