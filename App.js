import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Image } from 'react-native';
import {DrawerContent}from "./App/drawerControler";
import { Ionicons } from '@expo/vector-icons';
// import { MaterialCommunityIcons } from '@expo/vector-icons';


import { AuthContext } from "./App/context";
import {
  SignIn,
  CreateAccount,
  Home,
  Details,
  Profile,
  Splash,
  LivestockPhoto,
  ProcessFreezTag,
  DistributeMeatPackages,
  takeHouseholdPic,
  LivestockFeeder
} from "./App/Screens";
import {SlaughterLivestock} from "./App/SlaughterLivestock"
import {ScanTheTag} from "./App/FreezPackage"
import {AddCow} from "./App/ProcureLivestock"
import {LivestockFeederRegistration} from "./App/LivestockFeederRegistration"
import {HandingOverLivestock} from "./App/HandingOverLivestock"
const {SelectCattleFeeder} =require('./App/functionalComponents/selectFeedlot')
import {SelectContract} from './App/functionalComponents/selectContract'
import {SelectFeedlotDailyWG} from './App/functionalComponents/selectFeedlotForDailyWG'
import {SelectContractForDailyWG} from './App/functionalComponents/selectContractForDailyWG'
import {DailyWeightGain} from './App/DailyWeightGain'

const AuthStack = createStackNavigator();
const AuthStackScreen = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen
      name="SignIn"
      component={SignIn}
      options={{ title: "Sign In" }}
    />
    {/* <AuthStack.Screen
      name="CreateAccount"
      component={CreateAccount}
      options={{ title: "Create Account" }}
    /> */}
  </AuthStack.Navigator>
);

const Tabs = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const LivestockFeederStack = createStackNavigator();
// const SearchStack = createStackNavigator();


const HomeStackScreen = () => (
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
      name="Freez"
      component={ScanTheTag}
      options={({ route }) => ({
        title: route.params.name
      })}
    />
    <HomeStack.Screen
      name="ProcessFreezTag"
      component={ProcessFreezTag}
      options={({ route }) => ({
        title: route.params.name
      })}
    />
    <HomeStack.Screen
      name="DistributeMeatPackages"
      component={DistributeMeatPackages}
      options={({ route }) => ({
        title: route.params.name
      })}
    />
    <HomeStack.Screen
      name="takeHouseholdPic"
      component={takeHouseholdPic}
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
      name="AddCow"
      component={AddCow}
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

const LivestockFeederStackScreen = () => (
  <LivestockFeederStack.Navigator>
    <LivestockFeederStack.Screen name="  Livestock Feeder" component={LivestockFeeder}  options={{ headerTitle: props => <Ionicons name="md-menu" size={32} color="green" {...props}/> }}/>
    <LivestockFeederStack.Screen name="LivestockFeeder" component={LivestockFeeder} />
    <LivestockFeederStack.Screen name="Feeder Registration" component={LivestockFeederRegistration} />
    <LivestockFeederStack.Screen name="Select Feedlot" component={SelectCattleFeeder} />
    <LivestockFeederStack.Screen name="Feedlot Contract Management" component={HandingOverLivestock} />
    <LivestockFeederStack.Screen name="Select Contract" component={SelectContract} />
    <LivestockFeederStack.Screen name="Daily Weight Gain" component={SelectFeedlotDailyWG} />
    <LivestockFeederStack.Screen name="Contract For DWG" component={SelectContractForDailyWG} />
    <LivestockFeederStack.Screen name="Weight Gain Management" component={DailyWeightGain} />

  </LivestockFeederStack.Navigator>
);
// const SearchStackScreen = () => (
//   <SearchStack.Navigator>
//     <SearchStack.Screen name="Search" component={Search} />
//     <SearchStack.Screen name="Search2" component={Search2} />
//   </SearchStack.Navigator>
// );



const TabsScreen = () => (
  <Tabs.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              // <Ionicons name="md-checkmark-circle" size={32} color="green" />
              // iconName = focused
              // ? 'md-checkmark-circle' 
              // : 'ios-information-circle-outline';
             return <Image source={require('./assets/meat.png')} fadeDuration={0} style={{width: 20, height: 20}} />
            } else if (route.name === 'Feeder VSE') {
              // iconName = focused ? 'ios-list-box' : 'ios-list';
              // return <MaterialCommunityIcons name="coolant-temperature" size={24} color="black" />
              // return <Image source={require('./assets/Freezer.png')} fadeDuration={0} style={{width: 20, height: 20}} />
              return <Image source={require('./assets/sdg9.png')} fadeDuration={0} style={{width: 20, height: 20}} />
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
    <Tabs.Screen name="Feeder VSE" component={LivestockFeederStackScreen} />
   
    {/* <Tabs.Screen name="Daily Weight Gain" component={SelectFeedlotDailyWG} /> */}
  </Tabs.Navigator>
);
const ProfileStack = createStackNavigator();
const ProfileStackScreen = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen name="Profile" component={Profile} />
  </ProfileStack.Navigator>
);
const Drawer = createDrawerNavigator();
const DrawerScreen = () => (
  // <Drawer.Navigator initialRouteName="Profile" drawerContentOptions={{
  //   activeTintColor: '#e91e63',
  //   itemStyle: { marginVertical: 50 },
  // }}>
   <Drawer.Navigator drawerContent={() => <DrawerContent />}>
    <Drawer.Screen name="Home" component={TabsScreen} />
    <Drawer.Screen name="Profile" component={ProfileStackScreen} />
  </Drawer.Navigator>
);

const RootStack = createStackNavigator();
const RootStackScreen = ({ userToken }) => (
  <RootStack.Navigator headerMode="none">
    {userToken ? (
      <RootStack.Screen
        name="App"
        component={DrawerScreen}
        options={{
          animationEnabled: false
        }}
      />
    ) : (
      <RootStack.Screen
        name="Auth"
        component={AuthStackScreen}
        options={{
          animationEnabled: false
        }}
      />
    )}
  </RootStack.Navigator>
);

export default () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [userToken, setUserToken] = React.useState(null);

  const authContext = React.useMemo(() => {
    return {
      signIn: () => {
        setIsLoading(false);
        setUserToken("asdf");
      },
      // signUp: () => {
      //   setIsLoading(false);
      //   setUserToken("asdf");
      // },
      // signOut: () => {
      //   setIsLoading(false);
      //   setUserToken(null);
      // }
    };
  }, []);

  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return <Splash />;
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <RootStackScreen userToken={userToken} />
      </NavigationContainer>
    </AuthContext.Provider>
  );
};