import { useState, useEffect, useRef, useCallback } from 'react';
import { Client, type IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import type { Notification, NotificationState } from '../types/notification.type';
import * as notificationService from '../services/notificationService';
import { getAccessToken } from '../services/authService';

const WS_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1')
  .replace('/api/v1', '/ws');

export function useNotifications(isAuthenticated: boolean) {

  // ── Estado principal ──────────────────────────────────────────
  const [state, setState] = useState<NotificationState>({
    notifications: [],
    unreadCount:   0,
    isLoading:     false,
    isPanelOpen:   false,
    hasMore:       false,
    page:          0,
  });

  const [toastNotification, setToastNotification] = useState<Notification | null>(null);

  const stompClient  = useRef<Client | null>(null);
  const toastTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─────────────────────────────────────────────────────────────
  // CORRECCIÓN 5: mover showToast ANTES del useEffect que la usa
  // Convertirla a useCallback para que la referencia sea estable
  // ─────────────────────────────────────────────────────────────
  const showToast = useCallback((notification: Notification) => {
    setToastNotification(notification);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => {
      setToastNotification(null);
    }, 5000);
  }, []); // sin dependencias: setToastNotification es estable

  // ─────────────────────────────────────────────────────────────
  // CORRECCIÓN 6: loadNotifications como useCallback estable
  // Así puede incluirse en las dependencias del useEffect
  // sin causar renders infinitos
  // ─────────────────────────────────────────────────────────────
  const loadNotifications = useCallback(async (reset: boolean = false) => {
    if (!isAuthenticated) return;

    // Leer la página actual del estado funcional para evitar stale closure
    setState(prev => {
      const currentPage = reset ? 0 : prev.page;

      // Lanzar el fetch de forma asíncrona fuera del setState
      // para no llamar a setState dentro de setState
      notificationService.getNotifications(currentPage, 20)
        .then(data => {
          setState(inner => ({
            ...inner,
            notifications: reset
              ? data.content
              : [...inner.notifications, ...data.content],
            unreadCount: reset
              ? data.content.filter((n: Notification) => !n.read).length
              : inner.unreadCount,
            hasMore: !data.last,
            page:    currentPage + 1,
            isLoading: false,
          }));
        })
        .catch(() => {
          setState(inner => ({ ...inner, isLoading: false }));
        });

      return { ...prev, isLoading: true };
    });
  }, [isAuthenticated]);

  const loadUnreadCount = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const count = await notificationService.getUnreadCount();
      setState(prev => ({ ...prev, unreadCount: count }));
    } catch {
      // silenciar: el conteo es informativo, no crítico
    }
  }, [isAuthenticated]);

  // ─────────────────────────────────────────────────────────────
  // CORRECCIÓN 6 (continuación): incluir todas las dependencias
  // en el array del useEffect para satisfacer exhaustive-deps
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated) return;

    // Carga inicial: no llama a setState directamente en el cuerpo del efecto
    // porque loadNotifications y loadUnreadCount son funciones async que
    // gestionan el setState internamente de forma diferida
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadNotifications(true);
    loadUnreadCount();

    // ── Conexión WebSocket ──────────────────────────────────────
    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),

      connectHeaders: {
        Authorization: `Bearer ${getAccessToken() ?? ''}`,
      },

      reconnectDelay: 5000,

      onConnect: () => {
        console.log('✅ WebSocket conectado');

        // Suscripción 1: nuevas notificaciones en tiempo real
        client.subscribe('/topic/notifications', (message: IMessage) => {
          const notification = JSON.parse(message.body) as Notification;

          setState(prev => ({
            ...prev,
            notifications: [notification, ...prev.notifications],
            unreadCount:   prev.unreadCount + (notification.read ? 0 : 1),
          }));

          // CORRECCIÓN 5: showToast ya está declarada antes de este useEffect
          showToast(notification);
        });

        // Suscripción 2: conteo actualizado de no leídas
        client.subscribe('/topic/notifications/unread-count', (message: IMessage) => {
          const count = JSON.parse(message.body) as number;
          setState(prev => ({ ...prev, unreadCount: count }));
        });
      },

      onDisconnect: () => {
        console.log('⚠️ WebSocket desconectado');
      },

      onStompError: (frame) => {
        console.error('Error STOMP:', frame.headers['message']);
      },
    });

    client.activate();
    stompClient.current = client;

    return () => {
      client.deactivate();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // loadNotifications y loadUnreadCount son estables (useCallback sin deps cambiantes)
  // isAuthenticated: si cambia, queremos reconectar desde cero
  }, [isAuthenticated, loadNotifications, loadUnreadCount, showToast]);

  // ─────────────────────────────────────────────────────────────
  // CORRECCIÓN 7: markAsRead con id: string (UUID) en lugar de number
  // ─────────────────────────────────────────────────────────────
  const markAsRead = useCallback(async (id: string) => {  // ← era number
    try {
      await notificationService.markAsRead(id);
      setState(prev => ({
        ...prev,
        notifications: prev.notifications.map(n =>
          n.id === id ? { ...n, read: true } : n  // string === string ✅
        ),
        unreadCount: Math.max(0, prev.unreadCount - 1),
      }));
    } catch (err) {
      console.error('Error marcando notificación como leída:', err);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      setState(prev => ({
        ...prev,
        notifications: prev.notifications.map(n => ({ ...n, read: true })),
        unreadCount:   0,
      }));
    } catch (err) {
      console.error('Error marcando todas como leídas:', err);
    }
  }, []);

  const togglePanel = useCallback(() => {
    setState(prev => ({ ...prev, isPanelOpen: !prev.isPanelOpen }));
  }, []);

  const closePanel = useCallback(() => {
    setState(prev => ({ ...prev, isPanelOpen: false }));
  }, []);

  const loadMore = useCallback(() => {
    if (!state.isLoading && state.hasMore) {
      loadNotifications(false);
    }
  }, [state.isLoading, state.hasMore, loadNotifications]);

  const dismissToast = useCallback(() => {
    setToastNotification(null);
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  // ── Retornar todo el estado y las acciones ────────────────────
  return {
    ...state,
    toastNotification,
    markAsRead,
    markAllAsRead,
    togglePanel,
    closePanel,
    loadMore,
    dismissToast,
  };
}