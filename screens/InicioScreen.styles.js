import { StyleSheet } from "react-native";
export const colors = {
  primary: "#014034",
  primaryDark: "#e0ddf3ff",
  background: "#ece7f7ff",
  cardBackground: "#ffffff",
  textPrimary: "#333333",
  textSecondary: "#666666",
  buttonText: "#ffffff",
  accent: "#BFF207",
  shadow: "#00000020",
};

 export const styles = StyleSheet.create({
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
  // Estilos para header con categorías
  header: {
    backgroundColor: colors.cardBackground,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.accent,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryScrollContainer: {
    paddingHorizontal: 10,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: colors.accent,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  selectedCategoryButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  selectedCategoryButtonText: {
    color: colors.buttonText,
    fontWeight: "600",
  },
  welcomeSection: {
    alignItems: "center",
    marginBottom: 20,
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
  // Estilos para sección de prendas
  prendasSection: {
    width: "100%",
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 30,
    marginTop: 20,
    textAlign: "center",
  },
  row: {
    justifyContent: "space-between",
  },
  prendasGrid: {
    paddingBottom: 20,
  },
  prendaItem: {
    width: "48%",
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
    alignItems: "center",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  prendaImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  prendaNombre: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: 4,
  },
  prendaCategoria: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center",
  },
  // Estado vacío / loading / error (integrados del MisPrendasScreen)
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: colors.background,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 10,
  },
  muted: {
    color: colors.textSecondary,
    marginTop: 6,
    textAlign: "center",
  },
  error: {
    color: "#b00020",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  buttonText: {
    color: colors.buttonText,
    fontWeight: "700",
  },
  // Estilos para el bottom menu (sin cambios)
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
    // Ligeramente elevado para indicar activo
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
  }
});