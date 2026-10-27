import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });

api.interceptors.request.use((cfg) => {
  const t = localStorage.getItem('qb_token');
  if (t) cfg.headers.Authorization = 'Bearer ' + t;
  return cfg;
});

export const adminHeaders = () => ({ 'x-admin-key': sessionStorage.getItem('qb_admin') || '' });
export const errMsg = (e) => e?.response?.data?.message || e?.message || 'Something went wrong';
export const rupee = (n) => '₹' + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });

export default api;