import client from './client';

export const subscriptionApi = {
  getSubscriptions: () => client.get('/subscriptions'),
  createSubscription: (data: any) => client.post('/subscriptions', data),
  pauseSubscription: (id: string) => client.post(`/subscriptions/${id}/pause`),
  resumeSubscription: (id: string) => client.post(`/subscriptions/${id}/resume`),
  updateSubscriptionStatus: (id: string, status: string) => client.put(`/subscriptions/${id}/status`, { status }),
  deleteSubscription: (id: string) => client.delete(`/subscriptions/${id}`),
};
