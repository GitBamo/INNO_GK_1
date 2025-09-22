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
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Calendar } from "react-native-calendars";
import { useHeaderHeight } from "@react-navigation/elements";
import styles from "../styles/globalStyles";
import colors from "../styles/colors";
import { useBookings } from "../state/BookingsContext";
import { useAuth } from "../state/AuthContext";
import { ROOMS } from "../constants/rooms";

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
  for (let h = 0; h < 24; h++)
    for (let m = 0; m < 60; m += 30) {
      out.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
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

export default function CreateBookingScreen({ navigation }) {
  const { tryAddBooking } = useBookings();
  const { currentUser } = useAuth();
  const [repeatWeekly, setRepeatWeekly] = useState(false);

  const headerHeight = useHeaderHeight(); // korrekt offset for tastaturhævning
  const scrollRef = useRef(null); // til auto-scroll ved fokus på note

  const [room, setRoom] = useState(ROOMS[0]);
  const todayStr = useMemo(() => {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }, []);
  const [date, setDate] = useState(todayStr);
  const [start, setStart] = useState("10:00");
  const [end, setEnd] = useState("11:00");
  const [note, setNote] = useState("");

  const isValid = useMemo(
    () => room && date && start && end,
    [room, date, start, end]
  );

  function onSubmit() {
    if (!isValid) {
      Alert.alert(
        "Manglende felter",
        "Vælg venligst lokale, dato, start- og sluttid."
      );
      return;
    }

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
    const occurrences = [];
    const nowId = Date.now();

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

    // Undertryk nudges inde i konteksten, når vi gentager ugentligt
    const suppressNudges = repeatWeekly;

    occurrences.forEach((occ) => {
      const ok = tryAddBooking(occ, { showNudge: !suppressNudges });
      ok ? okCount++ : failCount++;
    });

    // Vis én samlet nudge (hvis relevant) ved gentagelser:
    if (repeatWeekly) {
      const msg = computeNudgeMessage(occurrences[0].start, occurrences[0].end);
      if (msg) {
        Alert.alert("Nudge", msg);
      }
      Alert.alert(
        "Gentagelser oprettet",
        `Lykkedes: ${okCount} • Afvist: ${failCount}`
      );
    }

    if (okCount > 0) {
      navigation.navigate("MyBookings");
    }
  }

  const markedDates = useMemo(
    () => ({ [date]: { selected: true, selectedColor: colors.accent } }),
    [date]
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      // gør at indholdet hæves præcist med headerens højde
      keyboardVerticalOffset={headerHeight}
    >
      <ScrollView
        ref={scrollRef}
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 32 }}
        keyboardShouldPersistTaps="handled" // knapper kan trykkes selv med tastatur åbent
      >
        <View style={styles.card}>
          <Text style={styles.title}>Ny booking</Text>

          {/* Fast login-info (MVP) */}
          <Text style={[styles.paragraph, { marginBottom: 12 }]}>
            Logget ind som:{" "}
            <Text style={{ fontWeight: "700" }}>{currentUser.name}</Text>
          </Text>

          {/* Lokale */}
          <Text style={styles.paragraph}>Lokale</Text>
          <View
            style={{
              backgroundColor: "#1b2340",
              borderRadius: 8,
              marginTop: 6,
              marginBottom: 12,
            }}
          >
            <Picker
              selectedValue={room}
              onValueChange={setRoom}
              dropdownIconColor="white"
              style={{ color: "white" }}
            >
              {ROOMS.map((r) => (
                <Picker.Item key={r} label={r} value={r} />
              ))}
            </Picker>
          </View>

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
              <View
                style={{
                  backgroundColor: "#1b2340",
                  borderRadius: 8,
                  marginTop: 6,
                }}
              >
                <Picker
                  selectedValue={start}
                  onValueChange={setStart}
                  dropdownIconColor="white"
                  style={{ color: "white" }}
                >
                  {TIME_SLOTS.map((t) => (
                    <Picker.Item key={`s-${t}`} label={t} value={t} />
                  ))}
                </Picker>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.paragraph}>Slut</Text>
              <View
                style={{
                  backgroundColor: "#1b2340",
                  borderRadius: 8,
                  marginTop: 6,
                }}
              >
                <Picker
                  selectedValue={end}
                  onValueChange={setEnd}
                  dropdownIconColor="white"
                  style={{ color: "white" }}
                >
                  {TIME_SLOTS.map((t) => (
                    <Picker.Item key={`e-${t}`} label={t} value={t} />
                  ))}
                </Picker>
              </View>
            </View>
          </View>
          {/* Gentag ugentligt (MVP: i alt 8 forekomster: uge 0..7) */}
          <View
            style={[styles.row, { alignItems: "center", marginBottom: 12 }]}
          >
            <Text style={[styles.paragraph, { flex: 1 }]}>
              Gentag ugentligt (8 uger)
            </Text>
            <Switch value={repeatWeekly} onValueChange={setRepeatWeekly} />
          </View>

          {/* Note (valgfri) – multiline og auto-scroll ved fokus */}
          <Text style={styles.paragraph}>Note (valgfri)</Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="Session note"
            multiline
            numberOfLines={3}
            // Gør retur-tasten til 'Done/Go' og luk tastaturet i stedet for newline
            returnKeyType="done"
            blurOnSubmit={true}
            onSubmitEditing={() => {
              Keyboard.dismiss();
            }}
            onFocus={() => {
              // scroll lidt efter fokus (vent til keyboard er oppe)
              setTimeout(
                () => scrollRef.current?.scrollToEnd({ animated: true }),
                150
              );
            }}
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
