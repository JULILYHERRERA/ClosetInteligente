import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";

const prendas = {
  "Camisetas": 1, "Camisas": 2, "Jeans": 3, "Pantalones": 4,
  "Faldas": 5, "Vestidos": 6, "Sudaderas": 7, "Blazers": 8,
  "Chaquetas": 9, "Shorts": 10, "Ropa deportiva": 11,
};

export default function AgregarPrendaScreen({ route, navigation }) { 
  const { usuarioId } = route.params;

  const [image, setImage] = useState(null);
  const [selectedPrenda, setSelectedPrenda] = useState(null);


//TOMAR FOTO  
  const tomarFoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Se requiere permiso para usar la cámara");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  //GUARDAR PRENDA
  const guardarPrenda = async () => {
    if (!image || !selectedPrenda) {
      Alert.alert("Debes tomar una foto y elegir la categoría");
      return;
    }

    const formData = new FormData();
    formData.append("usuarioId", usuarioId);
    formData.append("id_prenda", selectedPrenda);
    formData.append("imagen", { uri: image, name: "prenda.jpg", type: "image/jpeg" });

    try {
      const response = await fetch("http://192.168.20.21:3000/prendas", {
        method: "POST",
        body: formData
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error al guardar la prenda");

      Alert.alert("Prenda guardada correctamente");
      setImage(null);
      setSelectedPrenda(null);
    } catch (error) {
      console.error("Error guardando prenda:", error);
      Alert.alert("Error:", error.message);
    }
  };


 // VISTA 
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agregar Prenda</Text>

      <TouchableOpacity style={styles.button} onPress={tomarFoto}>
        <Text style={styles.buttonText}>Tomar Foto</Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image }} style={styles.preview} />}

      <Text style={styles.label}>Selecciona categoría:</Text>
      <Picker
        selectedValue={selectedPrenda}
        onValueChange={(itemValue) => setSelectedPrenda(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="-- Selecciona --" value={null} />
        {Object.entries(prendas).map(([nombre, id]) => (
          <Picker.Item key={id} label={nombre} value={id} />
        ))}
      </Picker>

      <TouchableOpacity style={styles.button} onPress={guardarPrenda}>
        <Text style={styles.buttonText}>Guardar Prenda</Text>
      </TouchableOpacity>

      {/* NUEVO: botón para ver las prendas  */}
      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => navigation.navigate("MisPrendas", { usuarioId })}
      >
        <Text style={[styles.buttonText, styles.secondaryButtonText]}>
          Ver mis prendas
        </Text>
      </TouchableOpacity>
    </View>
  );
}

//ESTILOS 
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
    backgroundColor: colors.background,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: colors.buttonText,
    fontSize: 16,
    fontWeight: "bold",
  },
  // Estilo del boton de VER PRENDAS
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: colors.primary,
  },
  secondaryButtonText: {
    color: colors.primary,
  },
  preview: {
    width: "100%",
    height: 250,
    marginVertical: 15,
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
    marginVertical: 10,
  },
  picker: {
    backgroundColor: colors.inputBackground,
    borderColor: colors.inputBorder,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
  },
});
