import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function DetallesContacto({ route }) {
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
}

const styles = StyleSheet.create({
  yellowScreen: {
    padding: 16,
    backgroundColor: 'yellow',
    flex: 1,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  contactDetail: {
    fontSize: 18,
    marginVertical: 5,
  },
});
