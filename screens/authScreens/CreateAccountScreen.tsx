import {StyleSheet, SafeAreaView, Text, View, ScrollView } from 'react-native';
import React, {useState} from 'react'
import { useSettingsContext } from '../../context/settingsContext';
import { Button, Spacer, InputField } from '../../components';
import { themes, sizes } from '../../constants/layout';


const CreateAccountScreen = ({route, navigation}: any) => {
  const {theme} = useSettingsContext();
  const isDark = theme === "dark";
  const [userCred, setUserCred] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });
  const [inputErrors, setInputErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    passwordDoNotMatch: '',
    role: '',
  });
  

// Function to handle user sign up
const handleSelectRole = () => {
  if(!userCred.firstName || !userCred.lastName || !userCred.email || !userCred.password || !userCred.confirmPassword || userCred.password !== userCred.confirmPassword){
    return handleInputError();
  }
  navigation.navigate('Complete Account', {userCred})
};
   
  const handleFirstNameChange = (text: string) => {
    setUserCred((prevUser) => ({
      ...prevUser,
      firstName: text,
    }));
  };
  
  const handleLastNameChange = (text: string) => {
    setUserCred((prevUser) => ({
      ...prevUser,
      lastName: text,
    }));
  };
  
  const handleEmailChange = (text: string) => {
    setUserCred((prevUser) => ({
      ...prevUser,
      email: text,
    }));
  };
  
  const handlePasswordChange = (text: string) => {
    setUserCred((prevUser) => ({
      ...prevUser,
      password: text,
    }));
  };
  
  const handleConfirmPasswordChange = (text: string) => {
    setUserCred((prevUser) => ({
      ...prevUser,
      confirmPassword: text,
    }));
  };
  

  const handleInputError = () => {
    setInputErrors({
      firstName: !userCred.firstName ? "Please enter your first name" : '',
      lastName: !userCred.lastName ? "Please enter your last name" : '',
      email: !userCred.email ? "Please enter a valid email address" : '',
      password: !userCred.password ? "Please enter a valid password" : '',
      confirmPassword: !userCred.confirmPassword ? "Please confirm your password" : '',
      passwordDoNotMatch: userCred.password !== userCred.confirmPassword ? "This does not match your password" : '',
      role: !userCred.role? "Please select a role" : '',
    });
  };
  
  
  const resetState = () => {
    setInputErrors({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      passwordDoNotMatch: '',
      role: '',
    });
    setUserCred({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
    });
  };
  
  return (
    <SafeAreaView style={{flex:1}}>
      <ScrollView
        contentContainerStyle={[styles.container,{backgroundColor:isDark? themes.dark.background : themes.light.background}]}      
      >
      <Text style={[styles.HeaderText, {color:isDark? themes.dark.text : themes.light.text}]}>Create Account</Text>
      <Text style={[styles.label, {color:isDark? themes.dark.text : themes.light.text}]}>Enter your personal information</Text>
      <Spacer marginBottom={32}/>
      <View style={styles.inputContainer}>
        <InputField
          value={userCred.firstName}
          onChangeText={handleFirstNameChange}
          error={!!(!userCred.firstName && inputErrors.firstName)}
          errorText={inputErrors.firstName}
          placeholder="First Name"
          color={isDark? themes.dark.text : themes.light.text }                  
        />      
        <InputField
          value={userCred.lastName}
          onChangeText={handleLastNameChange}
          error={!!(!userCred.lastName && inputErrors.lastName)}
          errorText={inputErrors.lastName}
          placeholder="Last Name"
          color={isDark? themes.dark.text : themes.light.text }                  
        />    
        <InputField
          value={userCred.email}
          onChangeText={handleEmailChange}
          error={!!(!userCred.email && inputErrors.email)}
          errorText={inputErrors.email}
          placeholder="Email Address"
          color={isDark? themes.dark.text : themes.light.text }                  
        />    
        <InputField
          value={userCred.password}
          onChangeText={handlePasswordChange}
          error={!!(!userCred.password && inputErrors.password)}
          errorText={inputErrors.password}
          placeholder="Enter Password (Minimum 6 characters)"
          secureTextEntry={true}
          color={isDark? themes.dark.text : themes.light.text }                  
        />    
         <InputField
          value={userCred.confirmPassword}
          onChangeText={handleConfirmPasswordChange}
          error={!!(!userCred.confirmPassword && inputErrors.confirmPassword) || !!(userCred.confirmPassword && inputErrors.passwordDoNotMatch)}
          errorText={userCred.confirmPassword && inputErrors.passwordDoNotMatch? inputErrors.passwordDoNotMatch : inputErrors.confirmPassword}
          placeholder="Confirm Password"
          secureTextEntry={true} 
          color={isDark? themes.dark.text : themes.light.text }                         
        />    
        <Button
          text={'Next'}
          icon={'arrow-forward'}
          width='100%'
          onPress={handleSelectRole}
          backgroundColor= {themes.light.primary}
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
    fontSize: sizes.font.small,
    color: themes.dark.text,
    fontFamily:'monserrat-regular'  
  },
});


export default CreateAccountScreen;
