import { View, Text, SafeAreaView, StyleSheet, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import { collection, getDocs, getFirestore, limit, query, orderBy, startAfter} from 'firebase/firestore';
import createCustomAlert from '../../components/CustomCallableAlert';
import { themes,sizes } from '../../constants/layout';
import { useSettingsContext } from '../../context/settingsContext';
import { PropertyCard, Search, TextWithIconButton, MenuModal } from '../../components';
import { FlashList } from '@shopify/flash-list';
import { useSearchContext } from '../../context/searchContext';

const propertiesLimit = 25;
const {height} = Dimensions.get('screen')
const ITEM_HEIGHT = height / 2.2;

const AvailablePropertiesScreen = ({navigation}) => {

  //Screen constants
  const {theme} = useSettingsContext();
  const { searchResults, searchQuery} = useSearchContext();
  const { showAlert, CustomAlert } = createCustomAlert();
  const db = getFirestore();
  const dark = theme === "dark";
  const [properties, setProperties] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [startAfterDoc, setStartAfterDoc] = useState(null);
  const [reachedLastProperty, setReachedLastProperty] = useState(false);
  const isSearching = !!searchQuery;





// Function to get available properties
  const fetchProperties = async () => {
    try {
      const propertiesCollectionRef = collection(db, 'properties');
      const q = query(propertiesCollectionRef, orderBy("address"), limit(propertiesLimit));
      const querySnapshot = await getDocs(q);
      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];  // snapshot of last doc
      setStartAfterDoc(lastDoc)
      const propertiesData = querySnapshot.docs.map((doc) => ({
        propertyImage: doc.data().images[0],
        landlordName: doc.data().landlordName,
        landlordID:doc.data().landlordID,
        location: `${doc.data().address}, ${doc.data().city}`,
        city: doc.data().city,
        postcode: doc.data().postcode,
        propertyType: doc.data().type,
        listingPrice: doc.data().listingPrice,
        propertyId: doc.data().uid,
        terms: doc.data().terms,
        description: doc.data().description,
        propertyImages: doc.data().images
      }));
      setProperties(propertiesData);
    } catch (error) {
      console.log('Error fetching properties:', error);
      showAlert("Error", "Error retrieving properties, contact support if this error persist.")
    }
  };

  // Function to get available properties
  const fetchMoreProperties = async () => {
    //Early exit if there is no startAfterDoc or if user has reached the last property
    if(!startAfterDoc || reachedLastProperty){return}

    try {
      const propertiesCollectionRef = collection(db, 'properties');
      const q = query(propertiesCollectionRef, orderBy("address"), limit(propertiesLimit), startAfter(startAfterDoc));
      const querySnapshot = await getDocs(q);
      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];  // snapshot of last doc

      //Handle the case where all docs have been fetched
      if(lastDoc === startAfterDoc){
        setReachedLastProperty(true);
        return;
      }
      setStartAfterDoc(lastDoc)
      const newProperties = querySnapshot.docs.map((doc) => ({
        propertyImage: doc.data().images[0],
        landlordName: doc.data().landlordName,
        landlordID:doc.data().landlordID,
        location: `${doc.data().address}, ${doc.data().city}`,
        city: doc.data().city,
        postcode: doc.data().postcode,
        propertyType: doc.data().type,
        listingPrice: doc.data().listingPrice,
        propertyId: doc.data().uid,
        terms: doc.data().terms,
        description: doc.data().description,
        propertyImages: doc.data().images
      }));
      setProperties([...properties, ...newProperties]);
    } catch (error) {
      console.log('Error fetching properties:', error);
      showAlert("Error", "Error retrieving properties, contact support if this error persist.")
    }
  };

  // useEffect hook to fetch available properites
  useEffect(() => {
    fetchProperties();
  }, []);

  
  const handleSort = () => {
    setShowMenu(true)
  }

  const renderProperty = ({ item }: any) => (
    <View> 
     <PropertyCard
        property={item}
        textColor={dark? themes.dark.text: themes.light.text}
        />
    </View>
  );
   
  return (
    <SafeAreaView style={[styles.container, dark && {backgroundColor:themes.dark.background}]}>
        <View style={styles.contentContainer}>
          <Search 
          properties={properties}
          placeholder='Search Properties...'
          backgroundColor={dark? themes.dark.card: themes.light.card}
          color={dark? themes.dark.text:themes.light.text}
          borderRadius={30}
          />
          <TextWithIconButton icon={'filter'} buttonText={'Filter'} color={themes.colors.darkBlue} onPress={()=>console.log('pressed')}/>
          <Text style={[styles.propertiesTitle, dark && {color:themes.dark.text}]}>Available Properties</Text>
          <View style={[styles.properties]}>
          <FlashList
            data={isSearching && searchResults? searchResults : properties}
            keyExtractor={(item, index) => index.toString()}
            estimatedItemSize={ITEM_HEIGHT}
            renderItem={renderProperty}
            getItemLayout={(data: any, index: any) => (
              { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
            )}
            onEndReached={fetchMoreProperties}
            onEndReachedThreshold={0.2}
            showsVerticalScrollIndicator={true}
          />
          </View>
        </View>
        <CustomAlert/>
      <MenuModal
        visible ={showMenu}
        onClose={() => setShowMenu(false)}
        contentBackground={dark? themes.dark.card:themes.light.card}
        backgroundColor={dark? themes.dark.card : themes.light.card}
        textColor={dark? themes.dark.text:themes.light.text}     
      />
    </SafeAreaView>

  );
}

 const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themes.light.background
  },
  contentContainer: {
    padding: sizes.layout.medium,
  },
  propertiesTitle: {
    fontSize: sizes.font.medium,
    fontFamily: 'monserrat-semibold',
    marginVertical: sizes.layout.medium,
  },
  
  findMoreButton: {
    backgroundColor: '#0782F9',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: sizes.layout.small,
    marginBottom:sizes.layout.medium,
  },
  findMoreButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: sizes.font.medium,
    textAlign: 'center',
  },
  properties:{
    height: '80%',
    paddingBottom:16,
    verticalAlign:'bottom',
  },
});

export default AvailablePropertiesScreen;
