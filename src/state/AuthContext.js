import React, { createContext, useContext } from 'react';

// MVP: fast "logget ind" bruger (senere -> rigtig auth/userId fra DB)
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const currentUser = { id: 'u-bamo', name: 'Bamo' };
  return <AuthContext.Provider value={{ currentUser }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
