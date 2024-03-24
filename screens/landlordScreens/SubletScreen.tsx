import React, { useState } from 'react';
import { Text, View, SafeAreaView, ScrollView, TouchableOpacity, Linking, RefreshControl, StyleSheet } from 'react-native';
import { collection, query, where, getDocs, getFirestore, doc, updateDoc } from 'firebase/firestore';
import { themes, sizes } from '../../constants/layout';
import { Agreements, Requests, createCustomAlert } from '../../components';
import { useSettingsContext } from '../../context/settingsContext';
import { useLandlordContext } from '../../context/landlordContext';
import { useUserContext } from '../../context/userContext';

const SubletScreen = ({navigation}) => {
  const db = getFirestore();
  const { showAlert, CustomAlert } = createCustomAlert();
  const { user } = useUserContext();
  const {landlordRequests, setLandlordRequests, landlordAgreements, setLandlordAgreements} = useLandlordContext()
  const {theme} = useSettingsContext();
  const [refreshing, setRefreshing] = useState(false);
  const dark = theme === "dark";   //dark theme


  //send push notification
  async function sendPushNotification(expoPushToken, title, body) {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: title,
      body: body,
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


  //Function to get the requests made to the landlords listed properties
  const fetchSubletRequests = async () => {
    try {
      const requestsCollectionRef = collection(db, 'requests');
      const querySnapshot = await getDocs(
        query(requestsCollectionRef, where('landlordID', '==', user.uid), where('status', '==', 'pending'))
      );
      const requests = querySnapshot.docs.map((doc) => doc.data());
      setLandlordRequests(requests);
    } 
    catch (error) {
      console.log('Error fetching sublet requests:', error);
      showAlert("Error", "Error retrieving your requests, contact support if this error persist.")
    }
  };
  

  //Function to get the landlords active agrrements 
  const fetchActiveAgreements = async () => {
    try {
      const requestsCollectionRef = collection(db, 'requests');
      const querySnapshot = await getDocs(
        query(requestsCollectionRef, where('landlordID', '==', user.uid), where('status', '==', 'agreed'))
      );
      const agreements = querySnapshot.docs.map((doc) => doc.data());
      setLandlordAgreements(agreements);
    } 
    catch (error) {
      console.log('Error fetching active agreements:', error);
      showAlert("Error", "Error retrieving your active agreements, contact support if this error persist.")
    }
  };
  


  //Function to handle refreshing the screen
  const onRefresh = () => {
    setRefreshing(true);
    fetchActiveAgreements()
    fetchSubletRequests().then(() => setRefreshing(false));
  };


  //Function to open chat with the subletter who made request
  const handleMessage = (sender, recipient) => {
    navigation.navigate("Messaging", { sender, recipient });
  };


  //Function to reject the selected request
  const handleRejection = async (requestID) => {
    try {
      const requestsCollectionRef = collection(db, 'requests');
      const requestQuerySnapshot = await getDocs(query(requestsCollectionRef, where('requestID', '==', requestID)));
  
      if (!requestQuerySnapshot.empty) {
        const requestDoc = requestQuerySnapshot.docs[0];
        const requestRef = doc(db, 'requests', requestDoc.id);
        await updateDoc(requestRef, {
          status: 'rejected',
        });
  
        const usersCollectionRef = collection(db, 'users');
        const userQuerySnapshot = await getDocs(query(usersCollectionRef, where('uid', '==', requestDoc.data().subletterID)));
  
        if (!userQuerySnapshot.empty) {
          const userDoc = userQuerySnapshot.docs[0];
          const userRef = doc(db, 'users', userDoc.id);
          const updatedRequests = userDoc.data().requests.map((request) => {
            if (request.requestID === requestID) {
              return { ...request, status: 'rejected' };
            } else {
              return request;
            }
          });
          await updateDoc(userRef, {
            requests: updatedRequests,
          });
          showAlert("Request Rejected", 'Request rejected successfully.');
          if(userDoc.notificationToken){
            sendPushNotification(userDoc.notificationToken, "Request rejected", `Your lease request for ${requestDoc.address} has been rejected by the Landlord.`)
        }
      }
    }
    } 
    catch (error) {
      console.log('Error rejecting request:', error);
      showAlert("Error Rejecting Request", "An error occured whilst rejecting the request, contact support if this error persist.")
    }
  };
  

  //Function to accept the selected request
  const handleAccept = async (requestID) => {
    try {
      const requestsCollectionRef = collection(db, 'requests');
      const requestQuerySnapshot = await getDocs(query(requestsCollectionRef, where('requestID', '==', requestID)));
  
      if (!requestQuerySnapshot.empty) {
        const requestDoc = requestQuerySnapshot.docs[0];
        const requestRef = doc(db, 'requests', requestDoc.id);
        await updateDoc(requestRef, {
          status: 'agreed',
        });
  
        const usersCollectionRef = collection(db, 'users');
        const userQuerySnapshot = await getDocs(query(usersCollectionRef, where('uid', '==', requestDoc.data().subletterID)));
  
        if (!userQuerySnapshot.empty) {
          const userDoc = userQuerySnapshot.docs[0];
          const userRef = doc(db, 'users', userDoc.id);
          const updatedRequests = userDoc.data().requests.map((request) => {
            
            if (request.requestID === requestID) {
              return { ...request, status: 'agreed' };
            } else {
              return request;
            }
          });
          await updateDoc(userRef, {
            requests: updatedRequests,
          });

          if(userDoc.notificationToken){
            sendPushNotification(userDoc.notificationToken, "Request accepted", `Your lease request for ${requestDoc.address} has been accepted by the Landlord.`)
          }
        showAlert("Request Accepted", 'Request accepted successfully.');
        }
      }
    } 
    catch (error) {
      console.log('Error aceepting request:', error);
      showAlert("Error Accepting Request", "An error occured whilst accepting the request, contact support if this error persist.")
    }
  };


  return (
    <SafeAreaView style={[styles.container, dark && {backgroundColor:themes.dark.background}]}>      
      <ScrollView
       refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      >
        <View style={styles.content}>
        <Requests
        requests={landlordRequests}
        handleAccept={handleAccept}
        handleRejection={handleRejection}
        handleMessage={handleMessage}
        textColor={dark? themes.dark.text:themes.light.text}
        user={user}
        />
        <Agreements
        landlordAgreements={landlordAgreements}
        textColor={dark? themes.dark.text:themes.light.text}
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
    backgroundColor:themes.light.background
  },
  content: {
    padding: sizes.layout.medium,
  },
});



export default SubletScreen;
