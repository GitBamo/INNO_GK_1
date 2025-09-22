import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { BookingsProvider } from './src/state/BookingsContext';

export default function App() {
  return (
    <BookingsProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </BookingsProvider>
  );
}
