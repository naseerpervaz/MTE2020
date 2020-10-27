import React from "react";
import { Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Home,
  } from "../Screens";
const HomeStackScreen = require('../stackNayvigator/homeStack')
const SearchStackScreen= require('../stackNayvigator/searchStack')

const Tabs = createBottomTabNavigator();
export const TabsScreen = () => (
    <Tabs.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
  
              if (route.name === 'Home') {
                // <Ionicons name="md-checkmark-circle" size={32} color="green" />
                // iconName = focused
                // ? 'md-checkmark-circle' 
                // : 'ios-information-circle-outline';
               return <Image source={require('../../assets/meat.png')} fadeDuration={0} style={{width: 20, height: 20}} />
              } else if (route.name === 'Freez') {
                // iconName = focused ? 'ios-list-box' : 'ios-list';
                // return <MaterialCommunityIcons name="coolant-temperature" size={24} color="black" />
                return <Image source={require('../../assets/Freezer.png')} fadeDuration={0} style={{width: 20, height: 20}} />
              }
  
              // You can return any component that you like here!
              return 
              // <Image source={require('./assets/meat.png')} fadeDuration={0} style={{width: 20, height: 20}} />
            },
            // tabBarIcon: ({ focused, color, size }) => {
            //   let iconName;
  
            //   if (route.name === 'Slaughter') {
            //     // <Ionicons name="md-checkmark-circle" size={32} color="green" />
            //     iconName = focused
            //       ? 'md-checkmark-circle' 
            //       : 'ios-information-circle-outline';
            //   } else if (route.name === 'Freez') {
            //     iconName = focused ? 'ios-list-box' : 'ios-list';
            //   }
  
            //   // You can return any component that you like here!
            //   return <Ionicons name={iconName} size={size} color={color} />;
            // },
          })}
    tabBarOptions={{
      activeTintColor: 'green',
      inactiveTintColor: 'gray',
      
    }}>
      <Tabs.Screen name="Home" component={HomeStackScreen} />
      <Tabs.Screen name="Freez" component={SearchStackScreen} />
      <Tabs.Screen name="Distribute" component={SearchStackScreen} />
    </Tabs.Navigator>
  );
  