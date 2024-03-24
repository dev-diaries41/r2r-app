import {StyleSheet, SafeAreaView, Text, View, ScrollView, Platform, Alert } from 'react-native';
import React, { useEffect, useRef, useState} from 'react'
import { useSettingsContext } from '../../context/settingsContext';
import { Button, Spacer, TextWithIconButton } from '../../components';
import { themes, sizes } from '../../constants/layout';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { auth } from '../../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserContext } from '../../context/userContext';

const SELECT_ROLE_MESSAGE = "Select the appropriate role. If you wish to list properties to let, select 'Landlord'. If you wsh to sublet properties from Landlords select 'Subletter'"
const Circle = ({ filled }) => {
    return <View style={[styles.circle, filled && styles.filledCircle]} />;
  };

const CompleteAccountScreen = ({route, navigation}: any) => {
  const db = getFirestore();
  const {theme} = useSettingsContext();
  const {setUser} = useUserContext();
  const {userCred} = route?.params;
  const [role, setRole] = useState(null)
  const isDark = theme === "dark";
  
  
  const [loading, setLoading] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState("");
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();



 //Notification handler config
 Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

//Function to register for push notifications
const registerForPushNotificationsAsync = async () => {
  let token: any;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
    //   Alert.alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
};


//useEffect hook to prompt user to register for push notifications
useEffect(() => {
  registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

  notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
    setNotification(notification);
  });

  responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
  });

  return () => {
    Notifications.removeNotificationSubscription(notificationListener.current);
    Notifications.removeNotificationSubscription(responseListener.current);
  };
}, []);


//useEffect hook to navigate to relevant screen upon successful registration
useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged(user => {
    if (user) {
      if (registrationStatus === 'Registration Successful') {
        const navigateToHomeScreen = async () => {
          try {
            const userRole = await AsyncStorage.getItem("userRole");
            console.log(userRole);
              if (userRole === 'Landlord') {
                navigation.replace('LandlordHome');
              } else if (userRole === 'Subletter') {
                navigation.replace('SubletterHome');
              }
          } 
          catch (error) {
            console.log('Error retrieving user role:', error);
          }
        };
        setTimeout(navigateToHomeScreen, 1000);
      }
    }
  });  
  return unsubscribe;
}, [registrationStatus]);

const handleAccountCreationError = (error:any) => {
    console.log(error)
    if(error.message.includes("auth/email-already-in-use")){
      Alert.alert("Existing Account", "An account for the email address entered already exists, if you are the owner please login.");
    }
    else if(error.message.includes("auth/weak-password")){
      Alert.alert("Weak Password", "Password should be at least 6 characters.");
    }
    else{
      Alert.alert("Sign Up Error", "An error occured whilst signing up, please try again.");
    }       
    setRegistrationStatus('');
}

// Function to handle user sign up
const handleCreateAccount = async () => {
  if(!userCred.firstName || !userCred.lastName || !userCred.email || !userCred.password || !userCred.confirmPassword || userCred.password !== userCred.confirmPassword){
  throw new Error('Invalid User')
}
  setLoading(true);

  try {
    const userCredentials = await createUserWithEmailAndPassword(auth, userCred.email, userCred.password);
    const user = userCredentials.user;
    
    // Save user to the relevant collection based on their role
    if (role === 'Landlord') {
      const userDataWithNotifications = {
        uid: user.uid,
        firstName: userCred.firstName,
        lastName: userCred.lastName,
        email: user.email,
        role: 'Landlord', // Store the role in the user document
        listings:[],
        notificationToken:expoPushToken
      }
      const userDataWithoutNotification = {
        uid: user.uid,
        firstName: userCred.firstName,
        lastName: userCred.lastName,
        email: user.email,
        listings:[],
        role: 'Landlord', // Store the role in the user document
      }
      setUser(expoPushToken? userDataWithNotifications:userDataWithoutNotification);
      await setDoc(doc(db, 'users', user.uid),  expoPushToken? userDataWithNotifications:userDataWithoutNotification)           
      
      AsyncStorage.setItem('savedUser', JSON.stringify(userDataWithoutNotification));
    } else if (role === 'Subletter') {
      const userDataWithNotifications = {
        uid: user.uid,
        firstName: userCred.firstName,
        lastName: userCred.lastName,
        email: user.email,
        role: 'Subletter', // Store the role in the user document
        requests:[],
        notificationToken:expoPushToken
      }
      const userDataWithoutNotification = {
        uid: user.uid,
        firstName: userCred.firstName,
        lastName: userCred.lastName,
        email: user.email,
        role: 'Subletter', // Store the role in the user document
        requests:[],
      }
      setUser(expoPushToken? userDataWithNotifications:userDataWithoutNotification);
      await setDoc(doc(db, 'users', user.uid),  expoPushToken? userDataWithNotifications:userDataWithoutNotification)            
      await AsyncStorage.setItem('savedSubletterUser', JSON.stringify(userDataWithoutNotification));
    }
    // Save user role to AsyncStorage
    await AsyncStorage.setItem('userRole', role);
    console.log(`${userCred.firstName} ${userCred.lastName} successfully registered with email:`, user.email);
    setRegistrationStatus('Registration Successful');
  } 
  catch (error) {
   handleAccountCreationError(error)
  } 
  finally {
    setLoading(false);
  }
};
   

  return (
    <SafeAreaView style={{flex:1}}>
      <ScrollView
        contentContainerStyle={[styles.container,{backgroundColor:isDark? themes.dark.background : themes.light.background}]}      
      >
      <Text style={[styles.HeaderText, {color:isDark? themes.dark.text : themes.light.text}]}>Select Role</Text>
      <Text style={[styles.label, {color:isDark? themes.dark.text : themes.light.text}]}>{SELECT_ROLE_MESSAGE}</Text>
      <Spacer marginBottom={32}/>
      <View style={styles.inputContainer}>
        <View style={styles.roles}>
            <View style={styles.row}>
                <TextWithIconButton
                onPress={()=> setRole('Landlord')}
                buttonText='Landlord'
                icon={'home'}
                fontSize={sizes.font.large}
                color={themes.colors.green}
                />
                <Circle filled={role === 'Landlord'} />
            </View>
            <View style={styles.row}>
                <TextWithIconButton
                onPress={()=> setRole('Subletter')}
                buttonText='Subletter'
                icon={'person'}
                fontSize={sizes.font.large}
                color={themes.colors.red}
                />
                 <Circle filled={role === 'Subletter'} />
            </View>
            <Spacer/>
        </View>
        <Button
          text={'Create Account'}
          icon={'person-outline'}
          width='100%'
          onPress={handleCreateAccount}
          backgroundColor= {themes.light.primary}
          loading={loading}
        />
      </View>
      </ScrollView>
    </SafeAreaView>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  inputContainer: {
    width: '100%',
    gap:sizes.layout.small
  },
  HeaderText:{
    fontSize :sizes.font.xLarge,
    color:"#000",
    marginBottom:sizes.layout.medium,
    fontWeight:"bold"
  },
  label: {
    fontSize: sizes.font.medium,
    color: themes.dark.text,
    fontFamily:'monserrat-regular'  
  },
  roles:{
    flexDirection:'column',
    gap:sizes.layout.small,
    justifyContent:'center',
    // alignItems:'center'
  },
  row:{
    flexDirection:'row',
    justifyContent: 'space-between',
    alignItems:'center'
  },
  circle: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    borderWidth: 1,
    marginHorizontal: 10,
  },
  filledCircle: {
    backgroundColor: themes.colors.darkBlue,
    borderColor: themes.dark.text,
  },

});


export default CompleteAccountScreen;
