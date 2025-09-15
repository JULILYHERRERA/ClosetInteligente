// screens/InicioScreen.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function InicioScreen({ route, navigation }) {
  const { nombre, usuarioId } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido {nombre}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("AgregarPrenda", { usuarioId })}
      >
        <Text style={styles.buttonText}>Agregar prenda</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("MisPrendas", { usuarioId })}
      >
        <Text style={styles.buttonText}>Mis prendas</Text>
      </TouchableOpacity>
    </View>
  );
}


const colors = {
  primary: "#a17b4aff",
  background: "#ece2dcff",
  inputBackground: "#fff",
  inputBorder: "#ccc",
  textPrimary: "#333",
  placeholder: "#666",
  buttonText: "#fff",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 30,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginVertical: 10,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: colors.buttonText,
    fontSize: 18,
    fontWeight: "bold",
  },
});