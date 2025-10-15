import React, { createContext, useContext } from 'react';

// MVP: fast "logget ind" bruger (senere -> rigtig auth/userId fra DB)
const AuthContext = createContext(null);

// AuthProvider wrapper komponent til at give adgang til currentUser i hele appen
export function AuthProvider({ children }) {
  // ADVARSEL: markeret som midlertidig/deprekeret — søg i projektet efter useAuth/AuthProvider
  // for at kunne slette filen sikkert, eller erstat med ny auth-implementering.
  if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
    // synlig i browser-konsollen når AuthProvider mountes i dev
    // (hjælper med at opdage om filen benyttes nogen steder)
    // eslint-disable-next-line no-console
    console.warn('AuthContext: AuthProvider er midlertidig/deprekeret — tjek brug før sletning');
  }

  const currentUser = { id: 'u-bamo', name: 'Bamo' };
  return <AuthContext.Provider value={{ currentUser }}>{children}</AuthContext.Provider>;
}

// Custom hook til at hente currentUser og auth-funktioner
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}