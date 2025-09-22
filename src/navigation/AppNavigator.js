import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import CreateBookingScreen from '../screens/CreateBookingScreen';
import MyBookingsScreen from '../screens/MyBookingsScreen';
import colors from '../styles/colors';


const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { color: colors.text },
        headerShadowVisible: false, // renere look på iOS
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'MusiCal' }} />
      <Stack.Screen name="CreateBooking" component={CreateBookingScreen} options={{ title: 'Ny booking' }} />
      <Stack.Screen name="MyBookings" component={MyBookingsScreen} options={{ title: 'Mine bookinger' }} />
    </Stack.Navigator>
  );
}