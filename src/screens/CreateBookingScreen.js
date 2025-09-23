import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Keyboard,
  Pressable,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useHeaderHeight } from "@react-navigation/elements";
import styles from "../styles/globalStyles";
import colors from "../styles/colors";
import { useBookings } from "../state/BookingsContext";
import { useAuth } from "../state/AuthContext";
import { ROOMS } from "../constants/rooms";
import SelectModal from "../components/SelectModal";

/*
Hjælpefunktioner til dato/tidshåndtering og nudges:

- toIsoLocal(yyyymmdd, hhmm):
    Konverterer en dato (fx '2025-09-23') og et tidspunkt (fx '10:00') til en ISO-string i lokal tid.
    Bruges til at oprette start- og sluttidspunkter for bookinger.

- buildTimeSlots():
    Genererer alle mulige 30-minutters tidsintervaller på en dag ("00:00", "00:30", ... "23:30").
    Bruges som valg i start/slut-tid dropdowns ved booking.

- computeNudgeMessage(startIso, endIso):
    Returnerer en venlig "nudge"-besked hvis bookingen er lang (>3t) eller ligger i prime time (16-22).
    Bruges til at informere brugeren om fair-use regler (MVP).
*/

function toIsoLocal(yyyymmdd, hhmm) {
  const [Y, M, D] = yyyymmdd.split("-").map(Number);
  const [h, m] = hhmm.split(":").map(Number);
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

function buildTimeSlots() {
  const out = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      out.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
  }
  return out;
}
const TIME_SLOTS = buildTimeSlots();

function computeNudgeMessage(startIso, endIso) {
  const durH = (new Date(endIso) - new Date(startIso)) / (1000 * 60 * 60);
  const startH = new Date(startIso).getHours();
  const endH = new Date(endIso).getHours();
  const isPeak = (h) => h >= 16 && h < 22;
  if (durH > 3)
    return "Overvej at dele lange sessioner (>3t) i kortere blokke for fair fordeling.";
  if (isPeak(startH) || isPeak(endH))
    return "Peak-time booking: overvej at holde dig til ≤2t i prime time.";
  return null;
}

/*
selectBox og selectText bruges som inline-styles til de trykbare valg-bokse (lokale/rum, start, slut)
i booking-formularen. De sikrer ensartet udseende og padding på tværs af alle select-felter.
*/
const selectBox = {
  backgroundColor: "#1b2340",
  borderRadius: 8,
  paddingVertical: 12,
  paddingHorizontal: 12,
  marginTop: 6,
  marginBottom: 12,
};
const selectText = { color: colors.text, fontWeight: "600" };

export default function CreateBookingScreen({ navigation }) {
  const { tryAddBooking } = useBookings(); // Henter funktionen til at forsøge at tilføje en booking fra BookingsContext.
  const { currentUser } = useAuth(); // Henter den aktuelle bruger fra AuthContext.

  const [repeatWeekly, setRepeatWeekly] = useState(false); // Boolean state, styrer om bookingen skal gentages ugentligt (8 uger).
  // Styrer om de respektive SelectModal-komponenter (for rum, start, slut) er åbne.
  const [roomOpen, setRoomOpen] = useState(false);
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);

  const headerHeight = useHeaderHeight(); // Henter headerens højde, bruges til at justere KeyboardAvoidingView så tastaturet ikke overlapper indholdet.
  const scrollRef = useRef(null); // Ref til ScrollView, bruges til at scrolle til bunden når note-feltet får fokus.

  const [room, setRoom] = useState(ROOMS[0]); // State for valgt rum, initialiseret til første rum i ROOMS-arrayet.
  // Beregner dags dato som en streng på formatet 'YYYY-MM-DD'. useMemo sikrer at værdien kun beregnes én gang ved mount.
  const todayStr = useMemo(() => {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }, []);
  const [date, setDate] = useState(todayStr); // State for valgt dato, initialiseret til dags dato.
  // State for valgt start- og sluttidspunkt.
  const [start, setStart] = useState("10:00");
  const [end, setEnd] = useState("11:00");
  const [note, setNote] = useState(""); // State for note-feltet (valgfri tekst).

  // useMemo bruges til at memoizere om formularen er gyldig (alle felter udfyldt).
  // isValid opdateres kun når room, date, start eller end ændres.
  const isValid = useMemo(
    () => room && date && start && end,
    [room, date, start, end]
  );

  // Handler-funktion til at indsende booking:
  function onSubmit() {
    if (!isValid) {
      Alert.alert(
        "Manglende felter",
        "Vælg venligst lokale, dato, start- og sluttid."
      );
      return;
    }

    // shiftDate: Hjælpefunktion til at lægge uger til en dato (bruges til gentagelser)
    const shiftDate = (yyyymmdd, weeks) => {
      const [Y, M, D] = yyyymmdd.split("-").map(Number);
      const base = new Date(Y, M - 1, D);
      base.setDate(base.getDate() + weeks * 7);
      const pad = (n) => String(n).padStart(2, "0");
      return `${base.getFullYear()}-${pad(base.getMonth() + 1)}-${pad(
        base.getDate()
      )}`;
    };

    const OCCS = repeatWeekly ? 8 : 1;
    // Antal bookinger der skal oprettes (1 eller 8 ved gentagelse)
    const occurrences = [];
    const nowId = Date.now();

    // Opretter alle booking-objekter (én pr. uge hvis gentagelse)
    for (let w = 0; w < OCCS; w++) {
      const dStr = w === 0 ? date : shiftDate(date, w);
      occurrences.push({
        id: `b-${nowId}-${w}`,
        room,
        start: toIsoLocal(dStr, start),
        end: toIsoLocal(dStr, end),
        by: currentUser.name,
        userId: currentUser.id,
        note,
        createdAt: new Date().toISOString(),
      });
    }

    let okCount = 0;
    let failCount = 0;
    const suppressNudges = repeatWeekly;

    // Forsøger at tilføje hver booking via tryAddBooking (validering, overlap, nudges)
    occurrences.forEach((occ) => {
      const ok = tryAddBooking(occ, { showNudge: !suppressNudges });
      ok ? okCount++ : failCount++;
    });

    // Hvis gentagelse: vis nudge og feedback om hvor mange bookinger lykkedes/afvist
    if (repeatWeekly) {
      const msg = computeNudgeMessage(occurrences[0].start, occurrences[0].end);
      if (msg) Alert.alert("Nudge", msg);
      Alert.alert(
        "Gentagelser oprettet",
        `Lykkedes: ${okCount} • Afvist: ${failCount}`
      );
    }

    // Naviger til "Mine bookinger" hvis mindst én booking lykkedes
    if (okCount > 0) navigation.navigate("MyBookings");
  }

  // Memoized objekt til at markere valgt dato i kalenderen
  const markedDates = useMemo(
    () => ({ [date]: { selected: true, selectedColor: colors.accent } }),
    [date]
  );

  /*
  Returnerer hele UI'en for booking-formularen:
  Indeholder felter til valg af lokale, dato, start/slut-tid, note, gentagelse og en opret-knap.
  Bruger ScrollView og KeyboardAvoidingView for god mobil-UX, samt SelectModal til valg af tid/rum.
  */
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={headerHeight}
    >
      <ScrollView
        ref={scrollRef}
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 32 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.title}>Ny booking</Text>

          <Text style={[styles.paragraph, { marginBottom: 12 }]}>
            Logget ind som:{" "}
            <Text style={{ fontWeight: "700" }}>{currentUser.name}</Text>
          </Text>

          {/* Lokale */}
          <Text style={styles.paragraph}>Lokale</Text>
          <Pressable
            style={selectBox}
            onPress={() => {
              Keyboard.dismiss();
              setRoomOpen(true);
            }}
          >
            <Text style={selectText}>{room}</Text>
          </Pressable>

          {/* Dato */}
          <Text style={styles.paragraph}>Dato</Text>
          <Calendar
            onDayPress={(d) => setDate(d.dateString)}
            markedDates={markedDates}
            theme={{
              calendarBackground: "#0B0F1A",
              dayTextColor: "#E8ECF1",
              monthTextColor: "#E8ECF1",
              textSectionTitleColor: "#A6B0C3",
              selectedDayBackgroundColor: colors.accent,
              selectedDayTextColor: "#0B0F1A",
              arrowColor: "#E8ECF1",
              todayTextColor: colors.primary,
            }}
            style={{ marginTop: 8, marginBottom: 12 }}
          />

          {/* Start/Slut */}
          <View style={[styles.row, { marginTop: 4, marginBottom: 12 }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.paragraph}>Start</Text>
              <Pressable
                style={selectBox}
                onPress={() => {
                  Keyboard.dismiss();
                  setStartOpen(true);
                }}
              >
                <Text style={selectText}>{start}</Text>
              </Pressable>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.paragraph}>Slut</Text>
              <Pressable
                style={selectBox}
                onPress={() => {
                  Keyboard.dismiss();
                  setEndOpen(true);
                }}
              >
                <Text style={selectText}>{end}</Text>
              </Pressable>
            </View>
          </View>

          {/* Gentag ugentligt */}
          <View
            style={[styles.row, { alignItems: "center", marginBottom: 12 }]}
          >
            <Text style={[styles.paragraph, { flex: 1 }]}>
              Gentag ugentligt (8 uger)
            </Text>
            <Switch value={repeatWeekly} onValueChange={setRepeatWeekly} />
          </View>

          {/* Note */}
          <Text style={styles.paragraph}>Note (valgfri)</Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="Session note"
            multiline
            numberOfLines={3}
            returnKeyType="done"
            blurOnSubmit={true}
            onSubmitEditing={() => Keyboard.dismiss()}
            onFocus={() =>
              setTimeout(
                () => scrollRef.current?.scrollToEnd({ animated: true }),
                150
              )
            }
            style={{
              backgroundColor: "#1b2340",
              color: "white",
              borderRadius: 8,
              padding: 12,
              marginTop: 6,
              marginBottom: 12,
              textAlignVertical: "top",
            }}
          />

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.accent }]}
            onPress={onSubmit}
          >
            <Text style={styles.buttonText}>Opret booking</Text>
          </TouchableOpacity>
        </View>

        {/* Select-modaler */}
        <SelectModal
          visible={roomOpen}
          title="Vælg lokale"
          options={ROOMS}
          value={room}
          onSelect={(v) => {
            setRoom(v);
            setRoomOpen(false);
          }}
          onClose={() => setRoomOpen(false)}
        />
        <SelectModal
          visible={startOpen}
          title="Vælg start"
          options={TIME_SLOTS}
          value={start}
          onSelect={(v) => {
            setStart(v);
            setStartOpen(false);
          }}
          onClose={() => setStartOpen(false)}
        />
        <SelectModal
          visible={endOpen}
          title="Vælg slut"
          options={TIME_SLOTS}
          value={end}
          onSelect={(v) => {
            setEnd(v);
            setEndOpen(false);
          }}
          onClose={() => setEndOpen(false)}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
