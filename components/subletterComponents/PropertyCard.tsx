import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import { themes, sizes } from '../../constants/layout';
import { useNavigation } from '@react-navigation/native';
import { useUserContext } from '../../context/userContext';

const {height} = Dimensions.get('screen')
const imageHeight = height / 3
const propertyCardHeight = height / 2.2;

interface AvailablePropertiesProps {
  property: {
    landlordID: string;
    landlordName: string;
    location: string;
    propertyImages: string[]; // Assuming type of propertyImages
    description: string;
    terms: string;
    propertyImage: string;
    propertyType: string;
    listingPrice: number;
    landlordImage: string;
  };
  textColor: string;
}

const PropertyCard = ({
  property,
  textColor = themes.light.text,
}: AvailablePropertiesProps) => {
    const navigation = useNavigation();
    const {user} = useUserContext();
    
    //Open Property Deatils screen with relevant details
    const handleViewDetails = (userId: string, userName: string, landlordID: string, location: string, images: string[], description: string, terms: string) => {
        navigation.navigate("Property Details", { userId, userName, landlordID, location, images, description, terms });
    };


  return (
    property && (
      <TouchableOpacity
      style={[styles.propertyContainer,]}
      onPress={() =>
        handleViewDetails(
          user.uid,
          `${user.firstName} ${user.lastName}`,
          property.landlordID,
          property.location,
          property.propertyImages,
          property.description,
          property.terms
        )
      }
    >
      <Image source={{ uri: property.propertyImage }} style={styles.propertyImage} />
      <View style={styles.propertyInfo}>
          <Text style={[styles.propertyText,  { color: textColor, fontFamily: 'monserrat-semibold' }]}>Address: {property.location}</Text>
          <Text style={[styles.propertyText,  { color: textColor }]}>Landlord: {property.landlordName}</Text>
          <Text style={[styles.propertyText,  { color: textColor }]}>Type: {property.propertyType}</Text>
          <Text style={styles.listingPrice}>£{property.listingPrice}/month</Text>
      </View>
    </TouchableOpacity>
    )
  );
};

const styles = StyleSheet.create({
    propertyContainer: {
      flexDirection: 'column',
      marginBottom: sizes.layout.medium,
      height: propertyCardHeight
    },
    propertyImage: {
      width: '100%',
      height: imageHeight,
      borderRadius: 10,
      marginRight: sizes.layout.medium,
    },
    propertyInfo: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: sizes.layout.xSmall,
      marginVertical: sizes.layout.small,
    },
    landlordImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginBottom: sizes.layout.small,
    },
    propertyText: {
      fontSize:  sizes.font.small,
      fontFamily: 'monserrat-regular',
    },
    listingPrice: {
      fontSize:  sizes.font.small,
      fontFamily: 'monserrat-semibold',
      textDecorationLine: 'underline'
    },
  });

export default PropertyCard;
