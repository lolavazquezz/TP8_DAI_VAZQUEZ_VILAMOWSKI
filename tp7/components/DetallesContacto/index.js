import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Button, TouchableOpacity } from 'react-native';
import ModalInvitacion from '../ModalInvitacion';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importa AsyncStorage

export default function DetallesContacto({ route, addTrainingToCalendar }) {
  const { contact } = route.params;
  const [entrenamientos, setEntrenamientos] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState(contact);
  const [isEmergencyContact, setIsEmergencyContact] = useState(false);

  useEffect(() => {
    const loadEmergencyContacts = async () => {
      const storedEmergencyContacts = await AsyncStorage.getItem('emergencyContacts');
      if (storedEmergencyContacts) {
        const emergencyContacts = JSON.parse(storedEmergencyContacts);
        setIsEmergencyContact(emergencyContacts.includes(contact.id));
      }
    };

    loadEmergencyContacts();
  }, [contact]);

  const handleInvite = () => {
    setModalVisible(true); // Muestra el modal de invitación
  };

  const handleConfirmInvite = (date, type) => {
    addTrainingToCalendar(date, type, selectedContact); // Llama a la función pasada por props
    Alert.alert('Invitación enviada', `Invitación a ${selectedContact.name} para ${type} el ${date}.`);
    setModalVisible(false);
  };

  const toggleEmergencyContact = async () => {
    const storedEmergencyContacts = await AsyncStorage.getItem('emergencyContacts');
    let emergencyContacts = storedEmergencyContacts ? JSON.parse(storedEmergencyContacts) : [];

    if (isEmergencyContact) {
      // Remover de contactos de emergencia
      emergencyContacts = emergencyContacts.filter((id) => id !== contact.id);
      Alert.alert('Contacto removido de emergencia');
    } else {
      // Agregar a contactos de emergencia
      emergencyContacts.push(contact.id);
      Alert.alert('Contacto agregado a emergencia');
    }

    await AsyncStorage.setItem('emergencyContacts', JSON.stringify(emergencyContacts));
    setIsEmergencyContact(!isEmergencyContact);
  };

  return (
    <View style={styles.yellowScreen}>
      <Text style={styles.text}>Detalle de Contacto</Text>
      <Text style={styles.contactDetail}>Nombre: {contact.name}</Text>
      {contact.phoneNumbers?.length > 0 && (
        <Text style={styles.contactDetail}>Teléfono: {contact.phoneNumbers[0].number}</Text>
      )}
      <Text style={styles.button} onPress={handleInvite}>
        Invitar
      </Text>
      <TouchableOpacity
        style={[styles.emergencyButton, isEmergencyContact && { backgroundColor: 'red' }]} // El botón será rojo si es contacto de emergencia
        onPress={toggleEmergencyContact}
      >
        <Text style={styles.emergencyButtonText}>
          {isEmergencyContact ? 'Remover de Contactos de Emergencia' : 'Agregar a Contactos de Emergencia'}
        </Text>
      </TouchableOpacity>
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
    color: 'blue',
    fontSize: 20,
    marginVertical: 10,
  },
  emergencyButton: {
    padding: 10,
    marginVertical: 10,
    backgroundColor: 'green',
    borderRadius: 5,
  },
  emergencyButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
});
