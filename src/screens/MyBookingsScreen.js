import React, { useMemo } from 'react';
import { View, FlatList, Text } from 'react-native';
import styles from '../styles/globalStyles';
import { useBookings } from '../state/BookingsContext';
import { useAuth } from '../state/AuthContext';
import BookingItem from '../components/BookingItem';

export default function MyBookingsScreen() {
  const { bookings, removeBooking } = useBookings();
  const { currentUser } = useAuth();

  const myBookings = useMemo(
    () => bookings.filter((b) => b.userId === currentUser.id)
                  .sort((a, b) => new Date(b.start) - new Date(a.start)),
    [bookings, currentUser.id]
  );

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
