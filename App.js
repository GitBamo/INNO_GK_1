import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { BookingsProvider } from './src/state/BookingsContext';
import { AuthProvider } from './src/state/AuthContext';
import { StatusBar } from 'expo-status-bar';


export default function App() {
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
