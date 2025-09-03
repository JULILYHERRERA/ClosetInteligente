import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hola, que tal 👋</Text>
      <Text style={styles.subtext}>Bienvenido a la HomeScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  text: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtext: {
    fontSize: 18,
    color: "#555",
  },
});
