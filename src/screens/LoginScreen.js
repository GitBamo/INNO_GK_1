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
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen({ navigation }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onLogin() {
    setLoading(true);
    const ok = await signIn({ email: email.trim(), password });
    setLoading(false);
    if (ok) {
      // Auth state changed; AppNavigator is reading currentUser and will
      // automatically render the main tab navigator. No reset needed here.
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
          <Text style={styles.title}>Log ind</Text>
          <Text style={[styles.paragraph, { marginBottom: 12 }]}>
            Log ind med din email og kodeord.
          </Text>

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
                marginBottom: 12,
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

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.accent }]}
            onPress={onLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Logger ind..." : "Log ind"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ marginTop: 12, alignItems: "center" }}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={[styles.paragraph, { color: colors.primary }]}>
              Har du ikke en konto? Opret en
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
