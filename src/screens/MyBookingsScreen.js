import React from 'react';
import { View, FlatList, Text } from 'react-native';
import styles from '../styles/globalStyles';
import { useBookings } from '../state/BookingsContext';
import BookingItem from '../components/BookingItem';

export default function MyBookingsScreen() {
  const { bookings, removeBooking } = useBookings();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { marginBottom: 12 }]}>Mine bookinger</Text>

      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BookingItem booking={item} onDelete={removeBooking} />
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
