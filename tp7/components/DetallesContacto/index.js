import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import ModalInvitacion from '../ModalInvitacion';

export default function DetallesContacto({ route, addTrainingToCalendar }) { // Recibe la función como prop
  const { contact } = route.params;
  const [entrenamientos, setEntrenamientos] = React.useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState(contact);

  React.useEffect(() => {
    const exampleEvents = {};
    setEntrenamientos(exampleEvents);
  }, [contact]);

  const handleInvite = () => {
    setModalVisible(true); // Muestra el modal de invitación
  };

  const handleConfirmInvite = (date, type) => {
    addTrainingToCalendar(date, type, selectedContact); // Llama a la función pasada por props
    Alert.alert('Invitación enviada', `Invitación a ${selectedContact.name} para ${type} el ${date}.`);
    setModalVisible(false);
  };

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
      <Text style={styles.button} onPress={handleInvite}>Invitar</Text>
      <ModalInvitacion
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleConfirmInvite}
        contactName={selectedContact?.name}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  yellowScreen: {
    padding: 16,
    backgroundColor: 'white',
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
  button: {
    color:'blue',
    fontSize: 20,
  },
});
