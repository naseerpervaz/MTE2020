import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
const SearchStack = createStackNavigator();
export const SearchStackScreen = () => (
    <SearchStack.Navigator>
      <SearchStack.Screen name="Search" component={Search} />
      <SearchStack.Screen name="Search2" component={Search2} />
    </SearchStack.Navigator>
  );
  