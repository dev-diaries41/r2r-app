import React, { useContext, useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { collection, addDoc, updateDoc, doc, getDocs, query, where , getFirestore, arrayUnion, getDoc} from 'firebase/firestore';
import {getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import createCustomAlert from '../../components/CustomCallableAlert';
import { useUserContext } from '../../context/userContext';
import { sizes, themes } from '../../constants/layout';
import { Button } from '../../components';


const PropertyDetailsScreen = ({route}) => {

  // Screen constants
  const { userId, userName,landlordID, location, images, description, terms } = route.params;
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [references, setReferences] = useState([]);
  const { showAlert, CustomAlert } = createCustomAlert();
  const {user, setUser, } = useUserContext();


  //Function to get the landlords notification token to send notification if request made
  async function getLandlordToken(landlordID){
    try{  
    const db = getFirestore();
      const userCollectionRef = collection(db, 'users');
      const querySnapshot = await getDocs(query(userCollectionRef, where('uid', '==', landlordID)));

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const token = userDoc.data().notificationToken;
        return token
    }
  }
  catch(error){
    console.log("Error retrieving token")
  }
}

//Function to send notifications
  async function sendPushNotification(expoPushToken) {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: 'New Request ',
      body: `You have a new lease request from ${userName}`,
    };
  
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  }


//Function to upload references when making a requests
  const handleAddReferences = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync();

      if ( result['canceled'] !== 'false') {
        console.log('Selected document name:', result.assets[0].name);
        console.log('Selected document URI:', result.assets[0].uri);  
        const fileUri = result.assets[0].uri
        const fileName = result.assets[0].name; 
        const storage = getStorage()
  
        const storageRef = ref(storage, fileName); // Create a reference to the storage location
  
        // Convert the file to blob format for uploading
        const response = await fetch(fileUri);
        const blob = await response.blob();
  
        // Upload the blob to Firestore storage
        await uploadBytes(storageRef, blob);
  
        // Get the download URL of the uploaded file
        const downloadURL = await getDownloadURL(storageRef);
        console.log('File uploaded successfully:', downloadURL);

        // Add Url of reference to references state
        setReferences([...references, downloadURL]);
        console.log('References:', references);
      } else {
        console.log('Document picking cancelled.');
      }
    } 
    catch (error) {
      console.log('Error picking document:', error);
      showAlert("Error Adding References", " An error occured whilst adding references, contact support if this error persist.", error)
    }
  };
  

  //Function to check if the subletter has alreaday made a request for a given property
  const checkExistingRequest = async (userDoc, landlordID, address) => {
    const requests = userDoc.data().requests;

    if(requests){
    const existingRequest = requests.some(request => {
      return request.landlordID === landlordID && request.address === address;
    });
    return existingRequest;
  } 
  else{
    return false;
    }
  };


  //Function to make a request to a landlord
  const handleMakeRequest = async () => {
    setLoading(true);

    try{
      const rid = uuidv4()
      const db = getFirestore();
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (!userDocSnapshot.empty) {
        const existingRequest = await checkExistingRequest(userDocSnapshot, landlordID, location)
        if(!existingRequest){
          const request = {
            address: location,
            subletterName: userName,
            subletterID: userId,
            message: message,
            references: references,
            landlordID:landlordID,
            requestID:rid,
            status: "pending"
          };
          await updateDoc(userDocRef, {
            requests: arrayUnion(request),     
          });
          const requestsCollectionRef = collection(db, 'requests');       // Save the listing to 'requests' collection
          await addDoc(requestsCollectionRef, request);    
          // setSubletterRequests(prevRequests => [...prevRequests, request]);
          const updatedUser = {
            ...user,
            requests: [...user.requests, request],
          };
          setUser(updatedUser);
          const token = await getLandlordToken(landlordID)  // Send a push notification to the landlord user
          if(token){
          await sendPushNotification(token);
          }else{
            console.log("no valid token");
          }
          showAlert("Request Made", "Your request was successfully made, please wait for the Landlord's response.");
        }
        else{
          showAlert("Existing Request", "You already have a pending request for this property.");
        }
      }
      else{
        console.log("User document not found")
      }
    }
    catch(error){
      showAlert("Request Error", "Error making request, contact support if this error persist.")
      console.log(error)
  }
    finally{
      setLoading(false);
      setMessage('');
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.contentContainer}>
          <Text style={styles.address}>{location}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageContainer}>
            {images.map((image, index) => (
              <Image source={{ uri: image }} style={styles.image} key={index} />
            ))}
          </ScrollView>
          <Text style={styles.title}>Property Description:</Text>
          <Text style={styles.description}>{description}</Text>
          <Text style={styles.title}>Terms:</Text>
          <Text style={styles.terms}>{terms}</Text>
          <Text style={styles.title}>Message:</Text>
          <TextInput
            style={styles.messageInput}
            multiline
            placeholder="Add a message to the Landlord before you submit your request... (Optional)"
            value={message}
            onChangeText={(text) => setMessage(text)}
          />

          <View style={{gap:8}}>
            <Button
              onPress={handleAddReferences}
              text='Add Reference'
              />
            
            <Button
              onPress={handleMakeRequest}
              text={"Make Request"}
              loading={loading}
              backgroundColor={themes.light.background}
              borderColor={themes.light.primary}
              borderWidth={2}
              color={themes.light.primary}
              />
          </View>  
        </View>
      </ScrollView>
      <CustomAlert /> 
    </SafeAreaView>
  );
};


 const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: sizes.font.medium,
    fontWeight: 'bold',
    marginBottom: sizes.layout.medium,
  },
  contentContainer: {
    padding: sizes.layout.medium,
  },
  address: {
    fontSize:  sizes.font.large,
    fontWeight: 'bold',
    marginBottom: sizes.layout.medium,
  },
  imageContainer: {
    marginBottom: sizes.layout.medium,
  },
  image: {
    width: 200,
    height: 200,
    marginRight: sizes.layout.medium,
    borderRadius: sizes.layout.small,
  },
  description: {
    fontSize:  sizes.font.medium,
    marginBottom: sizes.layout.medium,
  },
  terms: {
    fontSize: 12,
    marginBottom: 32,
  },
  messageInput: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: sizes.layout.small,
    padding:sizes.layout.small,
    marginBottom: sizes.layout.medium,
  },
});

export default PropertyDetailsScreen;
