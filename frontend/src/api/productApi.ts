import client from './client';

export const productApi = {
  getProducts: (params?: any) => client.get('/products', { params }),
  getProductById: (id: string) => client.get(`/products/${id}`),
  createProduct: (data: any) => client.post('/products', data),
  updateProduct: (id: string, data: any) => client.put(`/products/${id}`, data),
  deleteProduct: (id: string) => client.delete(`/products/${id}`),
};
