import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, TouchableOpacity, Text, View , StyleSheet, DimensionValue} from 'react-native';
import { themes, sizes } from '../constants/layout';
import { Ionicons } from '@expo/vector-icons';
import { ButtonProps, GradientButtonProps } from '../constants/types';

 export const GradientButton  = ({ 
  loading, 
  disabled, 
  onPress, 
  text, 
  gradientColor = themes.dark.primaryGradient, 
  width = '100%', 
  height = 50, 
  icon, 
  fontSize = sizes.font.medium,
  borderColor,
  borderWidth,
  color = themes.light.text,
  }: GradientButtonProps) => {
    const customizableButtonStyles =  { width,
      height, borderColor, borderWidth}
      const customizableButtonTextStyles = {fontSize, color}
    return (
      <LinearGradient colors={gradientColor} style={[buttonStyles.button, customizableButtonStyles]}>
        <TouchableOpacity style={[disabled && { opacity: 0.5 }]} onPress={onPress} disabled={disabled}>
          {loading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <View style = {buttonStyles.rowContainer}>
              {icon &&(
              <Ionicons name={icon} size={24} color={color} />
              )}
              {text &&<Text style={[buttonStyles.buttonText,customizableButtonTextStyles ]}>{text}</Text>}
            </View>
          )}
        </TouchableOpacity>
      </LinearGradient>
    );
  };


  export const Button = ({ 
    loading, 
    disabled, 
    onPress, 
    text, 
    backgroundColor = themes.dark.primary, 
    width = '100%', 
    height = 50, 
    icon, 
    fontSize = sizes.font.medium,
    borderColor,
    borderWidth,
    color = themes.dark.text
  }:ButtonProps) => {
    const customizableStyles = { backgroundColor, width, height, borderColor, borderWidth };
    const customizableButtonTextStyles = { fontSize, color };
  
    return (
      <TouchableOpacity
        style={[
          buttonStyles.button,
          customizableStyles,
          disabled && { opacity: 0.5 }, // Apply opacity directly to TouchableOpacity
        ]}
        onPress={onPress}
        disabled={disabled}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <View style={buttonStyles.rowContainer}>
            {icon && <Ionicons name={icon} size={24} color={color} />}
            {text && <Text style={[buttonStyles.buttonText, customizableButtonTextStyles]}>{text}</Text>}
          </View>
        )}
      </TouchableOpacity>
    );
  };
  
  const buttonStyles = StyleSheet.create({
    button: {
      backgroundColor: themes.dark.primary,
      borderRadius: sizes.layout.large,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: "center",
      marginHorizontal: sizes.layout.medium,
      elevation: 2,
      shadowColor: themes.light.text,
      shadowOffset: {
        width: 5,
        height: 10,
      },
      shadowOpacity: 1,
      shadowRadius: sizes.layout.small,
    },
    buttonText: {
      color: themes.dark.text,
      fontFamily: 'monserrat-bold',
      marginStart: sizes.layout.small
    },
    icon: {
      marginRight: sizes.layout.xSmall,
    },
    rowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  });
  

