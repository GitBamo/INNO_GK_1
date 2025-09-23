import React from "react";
import { Pressable, Text } from "react-native";
import colors from "../styles/colors";

/*Chip er en lille, genanvendelig React Native UI-komponent, der bruges som filter- eller valgknap.

Props:
  - label: tekst der vises på chippen
  - selected: boolean, styrer om chippen er aktiv/trykket på (ændrer farve og fontvægt)
  - onPress: funktion der kaldes når chippen trykkes

UI:
  - Viser label med afrundede kanter og farveskift ved "selected"
  - Bruges typisk til at filtrere lister eller vælge kategorier
  - Tilgængelighed: markeret som "button" og label sættes for skærmlæsere

Eksempel på brug: <Chip label="Studie A" selected={true} onPress={...} />. For eksempel se; src/screens/HomeScreen.js
*/
export default function Chip({ label, selected, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
        backgroundColor: selected ? colors.accent : "#1b2340",
        marginRight: 8,
        marginBottom: 8,
      }}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={{ color: "white", fontWeight: selected ? "700" : "500" }}>
        {label}
      </Text>
    </Pressable>
  );
}
