import React, { createContext, useContext } from 'react';

// MVP: fast "logget ind" bruger (senere -> rigtig auth/userId fra DB)
const AuthContext = createContext(null);

// AuthProvider wrapper komponent til at give adgang til currentUser i hele appen
export function AuthProvider({ children }) {
  const currentUser = { id: 'u-bamo', name: 'Bamo' };
  return <AuthContext.Provider value={{ currentUser }}>{children}</AuthContext.Provider>;
}

// Custom hook til at hente currentUser og auth-funktioner
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
