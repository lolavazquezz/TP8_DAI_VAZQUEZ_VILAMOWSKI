import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';

export default function Clima() {
  const [clima, setClima] = useState({});
  const [ubicacion, setUbicacion] = useState(null);
  const [error, setError] = useState(null);
  const [fechaHora, setFechaHora] = useState(new Date());

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access location was denied');
        Alert.alert('Permiso denegado', 'Necesitamos acceder a la ubicación para mostrar el clima.');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setUbicacion(location.coords);
      if (location) {
        const { latitude, longitude } = location.coords;
        fetchClima(latitude, longitude);
      }
    })();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFechaHora(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchClima = async (latitude, longitude) => {
    const appId = '572439d21bda87f48f83dc74b1793e24';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${appId}&units=metric`;
    try {
      const response = await axios.get(url);
      setClima({
        ciudad: response.data.name,
        pais: response.data.sys.country,
        temperatura: response.data.main.temp,
        humedad: response.data.main.humidity,
        descripcion: response.data.weather[0].description,
        icono: response.data.weather[0].icon,
      });
    } catch (error) {
      Alert.alert('Error', 'No se pudo obtener el clima. Inténtalo de nuevo más tarde.');
    }
  };

  const getRecomendacion = () => {
    const temp = clima.temperatura;
    if (temp >= 12 && temp <= 18) {
      return 'El mejor horario para correr es ahora, entre las 11:00 AM y las 12:00 PM.';
    } else if (temp > 18 && temp <= 21) {
      return 'El clima es agradable para correr entre las 12:00 PM y las 3:00 PM.';
    } else if (temp < 12 || temp > 21) {
      return 'Evita correr en este momento debido a las condiciones climáticas.';
    }
    return 'Clima no disponible.';
  };

  return (
    <View style={styles.climaContainer}>
      <Text style={styles.fechaHora}>
        {fechaHora.toLocaleDateString()} {fechaHora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <View>
          <Text style={styles.ciudad}>
            {clima.ciudad ? `${clima.ciudad}, ${clima.pais}` : ''}
          </Text>
          <Text style={styles.temperatura}>
            {clima.temperatura ? `${clima.temperatura}°C` : ''}
          </Text>
          <Text style={styles.descripcion}>
            {clima.descripcion ? clima.descripcion : ''}
          </Text>
          {clima.icono ? (
            <Image
              style={styles.icono}
              source={{ uri: `https://openweathermap.org/img/wn/${clima.icono}.png` }}
            />
          ) : null}
          <Text style={styles.recomendacion}>{getRecomendacion()}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
        climaContainer: {
          padding: 16,
          borderRadius: 10,
          backgroundColor: '#fff',
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 5,
          shadowOffset: { width: 0, height: 2 },
          alignItems: 'center',
          marginVertical: 10,
          width: '90%',
          maxWidth: 350,
          alignSelf: 'center',
        },
        ciudad: {
          fontSize: 18,
          fontWeight: 'bold',
        },
        temperatura: {
          fontSize: 48,
          fontWeight: 'bold',
          color: '#333',
        },
        descripcion: {
          fontSize: 16,
          color: '#666',
        },
        icono: {
          width: 50,
          height: 50,
          marginVertical: 10,
        },
        recomendacion: {
          fontSize: 14,
          color: '#333',
          textAlign: 'center',
        },
        error: {
          fontSize: 14,
          color: 'red',
          textAlign: 'center',
        },
        fechaHora: {
          fontSize: 16,
          color: '#333',
          marginBottom: 10,
        },
});
