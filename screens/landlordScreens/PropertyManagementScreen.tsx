import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/core'
import { View, Text, SafeAreaView, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";
import { collection, addDoc, updateDoc, doc, getDocs, query, where , getFirestore, arrayUnion, deleteDoc, getDoc} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import ConfirmAlert from '../../components/ConfirmAlert'
import createCustomAlert from '../../components/CustomCallableAlert';
import { PropertyImages, ListingInputs } from '../../components/landlordComponents/ListingInputs';
import { useUserContext } from '../../context/userContext';
import { useLandlordContext } from '../../context/landlordContext';
import { useSettingsContext } from '../../context/settingsContext';
import { themes, sizes } from '../../constants/layout';
import { Button, TextButton } from '../../components';


const PropertyManagementScreen = () => {
  const {listings, setListings} = useLandlordContext();
  const {user, setUser} = useUserContext();
  const {theme} = useSettingsContext()
  const navigation = useNavigation();
  const db = getFirestore();
  const { showAlert, CustomAlert } = createCustomAlert();
  const dark = theme === "dark";   //dark theme

  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [postcode, setPostcode] = useState('')
  const [listingPrice, setListingPrice] = useState('')
  const [terms, setTerms] = useState('')
  const [type, setType] = useState('')
  const [description, setDescription] = useState('')
  const [assets, setAssets] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [listingSuccess, setListingSuccess] = useState(false);


  //useEffect hook to set listings
  useEffect(() => {
    if (user) {
      setListings(user.listings);
    }
  }, [user]);


  //Function to fetch the landlords listings
  const fetchListings = async () => {
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnapshot = await getDoc(userDocRef);
      
      if (!userDocSnapshot.empty) {
        const userListings = userDocSnapshot.data().listings
        setListings(userListings);
      }
    } 
    catch (error) {
      console.log('Error fetching listings:', error);
      showAlert("Error", "Error retrieving your listings, contact support if this error persist.")
    }
  };

  //Function to refresh screen
  const onRefresh = () => {
    setRefreshing(true);
    fetchListings().then(() => setRefreshing(false));
  };
  
  //Function to navigate to edit screen and edit a listing
  const edit = (uaddress: string, ucity: string, upostcode: string, utype:string, ulistingPrice:string|number, uterms:string, udescription:string, images:string[], listingID:string, userId:string) => {
    navigation.navigate("Edit", { uaddress, ucity, upostcode, utype, ulistingPrice, uterms, udescription, images, listingID, userId });
    
  };


  //Function to select previous image
  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };
  
  
  //Function to select next image
  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => Math.min(prevIndex + 1, assets.length - 1));
  };
  

  //Fucntion to upload image to firebase storage and update state
  const uploadImage = async () => {
    if(assets.length === 10){
      showAlert("Reached Upload Limit", "Only 10 images can be uploaded.")
    }
    else{
      try {
        const imagePickerResult = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 1,
        });

        if (!imagePickerResult.canceled) {
          const selectedAsset = imagePickerResult.assets[0];
          const fileName = `${Date.now()}_${selectedAsset.fileName}`;
          const storage = getStorage()
          const imgref = ref(storage, fileName)
          const img = await fetch(selectedAsset.uri)
          const bytes = await img.blob();
          await uploadBytes(imgref, bytes);
          const downloadURL = await getDownloadURL(imgref);
          console.log(downloadURL)
          setAssets((prevAssets) => [...prevAssets, downloadURL]);
        }
      } 
      catch (error) {
        console.log('Error uploading image:', error);
      }
    }
  };
  

  //Function to create a listing
  const createListing = async () => {
    setLoading(true);
    try {
      const uid = uuidv4();
      const db = getFirestore();
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnapshot = await getDoc(userDocRef);
  
      if (!userDocSnapshot.empty) {
        const listing = {
          landlordID:user.uid,
          uid: uid,
          landlordName: `${user.firstName} ${user.lastName}`, 
          address,
          city,
          postcode,
          type,
          listingPrice: parseInt(listingPrice), // Parse listingPrice as an integer
          terms,
          description,
          images: assets,
        };
        
  
        await updateDoc(userDocRef, {
          listings: arrayUnion(listing),
        });
  
        // Save the listing to 'properties' collection
        const propertiesCollectionRef = collection(db, 'properties');
        await addDoc(propertiesCollectionRef, listing);
        handleResetState();
        const updatedUser = {
          ...user,
          listings: [...user.listings, listing],
        };
        setUser(updatedUser);
        setLoading(false);
        // add animations
        setListingSuccess(true);
      } 
      else {
        console.log('User document does not exist.');
      }
    } 
    catch (error) {
      console.log('Error creating listing:', error);
      showAlert("Error Creating Listing", "An error occured whilst creating your listing, contact support if this error persist.")
    }
  };
  

  //Function to delete listing
  const onDeleteListing = async (listingUid) => {
    try {
      // Remove the listing from the listings state
      setListings((prevListings) =>
        prevListings.filter((listing) => listing.uid !== listingUid)
      );
  
      // Update the user document in Firestore by removing the listing from the listings array field
      const userCollectionRef = collection(db, 'users');
      const querySnapshot = await getDocs(
        query(userCollectionRef, where('uid', '==', user.uid))
      );
  
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userRef = doc(db, 'users', userDoc.id);
  
        const updatedListings = userDoc.data().listings.filter(
          (listing) => listing.uid !== listingUid
        );
  
        await updateDoc(userRef, {
          listings: updatedListings,
        });

        const updatedUser = {
          ...user,
          listings: user.listings.filter(listing => listing.uid !== listingUid),
        };
        setUser(updatedUser);

        //delete listing from properties collection
        const propertiesCollectionRef = collection(db, 'properties');
        const propertyQuerySnapshot = await getDocs(query(propertiesCollectionRef, where('uid', '==', listingUid)));
        if (!propertyQuerySnapshot.empty) {
          const propertyDoc = propertyQuerySnapshot.docs[0];
          const propertyRef = doc(db, 'properties', propertyDoc.id);
          await deleteDoc(propertyRef)
        }
        else{
          console.log('Property document does not exist.');
        }
      }
       else {
        console.log('User document does not exist.');
      }
    } 
    catch (error) {
      console.log('Error deleting listing:', error);
      showAlert("Error Deleting Listing", "An error occured whilst attempting to delete your listing, contact support if this error persist.")
    }
  };
  

  //Function to initiate the deletion process
  const handleInitiateDeletion = (listingId) => {
    setListingToDelete(listingId);
    setDeleting(true);
  };


  //Function to cancel deleting a listing
  const handleCancelDelete = () => {
    setListingToDelete(null);
    setDeleting(false);
  };


  //Function to confirm deleting a listing
  const handleConfirmDelete = () => {
    if (listingToDelete) {
      onDeleteListing(listingToDelete);
      setListingToDelete(null);
    }
    setDeleting(false);
  };


  //Function to reset state variables after creating listing
  const handleResetState = () => {
    setType('');
    setAddress('');
    setCity('');
    setPostcode('');
    setDescription('');
    setTerms('');
    setListingPrice('');
    setAssets([]);
    setCurrentImageIndex(0);
  };
  

  //Component to render listings
  const renderListings = () => {
    const noListings = !listings || listings.length === 0
    if (noListings) {
      return(
        <Text style={styles.noListings}>No listings</Text>
      ); 
    }

    return (
      <View style={[styles.listingContainer, dark && {backgroundColor:themes.dark.card}]}>
        {listings.map((listing:any, index: number) => (
          <React.Fragment key={index}>
            <View style={styles.listingRow}>
              <Text style={[styles.listingText, dark && {color:themes.dark.text} ]}>{listing.address}</Text>
              <TextButton 
                onPress={() => edit(listing.address, listing.city, listing.postcode, listing.type, listing.listingPrice, listing.terms, listing.description, listing.images, listing.uid, user.uid)}
                buttonText='Edit'
                color={themes.colors.green}
                margin={sizes.layout.xSmall}
              />
              <TextButton 
                onPress={() => handleInitiateDeletion(listing.uid)}
                buttonText='Delete'
                color={themes.colors.red}
                margin={sizes.layout.xSmall}
              />
            </View>
            {index !== listings.length - 1 && <View style={[styles.divider, dark && {borderBottomColor:themes.dark.border}]} />}
          </React.Fragment>
          
        ))}
      </View>
    );
  };
  


  return (
    <SafeAreaView style={[styles.container, dark && {backgroundColor:themes.dark.background}]}>      
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
    <Text style={[styles.title, dark && {color:themes.dark.text}]}>Create Listings</Text>
      <ListingInputs
          type={type}
          setType={setType}
          address={address}
          setAddress={setAddress}
          city={city}
          setCity={setCity}
          postcode={postcode}
          setPostcode={setPostcode}
          listingPrice={listingPrice}
          setListingPrice={setListingPrice}
          terms={terms}
          setTerms={setTerms}
          description={description}
          setDescription={setDescription}
          dark = {dark}
        />

        <View style={styles.imageContainer}>
          {assets.length > 0 && (
           <PropertyImages
              assets={assets}
              currentImageIndex={currentImageIndex}
              handlePreviousImage={handlePreviousImage}
              handleNextImage={handleNextImage}
              setAssets={setAssets}
              setCurrentImageIndex={setCurrentImageIndex}
            
              />
            )}
        </View>

        <View style={{gap:8}}>
        <Button
          onPress={uploadImage}
          text='Upload Images'
          />
        
        <Button
          onPress={createListing}
          text={loading ? "Creating..." : "Create Listing"}
          loading={loading}
          backgroundColor={themes.light.background}
          borderColor={themes.light.primary}
          borderWidth={2}
          color={themes.light.primary}
          />
        </View>    
    <Text style={[styles.title, dark && {color:themes.dark.text}]}>My Listings</Text>
        {/* My Listings section goes here */}
        {renderListings()}
      </ScrollView>
      <CustomAlert/>
       <ConfirmAlert
        visible={deleting}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Listing"
        description="Are you sure you want to delete this listing?"
      />
    
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:sizes.layout.medium,
    backgroundColor:themes.light.background

  },
  title: {
    fontSize: 14,
    fontFamily:'monserrat-bold',
    marginVertical: sizes.layout.medium,
  },

  imageContainer: {
    marginBottom: sizes.layout.medium,
  },

  listingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    height:50,
    padding: 10,
    
  },
  listingText: {
    flex: 1,
    marginRight: 8,
    marginLeft:8,
    fontSize:12,
  },
  listingContainer: {
    backgroundColor: themes.light.card,
    borderRadius:10,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginHorizontal: 10,
  },
  noListings: {
    fontSize: 12,
    marginStart:8
  },    
});

export default PropertyManagementScreen;
