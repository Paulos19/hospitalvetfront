// src/services/notifications.ts
import { api } from './api';

export interface Notification {
  id: string;
  userId: string;
  petId?: string;
  title: string;
  message: string;
  type: 'VACCINE' | 'PRESCRIPTION' | 'APPOINTMENT' | 'GENERIC';
  read: boolean;
  createdAt: string;
  pet?: {
    name: string;
    photoUrl: string;
  };
}

export const NotificationsService = {
  getNotifications: () => {
    return api.get<Notification[]>(`/notifications`);
  },
  markAsRead: (notificationIds: string[]) => {
    return api.patch<{ unreadCount: number }>(`/notifications`, {
      notificationIds,
    });
  },
};