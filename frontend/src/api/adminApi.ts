import client from './client';

export const adminApi = {
  getDashboardStats: () => client.get('/admin/dashboard'),
  getCustomers: () => client.get('/admin/customers'),
  toggleUserStatus: (id: string) => client.put(`/admin/users/${id}/toggle-status`),
  getDeliveryStaff: () => client.get('/admin/delivery-staff'),
  getInventory: () => client.get('/admin/inventory'),
  getReports: (type: 'daily' | 'monthly') => client.get(`/reports/${type}`),
};
