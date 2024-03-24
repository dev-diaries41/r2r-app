import { Text, StyleSheet, SafeAreaView } from 'react-native';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { themes, sizes } from '../../constants/layout';
import { useSettingsContext } from '../../context/settingsContext';
import { Button, Spacer } from '../../components';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import { useUserContext } from '../../context/userContext';

const SignOutScreen = ({navigation}: any) => {
  const {theme} = useSettingsContext();
  const {setUser} = useUserContext()
  const dark = theme === "dark";


  const handleSignOut = async () => {
    try{
      await signOut(auth);
      await AsyncStorage.removeItem('loggedIn');
      await AsyncStorage.removeItem('user');
      navigation.replace("Login");
      setUser(null);

    }catch(error){
      console.log(error.message);
    }
  };

  return (
    <SafeAreaView style={[styles.container,{backgroundColor:dark? themes.dark.background : themes.light.background}]}>
      <Text style={[styles.confimQuestionText, {color:dark? themes.dark.text : themes.light.text}]} >Are you sure you want to sign out?</Text>
      <Spacer/>
      <Button
        text={'SIgn Out'}
        icon={'exit-outline'}
        width='100%'
        onPress={handleSignOut}
        backgroundColor={themes.light.primary}
       />
    </SafeAreaView>
  );
};

export default SignOutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal:16
  },

  confimQuestionText:{
    color:themes.dark.text,
    fontFamily:'monserrat-regular',
    fontSize: sizes.font.medium,
  }
});
