import { SafeAreaView, StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SystemUI from 'expo-system-ui';
import { updateEmail,  reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';
import { auth } from '../firebase';
import DialogueAlert from '../components/DialogueAlert_ios';
import createCustomAlert from '../components/CustomCallableAlert';
import { themes, sizes } from '../constants/layout';
import { useSettingsContext } from '../context/settingsContext';
import { useUserContext } from '../context/userContext';

const UpdateSettingsScreen = ({ route, navigation }) => {

  const placeholder = route.params?.email;
  const changingTheme = route.params?.changingTheme;
  const {user} = useUserContext();
  const { theme, setTheme} = useSettingsContext();
  const currentUser = auth.currentUser;
  const light = theme === "light"; //light theme
  const dark = theme === "dark"; //dark theme
  const {showAlert, CustomAlert} = createCustomAlert();


  const [email, setEmail] = useState("");
  const [visible, setVisible] = useState(false);


  // useEffect hook to set the header background color and tint color when the component mounts
useEffect(()=>{
  navigation.setOptions({
    headerStyle: { backgroundColor: dark? themes.dark.background : themes.light.background },
    headerTitleStyle: { color: dark? themes.dark.text : themes.light.text},
    headerTintColor: dark? themes.dark.text : themes.light.text,
  });
}, [dark] )


// Function to change to toggle between light and dark theme
  const chooseTheme = async (theme) => {
    setTheme(theme);
    try {
      const darkTheme = theme === "dark"; //dark theme
      SystemUI.setBackgroundColorAsync(darkTheme? themes.dark.background : themes.light.background )
      navigation.setOptions({
        headerStyle: { backgroundColor: darkTheme? themes.dark.background : themes.light.background },
        headerTitleStyle: { color: darkTheme? themes.dark.text : themes.light.text},
        headerTintColor: darkTheme? themes.dark.text : themes.light.text,
      });
      await AsyncStorage.setItem("theme", theme);
    } 
    catch(error){
      console.log("Error storing theme setting:", error.message)
    }
  }


  // Function to change email
  const changeEmail = async (currentPassword) => {

    const credentials = EmailAuthProvider.credential( currentUser.email, currentPassword); 
    await reauthenticateWithCredential(currentUser, credentials )
    try{
      await updateEmail(auth.currentUser, email)
      showAlert("Email Updated", "Your email address was successfully updated.")
      setEmail("");
    console.log("updated email", currentUser.email)
    }
    catch(error){
      console.log("An error occured updating the user's email:", error.message)
    }
  }


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={[styles.container, dark && {backgroundColor:themes.dark.background}]}>
      {placeholder && (
        <View style={[styles.settingsContainer, dark && {backgroundColor:themes.dark.card}]}>
        <View style={{ flexDirection: "column" }}>
            <Text style={[styles.singleSettingTitle, dark && {color:themes.dark.text}]}>New Email Address</Text>
            <View style={styles.settingsRow}>
              <TextInput
                style={[styles.input, dark && {color:themes.dark.text}]}
                placeholder={placeholder}
                placeholderTextColor={themes.placeholder}
                value={email}
                onChangeText={text => setEmail(text.trim())}
              />
            </View>
          </View>
        </View>
          )}

      {/* {Render theme settings} */}
      {changingTheme && (
        <View style={[styles.settingsContainer, dark && {backgroundColor:themes.dark.card}]}>

          <TouchableOpacity style={styles.themeRow} onPress = {()=>{chooseTheme("light")}}>
          <View style={[styles.circle, light && {backgroundColor:"#0782F9"}]}/>
            <Text style={[ dark && {color:themes.dark.text}]}>Light Mode</Text>
          </TouchableOpacity>
          <View style={[styles.divider, dark && {borderBottomColor:themes.dark.border}]} />

        
         <TouchableOpacity style={[styles.themeRow]} onPress = {()=>{chooseTheme("dark")}}>
         <View style={[styles.circle, dark && {backgroundColor:"#0782F9"}]}/>
         <Text style={[ dark && {color:themes.dark.text}]}>Dark Mode</Text>
          </TouchableOpacity>
    </View>

      )}
       {/* Save button */}
        {!changingTheme &&  (
        <TouchableOpacity style={styles.saveButton} onPress ={()=>setVisible(true)} disabled={!email}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
        )}

      </View>
      <DialogueAlert 
      visible={visible}
      onClose = {()=>setVisible(false)}
      onConfirm = {changeEmail}
      title = "Changing Email"
      description ="For security, please enter your password to change your email."
      backgroundColor = {themes.dark.card}
      isSecure ={true}
      placeholder = "Enter password"
      />


    <CustomAlert/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between', // Aligns content with space between (puts "Save" button at the bottom)
    alignItems: 'center',
    padding: 16,
    backgroundColor:"#fff"
  },
  settingsContainer: {
    backgroundColor: '#f1f1f1',
    borderRadius: 20,
    width: "100%",
    marginTop: 16
  },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: 'center',
    height: 40,
    paddingHorizontal: 16,
  },

  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    paddingHorizontal: 16,
  },
 

  singleSettingTitle: {
    fontSize: 12,
    fontWeight: "bold",
    paddingStart: 16,
    paddingTop: 8,
    marginBottom:8
  },
  input: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderColor: '#555',
    padding: 8,
    width: "100%",
    paddingVertical:4
  },
  saveButton: {
    backgroundColor: "#0782F9",
    padding: 16,
    width: "100%",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 16,
  },
  saveButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E4',
    marginHorizontal: 10,
  },

  circle: {
    width: 18,
    height: 18,
    borderRadius: 9, // Half of the width and height to create a circle
    backgroundColor: '#fff', // You can set any color you want
    borderWidth:1,
    borderColor:"#333",
    marginRight: 16
  },
 
  
});

export default UpdateSettingsScreen;
