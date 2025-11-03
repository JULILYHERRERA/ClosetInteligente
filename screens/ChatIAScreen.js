import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image, KeyboardAvoidingView, Platform, Alert } from "react-native";
import Constants from "expo-constants";
import { useRoute } from "@react-navigation/native";

export default function ChatIAScreen() {
  const route = useRoute();
  const { usuarioId } = route.params || {}; 

  const [messages, setMessages] = useState([
    { id: "1", text: "👋 Hola, soy tu asistente de moda. ¿Qué ocasión tienes en mente?", sender: "ia", type: "text" }
  ]);
  const [input, setInput] = useState("");

  const API_BASE = Constants.expoConfig.extra.API_URL;

  const handleSend = async () => {
    if (!input.trim()) return;

    if (!usuarioId) {
      Alert.alert("Falta usuario", "No se encontró el usuario logueado (usuarioId). Vuelve desde Inicio.");
      return;
    }

    const userMessage = { id: Date.now().toString(), text: input, sender: "user", type: "text" };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await fetch(`${API_BASE}/chat-ia`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensaje: input, usuarioId }) 
      });

      const data = await res.json();
      console.log("📩 Respuesta del backend:", data);

      const iaMessage = {
        id: `${Date.now()}-${Math.random()}`,
        text: data.respuesta || data.error || "❌ No se pudo obtener respuesta",
        sender: "ia",
        type: "text"
      };
      setMessages((prev) => [...prev, iaMessage]);

      if (data.imagenes?.length) {
        const imageMessages = data.imagenes.map((img, idx) => ({
          id: `${Date.now()}-img-${idx}`,
          url: img.url || img.imagenUrl,
          sender: "ia",
          type: "image"
        }));
        setMessages((prev) => [...prev, ...imageMessages]);
      }
    } catch (err) {
      console.error("❌ Error en frontend:", err);
      const iaMessage = {
        id: `${Date.now()}-error`,
        text: "⚠️ Error al conectar con la IA",
        sender: "ia",
        type: "text"
      };
      setMessages((prev) => [...prev, iaMessage]);
    }

    setInput("");
  };

  const renderMessage = ({ item }) => {
    if (item.type === "image") {
      return (
        <View style={[styles.messageBubble, styles.iaBubble]}>
          <Image source={{ uri: item.url }} style={styles.imageMessage} />
        </View>
      );
    }

    return (
      <View
        style={[
          styles.messageBubble,
          item.sender === "user" ? styles.userBubble : styles.iaBubble
        ]}
      >
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatContainer}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe tu mensaje..."
          placeholderTextColor="#aaa"
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f5f7" // gris muy claro, tipo fashion app
  },
  chatContainer: {
    padding: 15,
    paddingBottom: 80 // deja espacio para el input
  },
  messageBubble: {
    padding: 12,
    marginVertical: 6,
    borderRadius: 15,
    maxWidth: "80%",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#BFF207" // color lima
  },
  iaBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd"
  },
  messageText: {
    color: "#333",
    fontSize: 15
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    marginBottom: 10 // lo sube un poco del borde inferior
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 15,
    backgroundColor: "#f9f9f9"
  },
  sendButton: {
    backgroundColor: "#BFF207",
    marginLeft: 10,
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 10
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold"
  },
  imageMessage: {
    width: 160,
    height: 200,
    borderRadius: 12,
    resizeMode: "cover"
  }
});
