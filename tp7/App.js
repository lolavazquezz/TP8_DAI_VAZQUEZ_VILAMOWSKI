import * as React from 'react';
import { Button, TextInput, Text, View, Alert, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native'; 
import { NavigationContainer, useNavigation } from '@react-navigation/native'; 
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; 
import { createNativeStackNavigator } from '@react-navigation/native-stack'; 
import { Ionicons } from '@expo/vector-icons'; 
import CalendarioEntrenamientos from './components/CalendarioEntrenamientos';
import Clima from './components/Clima';
import * as Contacts from 'expo-contacts';

// Componentes de las Pantallas
const ScreenA1 = () => (
  <ScrollView contentContainerStyle={styles.container}>
    <Clima />
    <CalendarioEntrenamientos />
  </ScrollView>
);

const ScreenA2 = () => (
  <View style={styles.pinkScreen}>
    <Text style={styles.text}>Pantalla A2</Text>
  </View>
);

const ScreenB1 = () => {
  const navigation = useNavigation();
  const [contactos, setContactos] = React.useState([]);

  React.useEffect(() => {
    const fetchContacts = async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });
        if (data.length > 0) {
          setContactos(data);
        }
      }
    };
    fetchContacts();
  }, []);

  const handleInvite = (contact) => {
    Alert.alert(
      'Invitar a Carrera',
      `¿Deseas invitar a ${contact.name} a una carrera?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Invitar', onPress: () => console.log(`Invitación enviada a ${contact.name}`) },
      ]
    );
  };

  const renderItem = ({ item }) => {
    const isEmergencyContact = item.name.toLowerCase().includes('emergencia');
    return (
      <TouchableOpacity style={styles.contactItem} onPress={() => navigation.navigate('ScreenB2', { contact: item })}>
        <Text style={styles.contactName}>{item.name}</Text>
        {item.phoneNumbers?.length > 0 && (
          <Text style={styles.contactPhone}>{item.phoneNumbers[0].number}</Text>
        )}
        {isEmergencyContact && <Ionicons name="warning" size={24} color="red" />}
        <TouchableOpacity style={styles.inviteButton} onPress={() => handleInvite(item)}>
          <Ionicons name="md-send" size={24} color="blue" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.yellowScreen}>
      <Text style={styles.text}>Contactos del Teléfono</Text>
      <FlatList data={contactos} keyExtractor={(item) => item.id} renderItem={renderItem} />
    </View>
  );
};

const ScreenB2 = ({ route }) => {
  const { contact } = route.params;
  const navigation = useNavigation();
  const [entrenamientos, setEntrenamientos] = React.useState({});

  React.useEffect(() => {
    // Simula la obtención de entrenamientos pendientes relacionados con el contacto
    const exampleEvents = {};
    setEntrenamientos(exampleEvents);
  }, [contact]);

  return (
    <View style={styles.yellowScreen}>
      <Text style={styles.text}>Detalle de Contacto</Text>
      <Text style={styles.contactDetail}>Nombre: {contact.name}</Text>
      {contact.phoneNumbers?.length > 0 && (
        <Text style={styles.contactDetail}>Teléfono: {contact.phoneNumbers[0].number}</Text>
      )}
      <Text style={styles.contactDetail}>Entrenamientos Pendientes:</Text>
      {Object.keys(entrenamientos).length > 0 ? (
        Object.keys(entrenamientos).map(date => (
          <Text key={date} style={styles.contactDetail}>{entrenamientos[date].eventType} para el {date}</Text>
        ))
      ) : (
        <Text style={styles.contactDetail}>No hay entrenamientos pendientes.</Text>
      )}
      <Button title="Volver a Contactos" onPress={() => navigation.goBack()} />
    </View>
  );
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
    <StackA.Screen name="ScreenA2" component={ScreenA2} />
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
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  contactName: {
    flex: 1,
    fontSize: 16,
  },
  contactPhone: {
    fontSize: 14,
    color: '#666',
  },
  contactDetail: {
    fontSize: 18,
    marginVertical: 5,
  },
  inviteButton: {
    marginLeft: 10,
  },
  yellowScreen: {
    flex: 1,
    backgroundColor: '#FFEB3B',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  greenScreen: {
    flex: 1,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  pinkScreen: {
    flex: 1,
    backgroundColor: '#E91E63',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
