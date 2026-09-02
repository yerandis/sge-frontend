// src/hooks/useNotificationContext.ts
// SOLO exporta el hook — satisface Fast Refresh

import { useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';
import type { NotificationContextType } from '../context/NotificationContext';

export function useNotificationContext(): NotificationContextType {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotificationContext debe usarse dentro de <NotificationProvider>');
  return ctx;
}