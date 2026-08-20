import client from './client';

export const notificationApi = {
  getNotifications: () => client.get('/notifications'),
  markRead: (id: string) => client.put(`/notifications/${id}/read`),
  markAllRead: () => client.put('/notifications/read-all'),
};
