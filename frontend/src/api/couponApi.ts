import client from './client';

export const couponApi = {
  getCoupons: () => client.get('/coupons'),
  validateCoupon: (data: any) => client.post('/coupons/validate', data),
  createCoupon: (data: any) => client.post('/coupons', data),
};
