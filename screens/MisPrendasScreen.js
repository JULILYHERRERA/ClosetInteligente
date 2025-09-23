import React, { useEffect, useState, useCallback } from "react";
import {View,Text,FlatList,Image,StyleSheet,ActivityIndicator,RefreshControl,TouchableOpacity,Platform} from "react-native";

//AJUSTE DE URL DE ANDROID O IOS
const API_BASE =
  Platform.OS === "android"
    ? "http://10.0.2.2:3000"
    : "http://192.168.78.207:3000";


//CATEGORÍAS
const categorias = {
  Camisetas: 1, Camisas: 2, Jeans: 3, Pantalones: 4,
  Faldas: 5, Vestidos: 6, Sudaderas: 7, Blazers: 8,
  Chaquetas: 9, Shorts: 10, "Ropa deportiva": 11,
};
const nombrePorId = Object.fromEntries(
  Object.entries(categorias).map(([nombre, id]) => [id, nombre])
);


//PANTALLA PRINCIPAL DE MIS PRENDAS
export default function MisPrendasScreen({ route }) {
  const { usuarioId } = route.params || {};
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

//FUNCION PARA CARGAR PRENDAS 
  const fetchPrendas = useCallback(async () => {
    try {
      setErrorMsg("");
      const res = await fetch(`${API_BASE}/prendas?usuarioId=${usuarioId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "No se pudo cargar prendas");
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setErrorMsg(e.message || "Error al cargar prendas");
      setItems([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [usuarioId]);

//CARGA INICIAL DE PRENDAS
  useEffect(() => { fetchPrendas(); }, [fetchPrendas]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPrendas();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text style={styles.muted}>Cargando prendas…</Text>
        </View>
      </SafeAreaView>
    );
  }

// MENSAJES DE ERROR O DE LISTA VACIA
  if (errorMsg) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.center}>
          <Text style={styles.error}>Error: {errorMsg}</Text>
          <TouchableOpacity style={styles.button} onPress={fetchPrendas}>
            <Text style={styles.buttonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

//VISTA DE LISTA DE PRENDAS
  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.center}>
          <Text style={styles.title}>Aún no tienes prendas guardadas</Text>
          <Text style={styles.muted}>Agrega una desde “Agregar prenda”.</Text>
          <TouchableOpacity style={[styles.button, { marginTop: 16 }]} onPress={fetchPrendas}>
            <Text style={styles.buttonText}>Actualizar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <FlatList
        style={styles.list}                     
        contentContainerStyle={styles.listInner} 
        data={items}
        keyExtractor={(it) => String(it.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => {
          const nombre = nombrePorId[item.id_prenda] || "Prenda";
          return (
            <View style={styles.card}>
              <Image source={{ uri: item.imagenUrl }} style={styles.img} />
              <View style={styles.row}>
                <Text style={styles.caption}>{nombre}</Text>
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

//ESTILOS
const colors = {
  primary: "#a17b4aff",
  background: "#ece2dcff",
  card: "#fff",
  text: "#333",
  muted: "#666",
  buttonText: "#fff",
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  list: { flex: 1, backgroundColor: colors.background },
  listInner: { padding: 16, gap: 12 },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: colors.background,
  },

  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },

  img: { width: "100%", height: 200, borderRadius: 12, marginBottom: 10, backgroundColor: "#eee" },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },

  caption: { fontSize: 16, fontWeight: "600", color: colors.text },
  title: { fontSize: 18, fontWeight: "700", color: colors.text, textAlign: "center" },
  muted: { color: colors.muted, marginTop: 6, textAlign: "center" },
  error: { color: "#b00020", fontWeight: "600", textAlign: "center", marginBottom: 12 },

  button: { backgroundColor: colors.primary, paddingVertical: 12, paddingHorizontal: 18, borderRadius: 10 },
  buttonText: { color: colors.buttonText, fontWeight: "700" },
});
