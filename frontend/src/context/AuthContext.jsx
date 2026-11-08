import { createContext, useContext, useMemo, useState } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

const STORAGE_KEY = 'ape_para_auth';

function readStoredAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { token: null, user: null };
  } catch {
    return { token: null, user: null };
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readStoredAuth);

  const updateAuth = (data) => {
    setAuth(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const login = async (credentials) => {
    const result = await api.login(credentials);
    updateAuth({ token: result.token, user: result.user });
  };

  const register = async (payload) => {
    const result = await api.register(payload);
    updateAuth({ token: result.token, user: result.user });
  };

  const logout = () => {
    updateAuth({ token: null, user: null });
  };

  const value = useMemo(
    () => ({ ...auth, isAuthenticated: Boolean(auth.token), login, register, logout }),
    [auth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
