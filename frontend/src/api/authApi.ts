import client from './client';

export const authApi = {
  login: (data: any) => client.post('/auth/login', data),
  register: (data: any) => client.post('/auth/register', data),
  forgotPassword: (data: any) => client.post('/auth/forgot-password', data),
  resetPassword: (data: any) => client.post('/auth/reset-password', data),
  getProfile: () => client.get('/auth/profile'),
  updateProfile: (data: any) => client.put('/auth/profile', data),
};
