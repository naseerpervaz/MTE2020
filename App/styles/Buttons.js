import React from 'react'
import { Text, View, TouchableOpacity, Dimensions } from 'react-native'


const width = Dimensions.get('window').width


const Button = ({ text1, text2,onPress, type = 'filled', bordered = false, size = 'large' }) => {
  const large = width / 1.3
  const small = width / 2
  const btnSize = size === 'large' ? large : small
  const btnBgColor = type === 'filled' ? '#3f51b5' : 'transparent'
  const btnTextColor = type === 'filled' ? '#ffffff' : '#6371c2'
  const btnBorderRadius = bordered ? 30 : 5

  const containerCommonStyle = {
    backgroundColor: btnBgColor,
    paddingVertical: 8,
    width: btnSize,
    borderRadius: btnBorderRadius
  }

  const textCommonStyle = {
    color: btnTextColor,
    fontSize: 16,
    textTransform: 'uppercase',
    textAlign: 'center',
  }

  const border = type === 'outlined' && { borderColor: '#e7e7e7', borderWidth: 2 }

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View style={[containerCommonStyle, border]}>
        <Text style={[textCommonStyle]}> {text1} </Text>
        <Text style={[textCommonStyle]}> {text2} </Text>
      </View>
    </TouchableOpacity>
  )
}

export default Button

/**************************** following code to use above Button component 
 
import React from 'react';
import { View } from 'react-native';
import Button from './src/components/Button';
import Spacer from './src/components/Spacer';
import Center from './src/components/Center';


const App = () => {

  const onPress = () => {
    alert('clicked')
  }

  return (
    <Center>
      <Button
        text='Submit'
        type='outlined'
        bordered
        size='small'
        onPress={onPress}
      />
      <Spacer />
      <Button
        text='Submit'
        type='outlined'
        bordered
        onPress={onPress}
      />
      <Spacer />
      <Button
        text='Submit'
        type='outlined'
        onPress={onPress}
      />
      <Spacer />
      <Button
        text='Submit'
        size='small'
        onPress={onPress}
      />
      <Spacer />
      <Button
        text='Submit'
        bordered
        onPress={onPress}
      />
      <Spacer />
      <Button
        text='Submit'
        onPress={onPress}
      />
    </Center>
  );
};

export default App

 */