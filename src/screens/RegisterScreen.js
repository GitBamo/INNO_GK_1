import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import styles from "../styles/globalStyles";
import colors from "../styles/colors";
import { useAuth } from "../state/AuthContext";

export default function RegisterScreen({ navigation }) {
  const { signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onRegister() {
    setLoading(true);
    const ok = await signUp({
      name: name.trim(),
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (ok) {
      // Auth state changed; AppNavigator reads currentUser and will switch
      // to the main tab navigator automatically. No manual reset required.
      return;
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Opret konto</Text>
          <Text style={[styles.paragraph, { marginBottom: 12 }]}>
            Opret en ny bruger for at kunne oprette bookinger.
          </Text>

          <Text style={styles.paragraph}>Navn</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Dit navn"
            placeholderTextColor={colors.muted}
            style={{
              backgroundColor: "#1b2340",
              color: "white",
              borderRadius: 8,
              padding: 12,
              marginTop: 6,
              marginBottom: 12,
            }}
          />

          <Text style={styles.paragraph}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@eksempel.dk"
            placeholderTextColor={colors.muted}
            autoCapitalize="none"
            keyboardType="email-address"
            style={{
              backgroundColor: "#1b2340",
              color: "white",
              borderRadius: 8,
              padding: 12,
              marginTop: 6,
              marginBottom: 12,
            }}
          />

          <Text style={styles.paragraph}>Kodeord</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Kodeord"
            placeholderTextColor={colors.muted}
            secureTextEntry
            style={{
              backgroundColor: "#1b2340",
              color: "white",
              borderRadius: 8,
              padding: 12,
              marginTop: 6,
              marginBottom: 12,
            }}
          />

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.accent }]}
            onPress={onRegister}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Opretter..." : "Opret konto"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ marginTop: 12, alignItems: "center" }}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={[styles.paragraph, { color: colors.primary }]}>
              Allerede bruger? Log ind
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
