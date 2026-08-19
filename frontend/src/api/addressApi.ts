import client from './client';

export const addressApi = {
  getAddresses: () => client.get('/addresses'),
  createAddress: (data: any) => client.post('/addresses', data),
  updateAddress: (id: string, data: any) => client.put(`/addresses/${id}`, data),
  deleteAddress: (id: string) => client.delete(`/addresses/${id}`),
};
