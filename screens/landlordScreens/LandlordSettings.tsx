import { Text, View, SafeAreaView, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import createCustomAlert from '../../components/CustomCallableAlert';
import DialogueDoubleAlert from '../../components/DialogueDoubleAlert_ios';
import DialogueAlert from '../../components/DialogueAlert_ios';
import { auth } from '../../firebase';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential, updateProfile } from 'firebase/auth';
import {getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';
import { themes, sizes } from '../../constants/layout';
import { useUserContext } from '../../context/userContext';
import { useSettingsContext } from '../../context/settingsContext';
import { SettingsCard } from '../../components';
import * as SystemUI from 'expo-system-ui';
import { saveSettings } from '../../lib/storage';




const LandlordSettings = ({navigation}) => {
  const {user} = useUserContext();
  const {theme, setTheme} = useSettingsContext();
   const DARK_THEME = 'dark';
   const LIGHT_THEME = 'light';
   const dark = theme === DARK_THEME;
  const {showAlert, CustomAlert} = createCustomAlert();
  const currentUser = auth.currentUser;
  
  const [visible, setVisible] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const UserProfile = require('../../assets/UserProfile.png');


  const chooseTheme = async(theme: string) => {
    try {
      setTheme(theme);
      await saveSettings({theme})
      SystemUI.setBackgroundColorAsync(dark? themes.dark.background : themes.light.background )
    } 
    catch(error: any){
      console.error("Choosing theme:", error.message)
    }
  }

  const toggleTheme = () => {
    if(dark){
      chooseTheme(LIGHT_THEME)
    }else{
      chooseTheme(DARK_THEME)
    }
  }


  // Function to change password
  const handleChangePassword = async (newPassword, confirmNewPassword) => {
    const validPass = newPassword === confirmNewPassword;
    try {
      if (validPass){
        await updatePassword(currentUser, newPassword)
        showAlert("Password Updated", "Your password was succeessfully changed.")
      }
      else{
        showAlert("Invalid Password", "The passwords you entered do not match.")
      }
  }
  catch(error){
    console.log("An error occured updating the user's password:", error.message)
  }
}

  // Function to auth user before changing password by entering current password 
  const reauthenticate = async (currentPassword)=>{
    try {
      const credentials = EmailAuthProvider.credential( currentUser.email, currentPassword); 
      await reauthenticateWithCredential(currentUser, credentials )
      setChangingPassword(true)
    }
    catch(error) {
      console.log("An error occured authenticating the user's password:", error.message)
    }
  }


   //Function to choose a profile photo
   const chooseProfilePhoto = async () => {
    try {
      const imagePickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
  
      if (!imagePickerResult.canceled) {
        const {uri} = imagePickerResult.assets[0];
        const fileName = `IMG_${Date.now()}`;
        const storage = getStorage()
        const imgref = ref(storage, fileName)
        const img = await fetch(uri)
        const bytes = await img.blob();
        await uploadBytes(imgref, bytes);
        const downloadURL = await getDownloadURL(imgref);
        await updateProfile(currentUser, {photoURL:downloadURL});
        console.log("Profile photo updated.")
      }
    } 
    catch (error) {
      console.log('Error choosing profile photo:', error);
      showAlert("Error Uploading Image", "An error occured uploading your image, contact support if this error persist.")
    }  
  };

    //Function to navigate to update setting screen for email
    const handleUpdateSettings = () => {
      navigation.navigate("Update Settings", {email:"e.g JohnDoe123@gmail.com"});
    }
  
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: dark? themes.dark.background : themes.light.background}}>
      {/* {Update profile image} */}
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.imageContainer}>
        {currentUser.photoURL ? (
        // Render the current user's photo if UserProfile is available
            <Image source={{ uri: currentUser.photoURL }} style={styles.profileImage} />
          ) : (
            // Render the UserProfile image if UserProfile is not available
            <Image source={UserProfile} style={[styles.profileImage, dark && {tintColor:themes.placeholder}]} />
          )}          
          <TouchableOpacity style={styles.editPhotoButton} onPress={chooseProfilePhoto}>
            <Ionicons name = "md-camera" size ={24}/>
          </TouchableOpacity>
          <Text style={[styles.name, dark && {color:themes.dark.text}]}>{user.firstName} {user.lastName}</Text>
        </View>
        <View
          style={[styles.settingsContainer, {backgroundColor: dark? themes.dark.card : themes.light.card}]}
          >           
          <SettingsCard
            onPress={handleUpdateSettings}            
            dark={dark}
            settingDescription={'+447829384930'}
            settingTitle={'Mobile Number'}
          /> 
        <SettingsCard
            onPress={handleUpdateSettings}            
            dark={dark}
            settingDescription={currentUser.email}
            settingTitle={'Email'}
          /> 
        <SettingsCard
            onPress={handleUpdateSettings}            
            dark={dark}
            settingDescription={'42 Finchley Road, London, NW2 7HA'}
            settingTitle={'Address'}
          />  
        <SettingsCard
            onPress={()=>setVisible(true)}            
            dark={dark}
            settingDescription={'Update your account password'}
            settingTitle={'Change Password'}
          />  
        <SettingsCard
            onPress={toggleTheme}
            dark={dark}
            settingDescription={'Toggle between light and dark theme. The default is dark.'}
            settingTitle={'Dark Theme'}
            value={dark}
            isSwitch={true}
          />
        </View>
      </ScrollView>
      <CustomAlert/>
      <DialogueAlert 
      visible={visible}
      onClose = {()=>setVisible(false)}
      onConfirm = {reauthenticate}
      title = "Enter Current Password"
      description ="For security, please enter your current password."
      backgroundColor = {themes.dark.card}
      isSecure ={true}
      placeholder = "Enter password"
      />


      <DialogueDoubleAlert
       visible={changingPassword}
       onClose = {()=>setChangingPassword(false)}
       onConfirm = {handleChangePassword}
       title = "Enter New Password"
       description ="Enter and confirm your new password."
       backgroundColor = {themes.dark.card}
       isSecure ={true}
       placeholder = "Enter password"
       />
    </SafeAreaView>
  );
};


 const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: sizes.layout.medium,
  },
  imageContainer: {
    flexDirection:"column",
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 60,
  },
  name: {
    color: '#000',
    fontSize: sizes.font.medium,
    textAlign:"center",
    fontFamily:'monserrat-bold'
  },
  settingsContainer: {
    borderColor: '#E4E4E4',
    backgroundColor: '#f1f1f1',
    borderRadius: sizes.layout.medium,
    width:"100%",
    marginTop: sizes.layout.medium,
  },

  settingsRow: {
    flexDirection: 'row',
    justifyContent:"space-between",
    alignItems: 'center',
    height:40,
    paddingHorizontal: sizes.layout.medium,
    
  },

  settingTitle:{
    fontSize:sizes.font.small,
    paddingHorizontal:sizes.layout.medium,
    paddingTop:sizes.layout.small,
  },

  settingValue:{
    fontSize:sizes.font.medium,
    fontFamily: 'monserrat-bold'
  },

  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E4',
    marginHorizontal: 10,
  },

  singleSettingTitle:{
    fontSize:sizes.font.medium,
    fontFamily: 'monserrat-bold',
    paddingStart:sizes.layout.medium,
    paddingTop:sizes.layout.small,

  },

  editPhotoButton: {
    opacity:0.7,
    position: 'absolute', // Position the button on top of the profile image
    borderRadius: 40, // Use the same borderRadius as the profileImage
    paddingHorizontal: sizes.layout.medium,
    top: '50%', // Position the button halfway from the top of the image
    transform: [{ translateX: 0 }, { translateY: -20 }], // Center the button by offsetting its position
    alignSelf:"center",
    justifyContent:"center"
  },
  contentContainer: {
    flexDirection:"column",
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%'
  },
 
});
export default LandlordSettings;


