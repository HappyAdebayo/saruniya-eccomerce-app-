import React from "react";
import { TextInput } from "react-native";

const CustomTextInput =(props)=>{
    const {placeholder, value, keyboardType,inputstyle,secureTextEntry,KeyboardType,onChangeText}= props
    return(
        <TextInput
          style={inputstyle}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          autoCapitalize='none'
          autoCorrect={false}
          keyboardType={keyboardType || 'default'}
        />
    )
}
export default CustomTextInput