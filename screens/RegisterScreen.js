import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-datetimepicker/datetimepicker';
import { useNavigation } from '@react-navigation/native'; // importacion de las navegaciones asi nos ahorramos el "export default function RegisterScreen({ navigation }) {

export default function RegisterScreen() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const navigation = useNavigation();

  const handleRegister = async () => {
    if (!nombre || !apellido || !fechaNacimiento || !email || !password) {
      alert("Por favor completa todos los campos");
      return;
    }

    try {
      const response = await fetch("http://192.168.78.207:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          apellido,
          fecha_nacimiento: fechaNacimiento,
          email,
          contrasena: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Error en el registro");
        return;
      }

      alert(data.message || "Registro completado ✅");
      navigation.navigate('Preferencias', { userId: data.userId });
    } catch (error) {
      console.error("Error en el registro:", error);
      alert("Hubo un error al registrarse");
    }
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setFechaNacimiento(selectedDate.toISOString().split('T')[0]);
    }
  };

  // TODO LO VISUAL
  return (
    <View style={styles.container}>
      {/* Header animado similar al login para cohesión */}
      <View style={styles.header}>
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>C</Text>
        </View>
        <Text style={styles.title}>Crea tu Cuenta</Text>
        <Text style={styles.subtitle}>Únete a tu Closet Virtual</Text>
      </View>

      {/* Formulario en card con inputs mejorados */}
      <View style={styles.formCard}>
        {/* Input Nombre */}
        <TextInput
          placeholder="Nombre"
          placeholderTextColor={colors.placeholder}
          value={nombre}
          onChangeText={setNombre}
          autoCapitalize="words"
          style={styles.input}
        />

        {/* Input Apellido */}
        <TextInput
          placeholder="Apellido"
          placeholderTextColor={colors.placeholder}
          value={apellido}
          onChangeText={setApellido}
          autoCapitalize="words"
          style={styles.input}
        />

        {/* Selector de Fecha de Nacimiento */}
        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => setShowDatePicker(true)}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.dateText,
              { color: fechaNacimiento ? colors.textPrimary : colors.placeholder },
            ]}
          >
            {fechaNacimiento ? fechaNacimiento : 'Selecciona tu fecha de nacimiento'}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={fechaNacimiento ? new Date(fechaNacimiento) : new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onChangeDate}
            maximumDate={new Date()}
          />
        )}

        {/* Input Email */}
        <TextInput
          placeholder="Email"
          placeholderTextColor={colors.placeholder}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />

        {/* Input Contraseña */}
        <TextInput
          placeholder="Contraseña"
          placeholderTextColor={colors.placeholder}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrarse en mi Closet</Text>
        </TouchableOpacity>
      </View>

      {/* Enlace a login */}
      <TouchableOpacity
        style={styles.loginLink}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.loginText}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

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
  accent: '#8b7355',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 30,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
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
    borderWidth: 2,
    borderColor: colors.accent,
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
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: colors.placeholder,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 22,
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
  dateInput: {
    backgroundColor: colors.inputBackground,
    borderColor: colors.inputBorder,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dateText: {
    fontSize: 16,
    flex: 1,
  },
  inputIcon: {
    marginLeft: 10,
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
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  buttonText: {
    color: colors.buttonText,
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  loginLink: {
    alignItems: 'center',
  },
  loginText: {
    color: colors.secondary,
    fontSize: 14,
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
});
