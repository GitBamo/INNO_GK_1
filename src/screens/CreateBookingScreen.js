import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import styles from '../styles/globalStyles';
import colors from '../styles/colors';
import { useBookings } from '../state/BookingsContext';

function toIsoLocal(dateStr, timeStr) {
  // Forenklet: sammenflet "YYYY-MM-DD" + "HH:MM" til ISO i lokal tid
  const [Y, M, D] = dateStr.split('-').map(Number);
  const [h, m] = timeStr.split(':').map(Number);
  const d = new Date();
  d.setFullYear(Y);
  d.setMonth(M - 1);
  d.setDate(D);
  d.setHours(h);
  d.setMinutes(m);
  d.setSeconds(0);
  d.setMilliseconds(0);
  return d.toISOString();
}

export default function CreateBookingScreen({ navigation }) {
  const { tryAddBooking } = useBookings();

  // Simple form state
  const [room, setRoom] = useState('Control Room');
  const [date, setDate] = useState(() => {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  });
  const [start, setStart] = useState('10:00');
  const [end, setEnd] = useState('11:00');
  const [note, setNote] = useState('');

  const isValid = useMemo(() => room && date && start && end, [room, date, start, end]);

  function onSubmit() {
    if (!isValid) {
      Alert.alert('Manglende felter', 'Udfyld venligst alle felter.');
      return;
    }
    const booking = {
      id: `b-${Date.now()}`,
      room,
      start: toIsoLocal(date, start),
      end: toIsoLocal(date, end),
      note,
      createdAt: new Date().toISOString(),
    };
    const ok = tryAddBooking(booking);
    if (ok) {
      navigation.navigate('MyBookings');
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Ny booking</Text>

        <Text style={styles.paragraph}>Lokale</Text>
        <TextInput
          value={room}
          onChangeText={setRoom}
          placeholder="Fx Control Room"
          style={{
            backgroundColor: '#1b2340',
            color: 'white',
            borderRadius: 8,
            padding: 12,
            marginTop: 6,
            marginBottom: 12,
          }}
        />

        <Text style={styles.paragraph}>Dato (YYYY-MM-DD)</Text>
        <TextInput
          value={date}
          onChangeText={setDate}
          placeholder="2025-09-22"
          autoCapitalize="none"
          style={{
            backgroundColor: '#1b2340',
            color: 'white',
            borderRadius: 8,
            padding: 12,
            marginTop: 6,
            marginBottom: 12,
          }}
        />

        <Text style={styles.paragraph}>Starttid (HH:MM)</Text>
        <TextInput
          value={start}
          onChangeText={setStart}
          placeholder="10:00"
          autoCapitalize="none"
          style={{
            backgroundColor: '#1b2340',
            color: 'white',
            borderRadius: 8,
            padding: 12,
            marginTop: 6,
            marginBottom: 12,
          }}
        />

        <Text style={styles.paragraph}>Sluttid (HH:MM)</Text>
        <TextInput
          value={end}
          onChangeText={setEnd}
          placeholder="11:00"
          autoCapitalize="none"
          style={{
            backgroundColor: '#1b2340',
            color: 'white',
            borderRadius: 8,
            padding: 12,
            marginTop: 6,
            marginBottom: 12,
          }}
        />

        <Text style={styles.paragraph}>Note (valgfri)</Text>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="Session note"
          style={{
            backgroundColor: '#1b2340',
            color: 'white',
            borderRadius: 8,
            padding: 12,
            marginTop: 6,
            marginBottom: 12,
          }}
        />

        <TouchableOpacity style={[styles.button, { backgroundColor: colors.accent }]} onPress={onSubmit}>
          <Text style={styles.buttonText}>Opret booking</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
