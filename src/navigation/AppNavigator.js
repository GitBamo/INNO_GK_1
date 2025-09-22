import React, { memo } from 'react';
import { Image, Pressable, Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import CreateBookingScreen from '../screens/CreateBookingScreen';
import MyBookingsScreen from '../screens/MyBookingsScreen';
import colors from '../styles/colors';

const Stack = createNativeStackNavigator();
const LOGO = require('../../assets/app-logo.png');

// Klikbar version (tryk på logo = hjem). Hvis du ikke vil have klik, se varianten længere nede.
const LogoTitle = memo(function LogoTitle({ onPress }) {
  const style = {
    width: Platform.select({ ios: 160, android: 180 }), // større logo
    height: Platform.select({ ios: 36,  android: 40  }),
  };
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      android_ripple={{ borderless: true }}
      style={{ alignItems: 'center', justifyContent: 'center' }}
      accessibilityRole="button"
      accessibilityLabel="Gå til forside"
    >
      <Image source={LOGO} style={style} resizeMode="contain" />
    </Pressable>
  );
});
export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleAlign: 'center',      // tving centreret på Android
        headerShadowVisible: false,
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }) => ({
          headerTitle: () => <Image source={LOGO} style={{ width: 160, height: 36 }} resizeMode="contain" />,
        })}
      />
      <Stack.Screen
        name="CreateBooking"
        component={CreateBookingScreen}
        options={({ navigation }) => ({
          headerTitle: () => <Image source={LOGO} style={{ width: 160, height: 36 }} resizeMode="contain" />,
          title: 'Ny booking',
        })}
      />
      <Stack.Screen
        name="MyBookings"
        component={MyBookingsScreen}
        options={({ navigation }) => ({
          headerTitle: () => <Image source={LOGO} style={{ width: 160, height: 36 }} resizeMode="contain" />,
          title: 'Mine bookinger',
        })}
      />
    </Stack.Navigator>
  );
}
