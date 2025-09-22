import React from 'react';
import { View, Text } from 'react-native';
import styles from '../styles/globalStyles';

export default function CreateBookingScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Ny booking</Text>
        <Text style={styles.paragraph}>
          Her kommer formularen (start/slut, lokale, note, evt. adgangskode).
        </Text>
      </View>
    </View>
  );
}
