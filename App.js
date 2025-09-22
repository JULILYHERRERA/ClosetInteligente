import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

// IMPORTACIONES 
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// SCREENS
import RegisterScreen from './screens/RegisterScreen';
import WelcomeScreen from './screens/WelcomeScreen';  
import LoginScreen from './screens/LoginScreen';  
import PreferenciasScreen from './screens/PreferenciasScreen';
import InicioScreen from './screens/InicioScreen';
import AgregarPrendaScreen from './screens/AgregarPrendaScreen';
import MisPrendasScreen from "./screens/MisPrendasScreen";



// CREAR EL STACK
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen 
          name="Welcome" 
          component={WelcomeScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
        />
        <Stack.Screen 
          name="Preferencias" 
          component={PreferenciasScreen} 
        />        
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
        />
        <Stack.Screen 
          name="Inicio" 
          component={InicioScreen}
        />
        <Stack.Screen 
          name="AgregarPrenda" 
          component={AgregarPrendaScreen}
        />
        <Stack.Screen 
        name="MisPrendas" 
        component={MisPrendasScreen} 
        />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

//ESTILO

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
