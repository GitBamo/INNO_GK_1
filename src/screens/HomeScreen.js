import React, { useMemo, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { Calendar } from "react-native-calendars";
import styles from "../styles/globalStyles";
import colors from "../styles/colors";
import { useBookings } from "../state/BookingsContext";
import { useAuth } from '../state/AuthContext';
import { ROOMS } from "../constants/rooms";


function fmtTime(dt) {
  const d = new Date(dt);
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function yyyymmdd(d) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function sameDay(iso, dayStr) {
  const d = new Date(iso);
  return yyyymmdd(d) === dayStr;
}

export default function HomeScreen({ navigation }) {
  const { bookings, resetToSeed } = useBookings();
  const { currentUser } = useAuth();
  const [selectedDate, setSelectedDate] = useState(() => yyyymmdd(new Date()));

  const markedDates = useMemo(
    () => ({
      [selectedDate]: { selected: true, selectedColor: colors.primary },
    }),
    [selectedDate]
  );

  // Alle bookinger for valgt dato, sorteret på starttid, grupperet implicit via visning
  const dayBookings = useMemo(() => {
    const arr = bookings.filter((b) => sameDay(b.start, selectedDate));
    arr.sort((a, b) => new Date(a.start) - new Date(b.start));
    return arr;
  }, [bookings, selectedDate]);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { marginBottom: 4 }]}>MusiCal</Text>
      <Text style={[styles.paragraph, { marginBottom: 12 }]}>
        Logget ind som: <Text style={{ fontWeight: '700' }}>{currentUser.name}</Text>
      </Text>

      {/* Månedskalender med valgt dato */}
      <Calendar
        onDayPress={(d) => setSelectedDate(d.dateString)}
        markedDates={markedDates}
        theme={{
          calendarBackground: "#0B0F1A",
          dayTextColor: "#E8ECF1",
          monthTextColor: "#E8ECF1",
          textSectionTitleColor: "#A6B0C3",
          selectedDayBackgroundColor: colors.primary,
          selectedDayTextColor: "#0B0F1A",
          arrowColor: "#E8ECF1",
          todayTextColor: colors.accent,
        }}
        style={{ marginBottom: 12 }}
      />

      {/* Hurtige genveje */}
      <View style={[styles.row, { marginTop: 8 }]}>
        <Text
          onPress={() => navigation.navigate("CreateBooking")}
          style={{ color: colors.accent, fontWeight: "600" }}
        >
          + Opret booking
        </Text>
        <Text
          onPress={() => navigation.navigate("MyBookings")}
          style={{ color: colors.accent, fontWeight: "600" }}
        >
          Mine bookinger
        </Text>
        <Text
          onPress={resetToSeed}
          style={{ color: colors.accent, fontWeight: "600" }}
        >
          Nulstil demo-data
        </Text>
      </View>

      {/* Bookinger for valgt dato (ALLE lejere) */}
      <Text style={[styles.title, { marginVertical: 12 }]}>
        Bookinger — {selectedDate}
      </Text>
      <FlatList
        data={dayBookings}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.card}>
            <Text style={styles.paragraph}>Ingen bookinger denne dag.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.paragraph}>
              <Text style={{ fontWeight: "700" }}>{item.room}</Text> ·{" "}
              {fmtTime(item.start)}–{fmtTime(item.end)}
            </Text>
            <Text style={styles.paragraph}>
              Booket af: {item.by || "ukendt"}
            </Text>
            {item.note ? (
              <Text style={styles.paragraph}>Note: {item.note}</Text>
            ) : null}
          </View>
        )}
      />
    </View>
  );
}
