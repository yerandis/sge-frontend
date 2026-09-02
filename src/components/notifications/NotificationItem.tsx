// import { Link } from 'react-router-dom';
// import type { Notification } from '../../types/notification.type';
// import styles from './Notifications.module.css';
// import type { JSX } from 'react/jsx-runtime';

// interface Props {
//   notification: Notification;
//   onMarkRead: (id: number) => void;
//   onClose: () => void;
// }

// /** Icono por tipo */
// function TypeIcon({ type }: { type: string }) {
//   const icons: Record<string, JSX.Element> = {
//     EMPLOYEE_CREATED: (
//       <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//         <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
//       </svg>
//     ),
//     EMPLOYEE_UPDATED: (
//       <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//         <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z" />
//       </svg>
//     ),
//     EMPLOYEE_DELETED: (
//       <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//         <path strokeLinecap="round" strokeLinejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
//       </svg>
//     ),
//   };
//   return icons[type] || (
//     <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//       <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
//     </svg>
//   );
// }

// const iconClass: Record<string, string> = {
//   EMPLOYEE_CREATED: styles.iconCreated,
//   EMPLOYEE_UPDATED: styles.iconUpdated,
//   EMPLOYEE_DELETED: styles.iconDeleted,
//   SYSTEM: styles.iconSystem,
// };

// function timeAgo(dateStr: string): string {
//   const diff = Date.now() - new Date(dateStr).getTime();
//   const mins = Math.floor(diff / 60000);
//   if (mins < 1) return 'ahora mismo';
//   if (mins < 60) return `hace ${mins} min`;
//   const hrs = Math.floor(mins / 60);
//   if (hrs < 24) return `hace ${hrs}h`;
//   return `hace ${Math.floor(hrs / 24)}d`;
// }

// export default function NotificationItem({ notification, onMarkRead, onClose }: Props) {
//   function handleClick() {
//     if (!notification.read) onMarkRead(notification.id);
//   }

//   return (
//     <div
//       className={`${styles.item} ${!notification.read ? styles.itemUnread : ''}`}
//       onClick={handleClick}
//     >
//       <div className={`${styles.itemIconWrapper} ${iconClass[notification.type] || styles.iconSystem}`}>
//         <TypeIcon type={notification.type} />
//       </div>

//       <div className={styles.itemContent}>
//         <div className={styles.itemTitle}>{notification.title}</div>
//         <div className={styles.itemMessage}>{notification.message}</div>
//         <div className={styles.itemMeta}>
//           <span className={styles.itemTime}>{timeAgo(notification.createdAt)}</span>
//           {notification.navigateTo && (
//             <Link
//               to={notification.navigateTo}
//               className={styles.itemLink}
//               onClick={() => { handleClick(); onClose(); }}
//             >
//               Ver detalle →
//             </Link>
//           )}
//         </div>
//       </div>

//       {!notification.read && <span className={styles.unreadDot} />}
//     </div>
//   );
// }

// src/components/notifications/NotificationItem.tsx

import { Link } from 'react-router-dom';
import type { Notification } from '../../types/notification.type';
import styles from './Notifications.module.css';
import type { JSX } from 'react/jsx-runtime';

interface Props {
  notification: Notification;
  onMarkRead: (id: string) => void;  // ← era (id: number) → void
  onClose: () => void;
}

function TypeIcon({ type }: { type: string }) {
  const icons: Record<string, JSX.Element> = {
    EMPLOYEE_CREATED: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
      </svg>
    ),
    EMPLOYEE_UPDATED: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z" />
      </svg>
    ),
    EMPLOYEE_DELETED: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
      </svg>
    ),
  };
  return icons[type] ?? (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
  );
}

const iconClass: Record<string, string> = {
  EMPLOYEE_CREATED: styles.iconCreated,
  EMPLOYEE_UPDATED: styles.iconUpdated,
  EMPLOYEE_DELETED: styles.iconDeleted,
  SYSTEM:           styles.iconSystem,
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  if (mins < 1)  return 'ahora mismo';
  if (mins < 60) return `hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs  < 24) return `hace ${hrs}h`;
  return `hace ${Math.floor(hrs / 24)}d`;
}

export default function NotificationItem({ notification, onMarkRead, onClose }: Props) {

  function handleClick() {
    // notification.id es string (UUID) — coincide con onMarkRead(id: string)
    if (!notification.read) onMarkRead(notification.id);
  }

  return (
    <div
      className={`${styles.item} ${!notification.read ? styles.itemUnread : ''}`}
      onClick={handleClick}
    >
      <div className={`${styles.itemIconWrapper} ${iconClass[notification.type] ?? styles.iconSystem}`}>
        <TypeIcon type={notification.type} />
      </div>

      <div className={styles.itemContent}>
        <div className={styles.itemTitle}>{notification.title}</div>
        <div className={styles.itemMessage}>{notification.message}</div>
        <div className={styles.itemMeta}>
          <span className={styles.itemTime}>{timeAgo(notification.createdAt)}</span>
          {notification.navigateTo && (
            <Link
              to={notification.navigateTo}
              className={styles.itemLink}
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
                onClose();
              }}
            >
              Ver detalle →
            </Link>
          )}
        </div>
      </div>

      {!notification.read && <span className={styles.unreadDot} />}
    </div>
  );
}