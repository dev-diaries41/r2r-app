import React, { useState } from 'react';
import { Text, View, TextInput, SafeAreaView, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Picker } from "@react-native-picker/picker";
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import createCustomAlert from '../../components/CustomCallableAlert';
import { themes, sizes } from '../../constants/layout';
import { useSettingsContext } from '../../context/settingsContext';



const SearchScreen = ({navigation}) => {

  //Screen constants
  const {theme} = useSettingsContext();
  const { showAlert, CustomAlert } = createCustomAlert();
  const db = getFirestore();
  const dark = theme === "dark"; 

  //State variables
  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [searchResults, setSearchResults] = useState([]);



//Function to handle searching 
const handleSearch = async () => {
  try {
    const propertiesCollectionRef = collection(db, 'properties');
    let searchQuery = query(propertiesCollectionRef);


    // Apply filters based on the selected values
    if (location !== '') {
      searchQuery = query(searchQuery, where('city', '==', location));
    }
    if (minPrice !== '') {
      searchQuery = query(searchQuery, where('listingPrice', '>=', parseInt(minPrice)));
    }
    if (maxPrice !== '') {
      searchQuery = query(searchQuery, where('listingPrice', '<=', parseInt(maxPrice)));
    }
    if (propertyType !== '') {
      searchQuery = query(searchQuery, where('type', '==', propertyType));
    }

    const querySnapshot = await getDocs(searchQuery);

    // Map the document data to the search results array
    const searchResults = querySnapshot.docs.map((doc) => ({
      propertyImage: doc.data().images[0],
      landlordName: doc.data().landlordName,
      landlordImage: require('../../assets/profile.png'),
      city: doc.data().city,
      propertyType: doc.data().type,
      listingPrice: doc.data().listingPrice,
      propertyImages: doc.data().images,
      location: `${doc.data().address}, ${doc.data().postcode}`,
      terms: doc.data().terms,
      description: doc.data().description,
    }));
    setSearchResults(searchResults);
  } catch (error) {
    console.log('Error searching properties:', error);
    showAlert("Search Error", "An error occured whilst searching, contact support if this error persist.")
  }
};

//Function to navigate to Property Deatils screen
const handleViewDetails = (location, images, description, terms) => {
  navigation.navigate("Property Details", { location, images, description, terms });
};


  return (
    <SafeAreaView style={[styles.container, dark && {backgroundColor:themes.dark.background}]}>
      <ScrollView>
        <View style={styles.contentContainer}>
          <Text style={[styles.title, dark && {color:themes.dark.text}]}>Search Properties</Text>
          <TextInput
            style={[styles.input, dark && {color:themes.dark.text}]}
            placeholder="Enter city"
            value={location}
            onChangeText={text => setLocation(text.trim())}
            placeholderTextColor={themes.placeholder}
          />

          <Picker
            style={[styles.input, dark && {color:themes.dark.text}]}
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
            style={[styles.input, dark && {color:themes.dark.text}]}
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
            style={[styles.input, dark && {color:themes.dark.text}]}
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
      <CustomAlert/>
    </SafeAreaView>
  );
};


 const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:themes.light.background
  },
  contentContainer: {
    padding: sizes.layout.medium,
  },
  title: {
    fontSize: sizes.font.medium,
    fontWeight: 'bold',
    marginBottom: sizes.layout.medium,

  },
  resultsTitle: {
    fontSize: sizes.font.medium,
    fontWeight: 'bold',
    marginBottom: sizes.layout.medium,
    marginTop: sizes.layout.medium,

  },
  input: {
    borderWidth: 1,
    borderColor: '#E4E4E4',
    borderRadius: sizes.layout.small,
    padding: sizes.layout.small,
    marginBottom: sizes.layout.medium,
    fontSize: sizes.font.small,
  },
  pickerText: {
    fontSize: sizes.font.small,

  },
  pickerTitle: {
    fontSize: sizes.font.small,
    fontWeight: "bold",
  },

});

export default SearchScreen;
