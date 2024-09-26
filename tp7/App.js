import * as React from 'react';
import { Button, TextInput, Text, View, StyleSheet, ScrollView} from 'react-native'; 
import { NavigationContainer, useNavigation } from '@react-navigation/native'; 
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; 
import { createNativeStackNavigator } from '@react-navigation/native-stack'; 
import { Ionicons } from '@expo/vector-icons'; 
import CalendarioEntrenamientos from './components/CalendarioEntrenamientos';
import Clima from './components/Clima';
import Contactos from './components/Contactos';
import DetallesContacto from './components/DetallesContacto';
import { useState } from 'react';
import About from './components/About'; 

 export default function App() {
 const [entrenamientos, setEntrenamientos] = useState({});

 const addTrainingToCalendar = (date, type, contact) => {
  setEntrenamientos((prev) => ({
    ...prev,
    [date]: {
      marked: true,
      dotColor: type.toLowerCase().includes('carrera') ? 'red' : 'blue',
      eventType: type,
      contact: contact ? contact.name : null,
    },
  }));
};
const ScreenA1 = () => (
  <ScrollView contentContainerStyle={styles.container}>
    <Clima />
    <CalendarioEntrenamientos entrenamientos={entrenamientos} setEntrenamientos={setEntrenamientos} />
  </ScrollView>
);

const ScreenB1 = () => {
  return <Contactos addTrainingToCalendar={addTrainingToCalendar} />;
};

const ScreenB2 = ({ route }) => {
  return <DetallesContacto route={route} addTrainingToCalendar={addTrainingToCalendar} />;
};




const ScreenC1 = () => {
  return (
    <View style={styles.screenC1Container}>
      <About />
    </View>
  );
};



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
    <StackB.Screen 
      name="ScreenB1" 
      component={ScreenB1} 
      options={{ headerShown: false }} 
    />
    <StackB.Screen 
      name="ScreenB2" 
      component={ScreenB2} 
      options={({ navigation }) => ({
        headerTitle: 'Contactos', 
        headerBackTitleVisible: false,
        headerBackImage: () => (
          <Ionicons
            name="arrow-back"
            size={24}
            color="black"
            style={{ marginLeft: 10 }}
          />
        ),
        headerBackButtonMenuEnabled: true, 
      })}
    />
  </StackB.Navigator>
);



const StackCNavigator = () => (
  <StackC.Navigator>
    <StackC.Screen name="ScreenC1" component={ScreenC1} />
  </StackC.Navigator>
);
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
  screenC1Container: {
    flex: 1,
    paddingTop: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
});