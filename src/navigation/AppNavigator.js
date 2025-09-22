import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import CreateBookingScreen from '../screens/CreateBookingScreen';
import MyBookingsScreen from '../screens/MyBookingsScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'MusiCal' }} />
      <Stack.Screen name="CreateBooking" component={CreateBookingScreen} options={{ title: 'Ny booking' }} />
      <Stack.Screen name="MyBookings" component={MyBookingsScreen} options={{ title: 'Mine bookinger' }} />
    </Stack.Navigator>
  );
}