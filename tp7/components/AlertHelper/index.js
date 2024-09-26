import { Alert, Vibration } from 'react-native';

const showAlertWithVibration = (title, message) => {
  Vibration.vibrate(500);
    Alert.alert(title, message);
};

export default showAlertWithVibration;
