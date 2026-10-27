import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api.js';

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!localStorage.getItem('qb_token'));

  useEffect(() => {
    if (!localStorage.getItem('qb_token')) return;
    api.get('/auth/me')
      .then((r) => setUser(r.data))
      .catch(() => localStorage.removeItem('qb_token'))
      .finally(() => setLoading(false));
  }, []);

  const finish = ({ token, user }) => { localStorage.setItem('qb_token', token); setUser(user); return user; };
  const login = async (email, password) => finish((await api.post('/auth/login', { email, password })).data);
  const signup = async (form) => finish((await api.post('/auth/signup', form)).data);
  const logout = () => { localStorage.removeItem('qb_token'); setUser(null); };

  return <AuthCtx.Provider value={{ user, loading, login, signup, logout }}>{children}</AuthCtx.Provider>;
}