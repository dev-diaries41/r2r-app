import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/authScreens/LoginScreen';
import CreateAccountScreen from './screens/authScreens/CreateAccountScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LandlordHomeScreen from './screens/landlordScreens/LandlordHomeScreen';
import SubletterHomeScreen from './screens/subletterScreens/SubletterHomeScreen';
import ForgotPassword from './screens/authScreens/ForgotPassword';
import UpdateSettingsScreen from './screens/UpdateSettingsScreen';
import * as SystemUI from 'expo-system-ui';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { CardStyleInterpolators } from '@react-navigation/stack';
import { UserProvider } from './context/userContext';
import { LandlordProvider } from './context/landlordContext';
import { SubletterProvider } from './context/subletterContext';
import { SettingsProvider } from './context/settingsContext';
import { SearchProvider } from './context/searchContext';
import CompleteAccountScreen from './screens/authScreens/CompleteCreateAccountScreen';
import { themes } from './constants/layout';



const Stack = createStackNavigator();
SplashScreen.preventAutoHideAsync(); 
SystemUI.setBackgroundColorAsync('transparent')

const defaultSettings ={
  theme:"light"
}

export default function App() {
  const [initialRoute, setInititalRoute] = useState("");
  const [appIsReady, setAppIsReady] = useState(false);
  const [theme, setTheme] = useState(defaultSettings.theme);
  const [userSettings, setUserSettings] = useState(defaultSettings);
  const [userData, setUserData] = useState(null);
  const dark = theme === "dark";

  const checkLoggedInStatus = async () => {
    try {
      const storeUser = await AsyncStorage.getItem('user');
      const storeUserData = JSON.parse(storeUser);
      setUserData(storeUserData);

      if (storeUserData) {
        const userRole = storeUserData.role;

        switch (userRole) {
          case 'Landlord':
            setInititalRoute("LandlordHome");
            break;
          case 'Subletter':
            setInititalRoute("SubletterHome");
            break;
          default:
            setInititalRoute("Login");
            break;
        }
      } else {
        setInititalRoute("Login");
      }
    } catch (error) {
      console.log('Error retrieving loggedIn status:', error);
    } 
  };

  const loadSettings = async () => {
    try {
      const storedSettings = await AsyncStorage.getItem('settings');
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);
        setUserSettings(parsedSettings);
        setTheme(userSettings.theme)
      }
    } catch (error:any) {
      console.error('Error loading settings:', error.message);
    }
  };

  useEffect(() => {
    async function prepare() {
      try {
        await checkLoggedInStatus();
        await loadSettings();
        await Font.loadAsync({
          'monserrat-regular': require('./assets/fonts/Montserrat-Regular.otf'),
          'monserrat-semibold': require('./assets/fonts/Montserrat-SemiBold.otf'),
          'monserrat-bold': require('./assets/fonts/Montserrat-Bold.otf'),
        });

      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
  
    prepare();
  }, []);

  //Function to set app ready when nav children loaded
const onLayoutRootView = useCallback(async () => {
  if (appIsReady) {
  
    await SplashScreen.hideAsync();
  }
}, [appIsReady]);



if (!appIsReady) {
  return null;
}


  return (
    <UserProvider>
    <SubletterProvider>
    <LandlordProvider>
    <SearchProvider>
    <SettingsProvider settings={userSettings}> 
      <StatusBar backgroundColor="transparent" barStyle={dark? "light-content":"dark-content"} translucent />
      <NavigationContainer onReady={onLayoutRootView} theme={{colors: userSettings.theme === 'light'? themes.light: themes.dark, dark: userSettings.theme === 'dark'}} >
        <Stack.Navigator initialRouteName={initialRoute? initialRoute:"Login"}  screenOptions={{ animationEnabled:true, 
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS}}>
          <Stack.Screen name="Create Account" component={CreateAccountScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Complete Account" component={CompleteAccountScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Forgot Password" component={ForgotPassword} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="LandlordHome" component={LandlordHomeScreen} options={{ headerShown: false }} initialParams={{userData}} />
          <Stack.Screen name="SubletterHome" component={SubletterHomeScreen} options={{ headerShown: false }} initialParams={{userData}} />
          <Stack.Screen name="Update Settings" component={UpdateSettingsScreen} options ={{headerShadowVisible:false, headerTitleStyle:{fontSize:18}}}/>
        </Stack.Navigator>
      </NavigationContainer>
    </SettingsProvider> 
    </SearchProvider>
    </LandlordProvider>
    </SubletterProvider>
    </UserProvider>
  );
};


const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
