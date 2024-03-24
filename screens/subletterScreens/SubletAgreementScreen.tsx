import React, { useState } from 'react';
import { Text, View, SafeAreaView, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { collection, query, where, getDocs, getFirestore } from 'firebase/firestore';
import createCustomAlert from '../../components/CustomCallableAlert';
import { themes, sizes } from '../../constants/layout';
import { useSubletterContext } from '../../context/subletterContext';
import { useUserContext } from '../../context/userContext';
import { useSettingsContext } from '../../context/settingsContext';
import { SubletterRequests } from '../../components';

const SubletAgreementScreen = ({}) => {

  //Screen constants
  const {user} = useUserContext();
  const {subletterRequests, subletterAgreements, setSubletterRequests, setSubletterAgreements} = useSubletterContext();
  const {theme}= useSettingsContext();
  const db = getFirestore();
  const { showAlert, CustomAlert } = createCustomAlert();
  const dark = theme === "dark"; //dark theme

  //State variables
  const [refreshing, setRefreshing] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(-1);
  

  //Function to get the subletters pending requests
  const fetchSubletRequests = async () => {
    try {
      const requestsCollectionRef = collection(db, 'requests');
      const querySnapshot = await getDocs(
        query(requestsCollectionRef, where('subletterID', '==', user.uid), where('status', '==', 'pending'))
      );
      const requests = querySnapshot.docs.map((doc) => doc.data());
      setSubletterRequests(requests);
    } catch (error) {
      console.log('Error fetching sublet requests:', error);
      showAlert("Error", "Error retrieving your requests, contact support if this error persist.")

    }
  };
  

   //Function get the  subletters active agrrements 
   const fetchActiveAgreements = async () => {
    try {
      const requestsCollectionRef = collection(db, 'requests');
      const querySnapshot = await getDocs(
        query(requestsCollectionRef, where('subletterID', '==', user.uid), where('status', '==', 'agreed'))
      );
      const agreements = querySnapshot.docs.map((doc) => doc.data());
      setSubletterAgreements(agreements);
    } catch (error) {
      console.log('Error fetching active agreements:', error);
      showAlert("Error", "Error retrieving your active agreements, contact support if this error persist.")

    }
  };
  

  //Function to expand toggle of agreement container
  const toggleExpanded = (index) => {
    if (expandedIndex === index) {
      setExpandedIndex(-1);
    } else {
      setExpandedIndex(index);
    }
  };


  //Function to handle refreshing the screen
  const onRefresh = () => {
    setRefreshing(true);
    fetchActiveAgreements()
    fetchSubletRequests().then(() => setRefreshing(false));
  };

  // const handleMessage = ( recipient) => {
  //   navigation.navigate("Messaging", {  recipient });
  // };


  return (
    <SafeAreaView style={[styles.container, dark && {backgroundColor:themes.dark.background}]}>
      <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      >
        <View style={styles.content}>
        <SubletterRequests requests={subletterRequests} textColor={dark? themes.dark.text:themes.light.text}/>
          <Text style={[styles.agreementTitle, dark && {color:themes.dark.text}]}>Active Agreements</Text>
          {subletterAgreements.length === 0 ? (
            <Text style={[styles.noRequests, dark && {color:themes.dark.text}]}>No active agreements</Text>
          ) : (
            subletterAgreements.map((agreement, index) => (
              <View style={styles.activeAgreementContainer} key={index}>
                <View style={styles.activeAgreementInfo}>
                  <Text style={[styles.address, dark && {color:themes.dark.text}]}>{agreement.address}</Text>
                  <Text style={styles.inputText}>Landlord ID: {agreement.landlordID}</Text>
                  <Text style={styles.inputText}>Duration: 01/07/2023 – 01/07/2024</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
      <CustomAlert/>
    </SafeAreaView>
  );
   }; 


    const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:"#fff"
    
    },
    content: {
      padding: 16,
    },
    title: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    address: {
      fontSize: 12,
      fontWeight: 'bold',
    },
    agreementTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      marginTop: 32,
    },
    activeAgreementContainer: {
      borderWidth: 1,
      borderColor: 'green',
      borderRadius: 8,
      marginTop: 16,
      padding: 16,
    },
    activeAgreementInfo: {
      marginBottom: 16,
    },
    activeAgreementDetails: {
      marginBottom: 16,
    },
    inputText:{
      fontSize:12,
      color: 'gray',
  
    },
    noRequests: {
      fontSize: 12,
      marginTop:8,
      marginStart:8
    },
  });

export default SubletAgreementScreen;
