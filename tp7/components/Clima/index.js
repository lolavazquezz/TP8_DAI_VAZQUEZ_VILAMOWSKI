import * as React from 'react';
import { Button, TextInput, Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native'; 
import { NavigationContainer, useNavigation } from '@react-navigation/native'; 
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; 
import { createNativeStackNavigator } from '@react-navigation/native-stack'; 
import { Ionicons } from '@expo/vector-icons'; 
export default Clima = () => {
    const [climaSemana, setClimaSemana] = useState([]);
    const [consultar, setConsultar] = useState(true);
    const { ciudad, pais, temperatura, humedad, descripcion, error,fondo, icono } = clima;
    useEffect(() => {
        const consultarAPI = async () => {

            if (consultar) {
                const appId = '572439d21bda87f48f83dc74b1793e24';
                const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}&units=metric`;

                const respuesta = await axios.get(url);

                setClima({
                    ciudad: respuesta.data.name,
                    pais: respuesta.data.sys.country,
                    temperatura: respuesta.data.main.temp,
                    humedad: respuesta.data.main.humidity,
                    descripcion: respuesta.data.weather[0].description,
                    error: false
                })
            }
        }
        consultarAPI();
    }, [consultar, ciudad, pais]);
}