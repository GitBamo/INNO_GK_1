import React, { createContext, useContext, useMemo, useState } from 'react';
import { Alert } from 'react-native';

// Booking shape (guideline):
// { id: string, room: string, start: string (ISO), end: string (ISO), note?: string, createdAt: string }

const BookingsContext = createContext(null);

export function BookingsProvider({ children }) {
  const [bookings, setBookings] = useState(() => seed());

  function seed() {
    const now = new Date();
    const plus1h = new Date(now.getTime() + 60 * 60 * 1000);
    const plus2h = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    return [
      {
        id: 'seed-1',
        room: 'Control Room',
        start: now.toISOString(),
        end: plus1h.toISOString(),
        note: 'Vocal take',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'seed-2',
        room: 'Live Room',
        start: plus1h.toISOString(),
        end: plus2h.toISOString(),
        note: 'Drum setup',
        createdAt: new Date().toISOString(),
      },
    ];
  }

  function addBooking(b) {
    setBookings((prev) => [b, ...prev]);
  }

  function removeBooking(id) {
    setBookings((prev) => prev.filter((x) => x.id !== id));
  }

  // Simpel overlap-tjek på samme room (lukket interval [start, end))
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

  function tryAddBooking(b) {
    if (new Date(b.end) <= new Date(b.start)) {
      Alert.alert('Ugyldigt tidspunkt', 'Sluttid skal være efter starttid.');
      return false;
    }
    if (hasOverlap(b)) {
      Alert.alert('Tidskonflikt', 'Tidsrummet er allerede optaget i dette lokale.');
      return false;
    }

    // Fair-use nudges (blid vejledning, ingen hård blokering)
    const durH = (new Date(b.end) - new Date(b.start)) / (1000 * 60 * 60);
    const startH = new Date(b.start).getHours();
    const endH = new Date(b.end).getHours();
    const isPeak = (h) => h >= 16 && h < 22; // 16-22 som "peak"

    let msg = null;
    if (durH > 3) {
      msg = 'Overvej at dele lange sessioner (>3t) i kortere blokke for fair fordeling.';
    } else if (isPeak(startH) || isPeak(endH)) {
      msg = 'Peak-time booking: overvej at holde dig til ≤2t i prime time.';
    }
    if (msg) {
      Alert.alert('Nudge', msg);
    }
    addBooking(b);
    return true;
  }

  const value = useMemo(
    () => ({ bookings, addBooking, removeBooking, tryAddBooking }),
    [bookings]
  );

  return <BookingsContext.Provider value={value}>{children}</BookingsContext.Provider>;
}

export function useBookings() {
  const ctx = useContext(BookingsContext);
  if (!ctx) throw new Error('useBookings must be used within BookingsProvider');
  return ctx;
}
