// screens/InicioScreen.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; 

export default function InicioScreen({ route, navigation }) {
  const { nombre, usuarioId } = route.params || {};

  // Función para manejar navegación desde el bottom menu
  const navigateTo = (screenName) => {
    if (screenName === "AgregarPrenda") {
      navigation.navigate("AgregarPrenda", { usuarioId });
    } else if (screenName === "MisPrendas") {
      navigation.navigate("MisPrendas", { usuarioId });
    } else if (screenName === "Perfil") {
      navigation.navigate("Perfil", { usuarioId }); 
    } else if (screenName === "Configuracion") {
      navigation.navigate("Configuracion", { usuarioId }); 
    }
  };

  // Placeholder URL para avatar: Muestra iniciales del nombre (rápido y predefinido)
  const avatarUrl = nombre 
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(nombre)}&background=${colors.primary.replace('#', '')}&color=fff&size=80&rounded=true&bold=true&font-size=0.4`
    : 'https://ui-avatars.com/api/?name=Usuario&background=a17b4a&color=fff&size=80&rounded=true&bold=true&font-size=0.4';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.container}>
        {/* Contenido principal (ScrollView para si agregas más elementos) */}
        <ScrollView style={styles.scrollContent} contentContainerStyle={styles.contentContainer}>

          {/* Sección de bienvenida*/}
          <View style={styles.welcomeSection}>
            <Image
              source={{ uri: avatarUrl }} // Avatar con iniciales del nombre 
              style={styles.avatar}
              defaultSource={{ uri: 'https://ui-avatars.com/api/?name=U&background=a17b4a&color=fff&size=80&rounded=true' }} // Fallback simple si no carga
            />
            <Text style={styles.welcomeText}>¡Hola, {nombre || "Usuario"}!</Text>
            <Text style={styles.subtitle}>Empecemos a combinar</Text>
          </View>
        </ScrollView>

        {/* Menú inferior fijo */}
        <View style={styles.bottomMenu}>
          <TouchableOpacity
            style={[styles.menuItem, styles.activeItem]} 
            onPress={() => navigation.navigate("InicioScreen", { usuarioId })} 
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
            <Text style={styles.menuItemText}>Prendas</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigateTo("Perfil")}
            activeOpacity={0.7}
          >
            <MaterialIcons name="person-outline" size={24} color={colors.textSecondary} />
            <Text style={styles.menuItemText}>Perfil</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const colors = {
  primary: "#a17b4a",
  primaryDark: "#8a5f3a",
  background: "#ece2dc",
  cardBackground: "#ffffff",
  textPrimary: "#333333",
  textSecondary: "#666666",
  buttonText: "#ffffff",
  accent: "#f4e4d9",
  shadow: "#00000020",
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100, // Espacio para el bottom menu
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  welcomeSection: {
    alignItems: "center",
    marginBottom: 40,
    padding: 20,
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    width: "100%",
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
  },
  actionsSection: {
    width: "100%",
    alignItems: "center",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 15,
    width: "85%",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonIcon: {
    marginRight: 12,
  },
  actionButtonText: {
    color: colors.buttonText,
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
  },
  // Estilos para el bottom menu
  bottomMenu: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: colors.cardBackground,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: colors.accent,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  activeItem: {
    
  },
  menuItemText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    fontWeight: "500",
  },
  activeText: {
    color: colors.primary,
    fontWeight: "600",
  },
});
