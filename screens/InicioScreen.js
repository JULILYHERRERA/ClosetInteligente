// screens/InicioScreen.js
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles, colors } from "./InicioScreen.styles";
import Constants from "expo-constants";

const SafeAreaViewCompat = require("react-native").SafeAreaView || View;

// AJUSTE DE URL
const API_BASE = Constants.expoConfig.extra.API_URL;

// CATEGORÍAS
const categorias = {
  Camisetas: 1,
  Camisas: 2,
  Jeans: 3,
  Pantalones: 4,
  Faldas: 5,
  Vestidos: 6,
  Sudaderas: 7,
  Blazers: 8,
  Chaquetas: 9,
  Shorts: 10,
  "Ropa deportiva": 11,
};

const nombrePorId = Object.fromEntries(
  Object.entries(categorias).map(([nombre, id]) => [id, nombre])
);

const categories = ["Todas", ...Object.keys(categorias)];

export default function InicioScreen({ route, navigation }) {
  const { nombre, usuarioId } = route.params || {};

  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigateTo = (screenName) => {
    navigation.navigate(screenName, { usuarioId });
  };

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

  useEffect(() => {
    fetchPrendas();
  }, [fetchPrendas]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPrendas();
  };

  const getCategoriaNombre = (item) => {
    const categoriaId =
      item.id_prenda ?? item.categoria_id ?? item.categoria ?? 0;
    return nombrePorId[categoriaId] || "Desconocida";
  };

  const filteredPrendas =
    selectedCategory === "Todas"
      ? items
      : items.filter(
          (prenda) => getCategoriaNombre(prenda) === selectedCategory
        );

  const renderCategoryButton = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === item && styles.selectedCategoryButton,
      ]}
      onPress={() => setSelectedCategory(item)}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.categoryButtonText,
          selectedCategory === item && styles.selectedCategoryButtonText,
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  const renderPrenda = ({ item }) => {
    const categoriaNombre = getCategoriaNombre(item);
    const uri = item.imagenUrl ?? item.imagen_url ?? item.url ?? null;
    const prendaNombre = item.nombre ?? categoriaNombre ?? "Prenda";

    return (
      <TouchableOpacity
        style={styles.prendaItem}
        onPress={() =>
          navigation.navigate("DetallePrenda", { prenda: item, usuarioId })
        }
        activeOpacity={0.8}
      >
        {uri ? (
          <Image source={{ uri }} style={styles.prendaImage} />
        ) : (
          <View
            style={[
              styles.prendaImage,
              {
                backgroundColor: colors.accent,
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
          >
            <MaterialIcons
              name="image-not-supported"
              size={32}
              color={colors.textSecondary}
            />
          </View>
        )}
    
      </TouchableOpacity>
    );
  };

  const keyExtractor = (item) =>
    String(item.id ?? item.prenda_id ?? item.id_prenda ?? Math.random());

  if (loading) {
    return (
      <SafeAreaViewCompat style={styles.safeArea}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={colors.background}
        />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.muted}>Cargando prendas…</Text>
        </View>
      </SafeAreaViewCompat>
    );
  }

  if (errorMsg) {
    return (
      <SafeAreaViewCompat style={styles.safeArea}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={colors.background}
        />
        <View style={styles.center}>
          <Text style={styles.error}>Error: {errorMsg}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchPrendas}>
            <Text style={styles.buttonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaViewCompat>
    );
  }

  return (
    <SafeAreaViewCompat style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.container}>
        {/* Header con categorías */}
        <View style={styles.header}>
          <FlatList
            data={categories}
            renderItem={renderCategoryButton}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScrollContainer}
          />
        </View>

        {/* Grid de prendas */}
        <FlatList
          data={filteredPrendas}
          renderItem={renderPrenda}
          keyExtractor={keyExtractor}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.prendasGrid}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => (
            <Text style={styles.sectionTitle}>Tus Prendas</Text>
          )}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <MaterialIcons
                name="folder-off"
                size={48}
                color={colors.textSecondary}
              />
              <Text style={styles.emptyText}>
                Aún no tienes prendas guardadas
              </Text>
            </View>
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
            />
          }
        />

        {/* Menú inferior */}
        <View style={styles.bottomMenu}>
          <TouchableOpacity
            style={[styles.menuItem, styles.activeItem]}
            onPress={() => navigation.navigate("Logout", { usuarioId })}
            activeOpacity={0.7}
          >
            <MaterialIcons name="home" size={24} color={colors.primary} />
            <Text style={[styles.menuItemText, styles.activeText]}>Inicio</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigateTo("AgregarPrenda")}
            activeOpacity={0.7}
          >
            <MaterialIcons name="add" size={24} color={colors.textSecondary} />
            <Text style={styles.menuItemText}>Agregar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigateTo("MisPrendas")}
            activeOpacity={0.7}
          >
            <MaterialIcons name="folder" size={24} color={colors.textSecondary} />
            <Text style={styles.menuItemText}>Estilo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigateTo("ChatIA")}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name="person-outline"
              size={24}
              color={colors.textSecondary}
            />
            <Text style={styles.menuItemText}>Chat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaViewCompat>
  );
}
