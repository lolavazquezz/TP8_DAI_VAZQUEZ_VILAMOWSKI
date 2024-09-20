import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import * as Contacts from 'expo-contacts';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; // Importa useFocusEffect
import ModalInvitacion from '../ModalInvitacion';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importa AsyncStorage

export default function Contactos({ addTrainingToCalendar }) {
  const navigation = useNavigation();
  const [contactos, setContactos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [emergencyContacts, setEmergencyContacts] = useState([]);

  // Esta función carga los contactos de emergencia desde AsyncStorage
  const loadEmergencyContacts = async () => {
    const storedEmergencyContacts = await AsyncStorage.getItem('emergencyContacts');
    if (storedEmergencyContacts) {
      setEmergencyContacts(JSON.parse(storedEmergencyContacts));
    } else {
      setEmergencyContacts([]); // Asegura que esté vacío si no hay contactos de emergencia
    }
  };

  // Recarga los contactos del teléfono
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

  // Este hook recarga los contactos cada vez que la pantalla está en foco
  useFocusEffect(
    useCallback(() => {
      fetchContacts(); // Carga los contactos del teléfono
      loadEmergencyContacts(); // Carga los contactos de emergencia desde AsyncStorage
    }, [])
  );

  const handleInvite = (contact) => {
    setSelectedContact(contact);
    setModalVisible(true);
  };

  const handleConfirmInvite = (date, type) => {
    addTrainingToCalendar(date, type, selectedContact); // Pasa el contacto seleccionado
    Alert.alert('Invitación enviada', `Invitación a ${selectedContact.name} para ${type} el ${date}.`);
  };

  const isEmergencyContact = (contactId) => {
    return emergencyContacts.includes(contactId);
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.contactItem}
        onPress={() => navigation.navigate('ScreenB2', { contact: item })}
      >
        {isEmergencyContact(item.id) && (
          <Ionicons name="medical" size={24} color="red" style={styles.emergencyIcon} />
        )}
        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{item.name}</Text>
          {item.phoneNumbers?.length > 0 && (
            <Text style={styles.contactPhone}>{item.phoneNumbers[0].number}</Text>
          )}
        </View>
        <TouchableOpacity style={styles.inviteButton} onPress={() => handleInvite(item)}>
          <Text style={styles.button}>Invitar</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.text}>Contactos del Teléfono</Text>
      <FlatList data={contactos} keyExtractor={(item) => item.id} renderItem={renderItem} />
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
  screen: {
    backgroundColor: 'white',
    flex: 1,
  },
  text: {
    fontSize: 20,
    marginVertical: 10,
    textAlign: 'center',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  emergencyIcon: {
    marginRight: 10,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
  },
  contactPhone: {
    fontSize: 14,
    color: '#666',
  },
  inviteButton: {
    marginLeft: 10,
  },
  button: {
    color: 'blue',
  },
});
