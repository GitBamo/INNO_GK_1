import React, { useMemo, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { Calendar } from "react-native-calendars";
import styles from "../styles/globalStyles";
import colors from "../styles/colors";
import { useBookings } from "../state/BookingsContext";
import { useAuth } from "../state/AuthContext";
import { ROOMS } from "../constants/rooms";
import Chip from "../components/Chip";

/*
Hjælpefunktioner til dato- og tidsformatering samt sammenligning:

fmtTime(dt):
  - Modtager en dato/tid (ISO-string eller Date-objekt) og returnerer et klokkeslæt på formatet 'HH:MM'.
  - Bruges til at vise start- og sluttid for bookinger i listen.

yyyymmdd(d):
  - Modtager et Date-objekt og returnerer en streng på formatet 'YYYY-MM-DD'.
  - Bruges til at sammenligne og markere datoer i kalenderen.

sameDay(iso, dayStr):
  - Tjekker om en ISO-dato (fx booking.start) matcher en valgt dag (fx fra kalenderen).
  - Bruges til at filtrere bookinger så kun bookinger for den valgte dag vises.
*/
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

/*
HomeScreen viser forsiden med kalender, filtre og liste over dagens bookinger
Funktionen er bygget op som i CreateBookingScreen med hooks og memoization.
Den bruger useState til at holde styr på valgt dato og filtre (lokale, person).
useMemo bruges til at udlede data som markerede datoer, unikke personer/lokaler og filtrerede bookinger.
For en detaljeret gennemgang af komponentens opbygning og UI, se kommentarer i CreateBookingScreen.js.
*/
export default function HomeScreen({ navigation }) {
  const { bookings, resetToSeed } = useBookings();
  const { currentUser } = useAuth();

  const [selectedDate, setSelectedDate] = useState(() => yyyymmdd(new Date()));
  const [roomFilter, setRoomFilter] = useState("Alle");
  const [personFilter, setPersonFilter] = useState("Alle");

  const markedDates = useMemo(
    () => ({
      [selectedDate]: { selected: true, selectedColor: colors.primary },
    }),
    [selectedDate]
  );

  const persons = useMemo(() => {
    const s = new Set();
    bookings.forEach((b) => b.by && s.add(b.by));
    return ["Alle", ...Array.from(s).sort((a, b) => a.localeCompare(b))];
  }, [bookings]);

  const rooms = useMemo(() => ["Alle", ...ROOMS], []);

  const dayBookings = useMemo(() => {
    const arr = bookings.filter((b) => sameDay(b.start, selectedDate));
    arr.sort((a, b) => new Date(a.start) - new Date(b.start));
    return arr;
  }, [bookings, selectedDate]);

  const filtered = useMemo(() => {
    return dayBookings.filter((b) => {
      const roomOk = roomFilter === "Alle" ? true : b.room === roomFilter;
      const personOk = personFilter === "Alle" ? true : b.by === personFilter;
      return roomOk && personOk;
    });
  }, [dayBookings, roomFilter, personFilter]);

  // ALT ovenfor listen (titel, kalender, genveje, filtre) lægges i list header
  const Header = (
    <View>
      <Text style={[styles.title, { marginBottom: 4 }]}>MusiCal</Text>
      <Text style={[styles.paragraph, { marginBottom: 12 }]}>
        Logget ind som:{" "}
        <Text style={{ fontWeight: "700" }}>{currentUser.name}</Text>
      </Text>

      {/* Kalender */}
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
      <View style={styles.card}>
        <Text style={styles.paragraph}>Hurtige genveje</Text>
        <View style={[styles.row, { marginTop: 8, flexWrap: "wrap" }]}>
          <Text
            onPress={() => navigation.navigate("CreateBooking")}
            style={{ color: colors.accent, fontWeight: "600", marginRight: 12 }}
          >
            + Opret booking
          </Text>
          <Text
            onPress={() => navigation.navigate("MyBookings")}
            style={{ color: colors.accent, fontWeight: "600", marginRight: 12 }}
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
      </View>

      {/* Filtre som CHIPS (kompakt) */}
      <View style={[styles.card, { marginTop: 12 }]}>
        <Text style={[styles.paragraph, { marginBottom: 8 }]}>Filtre</Text>

        <Text style={styles.paragraph}>Lokale</Text>
        <View style={[styles.row, { marginTop: 8, flexWrap: "wrap" }]}>
          {rooms.map((r) => (
            <Chip
              key={`room-${r}`}
              label={r}
              selected={roomFilter === r}
              onPress={() => setRoomFilter(r)}
            />
          ))}
        </View>

        <Text style={[styles.paragraph, { marginTop: 12 }]}>Person</Text>
        <View style={[styles.row, { marginTop: 8, flexWrap: "wrap" }]}>
          {persons.map((p) => (
            <Chip
              key={`person-${p}`}
              label={p}
              selected={personFilter === p}
              onPress={() => setPersonFilter(p)}
            />
          ))}
        </View>
      </View>

      <Text style={[styles.title, { marginVertical: 12 }]}>
        Bookinger — {selectedDate}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={Header}
        ListEmptyComponent={
          <View style={styles.card}>
            <Text style={styles.paragraph}>
              {dayBookings.length === 0
                ? "Ingen bookinger denne dag."
                : "Ingen bookinger matcher dine filtre."}
            </Text>
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
        contentContainerStyle={{ paddingBottom: 24 }} // lidt luft nederst
      />
    </View>
  );
}
