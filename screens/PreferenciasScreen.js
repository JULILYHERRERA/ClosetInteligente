// screens/HomeScreen.js
import React, { useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";

// Opciones
const opciones = {
  colores: {
    Negro: 1, Blanco: 2, Gris: 3, Rojo: 4, Azul: 5, Verde: 6,
    Amarillo: 7, Naranja: 8, Morado: 9, Rosado: 10, Beige: 11, Marrón: 12,
  },
  estilos: {
    Casual: 1, Formal: 2, Deportivo: 3, Urbano: 4, Elegante: 5, Minimalista: 6,
  },
  ocasiones: {
    Trabajo: 1, Estudio: 2, Deporte: 3, Fiesta: 4,
    "Eventos formales": 5, Casa: 6, Viajes: 7, "Reuniones sociales": 8,
  },
  prendas: {
    Camisetas: 1, Camisas: 2, Jeans: 3, Pantalones: 4, Faldas: 5,
    Vestidos: 6, Sudaderas: 7, Blazers: 8, Chaquetas: 9, Shorts: 10, "Ropa deportiva": 11,
  },
};

export default function HomeScreen({ route, navigation }) {
  const { userId } = route.params || {}; 

  const [preferencias, setPreferencias] = useState({
    colores: [],
    estilos: [],
    ocasiones: [],
    prendas: [],
  });

  const [paso, setPaso] = useState(0); // índice del paso actual
  const categorias = Object.keys(opciones); // ["colores", "estilos", "ocasiones", "prendas"]

  const toggleSeleccion = (categoria, opcion) => {
    setPreferencias((prev) => {
      const seleccion = prev[categoria].includes(opcion)
        ? prev[categoria].filter((item) => item !== opcion)
        : [...prev[categoria], opcion];
      return { ...prev, [categoria]: seleccion };
    });
  };

  const renderOpciones = (categoria, lista) => (
    <View style={styles.section}>
      <Text style={styles.titulo}>Selecciona {categoria}</Text>
      {Object.keys(lista).map((opcion, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.opcion,
            preferencias[categoria].includes(opcion) && styles.opcionSeleccionada,
          ]}
          onPress={() => toggleSeleccion(categoria, opcion)}
        >
          <Text style={styles.texto}>{opcion}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const guardarPreferencias = async () => {
    try {
      const payload = {
        userId,
        colores: preferencias.colores.map((c) => opciones.colores[c]),
        estilos: preferencias.estilos.map((e) => opciones.estilos[e]),
        ocasiones: preferencias.ocasiones.map((o) => opciones.ocasiones[o]),
        prendas: preferencias.prendas.map((p) => opciones.prendas[p]),
      };

      const response = await fetch("http://10.33.28.44:3000/preferencias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

      const data = await response.json();
      console.log("Preferencias guardadas:", data);

      navigation.replace("Login");
    } catch (error) {
      Alert.alert("⚠️ Ocurrió un error: " + error.message);
    }
  };

  const categoriaActual = categorias[paso];

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <Text style={styles.header}>Paso {paso + 1} de {categorias.length}</Text>

      {renderOpciones(categoriaActual, opciones[categoriaActual])}

      <View style={styles.botonesContainer}>
        {paso > 0 && (
          <TouchableOpacity
            style={[styles.boton, styles.botonAnterior]}
            onPress={() => setPaso(paso - 1)}
          >
            <Text style={styles.botonTexto}>Anterior</Text>
          </TouchableOpacity>
        )}

        {paso < categorias.length - 1 ? (
          <TouchableOpacity
            style={styles.boton}
            onPress={() => setPaso(paso + 1)}
          >
            <Text style={styles.botonTexto}>Siguiente</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.boton} onPress={guardarPreferencias}>
            <Text style={styles.botonTexto}>Finalizar</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
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
  scroll: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: colors.background,
    justifyContent: "flex-start",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: colors.textPrimary,
  },
  section: {
    marginBottom: 20,
  },
  titulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: colors.textPrimary,
  },
  opcion: {
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    backgroundColor: colors.inputBackground,
  },
  opcionSeleccionada: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  texto: {
    fontSize: 16,
    textAlign: "center",
    color: colors.textPrimary,
  },
  botonesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  boton: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  botonAnterior: {
    backgroundColor: "#888", // gris para diferenciarlo
  },
  botonTexto: {
    color: colors.buttonText,
    fontSize: 18,
    fontWeight: "bold",
  },
});
