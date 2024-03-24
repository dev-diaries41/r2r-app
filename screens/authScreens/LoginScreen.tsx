import {StyleSheet, Text, View, ScrollView } from 'react-native';
import React, {  useState } from 'react'
import { useSettingsContext } from '../../context/settingsContext';
import { Button, Spacer, TextButton, InputField, createFlashMsg } from '../../components';
import { themes, sizes } from '../../constants/layout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../../firebase';
import { getFirestore, doc, getDoc, DocumentData } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useUserContext } from '../../context/userContext';

const LoginScreen = ({navigation}: any) => {
    const db = getFirestore();
    const {theme} = useSettingsContext();
    const {setUser} = useUserContext();
    const isDark = theme === "dark";
    const [loading, setLoading] = useState(false);
    const [userCred, setUserCred] = useState({
      email: '',
      password: '',
    })
    const [inputErrors, setInputErrors] = useState({
      email: '',
      password: '',
    });
    const {showMessage, FlashMessage} = createFlashMsg();
    
    const resetState = () => {
      setInputErrors({
        email: '',
        password: '',
      });
      setUserCred({
        email: '',
        password: '',
      });
    };

  const handleLoginError = (error: any) => {
    console.error('Error retrieving user role:', error);
  }

  const storeUser = async (userData: DocumentData, homeScreen: 'LandlordHome'| 'SubletterHome') => {
    setUser(userData);
    await AsyncStorage.setItem('user', JSON.stringify(userData));
    navigation.replace(homeScreen);
  };
  
  const handleLogin = async () => {
    // Handle the case where the user has not filled required fields
    if (!userCred.email || !userCred.password) {
      return handleInputError();
    }
  
    setLoading(true);
    try {
      const userCredentials = await signInWithEmailAndPassword(auth, userCred.email, userCred.password)
      const user = userCredentials.user;
  
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnapshot = await getDoc(userDocRef);
  
      if (!userDocSnapshot?.empty) {
        const userData = userDocSnapshot.data();
        resetState();
  
        switch (userData.role) {
          case 'Landlord':
            storeUser(userData, 'LandlordHome');
            break;
          case 'Subletter':
            storeUser(userData, 'SubletterHome');
            break;
          default:
            // Handle the case when the user role is unknown or not set
            console.error('Unknown user role.');
            break;
        }
      } else {
        console.error('User document does not exist.');
      }
    } catch (error) {
      handleLoginError(error)
    } finally {
      setLoading(false);
    }
  };
  
  
  //Function to navigate to the register screen
  const handleCreateAccount = () => {
    navigation.navigate('Create Account');
  };

  //Function to navigate to the forghot password screen
  const handleForgotPassword = () => {
    navigation.navigate('Forgot Password');
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
  
  const handleInputError = () => {
    setInputErrors({
      email: !userCred.email ? "Please enter a valid email address" : '',
      password: !userCred.password ? "Please enter a valid password" : '',
    });
  };


  return (
    <ScrollView
    contentContainerStyle={[styles.container, {backgroundColor:isDark? themes.dark.background : themes.light.background}]}      
    >
    <Text style={[styles.header, {color:isDark? themes.dark.text : themes.light.text}]}>Login</Text>
    <Spacer marginBottom={32}/>
      <View style={styles.inputContainer}>
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
          placeholder="Enter Password"
          color={isDark? themes.dark.text : themes.light.text }
          secureTextEntry={true}               
        /> 
       <Button
        text={'Login'}
        icon={'enter-outline'}
        width='100%'
        onPress={handleLogin}
        backgroundColor= {themes.light.primary}
        loading={loading}
       />
      </View>
      <Spacer/>
      <View style={styles.rowContainer}>
        <Text style={[styles.RegisterText, {color:isDark? themes.dark.text : themes.light.text}]}>Don't have an account?</Text>
        <TextButton
          onPress={handleCreateAccount}
          buttonText={'Create account'}
          color={themes.light.primary}
          margin={0}
        />
      </View>
      <Spacer/>
      <View style={styles.rowContainer}>
      <TextButton
          onPress={handleForgotPassword}
          buttonText={'Forgotten password?'}
          color={themes.light.primary}
          margin={0}
        />
      </View>
      <FlashMessage/>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: sizes.layout.medium
  },
  inputContainer: {
    width: '100%',
    backgroundColor:"transparent",
    gap:10
  },
  input: {
    backgroundColor: 'transparent',
    padding: sizes.layout.small,
    borderRadius: sizes.layout.medSmall,
    borderColor:themes.light.border,
    borderWidth:1,
    color: themes.light.text,
    fontFamily:'monserrat-regular'  
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  RegisterText: {
    marginRight: sizes.layout.xSmall,
    fontSize: sizes.font.medium,
    color: themes.light.text,
    fontFamily:'monserrat-regular',  
  },
  header:{
    fontSize :sizes.font.xLarge,
    color:themes.light.text,
    marginBottom:sizes.layout.medium,
    fontFamily:'monserrat-bold'  
  }
});

export default LoginScreen;


