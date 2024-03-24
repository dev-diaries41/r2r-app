import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons or any relevant icon library
import { themes, sizes } from '../../constants/layout';


const PropertyImages = ({
  assets,
  currentImageIndex,
  selectPreviousImage,
  selectNextImage,
  setAssets,
  setCurrentImageIndex,
}) => {
  return (
    <View style={styles.imageWrapper}>
      <Image style={styles.image} source={{ uri: assets[currentImageIndex] }} />
      <TouchableOpacity
        style={[styles.navigationButton, styles.navigationButtonBack]}
        onPress={selectPreviousImage}
        disabled={currentImageIndex === 0}
      >
        <Ionicons name="md-arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.navigationButton, styles.navigationButtonForward]}
        onPress={selectNextImage}
        disabled={currentImageIndex === assets.length - 1}
      >
        <Ionicons name="md-arrow-forward" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => {
          const updatedAssets = assets.filter((_: any, index:number) => index !== currentImageIndex);
          setAssets(updatedAssets);
          setCurrentImageIndex((prevIndex: number) => Math.min(prevIndex, updatedAssets.length - 1));
        }}
      >
        <Ionicons name="md-close" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({

  //Property Image styles
  image: {
    width: 200,
    height: 200,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor:"gray",
    marginBottom: sizes.layout.small,
    alignSelf:"center"
  },
  closeButton: {
    position: 'absolute',
    top: -8,
    right: 30,
  },
  navigationButtonBack: {
    position: 'absolute',
    top: 75,
    left: 30,
  },
  navigationButtonForward:{
    position: 'absolute',
    top: 75,
    right: 30,
  },
  navigationButton: {
    position: 'absolute',
    top: '50%',
    opacity: 0.7,
    padding: sizes.layout.medium,
  },
  imageWrapper:{
    marginVertical: sizes.layout.medium
  }
   
});

export default PropertyImages;