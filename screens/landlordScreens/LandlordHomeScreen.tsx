import { SafeAreaView, StyleSheet, TouchableOpacity, Image, StatusBar } from 'react-native';
import React, { useContext, useEffect } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import SignOutScreen from '../../screens/authScreens/SignOut';
import LandlordSettings from './LandlordSettings';
import PropertyManagementScreen from './PropertyManagementScreen';
import SubletScreen from './SubletScreen';
import LandlordOverviewScreen from './LandlordOverviewScreen';
import Messaging from '../../screens/Messaging';
import Inbox from '../../screens/Inbox';
import EditListing from './EditListing';
import { themes, sizes } from '../../constants/layout';
import { useUserContext } from '../../context/userContext';
import { useSettingsContext } from '../../context/settingsContext';
import { Ionicons } from '@expo/vector-icons';

const Drawer = createDrawerNavigator();

const LandlordHomeScreen = ({route, navigation}) => { // Changed the component name to MainHomeScreen

  //Screen constants
  const {user, setUser} = useUserContext();
  const {theme} = useSettingsContext();
  const {userData} = route?.params;
  const dark = theme === "dark" ; //dark theme

  //useEffect hook to set user
  useEffect(()=>{
      if(!user){
      setUser(userData)
      }
  }, [userData])


  // Fucntion to navigate to inbox screen
  const handleInboxClick = () => {
    navigation.navigate('Inbox');
  };


return (
  <SafeAreaView style={styles.container}>
    <StatusBar backgroundColor="transparent" barStyle={dark? "light-content":"dark-content"} translucent />
    <Drawer.Navigator initialRouteName="LandLord Overview" backBehavior="history" screenOptions={{headerRight: () => (
      <TouchableOpacity onPress={handleInboxClick} style={{marginEnd:16}}>
        <Ionicons name='mail' size={24} color={dark? themes.dark.icon:themes.light.icon}/>
      </TouchableOpacity>
    ), headerStyle: {
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
  <Drawer.Screen name="LandLord Overview" component={LandlordOverviewScreen}  options={{ headerTitleStyle: {fontSize: 16,fontWeight : "bold"}}} />                 
  <Drawer.Screen name="Property Management" component={PropertyManagementScreen}  options={{ headerTitleStyle: {fontSize: 16,fontWeight : "bold"}}} />          
  <Drawer.Screen name="Sublet Screen" component={SubletScreen}  options={{ headerTitleStyle: {fontSize: 16,fontWeight : "bold"}}} />
  <Drawer.Screen name="Landlord Settings" component={LandlordSettings}  options={{ headerTitleStyle: {fontSize: 16,fontWeight : "bold"}}} />
  <Drawer.Screen name="Inbox" component={Inbox}  options={{ headerTitleStyle: {fontSize: 16,fontWeight : "bold"}}} />
  <Drawer.Screen name="Sign Out" component={SignOutScreen} options={{ headerTitle: "" }}/>
  <Drawer.Screen name="Messaging" component={Messaging}   options={{
drawerItemStyle: { height: 0 },headerTitle: "Chat"  
}} />
<Drawer.Screen name="Edit" component={EditListing}   options={{
    drawerItemStyle: { height: 0 },headerTitle: ""  
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

export default LandlordHomeScreen;