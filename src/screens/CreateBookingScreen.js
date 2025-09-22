import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Calendar } from 'react-native-calendars';
import styles from '../styles/globalStyles';
import colors from '../styles/colors';
import { useBookings } from '../state/BookingsContext';
import { ROOMS } from '../constants/rooms';

// Hjælper: lav ISO string fra valgt dato (YYYY-MM-DD) + "HH:MM" i lokal tid
function toIsoLocal(yyyymmdd, hhmm) {
  const [Y, M, D] = yyyymmdd.split('-').map(Number);
  const [h, m] = hhmm.split(':').map(Number);
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

// 30-min slots i 24-timers format
function buildTimeSlots() {
  const out = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hh = String(h).padStart(2, '0');
      const mm = String(m).padStart(2, '0');
      out.push(`${hh}:${mm}`);
    }
  }
  return out;
}
const TIME_SLOTS = buildTimeSlots();

export default function CreateBookingScreen({ navigation }) {
  const { tryAddBooking } = useBookings();

  // Form state
  const [by, setBy] = useState('');                // hvem
  const [room, setRoom] = useState(ROOMS[0]);      // dropdown
  const todayStr = useMemo(() => {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }, []);
  const [date, setDate] = useState(todayStr);      // kalender
  const [start, setStart] = useState('10:00');     // dropdown
  const [end, setEnd] = useState('11:00');         // dropdown
  const [note, setNote] = useState('');

  const isValid = useMemo(
    () => by.trim() && room && date && start && end,
    [by, room, date, start, end]
  );

  function onSubmit() {
    if (!isValid) {
      Alert.alert('Manglende felter', 'Udfyld venligst dit navn, lokale, dato og tider.');
      return;
    }
    const booking = {
      id: `b-${Date.now()}`,
      by: by.trim(),
      room,
      start: toIsoLocal(date, start),
      end: toIsoLocal(date, end),
      note,
      createdAt: new Date().toISOString(),
    };
    const ok = tryAddBooking(booking);
    if (ok) navigation.navigate('MyBookings');
  }

  // Markér valgt dato i Calendar
  const markedDates = useMemo(
    () => ({
      [date]: { selected: true, selectedColor: colors.accent },
    }),
    [date]
  );

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Ny booking</Text>

        {/* Dit navn */}
        <Text style={styles.paragraph}>Dit navn</Text>
        <TextInput
          value={by}
          onChangeText={setBy}
          placeholder="Fx Bamo"
          style={{
            backgroundColor: '#1b2340',
            color: 'white',
            borderRadius: 8,
            padding: 12,
            marginTop: 6,
            marginBottom: 12,
          }}
        />

        {/* Lokale (dropdown) */}
        <Text style={styles.paragraph}>Lokale</Text>
        <View style={{ backgroundColor: '#1b2340', borderRadius: 8, marginTop: 6, marginBottom: 12 }}>
          <Picker
            selectedValue={room}
            onValueChange={(v) => setRoom(v)}
            dropdownIconColor="white"
            style={{ color: 'white' }}
          >
            {ROOMS.map((r) => (
              <Picker.Item key={r} label={r} value={r} />
            ))}
          </Picker>
        </View>

        {/* Dato (kalender) */}
        <Text style={styles.paragraph}>Dato</Text>
        <Calendar
          onDayPress={(d) => setDate(d.dateString)}           // d.dateString = YYYY-MM-DD
          markedDates={markedDates}
          theme={{
            calendarBackground: '#0B0F1A',
            dayTextColor: '#E8ECF1',
            monthTextColor: '#E8ECF1',
            textSectionTitleColor: '#A6B0C3',
            selectedDayBackgroundColor: colors.accent,
            selectedDayTextColor: '#0B0F1A',
            arrowColor: '#E8ECF1',
            todayTextColor: colors.primary,
          }}
          style={{ marginTop: 8, marginBottom: 12 }}
        />

        {/* Start/Slut (30-min dropdowns) */}
        <View style={[styles.row, { marginTop: 4, marginBottom: 12 }]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.paragraph}>Start</Text>
            <View style={{ backgroundColor: '#1b2340', borderRadius: 8, marginTop: 6 }}>
              <Picker
                selectedValue={start}
                onValueChange={(v) => setStart(v)}
                dropdownIconColor="white"
                style={{ color: 'white' }}
              >
                {TIME_SLOTS.map((t) => (
                  <Picker.Item key={`s-${t}`} label={t} value={t} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.paragraph}>Slut</Text>
            <View style={{ backgroundColor: '#1b2340', borderRadius: 8, marginTop: 6 }}>
              <Picker
                selectedValue={end}
                onValueChange={(v) => setEnd(v)}
                dropdownIconColor="white"
                style={{ color: 'white' }}
              >
                {TIME_SLOTS.map((t) => (
                  <Picker.Item key={`e-${t}`} label={t} value={t} />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        {/* Valgfri note */}
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
