import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import * as Contacts from 'expo-contacts';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Agregar esta importación

export default function Contactos() {
  const navigation = useNavigation();
  const [contactos, setContactos] = React.useState([]);

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
}

const styles = StyleSheet.create({
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
});
