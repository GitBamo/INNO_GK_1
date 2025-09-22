import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../styles/globalStyles";
import colors from "../styles/colors";

function fmt(dt) {
  const d = new Date(dt);
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export default function BookingItem({ booking, onDelete, owned = false }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{booking.room}</Text>
      <Text style={styles.paragraph}>
        {fmt(booking.start)} → {fmt(booking.end)}
      </Text>
      <Text style={styles.paragraph}>Booket af: {booking.by || 'ukendt'}</Text>
      {booking.note ? <Text style={styles.paragraph}>Note: {booking.note}</Text> : null}

      {owned && !!onDelete && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.danger, marginTop: 10 }]}
          onPress={() => onDelete(booking.id)}
        >
          <Text style={styles.buttonText}>Slet</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}


