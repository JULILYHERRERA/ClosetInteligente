import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import { Picker } from "@react-native-picker/picker";
import Constants from "expo-constants";
import { Buffer } from "buffer";


const prendas = {
  "Camisetas": 1, "Camisas": 2, "Jeans": 3, "Pantalones": 4,
  "Faldas": 5, "Vestidos": 6, "Sudaderas": 7, "Blazers": 8,
  "Chaquetas": 9, "Shorts": 10, "Ropa deportiva": 11,
};

// API KEY DE REMOVE.BG desde app.json 
const EXTRA = Constants.expoConfig?.extra || Constants.manifest?.extra || {};
const REMOVE_BG_API_KEY = EXTRA.REMOVE_BG_API_KEY || ""; 

// AJUSTE DE URL DE ANDROID O IOS (para tu backend de guardar prendas)
const API_BASE = Constants.expoConfig.extra.API_URL; 

export default function AgregarPrendaScreen({ route, navigation }) { 
  const { usuarioId } = route.params;

  const [image, setImage] = useState(null);       // ruta local del PNG recortado
  const [selectedPrenda, setSelectedPrenda] = useState(null);
  const [loading, setLoading] = useState(false);

  // helper: arrayBuffer -> base64 
const arrayBufferToBase64 = (buffer) => {
  return Buffer.from(buffer).toString("base64");
};


//TOMAR FOTO  
  const tomarFoto = async () => {
    if (!REMOVE_BG_API_KEY) {
      Alert.alert("Falta API Key", "Configura REMOVE_BG_API_KEY en app.json → expo.extra");
      return;
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Se requiere permiso para usar la cámara");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,   // <— importante: el recorte lo hara API
      quality: 1,
    });
    if (result.canceled) return;

    try {
      setLoading(true);

      // Llamar a remove.bg y obtener PNG con transparencia 
      const form = new FormData();
      form.append("image_file", {
        uri: result.assets[0].uri,
        name: "prenda.jpg",
        type: "image/jpeg",
      });
      form.append("size", "auto");   // tamaño automático
      form.append("format", "png");  // queremos PNG

      const resp = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: { "X-Api-Key": REMOVE_BG_API_KEY },
        body: form,
      });

      // remove.bg responde BINARIO (el PNG) leemos ArrayBuffer
      const arrayBuf = await resp.arrayBuffer();
      if (!resp.ok) {
        const msg = resp.headers.get("x-error") || `HTTP ${resp.status}`;
        throw new Error(`remove.bg: ${msg}`);
      }

      // Guardamos el PNG en la carpeta de la app
      const base64Data = arrayBufferToBase64(arrayBuf);
      const dir = FileSystem.documentDirectory + "prendas/";
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true }).catch(() => {});
      const localPng = `${dir}prenda_${Date.now()}.png`;

      await FileSystem.writeAsStringAsync(localPng, base64Data, { encoding: 'base64' });

      // Vista previa con el PNG recortado
      setImage(localPng);
      Alert.alert("Listo ✅", "Prenda recortada automáticamente");
    } catch (e) {
      console.error("Error recortando prenda:", e);
      Alert.alert("Error", e?.message || "No se pudo recortar la prenda");
    } finally {
      setLoading(false);
    }
  };

  //GUARDAR PRENDA
  const guardarPrenda = async () => {
    if (!image || !selectedPrenda) {
      Alert.alert("Debes tomar una foto y elegir la categoría");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("usuarioId", usuarioId);
      formData.append("id_prenda", selectedPrenda);
      formData.append("imagen", { uri: image, name: "prenda.png", type: "image/png" });

      const response = await fetch(`${API_BASE}/prendas`, {
        method: "POST",
        body: formData
      });

      const ct = response.headers.get("content-type") || "";
      const raw = await response.text();
      let data = null;
      if (ct.includes("application/json")) {
        try { data = JSON.parse(raw); } catch {}
      }
      if (!response.ok) {
        const msg = (data && data.message) || raw.slice(0, 120);
        throw new Error(msg || "Error al guardar la prenda");
      }

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

      <TouchableOpacity style={styles.button} onPress={tomarFoto} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Procesando..." : "Tomar Foto"}</Text>
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

      <TouchableOpacity style={styles.button} onPress={guardarPrenda} disabled={loading}>
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
    backgroundColor: "#fff",
    resizeMode: "contain", // luce mejor con PNG recortado
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
