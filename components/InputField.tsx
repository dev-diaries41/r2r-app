import React from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import { themes, sizes } from '../constants/layout';
import { InputFieldProps } from '../constants/types';


const InputField = ({ 
  value, 
  onChangeText, 
  error, 
  placeholder, 
  secureTextEntry = false, 
  errorText, 
  color, 
}: InputFieldProps) => {
  return (
    <View>
      {error && <Text style={styles.errorText}>{errorText}</Text>}
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        style={[styles.input, {color}, error && styles.inputError]}
        placeholderTextColor={themes.placeholder}        
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    input: {
      paddingHorizontal: sizes.layout.medium,
      paddingVertical: sizes.layout.small,
      borderRadius: sizes.layout.medSmall,
      marginBottom:sizes.layout.xSmall,
      borderColor: themes.light.border,
      borderWidth: 1,
      color:themes.light.text,
      fontFamily:'monserrat-regular'  
    },
    inputError: {
      borderColor: 'red',
    },
    errorText: {
      color: 'red',
      fontSize: sizes.font.small,
      fontFamily:'monserrat-regular',  
      marginTop: sizes.layout.xSmall,
    },
  });  

export default InputField;
