import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { themes, sizes } from '../../constants/layout';
import { useSubletterContext } from '../../context/subletterContext';
import { useUserContext } from '../../context/userContext';
import { auth } from '../../firebase';


const SubletterProfile = () => {
    const {user} = useUserContext();
    const {subletterRequests, subletterAgreements, setSubletterRequests, setSubletterAgreements} = useSubletterContext();
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const UserProfile = require('../../assets/UserProfile.png');

    // get the subletters pending requests
    const fetchSubletRequests = async () => {
      try {
      const requests = user.requests;
      const pendingRequests = requests.filter((request: any) => request.status !== "agreed");
        setSubletterRequests(pendingRequests);
      } catch (error) {
        console.log('Error fetching sublet requests:', error);
        // showAlert("Error", "Error retrieving your requests, contact support if this error persist.")
      }
    };


    // get the  subletters active agrrements 
    const fetchActiveAgreements = async () => {
      try {
        const requests = user.requests;
      const activeAgreements = requests.filter((request: any) => request.status === "agreed");
        setSubletterAgreements(activeAgreements);
      } catch (error) {
        console.log('Error fetching active agreements:', error);
        // showAlert("Error", "Error retrieving your active agreements, contact support if this error persist.")

      }
    };

    // useEffect hook to set current user
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        setCurrentUser(user);
      });

      return () => unsubscribe(); // Unsubscribe when the component unmounts

    }, []);

    // useEffect hook to fetch pending requests and active agreements
    useEffect(() => {
      if(user){
      fetchSubletRequests();
      fetchActiveAgreements();
      setLoading(false)
      }
    }, [user]);

    return (
        <View style={styles.profileContainer}>
        {currentUser?.photoURL ? (
            // Render the current user's photo if UserProfile is available
            <Image source={{ uri: currentUser?.photoURL }} style={styles.profileImage} />
        ) : (
            // Render the UserProfile image if UserProfile is not available
            <Image source={UserProfile} style={[styles.profileImage,  { tintColor: themes.placeholder }]} />
        )}
        <View style={styles.profileInfoContainer}>
            <Text style={styles.profileName}>{user?.firstName} {user?.lastName}</Text>
            <Text style={styles.profileText}>Active Agreements: {subletterAgreements?.length || 0}</Text>
            <Text style={styles.profileText}>Pending Agreements: {subletterRequests?.length || 0}</Text>
        </View>
        </View>
    );
    };

const styles = StyleSheet.create({
    profileContainer: {
      padding:sizes.layout.small,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: sizes.layout.medium,
      borderRadius:sizes.layout.small,
      
    },
    profileImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginRight: sizes.layout.medium,
    },
    profileInfoContainer: {
      flex: 1,
    },
    profileName: {
      fontSize: sizes.font.small,
      fontFamily: 'monserrat-semibold',
      marginBottom: sizes.layout.xSmall,
    },
    profileText: {
        fontSize: sizes.font.small,
        fontFamily: 'monserrat-regular',
      },
  });
  
  
export default SubletterProfile;
