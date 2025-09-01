import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';

export default function WelcomeScreen({ navigation }) {
  return (
    <ImageBackground 
      source={{ uri: "https://images.unsplash.com/photo-1604882767135-b41fac508fff?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}} 
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Bienvenido</Text>
        <Text style={styles.subtitle}>Organiza tu ropa, recibe recomendaciones de outfits y aprovecha tu closet al máximo.</Text>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)", // sombra oscura encima de la imagen
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 40,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#ddd",
    marginBottom: 30,
    margin: 20,
    padding: 30, 
  },
  button: {
    backgroundColor: "#a17b4aff",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
  },
});
