import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";


export default function ChatIAScreen() {
  const [messages, setMessages] = useState([
    { id: "1", text: "👋 Hola, soy tu asistente de moda. ¿Qué ocasión tienes en mente?", sender: "ia" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    // Agregar mensaje del usuario
    const userMessage = { id: Date.now().toString(), text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);

    // Respuesta simulada de la IA
    const iaMessage = { 
      id: (Date.now() + 1).toString(), 
      text: `Entendí: "${input}". Pronto te sugeriré outfits 😉`, 
      sender: "ia" 
    };

    setMessages((prev) => [...prev, iaMessage]);
    setInput("");
  };

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageBubble,
      item.sender === "user" ? styles.userBubble : styles.iaBubble
    ]}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

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
  sendButtonText: { color: "#fff", fontWeight: "bold" }
});

