// utils/AlertHelper.js
import { Alert, Vibration } from 'react-native';

const showAlertWithVibration = (title, message) => {
  // Vibrar durante 500 ms
  Vibration.vibrate(500);
  
  // Mostrar el alert
  Alert.alert(title, message);
};

export default showAlertWithVibration;
