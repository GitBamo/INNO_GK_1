import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";
import { BookingsProvider } from "./src/state/BookingsContext";
import { AuthProvider } from "./src/state/AuthContext";
import { Asset } from "expo-asset";

// App er root-komponenten der sætter navigation og context op
// AuthProvider og BookingsProvider gør auth og booking-data/funktioner tilgængelige i hele appen via context
// NavigationContainer og AppNavigator sætter navigationen op (se src/navigation/AppNavigator.js for detaljer)
export default function App() {
  useEffect(() => {
    Asset.loadAsync([require("./assets/app-logo.png")]); // preload for hurtigere visning i header (snappy UI uden delay)
  }, []);

  return (
    <AuthProvider>
      <BookingsProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <AppNavigator />
        </NavigationContainer>
      </BookingsProvider>
    </AuthProvider>
  );
}
