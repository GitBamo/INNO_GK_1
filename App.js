import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { BookingsProvider } from './src/state/BookingsContext';
import { AuthProvider } from './src/state/AuthContext';
import { Asset } from 'expo-asset';

export default function App() {
  useEffect(() => {
    Asset.loadAsync([require('./assets/app-logo.png')]); // preload
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