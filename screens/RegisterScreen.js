import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-datetimepicker/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import Constants from "expo-constants";

export default function RegisterScreen() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const API_BASE = Constants.expoConfig.extra.API_URL;

  const navigation = useNavigation();

  const handleRegister = async () => {
    if (!nombre || !apellido || !fechaNacimiento || !email || !password) {
      alert("Por favor completa todos los campos");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/register`, {
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
    setShowDatePicker(false);
    if (selectedDate) {
      setFechaNacimiento(selectedDate.toISOString().split('T')[0]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>C</Text>
        </View>
        <Text style={styles.title}>Crea tu Cuenta</Text>
        <Text style={styles.subtitle}>Únete a tu Closet Virtual</Text>
      </View>

      <View style={styles.formCard}>
        <TextInput
          placeholder="Nombre"
          placeholderTextColor={colors.placeholder}
          value={nombre}
          onChangeText={setNombre}
          autoCapitalize="words"
          style={styles.input}
        />

        <TextInput
          placeholder="Apellido"
          placeholderTextColor={colors.placeholder}
          value={apellido}
          onChangeText={setApellido}
          autoCapitalize="words"
          style={styles.input}
        />

        {/* Campo de fecha */}
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
          <Text style={styles.dateIcon}>📅</Text>
        </TouchableOpacity>

        {/* Render seguro del DatePicker */}
        {showDatePicker && (
          <View style={{ backgroundColor: '#fff', borderRadius: 10 }}>
            <DateTimePicker
              value={fechaNacimiento ? new Date(fechaNacimiento) : new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onChangeDate}
              maximumDate={new Date()}
            />
          </View>
        )}

        <TextInput
          placeholder="Email"
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

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrarse en mi Closet</Text>
        </TouchableOpacity>
      </View>

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
    borderColor: colors.secondary,
  },
  logoText: {
    fontSize: 48,
    color: colors.buttonText,
    fontWeight: '900',
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
    alignItems: 'center',
    flexDirection: 'row',
  },
  dateText: {
    fontSize: 16,
    flex: 1,
  },
  dateIcon: {
    fontSize: 18,
    color: colors.placeholder,
    marginLeft: 10,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.buttonText,
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  loginLink: { alignItems: 'center' },
  loginText: {
    color: colors.secondary,
    fontSize: 14,
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
});
