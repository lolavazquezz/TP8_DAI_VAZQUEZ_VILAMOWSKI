import React, { useState, useEffect } from 'react';
import { View, Text, Button, Modal, StyleSheet, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { BarCodeScanner } from 'expo-barcode-scanner';

const About = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState('');
  const [hasCameraPermission, setHasCameraPermission] = useState(null);

  const groupNames = ['Lola Vazquez', 'Sasha Vilamowski'];

  const requestCameraPermission = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasCameraPermission(status === 'granted');
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

  if (hasCameraPermission === null) {
    return <Text>Solicitando permiso para la cámara...</Text>;
  }

  if (hasCameraPermission === false) {
    return <Text>No se ha concedido acceso a la cámara.</Text>;
  }

  return (
    <View style={styles.container}>      
      <QRCode
        value={JSON.stringify(groupNames)}
        size={150}
        color="black"
        backgroundColor="white"
      />

      <Button title="Escanear otra App" onPress={openScanner} />

      <Modal visible={modalVisible} animationType="slide" transparent={false}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        <Button title="Cerrar" onPress={() => setModalVisible(false)} />
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
