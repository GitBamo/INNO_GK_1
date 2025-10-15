import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import styles from "../styles/globalStyles";
import colors from "../styles/colors";
import { useAuth } from "../state/AuthContext";

export default function ProfileScreen() {
  const { currentUser, signOut } = useAuth();

  function onSignOut() {
    Alert.alert("Log ud", "Vil du logge ud?", [
      { text: "Annuller", style: "cancel" },
      { text: "Log ud", style: "destructive", onPress: () => signOut() },
    ]);
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
          </>
        ) : (
          <Text style={styles.paragraph}>Ingen bruger logget ind.</Text>
        )}
      </View>
    </View>
  );
}
