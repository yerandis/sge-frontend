// import { createContext, useContext, type ReactNode } from 'react';
// import { useNotifications } from '../hooks/useNotifications';
// import { useAuth } from './AuthContext';
// import type { Notification } from '../types/notification.type';

// interface NotificationContextType {
//   notifications: Notification[];
//   unreadCount: number;
//   isLoading: boolean;
//   isPanelOpen: boolean;
//   hasMore: boolean;
//   toastNotification: Notification | null;
//   markAsRead: (id: number) => Promise<void>;
//   markAllAsRead: () => Promise<void>;
//   togglePanel: () => void;
//   closePanel: () => void;
//   loadMore: () => void;
//   dismissToast: () => void;
// }

// const NotificationContext = createContext<NotificationContextType | null>(null);

// export function NotificationProvider({ children }: { children: ReactNode }) {
//   const { isAuthenticated } = useAuth();
//   const notifications = useNotifications(isAuthenticated);

//   return (
//     <NotificationContext.Provider value={notifications}>
//       {children}
//     </NotificationContext.Provider>
//   );
// }

// export function useNotificationContext(): NotificationContextType {
//   const ctx = useContext(NotificationContext);
//   if (!ctx) throw new Error('useNotificationContext fuera de NotificationProvider');
//   return ctx;
// }

// src/context/NotificationContext.tsx
// SOLO exporta el componente Provider — satisface Fast Refresh

import { createContext, type ReactNode } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { useAuth } from './AuthContext';
import type { Notification } from '../types/notification.type';

interface NotificationContextType {
  notifications:      Notification[];
  unreadCount:        number;
  isLoading:          boolean;
  isPanelOpen:        boolean;
  hasMore:            boolean;
  toastNotification:  Notification | null;
  markAsRead:         (id: string) => Promise<void>;  // ← string
  markAllAsRead:      () => Promise<void>;
  togglePanel:        () => void;
  closePanel:         () => void;
  loadMore:           () => void;
  dismissToast:       () => void;
}

// Exportar el tipo por separado para que otros archivos lo importen sin importar el contexto
export type { NotificationContextType };

const NotificationContext = createContext<NotificationContextType | null>(null);

// Exportar el contexto para que el hook (en otro archivo) lo use
export { NotificationContext };

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const notificationState   = useNotifications(isAuthenticated);

  return (
    <NotificationContext.Provider value={notificationState}>
      {children}
    </NotificationContext.Provider>
  );
}