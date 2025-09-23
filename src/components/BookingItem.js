import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import styles from "../styles/globalStyles";
import colors from "../styles/colors";

// Formater dato/tid pænt
function fmt(dt) {
  const d = new Date(dt);
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

/*BookingItem er en genanvendelig React Native komponent, der viser information om én booking som et kort.
Komponentens props:
  - booking: booking-objektet med alle relevante data (rum, tid, bruger, note mm.)
  - owned: hvis true, vises en slet-knap (kun for brugerens egne bookinger)
  - onDelete: callback-funktion, der kaldes hvis brugeren bekræfter sletning

Komponentens UI:
  - Viser lokale, start/slut-tid, hvem der har booket og evt. note
  - Hvis "owned" er true, vises en rød slet-knap, der åbner en bekræftelses-dialog
  - Slet-knappen bruger Alert til at sikre, at brugeren bekræfter handlingen
*/
export default function BookingItem({ booking, onDelete, owned = false }) {
  const confirmDelete = () => {
    Alert.alert(
      "Slet booking",
      "Er du sikker på, at du vil slette denne booking?",
      [
        { text: "Annullér", style: "cancel" },
        {
          text: "Slet",
          style: "destructive",
          onPress: () => onDelete?.(booking.id),
        },
      ]
    );
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{booking.room}</Text>
      <Text style={styles.paragraph}>
        {fmt(booking.start)} → {fmt(booking.end)}
      </Text>
      <Text style={styles.paragraph}>Booket af: {booking.by || "ukendt"}</Text>
      {booking.note ? (
        <Text style={styles.paragraph}>Note: {booking.note}</Text>
      ) : null}

      {owned && !!onDelete && (
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: colors.danger, marginTop: 10 },
          ]}
          onPress={confirmDelete}
        >
          <Text style={styles.buttonText}>Slet</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
