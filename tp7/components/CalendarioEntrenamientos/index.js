import React, { useState } from 'react';
import { View, FlatList, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function CalendarioEntrenamientos({ entrenamientos }) {
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventType, setNewEventType] = useState('');

  const addEvent = () => {
    if (!newEventDate || !newEventType) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }
    setEntrenamientos(prev => ({
      ...prev,
      [newEventDate]: { marked: true, dotColor: newEventType.toLowerCase().includes('carrera') ? 'red' : 'blue', eventType: newEventType },
    }));
    setNewEventDate('');
    setNewEventType('');
    Alert.alert('Éxito', 'Entrenamiento o carrera añadida.');
  };

  const handleDayPress = (day) => {
    const date = day.dateString;
    if (entrenamientos[date]) {
      const eventType = entrenamientos[date].eventType;
      alert(`${eventType} programado para el día: ${date}`);
    } else {
      alert('No hay entrenamientos programados para este día.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calendario de Entrenamientos</Text>
      <Calendar
        markedDates={entrenamientos}
        onDayPress={handleDayPress}
        theme={{
          selectedDayBackgroundColor: '#00adf5',
          todayTextColor: '#00adf5',
          arrowColor: 'orange',
        }}
      />
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Fecha (YYYY-MM-DD)"
          value={newEventDate}
          onChangeText={setNewEventDate}
        />
        <TextInput
          style={styles.input}
          placeholder="Tipo (Entrenamiento/Carrera)"
          value={newEventType}
          onChangeText={setNewEventType}
        />
        <Button title="Añadir Evento" onPress={addEvent} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    alignSelf: 'center',
    width: '90%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  form: {
    marginTop: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 8,
    width: '100%',
  },
});
