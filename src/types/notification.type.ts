// export type NotificationType = 
//   | 'EMPLOYEE_CREATED'
//   | 'EMPLOYEE_UPDATED'
//   | 'EMPLOYEE_DELETED'
//   | 'DEPARTMENT_CREATED'
//   | 'SYSTEM';

//   export interface Notification {
//     id:         string;
//     type:         NotificationType;
//     title:        string;
//     message:      string;
//     entityType:   string | null;
//     entityId:     string | null;
//     triggeredBy:  string | null;
//     read:         boolean;
//     createdAt:    string;
//     navigateTo:   string | null;
//   }

//   export interface NotificationState {
//     notifications:  Notification[];
//     unreadCount:    number;
//     isLoading:      boolean;
//     isPanelOpen:    boolean;
//     hasMore:        boolean;
//     page:           number;
//   }

// src/types/notification.types.ts

export type NotificationType =
  | 'CREATED'
  | 'UPDATED'
  | 'DELETED'
  // | 'DEPARTMENT_CREATED'
  | 'SYSTEM';

export interface Notification {
  id:           string;        // ← era number (UUID serializado como string)
  type:         NotificationType;
  title:        string;
  message:      string;
  entityType:   string | null;
  entityId:     string | null; // ← era number | null
  triggeredBy:  string | null;
  read:         boolean;
  createdAt:    string;
  navigateTo:   string | null;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount:   number;
  isLoading:     boolean;
  isPanelOpen:   boolean;
  hasMore:       boolean;
  page:          number;
}