import * as React from 'react';
import { Button, TextInput, Text, View, Alert, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native'; 
import { NavigationContainer, useNavigation } from '@react-navigation/native'; 
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; 
import { createNativeStackNavigator } from '@react-navigation/native-stack'; 
import { Ionicons } from '@expo/vector-icons'; 
import CalendarioEntrenamientos from './components/CalendarioEntrenamientos';
import Clima from './components/Clima';
import Contactos from './components/Contactos'; // Importación por defecto
import DetallesContacto from './components/DetallesContacto'; // Importación por defecto


// Componentes de las Pantallas
const ScreenA1 = () => (
  <ScrollView contentContainerStyle={styles.container}>
    <Clima />
    <CalendarioEntrenamientos />
  </ScrollView>
);

const ScreenB1 = () => {
  return <Contactos />
};

const ScreenB2 = ({ route }) => {
  return <DetallesContacto route={route} />;
};

const ScreenC1 = () => {
  const navigation = useNavigation();
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');

  return (
    <View style={styles.greenScreen}>
      <Text style={styles.text}>Pantalla C1</Text>
      <TextInput style={styles.input} placeholder="Nombre" onChangeText={setName} value={name} />
      <TextInput style={styles.input} placeholder="Teléfono" onChangeText={setPhone} value={phone} />
      <Button title="Confirmar" onPress={() => navigation.navigate('ScreenC2', { name, phone })} />
    </View>
  );
};

const ScreenC2 = ({ route }) => {
  const { name, phone } = route.params;
  const navigation = useNavigation();

  return (
    <View style={styles.greenScreen}>
      <Text style={styles.text}>Hola {name}</Text>
      <Text style={styles.text}>Tu teléfono es {phone}</Text>
      <Button title="Volver" onPress={() => navigation.goBack()} />
    </View>
  );
};

// Navegadores de Stack
const StackA = createNativeStackNavigator();
const StackB = createNativeStackNavigator();
const StackC = createNativeStackNavigator();

const StackANavigator = () => (
  <StackA.Navigator>
    <StackA.Screen name="ScreenA1" component={ScreenA1} options={{ headerShown: false }} />
  </StackA.Navigator>
);

const StackBNavigator = () => (
  <StackB.Navigator>
    <StackB.Screen name="ScreenB1" component={ScreenB1} />
    <StackB.Screen name="ScreenB2" component={ScreenB2} />
  </StackB.Navigator>
);

const StackCNavigator = () => (
  <StackC.Navigator>
    <StackC.Screen name="ScreenC1" component={ScreenC1} />
    <StackC.Screen name="ScreenC2" component={ScreenC2} />
  </StackC.Navigator>
);

// Navegador de Pestañas
const Tab = createBottomTabNavigator();
const MyTabs = () => (
  <Tab.Navigator screenOptions={({ route }) => ({
    tabBarIcon: ({ color, size }) => {
      let iconName;
      if (route.name === 'Home') {
        iconName = 'home';
      } else if (route.name === 'Buscador') {
        iconName = 'search';
      } else if (route.name === 'Perfil') {
        iconName = 'person';
      }
      return <Ionicons name={iconName} size={size} color={color} />;
    },
  })}>
    <Tab.Screen name="Home" component={StackANavigator} />
    <Tab.Screen name="Buscador" component={StackBNavigator} /> 
    <Tab.Screen name="Perfil" component={StackCNavigator} />
  </Tab.Navigator>
);

// Aplicación Principal
export default function App() {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}

// Estilos
const styles = StyleSheet.create({
  text: { 
    color: 'white', 
    fontSize: 20, 
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 8,
    width: '80%',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
