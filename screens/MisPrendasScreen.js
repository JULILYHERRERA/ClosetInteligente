import React, { useState, useEffect, useCallback } from "react";
import { 
  View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, ScrollView 
} from "react-native";
import Constants from "expo-constants";
import { MaterialIcons } from "@expo/vector-icons";

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

// ... todo el import y definición de categorias, nombrePorId y API_BASE igual

export default function OutfitScreen({ route, navigation }) {
  const { usuarioId } = route.params || {};
  const [prendas, setPrendas] = useState([]);
  const [outfit, setOutfit] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPrendas = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/prendas?usuarioId=${usuarioId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Error cargando prendas");
      setPrendas(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error fetch prendas:", e);
      setPrendas([]);
    } finally {
      setLoading(false);
    }
  }, [usuarioId]);

  useEffect(() => { fetchPrendas(); }, [fetchPrendas]);

  const generarOutfit = useCallback(() => {
    if (!Array.isArray(prendas) || prendas.length < 2) return;

    const tops = prendas.filter(p =>
      [categorias.Camisetas, categorias.Camisas, categorias.Vestidos, categorias.Sudaderas, categorias.Blazers, categorias.Chaquetas]
        .includes(Number(p.id_prenda))
    );

    const bottoms = prendas.filter(p =>
      [categorias.Jeans, categorias.Pantalones, categorias.Faldas, categorias.Shorts, categorias["Ropa deportiva"]]
        .includes(Number(p.id_prenda))
    );

    if (tops.length === 0 || bottoms.length === 0) return;

    const randomTop = tops[Math.floor(Math.random() * tops.length)];
    const randomBottom = bottoms[Math.floor(Math.random() * bottoms.length)];

    setOutfit([randomTop, randomBottom]);
  }, [prendas]);

  useEffect(() => {
    if (!loading && prendas.length >= 2) generarOutfit();
  }, [loading, prendas, generarOutfit]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text>Cargando prendas…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {outfit.length > 0 ? (
        <>
          <ScrollView
            contentContainerStyle={[styles.outfitContainer, { paddingBottom: 10 }]} 
            showsHorizontalScrollIndicator={false}
          >
            {outfit.map((prenda, i) => {
              const tipo = [categorias.Camisetas, categorias.Camisas, categorias.Vestidos, categorias.Sudaderas, categorias.Blazers, categorias.Chaquetas]
                .includes(Number(prenda.id_prenda)) ? "Top" : "Bottom";
              return (
                <View key={i} style={styles.card}>
                  <Image source={{ uri: prenda.imagenUrl }} style={styles.img} />
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{tipo}</Text>
                  </View>
                  <Text style={styles.caption}>{nombrePorId[Number(prenda.id_prenda)] || "Prenda"}</Text>
                </View>
              );
            })}
          </ScrollView>

          <TouchableOpacity style={styles.secondaryButton} onPress={generarOutfit}>
            <Text style={styles.secondaryButtonText}>Generar otro look</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.muted}>Toca "Generar Outfit" para ver combinaciones</Text>
          <TouchableOpacity style={styles.secondaryButton} onPress={generarOutfit}>
            <Text style={styles.secondaryButtonText}>Generar Outfit</Text>
          </TouchableOpacity>
        </>
      )}

      <View style={styles.bottomMenu}>
        <TouchableOpacity style={[styles.menuItem, styles.activeItem]} onPress={() => navigation.navigate("Inicio", { usuarioId })} activeOpacity={0.7}>
          <MaterialIcons name="home" size={24} color={colors.textSecondary} />
          <Text style={styles.menuItemText}>Inicio</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("AgregarPrenda", { usuarioId })} activeOpacity={0.7}>
          <MaterialIcons name="add" size={24} color={colors.textSecondary} />
          <Text style={styles.menuItemText}>Agregar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("MisPrendas", { usuarioId })} activeOpacity={0.7}>
          <MaterialIcons name="folder" size={24} color={colors.textPrimary} />
          <Text style={[styles.menuItemText, styles.activeText]}>Estilo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("ChatIA", { usuarioId })} activeOpacity={0.7}>
          <MaterialIcons name="person-outline" size={24} color={colors.textSecondary} />
          <Text style={styles.menuItemText}>Chat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Colores y paleta
const colors = {
  primary: "#7F6DF2",       
  background: "#ece7f7",    
  textPrimary: "#014034",    
  textSecondary: "#888",      
  buttonText: "#fff",          
  menuBackground: "#fff", 
  shadow: "#000",
};

// Estilos
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  outfitContainer: { flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, paddingVertical: 20 },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    width: 180,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  img: { width: 150, height: 150, resizeMode: "contain", borderRadius: 10 },
  caption: { marginTop: 8, fontSize: 16, fontWeight: "600", color: colors.textPrimary, textAlign: "center" },
  muted: { textAlign: "center", marginTop: 20, color: colors.textSecondary },
  badge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
    marginBottom: 50, // se sube respecto al bottom menu
  },
  secondaryButton: {
    backgroundColor: "#BFF207",
    borderWidth: 2,
    borderColor: "#BFF207",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
    marginBottom: 200, // lo subimos respecto al bottom menu sin quitarlo
},

  bottomMenu: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.menuBackground,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    shadowColor: colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  menuItem: { flex: 1, alignItems: "center", justifyContent: "center" },
  menuItemText: { fontSize: 12, marginTop: 4, color: colors.textPrimary },
  activeItem: {},
  activeText: { color: colors.textPrimary, fontWeight: "600" },
});

