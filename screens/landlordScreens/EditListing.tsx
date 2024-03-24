import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";
import { collection, updateDoc, doc, getDocs, query, where , getFirestore, getDoc} from 'firebase/firestore';
import { Button, createCustomAlert } from '../../components';
import { PropertyImages, ListingInputs } from '../../components';
import { themes, sizes } from '../../constants/layout';
import { useSettingsContext } from '../../context/settingsContext';
import { useUserContext } from '../../context/userContext';


const EditListing = ({route}) => {
  const db = getFirestore();
  const { showAlert, CustomAlert } = createCustomAlert();
  const {user, setUser}  = useUserContext();
  const {theme} = useSettingsContext();
  const { uaddress, ucity, upostcode, utype, ulistingPrice, uterms, udescription, images, listingID, userId } = route.params;
  const dark = theme ==="dark";
    
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [postcode, setPostcode] = useState('')
  const [listingPrice, setListingPrice] = useState('')
  const [terms, setTerms] = useState('')
  const [type, setType] = useState('')
  const [description, setDescription] = useState('')
  const [assets, setAssets] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  
  //useEffect hook to set property data
  useEffect(() => {
      setAddress(uaddress);
      setCity(ucity);
      setPostcode(upostcode);
      setListingPrice(ulistingPrice.toString());
      setTerms(uterms);
      setType(utype);
      setDescription(udescription);
      setAssets(images);
    }, [uaddress, ucity, upostcode, utype, ulistingPrice, uterms, udescription, images]);


const selectPreviousImage = () => {
  setCurrentImageIndex((prevIndex) => Math.max(prevIndex - 1, 0));
};

const selectNextImage = () => {
  setCurrentImageIndex((prevIndex) => Math.min(prevIndex + 1, assets.length - 1));
};

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


//Fucntion to handle editing a listing
const editListing = async () => {
  setLoading(true);
  try {
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnapshot = await getDoc(userDocRef);

    if (!userDocSnapshot.empty) {
      const propertiesCollectionRef = collection(db, 'properties');
      const propertiesSnapshot = await getDocs(query(propertiesCollectionRef, where('uid', '==', listingID)));

      if (!propertiesSnapshot.empty) {
        const listingDoc = propertiesSnapshot.docs[0];
        const listingRef = doc(propertiesCollectionRef, listingDoc.id);

        const listing = {
          landlordID: userId,
          uid: listingID,
          landlordName: `${userDocSnapshot.data().firstName} ${userDocSnapshot.data().lastName}`,
          address,
          city,
          postcode,
          type,
          listingPrice: parseInt(listingPrice), // Parse listingPrice as an integer
          terms,
          description,
          images: assets,
        };

        // Update the listing in the 'properties' collection
        await updateDoc(listingRef, listing);

        // Update the listing in the landlord user's listings array
        const updatedListings = userDocSnapshot.data().listings.map((item) => {
          if (item.uid === listingID) {
            return listing;
          } 
          else {
            return item;
          }
        });
        await updateDoc(userDocRef, {
          listings: updatedListings,
        })
        const updatedUser = {
          ...user,
          listings: updatedListings,
        };
        setUser(updatedUser);
        setLoading(false);
      } 
      else {
        console.log('Listing document does not exist.');
        showAlert("Error Editing Listing", "An error occured whilst editing listing, contact support if this error persist.")
      }
    } 
    else {
      console.log('User document does not exist.');
      showAlert("Error Editing Listing", "An error occured whilst editing listing, contact support if this error persist.")
    }
  } 
  catch (error) {
    console.log('Error editing listing:', error);
    showAlert("Error Editing Listing", "An error occured whilst editing listing, contact support if this error persist.")
  }
};


return (
  <SafeAreaView style={[styles.container, dark && {backgroundColor:themes.dark.background}]}>      
    <ScrollView>
    <Text style={[styles.title, dark && {color:themes.dark.text}]}>Editing: {uaddress}, {postcode}</Text>
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
      selectPreviousImage={selectPreviousImage}
      selectNextImage={selectNextImage}
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
          onPress={editListing}
          text={loading ? "Creating..." : "Create Listing"}
          loading={loading}
          backgroundColor={themes.light.background}
          borderColor={themes.light.primary}
          borderWidth={2}
          color={themes.light.primary}
          />
        </View>    
  </ScrollView>
  <CustomAlert/>
</SafeAreaView>
);
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: sizes.layout.medium,
      backgroundColor:themes.light.background
    },
    title: {
      fontSize: sizes.font.medium,
      fontFamily:'monserrat-semibold',
      marginVertical: sizes.layout.medium,
    },
    imageContainer: {
      marginBottom:  sizes.layout.medium,
    },
  });

export default EditListing

