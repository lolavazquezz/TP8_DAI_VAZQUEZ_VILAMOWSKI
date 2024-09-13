import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity, Alert } from 'react-native';
import * as Contacts from 'expo-contacts';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ModalInvitacion from '../ModalInvitacion';

export default function Contactos({ addTrainingToCalendar }) {
  const navigation = useNavigation();
  const [contactos, setContactos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
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
    setSelectedContact(contact);
    setModalVisible(true);
  };

  const handleConfirmInvite = (date, type) => {
    addTrainingToCalendar(date, type, selectedContact); // Pasa el contacto seleccionado
    Alert.alert('Invitación enviada', `Invitación a ${selectedContact.name} para ${type} el ${date}.`);
  };  

  const renderItem = ({ item }) => {
    const nameLower = item.name ? item.name.toLowerCase() : '';
    const isEmergencyContact = nameLower.includes('emergencia');
  
    return (
      <TouchableOpacity style={styles.contactItem} onPress={() => navigation.navigate('ScreenB2', { contact: item, addTrainingToCalendar })}>
        <Text style={styles.contactName}>{item.name}</Text>
        {item.phoneNumbers?.length > 0 && (
          <Text style={styles.contactPhone}>{item.phoneNumbers[0].number}</Text>
        )}
        {isEmergencyContact && <Ionicons name="warning" size={24} color="red" />}
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
  inviteButton: {
    marginLeft: 10,
  },
  button: {
    color: 'blue',
  },
});