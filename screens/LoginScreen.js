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
      const response = await fetch("http://10.33.28.44:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          contrasena: password,
        }),
      });


      const data = await response.json();
      console.log("Respuesta del servidor:", data);


// VERIFICANCIONES DEL LOGIN     
      if (response.ok) {
        alert("Inicio de sesión exitoso");
        //NAVEGAR AL INICIO LUEGO DE UN LOGIN EXITOSO
        navigation.navigate("Inicio", { nombre: data.usuario.nombre }); 
        return;

      } else {
        alert(data.message || "Credenciales incorrectas");
      }

//MANEJO  DE ERRORES      
    } catch (error) {
      console.error("Error en el login:", error);
      alert("Hubo un error al iniciar sesión");
    }
  };    


// TODA LA PARTE DE ESTILOS
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesion</Text>

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

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
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
})
