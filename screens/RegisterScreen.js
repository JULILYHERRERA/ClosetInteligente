import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-datetimepicker/datetimepicker';
import { useNavigation } from '@react-navigation/native'; //  importacion de las navegaciones asi nos ahorramos el "export default function RegisterScreen({ navigation }) {


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
    const response = await fetch("http://10.33.28.44:3000/register", {
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

//VERIFICACIONES DEL REGISTRO

    if (!response.ok) {
      alert(data.message || "Error en el registro");
      return;
    }

    alert(data.message || "Registro completado ✅");
    navigation.navigate('Preferencias', { userId: data.userId});// USAMOS LOS DATOS RETORNADOS POR EL BACKEND


// MANEJO DE ERRORES
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
      <Text style={styles.title}>Registro</Text>

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

      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={{ color: fechaNacimiento ? colors.textPrimary : colors.placeholder }}>
          {fechaNacimiento || "Selecciona tu fecha de nacimiento"}
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
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>
    </View>
  );
}

const colors = {
  primary: '#a17b4aff',
  background: '#ece2dcff',
  inputBackground: '#fff',
  inputBorder: '#ccc',
  textPrimary: '#333',
  placeholder: '#666',
  buttonText: '#fff',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 30,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: colors.inputBackground,
    borderColor: colors.inputBorder,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.buttonText,
    fontSize: 18,
    fontWeight: '600',
  },
});
