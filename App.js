import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { BookingsProvider } from './src/state/BookingsContext';
import { AuthProvider } from './src/state/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <BookingsProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </BookingsProvider>
    </AuthProvider>
  );
}