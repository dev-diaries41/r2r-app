import { StyleSheet, Text, TextInput, View, SafeAreaView, Alert } from 'react-native';
import React, { useState } from 'react'
import { themes, sizes } from '../../constants/layout';
import { useSettingsContext } from '../../context/settingsContext';
import { Button, Spacer, TextButton } from '../../components';
import { auth } from '../../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

const ForgotPassword = ({navigation}: any) => {
  const { theme} = useSettingsContext();
  const isDark = theme === "dark";  
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = () => {
    navigation.navigate('Login');
  };
  
  //Function to submit request to reset password
   const handleSubmitReset = async () => {
    setLoading(true)
    try{
      await sendPasswordResetEmail(auth, email);
      setLoading(false)
      Alert.alert("Password Reset Email Sent", `Follow the instructions sent to ${email} to reset your password.`);
    }
    catch(error){
      console.log("Error reseting password" ,error.message);
      if(error.message.includes("auth/user-not-found")){
        Alert.alert("Invalid Email", "The email address you entered was invalid, please check your email and try again.");
      }
      else{
        Alert.alert("Error Resetting Password", "An error occured whilst trying to reset your password, please try again.");
      }
    }
  
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor:isDark? themes.dark.background : themes.light.background}]}      
    >
    <Text style={[styles.HeaderText, {color:isDark? themes.dark.text : themes.light.text}]}>Forgot Password</Text>
      <Spacer/>
      <View style={styles.inputContainer}>
      <TextInput
        placeholder="Enter email"
        value={email}
        onChangeText={text => setEmail(text.trim())}
        style={[styles.input, {color:isDark? themes.dark.text : themes.light.text}]}        
        placeholderTextColor= {themes.placeholder}
        autoCapitalize='none'
      />
       <Button
        text={'Reset Password'}
        width='100%'
        onPress={handleSubmitReset}
        backgroundColor= {themes.light.primary}
        loading={loading}
       />
      </View>

     
      <View style={styles.ForgotContainer}>
        <Text style={[styles.LoginText, {color:isDark? themes.dark.text : themes.light.text}]}>Already have an account?</Text>
        <TextButton
          onPress={handleLogin}
          buttonText={'Login'}
          color={themes.light.primary}
          margin={0}
        />
    </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal:16

  },
  inputContainer: {
    width: '100%',
    backgroundColor:"transparent",
    gap:10
  },
  input: {
    backgroundColor: 'transparent',
    padding:sizes.layout.small,
    borderRadius: sizes.layout.medSmall,
    borderColor:themes.light.border,
    borderWidth:1,
    color:themes.dark.text,
    fontFamily:'monserrat-regular'  

  },

  ForgotContainer: {
    flexDirection: 'row',
    marginTop: sizes.layout.medium,
    alignItems: 'center',
  },
  LoginText: {
    marginRight: sizes.layout.xSmall,
    fontSize: sizes.font.medium,
    color: themes.light.text,
    fontFamily:'monserrat-regular'  
  },
  HeaderText:{
    fontSize :sizes.font.xLarge,
    color: themes.light.text,
    marginBottom:sizes.layout.medium,
    fontFamily: 'monserrat-bold'
  }
  
});

export default ForgotPassword;
