import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import CustomPicker from '../CustomPicker';
import { propertyTypes } from '../../constants/landlord';
import { themes, sizes } from '../../constants/layout';

const ListingInputs = ({ type, setType, address, setAddress, city, setCity, postcode, setPostcode, listingPrice, setListingPrice, 
  terms, setTerms, description, setDescription, dark 

}) => {
  return (
    <>
      <CustomPicker
        label={'Select property type'}
        dropdownIconColor={themes.colors.darkBlue}
        dropdownIconRippleColor={themes.colors.darkBlue}
        textColor={dark? themes.dark.text:themes.light.text}
        options={Object.values(propertyTypes)}
        selectedValue={type}
        onValueChange={itemValue => setType(itemValue)}
      />

      <View style={[styles.inputWrapper, dark && {backgroundColor:themes.dark.card}]}>
      <View style={styles.gridContainer}>
        <View style={styles.column}>
          <TextInput
            style={[styles.input, dark && {borderColor:themes.dark.border, color:themes.dark.text}]}            
            placeholder="Address"
            value={address}
            onChangeText={text => setAddress(text)}
            placeholderTextColor={dark && themes.placeholder}

          />
          <TextInput
            style={[styles.input, dark && {borderColor:themes.dark.border, color:themes.dark.text}]}            
            placeholder="City"
            value={city}
            onChangeText={text => setCity(text.trim())}
            placeholderTextColor={dark && themes.placeholder}

          />
        </View>
        <View style={styles.column}>
          <TextInput
            style={[styles.input, dark && {borderColor:themes.dark.border, color:themes.dark.text}]}            
            placeholder="Postcode"
            value={postcode}
            onChangeText={text => setPostcode(text.trim())}
            placeholderTextColor={dark && themes.placeholder}
          />
          <TextInput
            style={[styles.input, dark && {borderColor:themes.dark.border, color:themes.dark.text}]}            
            placeholder="Listing Price"
            value={listingPrice}
            onChangeText={text => setListingPrice(text.trim())}
            keyboardType='numeric'
            placeholderTextColor={dark && themes.placeholder}

          />
        </View>
      </View>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
            style={[styles.bigInput, styles.multiLineInput, dark && { color:themes.dark.text}]}            
            placeholder="Terms"
          value={terms}
          onChangeText={text => setTerms(text)}
          multiline
          placeholderTextColor={dark && themes.placeholder}

        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
            style={[styles.bigInput, styles.multiLineInput, dark && {color:themes.dark.text}]}            
            placeholder="Property description"
          value={description}
          onChangeText={text => setDescription(text)}
          multiline
          placeholderTextColor={dark && themes.placeholder}

        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    marginBottom: sizes.layout.medium,
  },
  column: {
    flex: 1,
    paddingHorizontal: sizes.layout.small,
  },
  input: {
    borderBottomWidth:1,
    borderColor: '#ccc',
    padding: sizes.layout.medium,
    borderRadius:sizes.layout.small,
  },
  bigInput: {
    marginBottom: sizes.layout.small,
    padding: sizes.layout.small,
    backgroundColor: themes.light.card,
    borderRadius: sizes.layout.small,
  },
  inputContainer: {
    marginBottom:sizes.layout.small,
  },
  multiLineInput: {
    height: 100,
  },
  inputWrapper:{
    borderRadius: sizes.layout.small,
    padding:sizes.layout.small,
    backgroundColor:themes.light.card,
    marginBottom:sizes.layout.medium,
  },  
});

export default ListingInputs;