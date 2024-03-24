import {SafeAreaView, StyleSheet, TouchableOpacity, Image, StatusBar } from 'react-native';
import React, {useEffect } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import SignOutScreen from '../../screens/authScreens/SignOut';
import AvailablePropertiesScreen from './AvailablePropertiesScreen';
import SearchScreen from './SearchScreen';
import PropertyDetailScreen from './PropertyDetailScreen';
import SubletAgreementScreen from './SubletAgreementScreen';
import SubletterSettings from './SubletterSettings';
import Inbox from '../../screens/Inbox';
import Messaging from '../../screens/Messaging';
import { Ionicons } from '@expo/vector-icons';
import { useUserContext } from '../../context/userContext';
import { useSettingsContext } from '../../context/settingsContext';
import { themes, sizes } from '../../constants/layout';

const Drawer = createDrawerNavigator();

const SubletterHomeScreen = ({route, navigation}) => {

  //Screen constants 
  const {userData} = route?.params;
  const {user, setUser} = useUserContext();
  const {theme} = useSettingsContext();
  const dark = theme === "dark" ; //dark theme


  //useEffect hook to set user
  useEffect(()=>{
    if(!user){
    setUser(userData)
    }   
}, [userData])


 //Function to navigate to inbox
  const handleInboxClick = () => {
    navigation.navigate('Inbox');
  };

 
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="transparent" barStyle={dark? "light-content":"dark-content"} translucent />
      <Drawer.Navigator initialRouteName="Available Properties" backBehavior="history" screenOptions={{headerRight: () => (
      <TouchableOpacity onPress={handleInboxClick} style={{marginEnd:16}}>
        <Ionicons name='mail' size={24} color={dark? themes.dark.icon:themes.light.icon}/>
      </TouchableOpacity>
    ),
    headerStyle: {
      backgroundColor: dark? themes.dark.background : themes.light.background,
    },
    headerTintColor: dark? themes.dark.text : themes.light.text,
    drawerStyle: {
      backgroundColor: dark? themes.dark.background : themes.light.background,
    },
    drawerInactiveTintColor:themes.placeholder,
    headerShadowVisible:false
  }}
>      
        <Drawer.Screen name="Available Properties"  component={AvailablePropertiesScreen} options={{headerTitleStyle: {fontSize: 16,fontWeight : "bold"}, headerTitle:"Profile Overview"}} />          
        {/* <Drawer.Screen name="Property Search" component={SearchScreen} options={{headerTitleStyle: {fontSize: 16,fontWeight : "bold"}}} /> */}
        <Drawer.Screen name="Sublet Agreement"  component={SubletAgreementScreen} options={{headerTitleStyle: {fontSize: 16,fontWeight : "bold"}}} />
        <Drawer.Screen name="Subletter Settings" component={SubletterSettings} options={{headerTitleStyle: {fontSize: 16,fontWeight : "bold"}}}/>
        <Drawer.Screen name="Inbox" component={Inbox}  options={{ headerTitleStyle: {fontSize: 16,fontWeight : "bold"}}} />
        <Drawer.Screen name="Sign Out" component={SignOutScreen} options={{ headerTitle: "" }}/>
        <Drawer.Screen name="Property Details" component={PropertyDetailScreen} options={{
    drawerItemStyle: { height: 0 },headerTitleStyle: {fontSize: 16,fontWeight : "bold"}  // hide the Property details screen in the drawer menu
  }} />
  <Drawer.Screen name="Messaging" component={Messaging}   options={{
    drawerItemStyle: { height: 0 }, headerTitle: "Chat"  
}} />
      </Drawer.Navigator>
    </SafeAreaView>
  );
};




const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
});

export default SubletterHomeScreen; // Changed the default export name
