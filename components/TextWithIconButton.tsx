import {TouchableOpacity, Text, StyleSheet, TextStyle} from 'react-native';
import { sizes, themes } from '../constants/layout';
import { Ionicons } from '@expo/vector-icons';
import { TextWithIconButtonProps } from '../constants/types';

const TextWithIconButton = ({ 
    onPress, 
    buttonText, 
    fontSize = sizes.font.medium, 
    margin = sizes.layout.small,
    textAlign = 'right',
    icon,
    iconSize=24,
    color = themes.dark.icon,
    justifyContent='flex-end'
}: TextWithIconButtonProps) => {
    const customizableStyles = {fontSize, color, margin, textAlign}
    return (
        <TouchableOpacity onPress={onPress} style={{flexDirection:'row', alignItems:'center', justifyContent}}>
            { icon && <Ionicons name={icon} size ={iconSize} color={color}/>}
            <Text style={[styles.buttonText, customizableStyles]}>{buttonText}</Text>
        </TouchableOpacity>
    );
  };

  const styles = StyleSheet.create({
    buttonText: {
        fontFamily:'monserrat-regular', 
      }
  })
  export default TextWithIconButton;