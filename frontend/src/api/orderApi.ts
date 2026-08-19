import client from './client';

export const orderApi = {
  createOrder: (data: any) => client.post('/orders', data),
  getOrders: (params?: any) => client.get('/orders', { params }),
  getOrderById: (id: string) => client.get(`/orders/${id}`),
  updateOrderStatus: (id: string, data: any) => client.put(`/orders/${id}/status`, data),
  verifyDeliveryOtp: (id: string, otp: string) => client.post(`/orders/${id}/verify-otp`, { otp }),
  cancelOrder: (id: string) => client.post(`/orders/${id}/cancel`),
};
