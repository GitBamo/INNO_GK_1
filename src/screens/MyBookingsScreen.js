import React, { useMemo } from "react";
import { View, FlatList, Text } from "react-native";
import styles from "../styles/globalStyles";
import { useBookings } from "../state/BookingsContext";
import { useAuth } from "../state/AuthContext";
import BookingItem from "../components/BookingItem";

/*
MyBookingsScreen viser en liste over den aktuelle brugers egne bookinger.

- Henter alle bookinger og brugerdata via context.
- Filtrerer bookinger så kun dem med userId === currentUser.id vises.
- Listen sorteres så de nyeste bookinger vises øverst.
- BookingItem-komponenten bruges til at vise hver booking, med mulighed for at slette (owned=true).
- Hvis der ikke er nogen bookinger, vises en tom-tilstand.

Dette giver brugeren et hurtigt overblik over egne bookinger og mulighed for at slette dem direkte fra listen.
*/

export default function MyBookingsScreen() {
  const { bookings, removeBooking } = useBookings(); // Hent bookinger fra BookingsContext.js 
  const { currentUser } = useAuth(); // Hent nuværende bruger fra AuthContext.js

  /*
  Filtrer og sorter bookinger så kun brugerens egne vises, nyeste først
  useMemo sikrer at listen kun genberegnes hvis bookings eller currentUser.id ændres
  */
  const myBookings = useMemo(
    () =>
      bookings
        .filter((b) => b.userId === currentUser.id)
        .sort((a, b) => new Date(b.start) - new Date(a.start)),
    [bookings, currentUser.id]
  );

  // Returner UI med liste over brugerens bookinger vha. FlatList og BookingItem (React-komponent)
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { marginBottom: 12 }]}>Mine bookinger</Text>
      <FlatList
        data={myBookings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BookingItem booking={item} onDelete={removeBooking} owned />
        )}
        ListEmptyComponent={
          <View style={styles.card}>
            <Text style={styles.paragraph}>Ingen bookinger endnu.</Text>
          </View>
        }
      />
    </View>
  );
}
