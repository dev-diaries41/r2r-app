import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, Modal, Image } from 'react-native';

const CustomAlert = ({ visible, onClose, title = "Alert", description, backgroundColor = "#fff" }) => {
  const [closeButtonBackgroundColor, setCloseButtonBackgroundColor]= useState("transparent")

  const closeModal = () => {
    onClose();
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
          <TouchableOpacity
          style={[
            styles.closeButton,
            { backgroundColor: closeButtonBackgroundColor },
          ]}
          onPress={closeModal}
          onPressIn={() => setCloseButtonBackgroundColor('#222')}
          onPressOut={() => setCloseButtonBackgroundColor('transparent')}
          activeOpacity={0.7}
        >           
         <Text style={styles.closeButtonText}>OK</Text>
          </TouchableOpacity>
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
    // paddingTop: 16,
  },
  modalContent: {
    backgroundColor: '#fff',
    // padding: 16,
    borderTopRightRadius:8,
    borderTopLeftRadius:8,
    borderBottomStartRadius:8,
    borderBottomEndRadius:8,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
    color: "black",
    textAlign: "center",
    paddingTop:12

  },
  modalDescription: {
    fontSize: 12,
    marginBottom: 16,
    color: "black",
    textAlign: "center",
    paddingHorizontal: 4,
  },
  closeButton: {
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 12,
    // borderRadius: 20,
    borderBottomStartRadius:8,
    borderBottomEndRadius:8,
    borderTopWidth:1,
    borderTopColor:"#222",
    alignSelf: 'center',
    width: '100%',
    marginTop: 16,
  },
  closeButtonText: {
    fontSize: 14,
    // fontWeight: 'bold',
    color: "black",
    textAlign: 'center'
  },
});



export default CustomAlert;
