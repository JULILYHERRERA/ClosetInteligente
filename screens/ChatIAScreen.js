import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image } from "react-native";
import Constants from "expo-constants";

export default function ChatIAScreen() {
  const [messages, setMessages] = useState([
    { id: "1", text: "👋 Hola, soy tu asistente de moda. ¿Qué ocasión tienes en mente?", sender: "ia", type: "text" }
  ]);
  const [input, setInput] = useState("");

  const API_BASE = Constants.expoConfig.extra.API_URL;

  const handleSend = async () => {
  if (!input.trim()) return;

  const userMessage = { id: Date.now().toString(), text: input, sender: "user", type: "text" };
  setMessages((prev) => [...prev, userMessage]);

  try {
    const res = await fetch(`${API_BASE}/chat-ia`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mensaje: input, usuarioId: 16 })
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
        url: img.url || img.imagenUrl, // soporte a ambas keys
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
      <View style={[
        styles.messageBubble,
        item.sender === "user" ? styles.userBubble : styles.iaBubble
      ]}>
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatContainer}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe aquí..."
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  chatContainer: { padding: 10 },
  messageBubble: { padding: 10, marginVertical: 5, borderRadius: 10, maxWidth: "80%" },
  userBubble: { alignSelf: "flex-end", backgroundColor: "#a17b4a" },
  iaBubble: { alignSelf: "flex-start", backgroundColor: "#ece2dc" },
  messageText: { color: "#000" },
  inputContainer: { flexDirection: "row", padding: 10, borderTopWidth: 1, borderColor: "#ddd", backgroundColor: "#fff" },
  input: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 20, paddingHorizontal: 15, marginRight: 10 },
  sendButton: { backgroundColor: "#a17b4a", paddingHorizontal: 15, borderRadius: 20, justifyContent: "center" },
  sendButtonText: { color: "#fff", fontWeight: "bold" },
  imageMessage: { width: 150, height: 200, borderRadius: 10 }
});
