import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import styles from "../styles/globalStyles";
import colors from "../styles/colors";
import { useAuth } from "../state/AuthContext";
import { useBookings } from "../state/BookingsContext";

export default function ProfileScreen() {
  const { currentUser, signOut, deleteAccount } = useAuth();
  const { removeAllForUser } = useBookings();

  function onSignOut() {
    Alert.alert("Log ud", "Vil du logge ud?", [
      { text: "Annuller", style: "cancel" },
      { text: "Log ud", style: "destructive", onPress: () => signOut() },
    ]);
  }

  function onDeleteAccount() {
    if (!currentUser) return;
    Alert.alert(
      "Slet konto",
      "Er du sikker på, at du vil slette din konto? Dette kan ikke fortrydes og sletter også alle dine bookinger.",
      [
        { text: "Annuller", style: "cancel" },
        {
          text: "Slet konto",
          style: "destructive",
          onPress: async () => {
            try {
              removeAllForUser(currentUser.id);
              await deleteAccount();
            } catch (e) {}
          },
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Min profil</Text>
        {currentUser ? (
          <>
            <Text style={[styles.paragraph, { marginBottom: 8 }]}>Navn</Text>
            <Text style={[styles.paragraph, { fontWeight: "700" }]}>
              {currentUser.name}
            </Text>

            <Text style={[styles.paragraph, { marginTop: 12 }]}>Email</Text>
            <Text style={[styles.paragraph, { fontWeight: "700" }]}>
              {currentUser.email || "—"}
            </Text>

            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: colors.danger, marginTop: 20 },
              ]}
              onPress={onSignOut}
            >
              <Text style={styles.buttonText}>Log ud</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: colors.card,
                  marginTop: 12,
                  borderWidth: 1,
                  borderColor: colors.danger,
                },
              ]}
              onPress={onDeleteAccount}
            >
              <Text style={[styles.buttonText, { color: colors.danger }]}>
                Slet konto
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.paragraph}>Ingen bruger logget ind.</Text>
        )}
      </View>
    </View>
  );
}
