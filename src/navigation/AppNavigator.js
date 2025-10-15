import React, { memo } from "react";
import { Image, Pressable, Platform } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import CreateBookingScreen from "../screens/CreateBookingScreen";
import MyBookingsScreen from "../screens/MyBookingsScreen";
import colors from "../styles/colors";

// Stack bruges til at oprette navigation mellem appens forskellige skærme (stack navigation).
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// LOGO importerer appens logo-billede, så det kan vises i headeren på alle skærme.
const LOGO = require("../../assets/app-logo.png");

/*
LogoTitle-komponenten er en klikbar version af logoet til brug i headeren.
Hvis man ønsker, at brugeren kan trykke på logoet for at gå til forsiden (Home), kan denne komponent bruges:
  <LogoTitle onPress={() => navigation.navigate('Home')} />
Komponenten bruger Pressable for at gøre logoet klikbart og tilgængeligt (accessibility).

I denne app er headerTitle dog sat direkte til en <Image> (ikke klikbar),
fordi det giver et mere simpelt og konsistent udtryk i headeren på tværs af alle skærme.
Hvis klikbarhed ønskes, kan <Image ... /> erstattes med <LogoTitle onPress={...} /> i options. */
const LogoTitle = memo(function LogoTitle({ onPress }) {
  const style = {
    width: Platform.select({ ios: 160, android: 180 }), // større logo
    height: Platform.select({ ios: 36, android: 40 }),
  };
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      android_ripple={{ borderless: true }}
      style={{ alignItems: "center", justifyContent: "center" }}
      accessibilityRole="button"
      accessibilityLabel="Gå til forside"
    >
      <Image source={LOGO} style={style} resizeMode="contain" />
    </Pressable>
  );
});

// AppNavigator definerer navigationen i appen med en stack-navigator.
// Her tilføjes alle hovedskærme (Home, CreateBooking, MyBookings) som Stack.Screen.
// Hver skærm får logoet vist i headeren, og der kan tilføjes titler eller andre header-indstillinger pr. skærm.
// Dette er det centrale sted hvor navigation og header-udseende styres for hele appen.
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleAlign: "center",
        headerShadowVisible: false,
        headerBackTitleVisible: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.text,
        tabBarStyle: { backgroundColor: colors.background, borderTopWidth: 0 },
        tabBarShowLabel: true,
        tabBarIcon: ({ color, size }) => {
          if (route.name === "Home") {
            return <Ionicons name="home-outline" size={size} color={color} />;
          } else if (route.name === "CreateBooking") {
            return (
              <Ionicons name="add-circle-outline" size={size} color={color} />
            );
          } else if (route.name === "MyBookings") {
            return (
              <Ionicons name="calendar-outline" size={size} color={color} />
            );
          }
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: () => (
            <Image
              source={LOGO}
              style={{ width: 160, height: 36 }}
              resizeMode="contain"
            />
          ),
          title: "Forside",
        }}
      />
      <Tab.Screen
        name="CreateBooking"
        component={CreateBookingScreen}
        options={{
          headerTitle: () => (
            <Image
              source={LOGO}
              style={{ width: 160, height: 36 }}
              resizeMode="contain"
            />
          ),
          title: "Opret booking",
        }}
      />
      <Tab.Screen
        name="MyBookings"
        component={MyBookingsScreen}
        options={{
          headerTitle: () => (
            <Image
              source={LOGO}
              style={{ width: 160, height: 36 }}
              resizeMode="contain"
            />
          ),
          title: "Mine bookinger",
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return <MainTabs />;
}
