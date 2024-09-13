// components/InvitationModal.js
import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function ModalInvitacion({ visible, onClose, onConfirm }) {
  const [eventDate, setEventDate] = useState('');
  const [eventType, setEventType] = useState('');

  const handleConfirm = () => {
    if (eventDate && eventType) {
      onConfirm(eventDate, eventType);
      setEventDate('');
      setEventType('');
      onClose();
    } else {
      alert('Por favor, completa todos los campos.');
    }
  };

  return (
    <Modal transparent={true} visible={visible} animationType="slide">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Invitar a una Carrera</Text>
          <TextInput
            style={styles.input}
            placeholder="Fecha (YYYY-MM-DD)"
            placeholderTextColor="gray"
            value={eventDate}
            onChangeText={setEventDate}
          />
          <TextInput
            style={styles.input}
            placeholder="Tipo (Entrenamiento/Carrera)"
            placeholderTextColor="gray"
            value={eventType}
            onChangeText={setEventType}
          />
          <Button title="Confirmar" onPress={handleConfirm} />
          <Button title="Cancelar" onPress={onClose} color="red" />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    color: 'gray',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 8,
  },
});
