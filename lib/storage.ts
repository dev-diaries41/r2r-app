import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveSettings = async (settings: any) => {
    try {
      await AsyncStorage.setItem('settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }