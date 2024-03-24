import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import { themes } from '../constants/layout';

const ConfirmAlert = ({ visible, onClose, onConfirm, title = "Alert", description, backgroundColor = "#fff" }) => {
  const [isCloseButtonPressed, setCloseButtonPressed] = useState(false);
  const [isConfirmButtonPressed, setConfirmButtonPressed] = useState(false);

  const closeModal = () => {
    onClose();
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { backgroundColor: backgroundColor }]}>
          <View style={styles.headerContainer}>
            {/* Logo */}
            <Text style={styles.modalTitle}>{title}</Text>
          </View>
  
          <Text style={styles.modalDescription}>{description}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                styles.leftButton,
                { backgroundColor: isCloseButtonPressed ? '#888' : 'transparent' },
              ]}
              onPress={closeModal}
              onPressIn={() => setCloseButtonPressed(true)}
              onPressOut={() => setCloseButtonPressed(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button2,
                { backgroundColor: isConfirmButtonPressed ? themes.placeholder : 'transparent' },
              ]}
              onPress={handleConfirm}
              onPressIn={() => setConfirmButtonPressed(true)}
              onPressOut={() => setConfirmButtonPressed(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      paddingHorizontal: 48,
      paddingTop: 16,
    },
    modalContent: {
      backgroundColor: '#fff',
      borderTopRightRadius: 8,
      borderTopLeftRadius: 8,
      borderBottomStartRadius: 8,
      borderBottomEndRadius: 8,
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    modalTitle: {
      flex: 1,
      fontSize: 14,
      fontWeight: 'bold',
      marginLeft: 8,
      color: 'black',
      textAlign: 'center',
      paddingTop:12

    },
    modalDescription: {
      fontSize: 12,
      paddingBottom: 32,
      color: 'black',
      textAlign: 'center',
      paddingHorizontal: 4,
    },

    
    buttonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    button: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderBottomStartRadius: 8,
      borderBottomEndRadius: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderTopWidth:1,
      borderTopColor:"#222"

    },
    button2: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderBottomStartRadius: 1,
      borderBottomEndRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      borderTopWidth:1,
      borderTopColor:"#222"
    },
    leftButton: {
      borderRightWidth: 1,
      borderRightColor: '#222',
    },
    
    buttonText: {
      fontSize: 12,
      fontWeight: 'bold',
      color: 'black',
      textAlign: 'center',
    },
  });
  


export default ConfirmAlert;
