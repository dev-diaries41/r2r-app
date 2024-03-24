import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, FlatList, ActivityIndicator, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { getFirestore, collection, query, where, onSnapshot } from 'firebase/firestore';
import createCustomAlert from '../../components/CustomCallableAlert';
import { auth } from '../../firebase';
import { useLandlordContext } from '../../context/landlordContext';
import { useSettingsContext } from '../../context/settingsContext';
import { useUserContext } from '../../context/userContext';
import { themes, sizes } from '../../constants/layout';
import { Button, LandlordPorfileCard, ListingCard } from '../../components';
import { chartData, expectedMonthlyIncome, actualMonthlyIncome } from '../../constants/placeholders';


const LandlordOverviewScreen = ({navigation,}) => {

  //Screen constants
  const {landlordRequests, setLandlordRequests, landlordAgreements, setLandlordAgreements} = useLandlordContext();
  const {user} = useUserContext();
  const {theme} = useSettingsContext();
  const { showAlert, CustomAlert } = createCustomAlert();
  const db = getFirestore();
  const dark = theme === "dark"; //dark theme
  const UserProfile = require('../../assets/UserProfile.png');

  //State variables
  const [currentListings, setCurrentListings] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  
  //useEffect hook to set currentUser state variable
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe(); // Unsubscribe when the component unmounts
  }, []);


  // Function to fetch current listings for the Landlord
  const fetchCurrentListings = async () => {
    try {
      const userListings = user.listings?  user.listings : [];
      const listings = userListings?.map((listing, index) => ({
        id: index,
        propertyImage: listing.images[0],
        location: `${listing.address}, ${listing.postcode}`,
        propertyType: listing.type,
        listingPrice: listing.listingPrice,
      }));
      setCurrentListings(listings);
    } 
    catch (error) {
      console.log('Error fetching properties:', error);
      showAlert("Error", "Error retrieving your listings, contact support if this error persist.")
    }
  };

  //useEffect hook to fetch pending requests and active agreements
  useEffect(() => {
    if (user) {
      fetchSubletRequests();
      fetchActiveAgreements();
    }
  }, [user]);


  //useEffect hook to fetch current listings
  useEffect(() => {
    if (user) {
      fetchCurrentListings();
    }
  }, [user]);


 //Function to get the requests made to the landlords listed properties
 const fetchSubletRequests = async () => {
  try {
    const requestsCollectionRef = collection(db, 'requests');
    const pendingAgreementsQuery = query(
      requestsCollectionRef,
      where('landlordID', '==', user.uid),
      where('status', '==', 'pending')
    );

    // Use onSnapshot for real-time updates
    const unsubscribe = onSnapshot(pendingAgreementsQuery, (querySnapshot) => {
      const pendingRequests = querySnapshot.docs.map((doc) => doc.data());
      setLandlordAgreements(pendingRequests);
    });

    // Save the unsubscribe function to detach the listener when needed
    return unsubscribe;
  } catch (error) {
    console.log('Error fetching sublet requests:', error);
    showAlert("Error", "Error retrieving your requests, contact support if this error persist.")

  }
};


//Function to get the Landlords active agreements
const fetchActiveAgreements = async () => {
  try {
    const requestsCollectionRef = collection(db, 'requests');
    const activeAgreementsQuery = query(
      requestsCollectionRef,
      where('landlordID', '==', user.uid),
      where('status', '==', 'agreed')
    );

    // Use onSnapshot for real-time updates
    const unsubscribe = onSnapshot(activeAgreementsQuery, (querySnapshot) => {
      const agreements = querySnapshot.docs.map((doc) => doc.data());
      setLandlordAgreements(agreements);
    });

    // Save the unsubscribe function to detach the listener when needed
    return unsubscribe;
  } catch (error) {
    console.log('Error fetching active agreements:', error);
    showAlert("Error", "Error retrieving your active agreements, contact support if this error persists.")
  }
};

  //Component to render the Landlrods current listings
  const renderListing = ({ item }) => {
    return (
      <ListingCard item={item} textColor={dark? themes.dark.text:themes.light.text}/>
    );
  };

  // Config options for chart displaying Landlord income
  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#e4e4e4',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 1,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  //Function to navigate to the property management screen where the Landlord can create and manage listings
  const handleNewListing = () => {
    navigation.navigate('Property Management');
  };


  return (
    <SafeAreaView style={[styles.container, dark && {backgroundColor:themes.dark.background}]}>
      {user && currentUser? (
        <ScrollView>
          <View style={styles.contentContainer}>
            {/* Profile container */}
            <LandlordPorfileCard
            currentUser={currentUser}
            user={user}
            landlordAgreements={landlordAgreements}
            landlordRequests={landlordRequests}
            />
            <Button
              onPress={handleNewListing}
              text='New Listing'
              backgroundColor={themes.colors.darkBlue}
            />

            {/* Current Listings */}
            <Text style={[styles.title, dark && {color:themes.dark.text}]}>Current Listings</Text>
            <View>
            {(currentListings.length > 0) ? (
            <FlatList
              data={currentListings}
              keyExtractor={item => item.id.toString()}
              renderItem={renderListing}
              contentContainerStyle={styles.listingsContainer}
              horizontal
              // onLayout={()=>setLoading(false)}
            />
            ):(
              <Text style={[styles.noListings, dark && {color:themes.dark.text}]}>No Listings</Text>
              )}
            </View>
            {/* Income section */}
            <Text style={[styles.title, dark && {color:themes.dark.text}]}>Income</Text>
            <View >
              <Text style={[styles.incomeDetails, dark && {color:themes.dark.text}]}>Expected Monthly Income: £{expectedMonthlyIncome}</Text>
              {/* Line Chart */}
              <LineChart
                data={chartData}
                width={Dimensions.get("window").width -10}
                height={Dimensions.get("window").width -10}
                chartConfig={chartConfig}
                style={styles.chartContainer}
              />
            </View>
          </View>
        </ScrollView>
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
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
    fontFamily: 'monserrat-bold',
    marginBottom: sizes.layout.medium,
    marginTop: sizes.layout.medium,
  },
  incomeDetails: {
    fontSize: sizes.font.small,
    marginBottom: sizes.layout.xSmall,
  },
  chartContainer: {
    marginTop: sizes.layout.medium,
    borderRadius: sizes.layout.small,
    alignSelf:"center", 
  },
  listingsTitle: {
    fontSize: sizes.font.large,
    fontFamily: 'monserrat-bold',
    marginBottom:sizes.layout.medium,
  },
  listingsContainer: {
    padding: sizes.layout.medium,
  },
  noListings:{
    padding: sizes.layout.medium,
    textAlign:"center"
  }

});

export default LandlordOverviewScreen;
