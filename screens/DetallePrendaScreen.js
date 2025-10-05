import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

const categorias = {
  Camisetas: 1, Camisas: 2, Jeans: 3, Pantalones: 4, Faldas: 5, Vestidos: 6,
  Sudaderas: 7, Blazers: 8, Chaquetas: 9, Shorts: 10, "Ropa deportiva": 11,
};
const nombrePorId = Object.fromEntries(
  Object.entries(categorias).map(([nombre, id]) => [id, nombre])
);

export default function DetallePrendaScreen({ route, navigation }) {
  const { prenda } = route.params || {};
  const nombreCategoria =
    prenda?.nombreCategoria || nombrePorId[prenda?.id_prenda] || "Sin categoría";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalle de prenda</Text>

      {!!prenda?.imagenUrl && (
        <Image source={{ uri: prenda.imagenUrl }} style={styles.img} />
      )}

      <View style={styles.grid}>
        <View style={styles.row}>
          <Text style={styles.label}>ID: </Text>
          <Text style={styles.value}>{prenda?.id ?? "-"}</Text>

        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Categoría: </Text>
          <Text style={styles.value}>{nombreCategoria}</Text>

        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const colors = {
  primary: "#a17b4a",
  bg: "#ece2dcff",
  card: "#fff",
  text: "#333",
  muted: "#666",
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: colors.bg },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 12, color: colors.text, textAlign: "center" },
  img: {
    width: "100%", height: 320, resizeMode: "contain",
    backgroundColor: colors.card, borderRadius: 12, marginBottom: 16,
  },
  grid: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    gap: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  row: { flexDirection: "row", alignItems: "center", flexWrap: "wrap" },
  label: { fontWeight: "700", color: colors.text, fontSize: 16 },
  value: { fontWeight: "400", color: colors.text, fontSize: 16 }, 
  button: {
    marginTop: 18, backgroundColor: colors.primary, padding: 14,
    borderRadius: 10, alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "700" },
});
