import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { TextInput, TouchableHighlight, Alert, } from 'react-native';
import { AuthContext } from "./context";
import Button from '../App/styles/Buttons';
// import {Button} from "react-native"
import {LivestockPic} from "../App/pictureManagement/LivestockPicture";
import {DisplayScannedTag} from "../App/ProcessScannedTag"
import {HouseNumber} from "../App/model/HouseholdMeatPackage"
import {MTEhouseholdPicture} from "../App/pictureManagement/HouseholdPicture"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 10,
    borderRadius: 5
  },

heading: {
    fontSize: 16,
  //  flex: 1
},
inputs: {
   // flex: 1,
    width: '80%',
    padding: 10,
    backgroundColor: 'yellow'
},
buttons:{
    marginTop: 15,
    fontSize: 20,
    color: "#f194ff",
    padding:10,
    borderColor: 'gray', borderWidth: 2
},
labels: {
    paddingBottom: 10,
    borderColor: 'red'
}
});

const ScreenContainer = ({ children }) => (
  <View style={styles.container}>{children}</View>
);

export const Home = ({ navigation }) => (
  <ScreenContainer>
    {/* <Text>Menu</Text> */}
    {/* <Button  text='Submit' bordered onPress={loginUser} /> */}
    <Button
      text1="Procure Livestock"
      text2="جانورن جو انتظام"
      // text2="هيڊ آفيس سان ڊيٽا کي هم وقت سازي ڪريو"
      onPress={() =>
        navigation.push("AddCow", { name: "Procurment Management" })
      }
      type='filled'
        bordered
    />
    
    <Text></Text>
    <Button
      // title="Slaughter Livestock"
      text1="Slaughter Livestock"
      text2="ذبح چوپايو مال"
        onPress={() =>
        navigation.push("SlaughterLivestock", { name: "Slaughter Management " }) }
        type='filled'
        bordered
    />
    <Text></Text>
    
    {/* <Button
      
      text="Livestock Picture"
        onPress={() =>navigation.push("LivestockPhoto", { LivestockTag: "HFL999" }) }
        type='transparent'
        bordered
    /> */}
    <Button
      text1="Meat Package Inventory"
      text2="گوشت پيڪيج جي فهرست"
      onPress={() =>
        navigation.push("Freez", { name: "گوشت پئڪيج اسٽيڪر اسڪين ڪيو" ,callingModule: "Inventory"})
      }
      type='filled'
        bordered
    />
     <Text></Text>
  
    <Button
      text1="Meat Package Distribution"
      text2="گوشت پيڪيج جي ورهاست"
      onPress={() =>
        navigation.push("Freez", { name: "گوشت پئڪيج اسٽيڪر اسڪين ڪيو" ,callingModule: "Distribution"})
      }
      type='filled'
        bordered
    />
     <Text></Text>
    <Text></Text>
    
    <Button text1="Settings"  text2="جوڙ" onPress={() => navigation.toggleDrawer()} type='filled'
        bordered />
    
  </ScreenContainer>
);
export const LivestockPhoto = ({route, navigation }) => (
  <ScreenContainer>
  {/* console.console.log('helllooooo'); */}
    <View>
    <Text>Loading...</Text>
    {route.params.LivestockTag && <Text>{route.params.LivestockTag}</Text>}
    <LivestockPic LivestockTag= {route.params.LivestockTag} navigation={navigation}/>
    
     </View>
  </ScreenContainer>
);
export const ProcessFreezTag = ({route, navigation }) => (
  <ScreenContainer>
    <Text>منجهيل گوشت جو پيڪيج</Text>
    <DisplayScannedTag  data= {route} navigation={navigation}/>
  </ScreenContainer>
);
export const DistributeMeatPackages = ({route, navigation }) => (
  <ScreenContainer>
    <Text> گوشت جو پيڪيج کي ورهائڻ </Text>
    <HouseNumber  data= {route} navigation={navigation}/>
  </ScreenContainer>
);
export const takeHouseholdPic = ({route, navigation }) => (
  <ScreenContainer>
    <Text> گوشت جو پيڪيج کي ورهائڻ </Text>
    <MTEhouseholdPicture  data= {route} navigation={navigation}/>
  </ScreenContainer>
);
export const Details = ({ route }) => (
  <ScreenContainer>
    <Text>Details Screen</Text>
    {route.params.name && <Text>{route.params.name}</Text>}
  </ScreenContainer>
);
export const LivestockFeeder = ({ route,navigation }) => (
  <ScreenContainer>
     <Button
      // title="Slaughter Livestock"
      text1="Register Feedlot"
      text2="فيڊل لاٽ کي رجسٽر ڪريو"
        onPress={() =>
        navigation.push("Feeder Registration", { name: "Feedlots Management " }) }
        type='filled'
        bordered
    />
    <Text></Text>
     <Button
      // title="Slaughter Livestock"
      text1="Handing Over Livestock to Feeder Feedlot"
      text2="فيڊر فيڊ لاٽ کي جانورن جي حوالي ڪرڻ"
        onPress={() =>
        // navigation.push("Feedlot Contract Management", { name: "Feedlots Contract Management " }) }
        navigation.push("Select Feedlot", { name: "Feedlots bbbContract Management " }) }
        type='filled'
        bordered
    />
    <Text></Text>
    <Button
      // title="Slaughter Livestock"
      text1="Daily Weight Gain"
      text2="روزانه وزن حاصل ڪرڻ جو انتظام"
        onPress={() =>
        // navigation.push("Feedlot Contract Management", { name: "Feedlots Contract Management " }) }
        navigation.push("Daily Weight Gain", { name: "Daily Weight Gain Management",callingModule: "dailyWeightGain" }) }
        type='filled'
        bordered
    />
    <Text></Text>
  </ScreenContainer>
);



export const Profile = ({ navigation }) => {
  const { signOut } = React.useContext(AuthContext);

  return (
    <ScreenContainer>
      <Text>Profile Screen</Text>
      <Button title="Drawer" onPress={() => navigation.toggleDrawer()} />
      <Button title="Sign Out" onPress={() => signOut()} />
    </ScreenContainer>
  );
};

export const Splash = () => (
  <ScreenContainer>
    <Text>Loading...</Text>
    <Image style={{ height: 200, width:200  }}
        
        source={require('../assets/PRICE.jpg')}
      />
  </ScreenContainer>
);

export const SignIn = ({ navigation }) => {
  const { signIn } = React.useContext(AuthContext);
  
  /****************** on hold by pass login */
  const [username,onChangeText]=React.useState("")
    const [passwrd,setPasswrd]=React.useState("")
    const [priceLocalUser]=React.useState("naseerpervaz")
    const [priceLocalUserPW]=React.useState("PRICE2011")
    loginUser = ()=>{
      if ( !username){
           Alert.alert('Please enter a username')
       }
       else if ( !passwrd) {
           Alert.alert ('Please enter password')
       }
       else if ( username.trim() != priceLocalUser.trim()){
           console.log(`You entered: ${username} and name on local table: ${priceLocalUser}`)
           Alert.alert('Please enter an authorized username');
       }
       else if ( passwrd != priceLocalUserPW){
           console.log(`You entered: ${passwrd} and pw on local table: ${priceLocalUserPW}`)
              Alert.alert('Password incorrect')
              }
       else {  signIn()  }
       }
    const onPress = () => {alert('clicked') }
   
  return (
    
    <View style = {styles.container}>
       
             <TextInput
                    style={styles.inputs}
                    onChangeText={text=>onChangeText(text)}
                    value={username}
                />
                <Text style = {styles.labels}>Enter User Name</Text>

                 <TextInput
                    style={styles.inputs}
                    onChangeText={text=>setPasswrd(text)}
                   value={passwrd}
                    secureTextEntry = {true}
                />
                <Text style = {styles.labels}>Enter Password</Text>
                 <Button  text1="Sign In" text2="سائن ان ڪريو"  onPress={loginUser} />


        </View>
        )
       /***************************************************** */
      return (
        <ScreenContainer>
          <Text>Sign In Screen</Text>
          
          <Button text1="Sign In" text2="سائن ان ڪريو" onPress={() => signIn()} />
          {/* <Button
            title="Create Account"
            onPress={() => navigation.push("CreateAccount")}
          /> */}
        </ScreenContainer>
      ); 
};

export const CreateAccount = () => {
  const { signUp } = React.useContext(AuthContext);

  return (
    <ScreenContainer>
      <Text>Create Account Screen</Text>
      <Button title="Sign Up" onPress={() => signUp()} />
    </ScreenContainer>
  );
};