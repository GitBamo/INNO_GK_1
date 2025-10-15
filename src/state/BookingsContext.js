import React, { createContext, useContext, useMemo, useState } from "react";
import { Alert } from "react-native";

// Opret context til booking-data og funktioner
const BookingsContext = createContext(null);

/*
BookingsProvider wrapper komponent til at give adgang til booking-data og funktioner i hele appen
Seed med to eksempler ved start for visualisering (kan nulstilles via HomeScreen)
Følgende funktioner eksponeres via context:
- bookings: array af alle bookinger
- addBooking(b): tilføj en booking (uden tjek)
- removeBooking(id): slet booking med id
- tryAddBooking(b, opts): forsøg at tilføje booking med tjek og nudges
- resetToSeed(): nulstil til seed-data

Overlap-tjekket er simpelt og tjekker kun for overlap i samme lokale.
Nudges er blide advarsler ved lange bookinger eller peak-time brug.
*/
export function BookingsProvider({ children }) {
  const [bookings, setBookings] = useState([]);

  // Seed-funktion fjernet: starter nu altid med tomt array

  function addBooking(b) {
    setBookings((prev) => [b, ...prev]);
  }

  function removeBooking(id) {
    setBookings((prev) => prev.filter((x) => x.id !== id));
  }

  function resetToSeed() {
    setBookings([]);
  }

  // Simpel overlap-tjek på samme room (lukket interval (start, end))
  function hasOverlap({ room, start, end }) {
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    return bookings.some((b) => {
      if (b.room !== room) return false;
      const bs = new Date(b.start).getTime();
      const be = new Date(b.end).getTime();
      return s < be && e > bs; // overlap hvis tidsintervaller skærer hinanden
    });
  }

  function tryAddBooking(b, opts = {}) {
    const { showNudge = true } = opts;

    if (new Date(b.end) <= new Date(b.start)) {
      Alert.alert("Ugyldigt tidspunkt", "Sluttid skal være efter starttid.");
      return false;
    }
    if (hasOverlap(b)) {
      Alert.alert(
        "Tidskonflikt",
        "Tidsrummet er allerede optaget i dette lokale."
      );
      return false;
    }

    // Fair-use nudges (ingen hård blokering)
    const durH = (new Date(b.end) - new Date(b.start)) / (1000 * 60 * 60);
    const startH = new Date(b.start).getHours();
    const endH = new Date(b.end).getHours();
    const isPeak = (h) => h >= 16 && h < 22; // 16-22 som "peak"

    let msg = null;
    if (durH > 3) {
      msg =
        "Overvej at dele lange sessioner (>3t) i kortere blokke for fair fordeling.";
    } else if (isPeak(startH) || isPeak(endH)) {
      msg = "Peak-time booking: overvej at holde dig til ≤2t i prime time.";
    }
    if (msg && showNudge) {
      Alert.alert("Nudge", msg);
    }

    addBooking(b);
    return true;
  }

  const value = useMemo(
    () => ({ bookings, addBooking, removeBooking, tryAddBooking, resetToSeed }),
    [bookings]
  );

  return (
    <BookingsContext.Provider value={value}>
      {children}
    </BookingsContext.Provider>
  );
}

// Custom hook til at hente bookings og booking-funktioner
export function useBookings() {
  const ctx = useContext(BookingsContext);
  if (!ctx) throw new Error("useBookings must be used within BookingsProvider");
  return ctx;
}
