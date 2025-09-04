// screens/WelcomeScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


export default function WelcomeScreen({ route }) {
  const { nombre } = route.params || {};
  return (
    <View style={styles.container}>
      <Text style={styles.text}>¡Bienvenido, {nombre}!</Text>
    </View>
  );
}

// ESTILOS 
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 24, fontWeight: 'bold' },
});