import React, {useRef, useLayoutEffect, useState } from 'react';
import { StyleSheet, View,Text, Modal, Animated, PanResponder, ScrollView } from 'react-native';
import { themes, sizes } from '../constants/layout';
import { Picker } from '@react-native-picker/picker';

interface MenuModalProps { 
  visible: boolean;
  onClose: () => void;
  contentBackground: string;
  backgroundColor: string;
  textColor: string;
}

const MenuModal = ({ 
  visible, 
  onClose, 
  contentBackground = themes.dark.card,
  backgroundColor = themes.light.background,
  textColor = themes.light.text,
}: MenuModalProps) => {
  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const panY = useRef(new Animated.Value(0)).current; // Start the modal off-screen

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        // Check if the gesture is moving downward
        if (gestureState.dy > 0) {
          panY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 50) {
          onClose();
        } else {
          Animated.spring(panY, {
            toValue: 0,
            useNativeDriver: true,
            damping: 15,
            stiffness: 100, 
            velocity: 5,    
          }).start();
                  }
      },
    })
  ).current;

  useLayoutEffect(() => {
    if (visible) {
      // Animate the modal into place when it becomes visible
      Animated.spring(panY, {
        toValue: 0,
        useNativeDriver: true,
        damping: 15,      
        stiffness: 100,   
        velocity: 5, 
      }).start();
          }
  }, [visible]);


  


  return (
    <Modal visible={visible} animationType="slide" transparent>
      <Animated.View
        style={[styles.modalContainer, { transform: [{ translateY: panY }] }]}
        {...panResponder.panHandlers}
      >
          <ScrollView>
            <View style={[styles.modalContent, {backgroundColor}]}>
              <Text style={[styles.title, {color:textColor}]}>Search Properties</Text>
              <Picker
                style={[styles.input, {color: textColor}]}
                selectedValue={minPrice}
                onValueChange={(itemValue) => setMinPrice(itemValue)}
              >
              <Picker.Item style={styles.pickerTitle} label="Min Price" value="" />
                <Picker.Item style={styles.pickerText} label="£0" value="0" />
                <Picker.Item style={styles.pickerText} label="£200" value="200" />
                <Picker.Item style={styles.pickerText} label="£400" value="400" />
                <Picker.Item style={styles.pickerText} label="£600" value="600" />
                <Picker.Item style={styles.pickerText} label="£800" value="800" />
                <Picker.Item style={styles.pickerText} label="£1000" value="1000" />
                <Picker.Item style={styles.pickerText} label="£1000" value="1000" />
                <Picker.Item style={styles.pickerText} label="£1200" value="1200" />
                <Picker.Item style={styles.pickerText} label="£1400" value="1400" />
                <Picker.Item style={styles.pickerText} label="£1600" value="1600" />
                <Picker.Item style={styles.pickerText} label="£1800" value="1800" />
                <Picker.Item style={styles.pickerText} label="£2000" value="2000" />
              </Picker>

              <Picker
                style={[styles.input, {color:textColor}]}
                selectedValue={maxPrice}
                onValueChange={(itemValue) => setMaxPrice(itemValue)}
              >
                <Picker.Item style={styles.pickerTitle} label="Max Price" value="" />
                <Picker.Item style={styles.pickerText} label="£2000" value="2000" />
                <Picker.Item style={styles.pickerText} label="£2200" value="2200" />
                <Picker.Item style={styles.pickerText} label="£2400" value="2400" />
                <Picker.Item style={styles.pickerText} label="£2600" value="2800" />
                <Picker.Item style={styles.pickerText} label="£2800" value="2800" />
                <Picker.Item style={styles.pickerText} label="£3000" value="3000" />
                <Picker.Item style={styles.pickerText} label="£3200" value="3200" />
                <Picker.Item style={styles.pickerText} label="£3400" value="3400" />
                <Picker.Item style={styles.pickerText} label="£3600" value="3600" />
                <Picker.Item style={styles.pickerText} label="£3800" value="3800" />
                <Picker.Item style={styles.pickerText} label="£4000" value="4000" />
              </Picker>
              <Picker
                style={[styles.input,{color: textColor}]}
                selectedValue={propertyType}
                onValueChange={(itemValue) => setPropertyType(itemValue)}
              >
                <Picker.Item style={styles.pickerTitle} label="Property Type" value='' />
                <Picker.Item style={styles.pickerText} label="Apartment" value="Apartment" />
                <Picker.Item style={styles.pickerText} label="Apartment(HMO)" value="Apartment(HMO)" />
                <Picker.Item style={styles.pickerText} label="Studio" value="Studio" />
                <Picker.Item style={styles.pickerText} label="House" value="House" />
              </Picker>
            </View>
          </ScrollView>
        </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0, 0, 0, 0)',
      flexGrow:1
    },
    modalContent: {
      backgroundColor: themes.dark.card,
      borderTopLeftRadius: sizes.layout.xLarge,
      borderTopRightRadius: sizes.layout.xLarge,
      padding: sizes.layout.medium,
      width: '100%',
    },
    infoSummary:{
      borderRadius: sizes.layout.medium,
      backgroundColor: themes.dark.background,
      marginBottom:sizes.layout.medium,
      paddingHorizontal:sizes.layout.small,
      elevation:5,
      shadowColor:themes.light.text,
      shadowOffset:{
        width:5,
        height:10
      },
      shadowOpacity:1,
      shadowRadius:sizes.layout.medium,
    },
    title: {
      fontSize: sizes.font.large,
      marginBottom: sizes.layout.large,
      color: themes.dark.text,
      textAlign: "center",
      fontFamily: 'monserrat-bold',
    },
    buttonContainer: {
      flexDirection: 'row',
      paddingVertical: sizes.layout.medium,
      justifyContent: 'space-evenly',
      marginTop: sizes.layout.medium,
    },
 
    infoContainer: {
      flexDirection: 'column',
      // alignItems: 'center',
      paddingVertical:sizes.layout.small,
    },
    icon:{
      marginRight: sizes.layout.xSmall,
    },
    pullDownButton: {
      position: 'absolute',
      top: 0, 
      alignSelf: 'center',
      zIndex: 2, // Ensure it's above other elements
    },
    pullDownNotch: {
      width: 60,
      height: sizes.layout.small,
      backgroundColor: themes.placeholder,
      borderColor:themes.dark.background,
      borderWidth:2,
      borderBottomRightRadius: sizes.layout.small,
      borderBottomLeftRadius: sizes.layout.small,
    },
    input: {
      width: '100%',
      maxHeight: 300,
      borderRadius: sizes.layout.small,
      paddingHorizontal: sizes.layout.medium,
      marginBottom: sizes.layout.small,
      color:themes.light.text,
      fontSize:sizes.font.medium
    },   
    pickerText: {
      fontSize: sizes.font.small,
  
    },
    pickerTitle: {
      fontSize: sizes.font.small,
      fontWeight: "bold",
    },

});

export default MenuModal;
