import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Por favor ingresa tu correo y contraseña");
      return;
    }

    try {
      const response = await fetch("http://192.168.20.21:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, contrasena: password }),
      });

      const data = await response.json();
      console.log("Respuesta del servidor:", data);

      if (response.ok) {
        alert("Inicio de sesión exitoso");
        navigation.navigate("Inicio", { nombre: data.usuario?.nombre, usuarioId: data.usuario?.id });
      } else {
        alert(data.message || "Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error en el login:", error);
      alert("Hubo un error al iniciar sesión");
    }
  };

  // === UI ===
  return (
    <View style={styles.container}>
      {/* Header simple con logo placeholder temático para closet virtual */}
      <View style={styles.header}>
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>C</Text>
        </View>
        <Text style={styles.title}>Bienvenido a tu Closet</Text>
        <Text style={styles.subtitle}>Inicia sesión para explorar</Text>
      </View>

      {/* Formulario con inputs mejorados */}
      <View style={styles.formCard}>
        <TextInput
          placeholder="Correo electrónico"
          placeholderTextColor={colors.placeholder}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />

        <TextInput
          placeholder="Contraseña"
          placeholderTextColor={colors.placeholder}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar a mi Closet</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.registerLink}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.registerText}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </View>
  );
}

// TODA LA PARTE DE ESTILOS
const colors = {
  primary: '#a17b4a',
  background: '#f5f0eb',
  inputBackground: '#ffffff',
  inputBorder: '#d9c2a7',
  textPrimary: '#4a4a4a',
  placeholder: '#b8a898',
  buttonText: '#ffffff',
  secondary: '#d4a574',
  shadow: '#00000020',
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: 
    colors.background, 
    padding: 30, 
    justifyContent: 'center' 
  },
  header: {
    alignItems: 'center',
    marginBottom: 30 
  },
  logoPlaceholder: {
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    backgroundColor: colors.primary,
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 16,
    shadowColor: colors.shadow, 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 8, 
    elevation: 6,
  },

  logoText: { 
    fontSize: 40, color: 
    colors.buttonText 
  },
  title: { fontSize: 28, 
    fontWeight: '700', 
    color: colors.primary, 
    marginBottom: 8, 
    textAlign: 'center', 
    letterSpacing: 0.5 
  },
  subtitle: { fontSize: 16, 
    color: colors.placeholder, 
    textAlign: 'center', 
    fontStyle: 'italic' 
  },
  formCard: {
    backgroundColor: colors.inputBackground, 
    borderRadius: 16, 
    padding: 24, 
    marginBottom: 20,
    shadowColor: colors.shadow, 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 8, 
    elevation: 4,
  },

  input: {
    backgroundColor: colors.inputBackground, 
    borderColor: colors.inputBorder, 
    borderWidth: 1, 
    borderRadius: 12,
    paddingHorizontal: 16, 
    paddingVertical: 14, fontSize: 16, 
    marginBottom: 20, color: colors.textPrimary,
    shadowColor: colors.shadow, 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 4, 
    elevation: 2,
  },

  button: {
    backgroundColor: colors.primary, 
    paddingVertical: 16, 
    borderRadius: 12, 
    alignItems: 'center',
    shadowColor: colors.shadow, 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 8, 
    elevation: 6,
  },

  buttonText: { 
    color: colors.buttonText, 
    fontSize: 18, 
    fontWeight: '600', 
    letterSpacing: 0.5 
  },

  registerLink: {
     alignItems: 'center' 
    },

  registerText: {
     color: colors.secondary, 
     fontSize: 14, 
     textAlign: 'center', 
     textDecorationLine: 'underline', 
     fontWeight: '500' 
    },
    
  logoText: {
    fontSize: 48,
    color: colors.buttonText,
    fontWeight: '900',
    fontFamily: 'System',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  }

});
