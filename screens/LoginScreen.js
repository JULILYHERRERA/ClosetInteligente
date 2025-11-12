import React, { useState, useRef } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Animated, Easing } from 'react-native';
import Constants from "expo-constants";
import { StatusBar, Platform } from 'react-native';


export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Toast de éxito (animado)
  const [successMsg, setSuccessMsg] = useState('');
  const toastY = useRef(new Animated.Value(-120)).current;
  const showSuccessToast = (msg = 'Inicio de sesión exitoso') => {
    setSuccessMsg(msg);
    Animated.timing(toastY, {
      toValue: 0,
      duration: 350,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(toastY, {
          toValue: -120,
          duration: 250,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }).start();
      }, 1200);
    });
  };

  const API_BASE = Constants.expoConfig.extra.API_URL;

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Por favor ingresa tu correo y contraseña");
      return;
    }

    try {
    const response = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, contrasena: password }),
    });

      const data = await response.json();
      console.log("Respuesta del servidor:", data);

      if (response.ok) {
        const nombre = data.usuario?.nombre || '¡Bienvenid@!';
        showSuccessToast(`Hola ${nombre} 👋`);
        setTimeout(() => {
          navigation.navigate("Inicio", { nombre: data.usuario?.nombre, usuarioId: data.usuario?.id });
        }, 900);
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
      <Animated.View style={[styles.toast, { transform: [{ translateY: toastY }] }]}>
        <View style={styles.toastIconCircle}>
          <Text style={styles.toastIcon}>✓</Text>
        </View>
        <Text style={styles.toastText}>{successMsg}</Text>
      </Animated.View>

      <View style={styles.header}>
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>C</Text>
        </View>
        <Text style={styles.title}>Bienvenido a tu LookMate</Text>
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
  primary: '#7F6DF2',
  background: '#ebe2f3ff',
  inputBackground: '#fcfcfcff',
  inputBorder: '#9688F2',
  textPrimary: '#9688F2',
  placeholder: '#9688F2',
  buttonText: '#ffffff',
  secondary: '#9688F2',
  shadow: '#00000020',
  success: '#BFF207',
  successDark: '#080808ff',
};

const styles = StyleSheet.create({
container: { 
  flex: 1, 
  backgroundColor: colors.background, 
  paddingHorizontal: 30,
  paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0, 
  justifyContent: 'center',
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
    fontSize: 48,
    color: colors.buttonText,
    fontWeight: '900',
    fontFamily: 'System',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  title: { 
    fontSize: 28, 
    fontWeight: '700', 
    color: colors.primary, 
    marginBottom: 8, 
    textAlign: 'center', 
    letterSpacing: 0.5 
  },
  subtitle: { 
    fontSize: 16, 
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
    paddingVertical: 14, 
    fontSize: 16, 
    marginBottom: 20, 
    color: colors.textPrimary,
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

  // estilos del toast
  toast: {
    position: 'absolute',
    top: 10,
    left: 16,
    right: 16,
    backgroundColor: colors.success,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  toastIconCircle: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.successDark,
    justifyContent: 'center', alignItems: 'center', marginRight: 10
  },
  toastIcon: { color: '#fff', fontSize: 18, fontWeight: '800' },
  toastText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
