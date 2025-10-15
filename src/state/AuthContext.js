import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Alert } from "react-native";

// NOTE:
// Denne AuthContext er en lille, lokal (in-memory) auth-implementation
// beregnet til at understøtte Login/Registrer-skærmene i undervisningsprojektet.
// Den kan senere erstattes med rigtige Firebase-auth-kald (se firebase/firebase.js)
// hvis du installerer og konfigurerer `firebase`-pakken.

const AuthContext = createContext(null);

// En simpel in-memory "user store" til demo-formål. Ikke sikkert, kun til local dev.
const userStore = {};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  // Hvis du vil auto-login under udvikling kan du sætte en test-bruger her.
  useEffect(() => {
    // Ingen auto-login som default.
  }, []);

  // Registrer en ny bruger (name, email, password)
  async function signUp({ name, email, password }) {
    if (!email || !password || !name) {
      Alert.alert("Manglende felter", "Udfyld navn, email og kodeord.");
      return false;
    }
    if (userStore[email]) {
      Alert.alert(
        "Bruger findes",
        "Der findes allerede en bruger med denne email."
      );
      return false;
    }
    const id = `u-${Date.now()}`;
    const user = { id, name, email };
    // Gem adgangskode i-memory (ikke sikkert) for demo-login
    userStore[email] = { ...user, password };
    setCurrentUser(user);
    return true;
  }

  // Login med email + password
  async function signIn({ email, password }) {
    if (!email || !password) {
      Alert.alert("Manglende felter", "Udfyld email og kodeord.");
      return false;
    }
    const rec = userStore[email];
    if (!rec || rec.password !== password) {
      Alert.alert("Login fejlede", "Email eller kodeord forkert.");
      return false;
    }
    setCurrentUser({ id: rec.id, name: rec.name, email: rec.email });
    return true;
  }

  // Simpelt signOut
  async function signOut() {
    setCurrentUser(null);
  }

  const value = useMemo(
    () => ({ currentUser, signUp, signIn, signOut }),
    [currentUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
