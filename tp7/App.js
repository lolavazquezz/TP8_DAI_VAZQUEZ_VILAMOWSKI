import * as React from 'react';
import { Button, TextInput, Text, View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native'; 
import { NavigationContainer, useNavigation } from '@react-navigation/native'; 
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; 
import { createNativeStackNavigator } from '@react-navigation/native-stack'; 
import { Ionicons } from '@expo/vector-icons'; 
import CalendarioEntrenamientos from './components/CalendarioEntrenamientos';
import Clima from './components/Clima';

function ScreenA1() { 
  const navigation = useNavigation(); 
  return ( 
    <ScrollView contentContainerStyle={styles.container}>
      <Clima />
      <CalendarioEntrenamientos />
    </ScrollView>
  ); 
}


function ScreenA2() { 
  return ( 
    <View style={styles.pinkScreen}> 
      <Text style={styles.text}>Pantalla A2</Text>
    </View> 
  ); 
}

// Screens del Segundo Stack 
function ScreenB1() { 
  const navigation = useNavigation(); 
  return ( 
    <View style={styles.yellowScreen}> 
      <Text style={styles.text}>Pantalla B1</Text>
      <Button 
        title="Ir a B2" 
        onPress={() => navigation.navigate('ScreenB2')} 
      />
    </View> 
  ); 
}

function ScreenB2() { 
  return ( 
    <View style={styles.yellowScreen}> 
      <Text style={styles.text}>Pantalla B2</Text>
    </View> 
  ); 
}

// Screens del Tercer Stack 
function ScreenC1() { 
  const navigation = useNavigation(); 
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');

  return ( 
    <View style={styles.greenScreen}> 
      <Text style={styles.text}>Pantalla C1</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        onChangeText={setName}
        value={name}
      />
      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        onChangeText={setPhone}
        value={phone}
      />
      <Button 
        title="Confirmar" 
        onPress={() => navigation.navigate('ScreenC2', { name, phone })} 
      />
    </View> 
  ); 
}

function ScreenC2({ route }) { 
  const { name, phone } = route.params;
  const navigation = useNavigation(); 
  return ( 
    <View style={styles.greenScreen}> 
      <Text style={styles.text}>Hola {name}</Text>
      <Text style={styles.text}>Tu teléfono es {phone}</Text>
      <Button 
        title="Volver" 
        onPress={() => navigation.goBack()} 
      />
    </View> 
  ); 
}

// Creación de los stacks 
const StackA = createNativeStackNavigator(); 
const StackB = createNativeStackNavigator(); 
const StackC = createNativeStackNavigator();

function StackANavigator() { 
  return ( 
    <StackA.Navigator> 
      <StackA.Screen 
        name="ScreenA1" 
        component={ScreenA1} 
        options={{ headerShown: false }} // Ocultar el título de la pantalla
      /> 
      <StackA.Screen 
        name="ScreenA2" 
        component={ScreenA2} 
      /> 
    </StackA.Navigator> 
  );
}


function StackBNavigator() { 
  return ( 
    <StackB.Navigator> 
      <StackB.Screen name="ScreenB1" component={ScreenB1} /> 
      <StackB.Screen name="ScreenB2" component={ScreenB2} /> 
    </StackB.Navigator> 
  );
}

function StackCNavigator() { 
  return ( 
    <StackC.Navigator> 
      <StackC.Screen name="ScreenC1" component={ScreenC1} /> 
      <StackC.Screen name="ScreenC2" component={ScreenC2} /> 
    </StackC.Navigator> 
  );
}

// Creación del BottomTabNavigator 
const Tab = createBottomTabNavigator(); 
function MyTabs() { 
  return ( 
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
}

// Envolviendo la aplicación en el NavigationContainer 
export default function App() {
  return ( 
    <NavigationContainer> 
      <MyTabs /> 
    </NavigationContainer>
  ); 
}

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