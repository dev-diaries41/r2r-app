import { Image, StyleSheet, Text, View, Dimensions } from 'react-native'
import React from 'react'
import { themes, sizes } from '../../constants/layout';

const {width} = Dimensions.get('screen')

const imageSize = width/1.5;

type Item = {
    propertyImage: string;
    location: string;
    propertyType: string;
    listingPrice: string | number;
}

interface ListingCardProps {
    item: Item;
    textColor?: string;
}

const ListingCard = ({item, textColor = themes.light.text}: ListingCardProps) => {
  return (
    <View style={styles.listingContainer}>
    <Image source={{uri:item.propertyImage}} style={styles.listingImage} />
    <View style={styles.listingInfoContainer}>
      <Text style={[styles.listingText, {fontFamily:"monserrat-bold", color:textColor}]}>{item.location}</Text>
      <Text style={[styles.listingText, {color:textColor}]}>{item.propertyType}</Text>
      <Text style={[styles.listingText, {color:textColor}]}>£{item.listingPrice}/month</Text>
    </View>
  </View>
  )
}

const styles = StyleSheet.create({
    listingContainer: {
      flexDirection: 'column',
      marginEnd:sizes.layout.medium,
      borderRadius: sizes.layout.medium,
    },
    
    listingImage: {
      width: imageSize,
      height: imageSize,
      borderRadius: sizes.layout.small,

    },
    listingInfoContainer: {
      padding: sizes.layout.small,
      // backgroundColor:'gray',
      borderBottomRightRadius: sizes.layout.small,
      borderBottomLeftRadius: sizes.layout.small,
    },
    listingText: {
      fontSize: sizes.font.small,
      marginBottom:  sizes.layout.xSmall,
      fontFamily: 'monserrat-regular',
      
    },
    listingStatus: {
        fontSize:  sizes.font.small,
    },

})

export default ListingCard;