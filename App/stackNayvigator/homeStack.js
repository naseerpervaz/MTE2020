import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {
    Home,
    } from "../Screens";

const HomeStack = createStackNavigator();
export const HomeStackScreen = () => (
    <HomeStack.Navigator>
      <HomeStack.Screen name="  Home" component={Home}  options={{ headerTitle: props => <Ionicons name="md-menu" size={32} color="green" {...props}/> }}/>
      
      <HomeStack.Screen
        name="LivestockPhoto"
        component={LivestockPhoto}
        options={({ route }) => ({
          title: route.params.name
        })}
      />
      <HomeStack.Screen
        name="Details"
        component={Details}
        options={({ route }) => ({
          title: route.params.name
        })}
      />
  
      <HomeStack.Screen
        name="SlaughterLivestock"
        component={SlaughterLivestock}
        options={({ route }) => ({
          title: route.params.name
        })}
      />
      
    </HomeStack.Navigator>
  );