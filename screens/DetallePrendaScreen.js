import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import Constants from "expo-constants";

// Mapeo de categorías
const categorias = {
  Camisetas: 1, Camisas: 2, Jeans: 3, Pantalones: 4, Faldas: 5, Vestidos: 6,
  Sudaderas: 7, Blazers: 8, Chaquetas: 9, Shorts: 10, "Ropa deportiva": 11,
};
const nombrePorId = Object.fromEntries(
  Object.entries(categorias).map(([nombre, id]) => [id, nombre])
);

// URL del backend desde app.json
const API_BASE = Constants.expoConfig.extra.API_URL;

export default function DetallePrendaScreen({ route, navigation }) {
  const { prenda } = route.params || {};
  const nombreCategoria = prenda?.nombreCategoria || nombrePorId[prenda?.id_prenda] || "Sin categoría";

  // Función para eliminar la prenda
  const eliminarPrenda = () => {
    Alert.alert(
      "Eliminar prenda",
      "¿Estás seguro de eliminar esta prenda?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              if (!prenda?.id) throw new Error("ID de la prenda no válido");

              const response = await fetch(`${API_BASE}/prendas/${prenda.id}`, {
                method: "DELETE",
              });

              if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                throw new Error(err.message || "Error al eliminar la prenda");
              }

              Alert.alert("Prenda eliminada ✅");
              navigation.goBack();
            } catch (error) {
              console.error("Error al eliminar prenda:", error);
              Alert.alert("Error al eliminar la prenda ❌", error.message);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalle de prenda</Text>

      {prenda?.imagenUrl && (
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

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#BFF207", marginTop: 10 }]}
        onPress={eliminarPrenda}
      >
        <Text style={styles.buttonTextE}>Eliminar prenda</Text>
      </TouchableOpacity>
    </View>
  );
}

// Colores y estilos
const colors = {
  primary: "#7F6DF2",
  bg: "#ebe2f3ff",
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
  buttonTextE: { color: "#014034", fontWeight: "700" },
});
