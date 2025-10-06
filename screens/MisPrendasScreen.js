import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import Constants from "expo-constants";

// CATEGORÍAS 
const categorias = {
  "Camisetas": 1, "Camisas": 2, "Jeans": 3, "Pantalones": 4,
  "Faldas": 5, "Vestidos": 6, "Sudaderas": 7, "Blazers": 8,
  "Chaquetas": 9, "Shorts": 10, "Ropa deportiva": 11,
};


const nombrePorId = Object.fromEntries(
  Object.entries(categorias).map(([n, id]) => [id, n])
);

const API_BASE = Constants.expoConfig.extra.API_URL;

export default function OutfitScreen({ route }) {
  const { usuarioId } = route.params || {};
  const [prendas, setPrendas] = useState([]);
  const [outfit, setOutfit] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar prendas guardadas
  const fetchPrendas = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/prendas?usuarioId=${usuarioId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Error cargando prendas");

      // aseguramos que siempre sea array
      setPrendas(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error fetch prendas:", e);
      setPrendas([]);
    } finally {
      setLoading(false);
    }
  }, [usuarioId]);

  useEffect(() => {
    fetchPrendas();
  }, [fetchPrendas]);

  // Generar outfit aleatorio (1 arriba + 1 abajo)
  const generarOutfit = () => {
    if (!Array.isArray(prendas) || prendas.length < 2) {
      alert("Debes tener al menos 2 prendas guardadas");
      return;
    }

    // tops (arriba)
    const tops = prendas.filter(p =>
      [categorias.Camisetas, categorias.Camisas, categorias.Vestidos, categorias.Sudaderas, categorias.Blazers, categorias.Chaquetas]
        .includes(Number(p.id_prenda))
    );

    // bottoms (abajo)
    const bottoms = prendas.filter(p =>
      [categorias.Jeans, categorias.Pantalones, categorias.Faldas, categorias.Shorts, categorias["Ropa deportiva"]]
        .includes(Number(p.id_prenda))
    );

    if (tops.length === 0 || bottoms.length === 0) {
      alert("Necesitas al menos 1 prenda superior y 1 inferior");
      return;
    }

    const randomTop = tops[Math.floor(Math.random() * tops.length)];
    const randomBottom = bottoms[Math.floor(Math.random() * bottoms.length)];

    setOutfit([randomTop, randomBottom]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Cargando prendas…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Outfit Aleatorio</Text>

      <TouchableOpacity style={styles.button} onPress={generarOutfit}>
        <Text style={styles.buttonText}>Generar Outfit</Text>
      </TouchableOpacity>

      {outfit.length > 0 ? (
        <ScrollView contentContainerStyle={styles.outfitContainer}>
          {outfit.map((prenda, i) => (
            <View key={i} style={styles.card}>
              <Image
                source={{ uri: prenda.imagenUrl }}
                style={styles.img}
              />
              <Text style={styles.caption}>
                {nombrePorId[Number(prenda.id_prenda)] || "Prenda"}
              </Text>
            </View>
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.muted}>Toca "Generar Outfit" para ver combinaciones</Text>
      )}
    </View>
  );
}

const colors = {
  primary: "#a17b4aff",
  background: "#ece2dcff",
  card: "#fff",
  text: "#333",
  muted: "#666",
  buttonText: "#fff",
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "700", textAlign: "center", marginBottom: 20, color: colors.text },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: { color: colors.buttonText, fontWeight: "700" },
  outfitContainer: { alignItems: "center", gap: 20 },
  card: {
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
  },
  img: { width: 200, height: 200, resizeMode: "contain", borderRadius: 10 },
  caption: { marginTop: 8, fontSize: 16, fontWeight: "600", color: colors.text },
  muted: { textAlign: "center", marginTop: 20, color: colors.muted },
});
