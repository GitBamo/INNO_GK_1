import React, { useMemo, useState } from "react";
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
import { Ionicons } from "@expo/vector-icons";

export default function RegisterScreen({ navigation }) {
  const { signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Live-validering
  const passwordError = useMemo(() => {
    if (!password) return "";
    if (password.length < 6) return "Kodeord skal være mindst 6 tegn.";
    return "";
  }, [password]);

  const confirmError = useMemo(() => {
    if (!confirm) return "";
    if (confirm !== password) return "Kodeordene er ikke ens.";
    return "";
  }, [confirm, password]);

  async function onRegister() {
    setError("");
    if (
      passwordError ||
      confirmError ||
      !name.trim() ||
      !email.trim() ||
      !password
    ) {
      // Fejl vises inline via live-validering
      return;
    }
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
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 0}
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
          <View style={{ position: "relative" }}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Kodeord"
              placeholderTextColor={colors.muted}
              secureTextEntry={!showPassword}
              style={{
                backgroundColor: "#1b2340",
                color: "white",
                borderRadius: 8,
                padding: 12,
                paddingRight: 44,
                marginTop: 6,
                marginBottom: 8,
              }}
            />
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={22}
              color={colors.muted}
              style={{ position: "absolute", right: 12, top: 18 }}
              onPress={() => setShowPassword((s) => !s)}
              accessibilityRole="button"
              accessibilityLabel={
                showPassword ? "Skjul kodeord" : "Vis kodeord"
              }
            />
          </View>
          {passwordError ? (
            <Text
              style={[
                styles.paragraph,
                { color: colors.danger, marginBottom: 8 },
              ]}
            >
              {passwordError}
            </Text>
          ) : null}

          <Text style={styles.paragraph}>Gentag kodeord</Text>
          <View style={{ position: "relative" }}>
            <TextInput
              value={confirm}
              onChangeText={setConfirm}
              placeholder="Gentag kodeord"
              placeholderTextColor={colors.muted}
              secureTextEntry={!showConfirm}
              style={{
                backgroundColor: "#1b2340",
                color: "white",
                borderRadius: 8,
                padding: 12,
                paddingRight: 44,
                marginTop: 6,
                marginBottom: 8,
              }}
            />
            <Ionicons
              name={showConfirm ? "eye-outline" : "eye-off-outline"}
              size={22}
              color={colors.muted}
              style={{ position: "absolute", right: 12, top: 18 }}
              onPress={() => setShowConfirm((s) => !s)}
              accessibilityRole="button"
              accessibilityLabel={
                showConfirm ? "Skjul gentagelse" : "Vis gentagelse"
              }
            />
          </View>
          {confirmError ? (
            <Text
              style={[
                styles.paragraph,
                { color: colors.danger, marginBottom: 12 },
              ]}
            >
              {confirmError}
            </Text>
          ) : null}

          {error ? (
            <Text
              style={[
                styles.paragraph,
                { color: colors.danger, marginBottom: 12 },
              ]}
            >
              {error}
            </Text>
          ) : null}

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
