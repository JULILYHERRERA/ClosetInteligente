import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';

export default function WelcomeScreen({ navigation }) {
  return (
    <ImageBackground 
      source={{ uri: "https://images.unsplash.com/photo-1608739871816-346c9db7e122?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=387"}} 
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>¡Bienvenido a LookMate!</Text>
        <Text style={styles.subtitle}>Organiza tu ropa, recibe recomendaciones de outfits y aprovecha tu closet al máximo.</Text>



{/* BOTON REGISTRO */}
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>

{/* BOTON DE INICIO DE SESION */}
        <TouchableOpacity 
          style={[styles.button, styles.loginButton]} 
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.buttonText}>Iniciar Sesion</Text>
        </TouchableOpacity>

      </View>
    </ImageBackground>
  );
}

// ESTILOS

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 40,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#ddd",
    marginBottom: 30,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#7F6DF2",
    paddingVertical: 12,
    borderRadius: 25,
    width: 200,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
});

