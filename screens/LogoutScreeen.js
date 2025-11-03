import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LogoutScreen({ navigation, route }) {
  const { usuarioId } = route.params || {};

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(["user", "token"]);
      // Vuelve a Login y limpia el stack
      navigation.reset({ index: 0, routes: [{ name: "Login" }] });
    } catch (e) {
      Alert.alert("Error", "No se pudo cerrar sesión. Intenta de nuevo.");
    }
  };

  const handleContinue = () => {
    navigation.replace("Inicio", { usuarioId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Quieres cerrar sesión?</Text>
      <Text style={styles.subtitle}>
        Puedes continuar navegando o salir de tu cuenta ahora.
      </Text>

      <View style={styles.buttonsRow}>
        <TouchableOpacity style={[styles.btn, styles.secondary]} onPress={handleContinue}>
          <Text style={[styles.btnText, styles.secondaryText]}>Continuar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, styles.danger]} onPress={handleLogout}>
          <Text style={styles.btnText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center", backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "700", textAlign: "center", marginBottom: 8, color: "#222" },
  subtitle: { fontSize: 14, textAlign: "center", color: "#666", marginBottom: 24 },
  buttonsRow: { flexDirection: "row", justifyContent: "center", gap: 12 },
  btn: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    minWidth: 140,
    alignItems: "center",
    ...Platform.select({
      android: { elevation: 2 },
      ios: { shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } }
    })
  },
  secondary: { backgroundColor: "#f2f2f2", borderWidth: 1, borderColor: "#ddd" },
  secondaryText: { color: "#333" },
  danger: { backgroundColor: "#BFF207" },
  btnText: { color: "#080808ff", fontWeight: "700" }
});
