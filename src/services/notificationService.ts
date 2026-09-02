// import apiClient from './axiosConfig';
// import type { Notification } from '../types/notification.type';
// import type { PageResponse, ApiResponse } from '../types/employee.types';

// export async function getNotifications(
//   page = 0,
//   size = 20
// ): Promise<PageResponse<Notification>> {
//   const res = await apiClient.get<ApiResponse<PageResponse<Notification>>>(
//     '/notifications',
//     { params: { page, size } }
//   );
//   return res.data.data;
// }

// export async function getUnreadCount(): Promise<number> {
//   const res = await apiClient.get<ApiResponse<{ count: number }>>(
//     '/notifications/unread-count'
//   );
//   return res.data.data.count;
// }

// export async function markAsRead(id: number): Promise<void> {
//   await apiClient.patch(`/notifications/${id}/read`);
// }

// export async function markAllAsRead(): Promise<void> {
//   await apiClient.patch('/notifications/read-all');
// }

// src/services/notificationService.ts

import apiClient from './axiosConfig';
import type { Notification } from '../types/notification.type';
import type { PageResponse, ApiResponse } from '../types/employee.types';

export async function getNotifications(page = 0, size = 20): Promise<PageResponse<Notification>> {
  const res = await apiClient.get<ApiResponse<PageResponse<Notification>>>(
    '/notifications',
    { params: { page, size } }
  );
  return res.data.data;
}

export async function getUnreadCount(): Promise<number> {
  const res = await apiClient.get<ApiResponse<{ count: number }>>(
    '/notifications/unread-count'
  );
  return res.data.data.count;
}

// ← id: string (UUID), no number
export async function markAsRead(id: string): Promise<void> {
  await apiClient.patch(`/notifications/${id}/read`);
}

export async function markAllAsRead(): Promise<void> {
  await apiClient.patch('/notifications/read-all');
}