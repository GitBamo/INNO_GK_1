import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles/globalStyles';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>MusiCal — Studiebooking</Text>
        <Text style={styles.paragraph}>
          Delte musikstudier (2–6 lejere): se ledige tider, opret sessioner og hold styr på dine bookinger.
        </Text>

        {/* Krav: mindst 2 knapper, hvoraf én navigerer */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('CreateBooking')}
        >
          <Text style={styles.buttonText}>+ Opret booking</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#45D4B8' }]}
          onPress={() => navigation.navigate('MyBookings')}
        >
          <Text style={styles.buttonText}>Mine bookinger</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
