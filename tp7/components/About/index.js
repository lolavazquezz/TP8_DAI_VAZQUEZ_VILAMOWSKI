import React, { useState, useEffect } from 'react';
import { View, Text, Button, Modal, StyleSheet, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { RNCamera } from 'react-native-camera';
import { PermissionsAndroid, Platform } from 'react-native';

const About = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState('');
  const [hasCameraPermission, setHasCameraPermission] = useState(false);

  const groupNames = ['Lola Vazquez', 'Sasha Vilamowski'];

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Permiso de cámara',
            message: 'Esta aplicación necesita acceso a la cámara para escanear códigos QR',
            buttonNeutral: 'Preguntar después',
            buttonNegative: 'Cancelar',
            buttonPositive: 'OK',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setHasCameraPermission(true);
        } else {
          Alert.alert('Permiso de cámara denegado');
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      setHasCameraPermission(true);
    }
  };

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    setScannedData(data);
    setModalVisible(false);
  };

  const openScanner = () => {
    if (hasCameraPermission) {
      setModalVisible(true);
    } else {
      Alert.alert('Permiso de cámara no concedido');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>About</Text>
      
      <QRCode
        value={JSON.stringify(groupNames)}
        size={150}
        color="black"
        backgroundColor="white"
      />

      <Button title="Escanear otra App" onPress={openScanner} />

      <Modal visible={modalVisible} animationType="slide" transparent={false}>
        <RNCamera
          style={styles.camera}
          onBarCodeRead={handleBarCodeScanned}
          captureAudio={false}
          type={RNCamera.Constants.Type.back} // Usa la cámara trasera
        >
          <Button title="Cerrar" onPress={() => setModalVisible(false)} />
        </RNCamera>
      </Modal>

      {scanned && (
        <Modal visible={scanned} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Integrantes de la App Escaneada</Text>
              <Text>{scannedData}</Text>
              <Button title="Cerrar" onPress={() => setScanned(false)} />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    margin: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default About;
