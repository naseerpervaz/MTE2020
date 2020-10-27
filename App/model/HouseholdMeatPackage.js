import React from 'react';
import { StyleSheet, Text, View, FlatList, Dimensions,TouchableHighlight, Alert } from 'react-native';
//mport { AlarmMethod } from 'expo/build/Calendar';
//import {Permissions} from 'expo';
const axios = require('axios');
import {BackEndApi} from "../config/constants";
import * as SQLite from 'expo-sqlite';

const slaughteredLivestockDetailsTable = require('./slaughteredLivestockDetailsTable')
const db = SQLite.openDatabase('PRICELocal.db');

const data = [
  { key: '1' }, { key: '2' }, { key: '3' }, { key: '4' }, { key: '5' }, { key: '6' }, { key: '7' }, { key: '9' }, { key: '10' }, { key: '11' }, { key: '12' }, { key: '13' },{ key: '14' }, { key: '15' }, { key: '16' }, { key: '17' }, { key: '18' }, { key: '19' }, { key: '20' }, { key: '21' }, { key: '22' }, { key: '23' }, { key: '24' }, { key: '25' }, { key: '26' }, { key: '27' }, { key: '28' }, { key: '29' }, { key: '30' }, { key: '31' }, { key: '32' }, { key: '33' }, { key: '34' }, { key: '35' }, { key: '36' }, { key: '37' }, { key: '38' }, { key: '39' }, { key: '40' }, { key: '41' },  { key: '42' },  { key: '43' },  { key: '44' },  { key: '45' }
  // { key: 'K' },
  // { key: 'L' },
];

const formatData = (data, numColumns) => {
  const numberOfFullRows = Math.floor(data.length / numColumns);
  let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
 
  while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
    data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
    numberOfElementsLastRow++;
  }

  return data;
};

const numColumns = 6;

export  class HouseNumber extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor (props){
        super(props);
        this.state = {
            ready: false,
            where: {lat:null, lng:null, Ald: null},
            error: null
       }
    };
componentDidMount = () => {
        // console.log('\n from HouseholdMeatPackage: props: \n',this.props)
     let geoOptions = {
        enableHighAccuracy: true,
        timeOut: 20000,
        maximumAge: 60 * 60 * 24
    };
    this.setState({ready:false, error: null });
    navigator.geolocation.getCurrentPosition( this.geoSuccess, this.geoFailure, geoOptions);
    
    let resultCreateTable = slaughteredLivestockDetailsTable.createMeatPackageDistributionTable()
    let createMTEHousehold = slaughteredLivestockDetailsTable.createMTEHouseholdTable()
    
}; // end of componentDidMount 
geoSuccess = (position) => {
    this.setState({  ready:true,
        where: {lat: position.coords.latitude,lng:position.coords.longitude, Ald:position.coords.altitude }
    })
}
geoFailure = (err) => {
    this.setState({error: err.message});
}


renderItem = ({ item, index }) => {
    if (item.empty === true) {
        return <View style={[styles.item, styles.itemInvisible]} />;
    }
    return (
        <View style={styles.item} >
          <TouchableHighlight onPress = {()=>this.chooseHouseNumber(item.key)}>
                <Text style={styles.itemText}>{item.key}</Text>
          </TouchableHighlight>
      </View>
    );
};


chooseHouseNumber = (HouseNumber) =>{
      const {data}=this.props.data.params
    //  console.log('\n data: ',data)
     let {VillageName, LivestockTag, PN: PackageNumber, PC: projectCode}= data
    
    //  console.log('\n data.VillageName, LivestockTag, PN: PackageNumber, PC: projectCode\n ',VillageName,LivestockTag, PackageNumber, projectCode)
    //  console.log('object Values:   ',Object.values(data))
    //  console.log('object keys:   ',Object.keys(data))
    //    const {VillageName, LivestockTag, PN: PackageNumber, PC: projectCode}= data
    
    PackageNumber= parseInt(PackageNumber)
  
    const updateTagData = {
      projectCode: projectCode,
      packageConsumtionStatus: 'Consumed',
      villageName: VillageName,
      packageNumber:PackageNumber,
      slaughterLivestockTag: LivestockTag,
      houseHold: parseInt(HouseNumber),
      // timestamp: new Date().toLocaleString(),
      // packageRefrigerationTimestamp: new Date().toLocaleString(),
      PackageHandedoverDate: Date(),
    //   Lat: this.state.where.lat,
    //  Lng: this.state.where.lng,
    //  Ald: this.state.where.Ald
    latitude: this.state.where.lat,
    longitude: this.state.where.lng,
    altitude: this.state.where.Ald
    }
    


// throw all records on console log for testing
// db.transaction(tx => { 
//   tx.executeSql('select * from MeatPackageDistribution', [], (tx, results) => { 
//     if (results.rows.length > 0){
//       console.log ('All rows from MeatPackageDistribution table: ', results.rows)
//     } else {
//         alert('No record found in the table MeatPackageDistribution');
//     }},(t,error)=> {console.log('Db3 error: ',error);})})



// console.log('\n\n\nfrom module HouseNumber before local DB update')
db.transaction(tx => { 
 
  // tx.executeSql('select * from MeatPackageDistribution where LivestockTag = ? AND PackageNumber = ? AND HouseHold is not null AND DateMeatFrozen is not null', [LivestockTag,PackageNumber], (tx, results) => { 
   
  tx.executeSql('select * from MeatPackageDistribution where LivestockTag = ? AND PackageNumber = ?  ', [LivestockTag,PackageNumber], (tx, results) => { 
      if (results.rows.length == 0) {
        // console.log ('\n\n Package not found for query  select * from MeatPackageDistribution where LivestockTag = ? AND PackageNumber = ?  for LivestockTag,PackageNumber: ',LivestockTag,PackageNumber)
        Alert.alert('Package not found for   لاءِ پيڪيج نه مليا آهن ',`Tag # ${LivestockTag},Package # ${PackageNumber}`,[{text: 'Ok  ٺيڪ آهي', onPress: ()=> this.exitHome()},],
          { cancelable: false }
        );
        
       }
       else {

  tx.executeSql('select * from MeatPackageDistribution where LivestockTag = ? AND PackageNumber = ? AND HouseHold is not null ', [LivestockTag,PackageNumber], (tx, results) => { 
   console.log ('\n\n\nResults after local DB search: ', results)
     if (results.rows.length > 0){

      // console.log ('All rows already exist with same livestock tag and package number: ', results.rows)
       Alert.alert ('Package has already', 'been consumed by another household ٻئي گھر جي طرفان اڳ ئي ئي پيسا بڻي',[{text: 'Ok  ٺيڪ آهي', onPress: ()=> this.exitHome()},])
      
     }
      // else if (results.rows.length == 0) {
      // console.log ('\n\n Package not found for query  select * from MeatPackageDistribution where LivestockTag = ? AND PackageNumber = ? AND HouseHold is not null for tag data: ',updateTagData)
      // Alert.alert ('Package not found ')
      // this.exitHome()
    //  }
     
     else {
      // console.log('\n\n from module HouseNumber before local DB update')
        // tx.executeSql(`UPDATE MeatPackageDistribution SET  VillageName = ${VillageName}, HouseHold = ${HouseNumber}, LivestockTag = ${ LivestockTag}, PackageNumber = ${PackageNumber }, PackageHandedoverDate = ${ updateTagData.timestamp},Latitude = ${this.state.where.lat }, Longitude = ${this.state.where.lng }, Altitude = ${ this.state.where.Ald }) WHERE LivestockTag = ${LivestockTag} AND PackageNumber =${PackageNumber}`,
        tx.executeSql('UPDATE MeatPackageDistribution SET  HouseHold = ?, PackageHandedoverDate =?,Latitude = ?, Longitude = ?, Altitude = ? WHERE LivestockTag = ? AND PackageNumber =?',[HouseNumber,updateTagData.PackageHandedoverDate,this.state.where.lat,this.state.where.lng,this.state.where.Ald,LivestockTag,PackageNumber],
        (tx, results) => {  console.log('\n Package has been updated: ', results)
        alert(`Package ${PackageNumber} status has been updated for house hold ${HouseNumber}`)
          // send meat Package gift geolocation to house hold

          // update backend
            //  axios.post(`https://4cfb7159.ngrok.io/updatescannedtag, ${PackageNumber}${HouseNumber}${timestamp}${this.state.where.lat}${this.state.where.lng}`)
          // console.log('updateTagData before calling backend: ',updateTagData)
              // axios.patch('http://32cba08da5ce.ngrok.io/updatescannedtag', updateTagData)

               // update backend
                // import {BackEndApi} from "../config/constants";
                const backendUrl= BackEndApi+'/updatescannedtag'
                axios.patch(backendUrl, updateTagData)

                // get livestock picture
                
                .then((response) => { // Success
                  // console.log('success response from server: ')
                  // console.log(response.data, response.status,response.data.result.affectedRows)
                  // Synchronize if back-end update is success
                  if (response.status == 200 && response.data.result.affectedRows > 0){
                    
                    db.transaction(tx => { 
                      tx.executeSql(`UPDATE MeatPackageDistribution set SynchronizeStatus = ? where LivestockTag =? AND PackageNumber = ?`, ["Synchronized",LivestockTag,PackageNumber], (tx, results) => { console.log ('\n from module HouseNumber.UpdateTag results after Synchronization update: ', results) },(t,error)=> {console.log('Db4 error: ',error);   this.exitHome()})})
                      
                      // throw all records on console log for testing
                          // db.transaction(tx => { 
                          //   tx.executeSql('select * from MeatPackageDistribution', [], (tx, results) => { 
                          //     if (results.rows.length > 0){
                          //       console.log ('All rows from MeatPackageDistribution table: ', results.rows)
                          //     } else {
                          //       alert('No record found in the table MeatPackageDistribution');
                          //     }},(t,error)=> {console.log('Db3 error: ',error);})})
                        }
                        
                        console.log(`\n from from module HouseNumber.UpdateTag Package ${PackageNumber} status has been updated for house hold ${HouseNumber} on the backend server`)
                        Alert.alert(
                          // 'Alert Title',
                          'Meat The Eid',
                         
                          `Please take the picture of recipient (تصوير وصول ڪندڙ)`,
                          [
                            {
                              // text: 'Ask me later',
                              text: 'Ok',
                              onPress: () => 
                            //   this.props.navigation.navigate('mTEhouseholdPictureRT',updateTagData)
                            this.props.navigation.push("takeHouseholdPic", {updateTagData})
                            },
                            // {
                            //   text: 'Cancel',
                            //   onPress: () => console.log('Cancel Pressed'),
                            //   style: 'cancel'
                            // },
                            // { text: 'OK', onPress: () => console.log('OK Pressed') }
                          ],
                          { cancelable: false }
                        );
                       
                // this.exitHome()
                
              }) // end of response
     
        .catch((error) => { // Error
          if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
            // alert('back end server error 1. Check console log for details. '+error.response.data+ 'Status: '+error.response.status)
              console.log('Module: HouseNumber: Server Error reported by response.data: ',error.response.data);
              console.log('Module: HouseNumber: Server Error reported by response.status: ',error.response.status);
              console.log('Module: HouseNumber: Server Error reported by response.headers: ',error.response.headers);
              this.exitHome()
          } else if (error.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the 
              // browser and an instance of
              // http.ClientRequest in node.js
              console.log('Module: HouseNumber: Server Error reported by error 2.request: ',error.request);
            // alert('back end server error. Check console log')
              this.exitHome()
          } else {
              // Something happened in setting up the request that triggered an Module: HouseNumber: Server Error
              console.log('Module: HouseNumber: Server Error', error.message);
              //alert('back end server error 3. Check console log')
              this.exitHome()
          }
            console.log('Module: HouseNumber: Server Error reported by error 4.config: ',error.config);
          //  alert('back end server error. Check console log')
            this.exitHome()
        }); // end of catch error
        
    // end of update backend
  },(t,error)=> {console.log('Db2 error: ',error);})

}  },(t,error)=> {console.log('Db4 error: ',error);})
       }
})})
  
  };// end of  updateTag


     exitHome =()=> { this.props.navigation.popToTop()}
 

  render() {
    return ( !this.state.ready ? null :
      <View style = {styles.container}>
      <Text style={styles.header}>   Select House Hold Number </Text>
      <Text style={styles.header}>   گهريلو نمبر چونڊيو </Text>
      <FlatList
        data={formatData(data, numColumns)}
        style={styles.container}
        renderItem={this.renderItem}
        numColumns={numColumns}
      />

            <View >
                { !this.state.ready && (
                <Text style={styles.big}>Using Geolocation in React Native.</Text>
                )}
                { this.state.error && (
                <Text style={styles.big}>{this.state.error}</Text>
                )}
                { this.state.ready && (
                    <Text style={styles.big}>{
                    `Location: ${this.state.where.lat} ${this.state.where.lng}`
                    }</Text>
                )}
            </View>
 



      <TouchableHighlight onPress = {this.exitHome} style={styles.item2}>
        <Text>Cancel Meat Distribution </Text>
      </TouchableHighlight>
       </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 20,
  },
  item: {
    backgroundColor: '#4D243D',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    margin: 1,
    height: Dimensions.get('window').width / numColumns, // approximate a square
  },
  item2: {
    backgroundColor: '#42f4eb',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 1,
     },
     header: {
      alignItems: 'center',
      justifyContent: 'center',
           },  
  itemInvisible: {
    backgroundColor: 'transparent',
  },
  itemText: {
    color: '#fff',
  },


  container2: {
    flex: 1,
    alignItems: 'center',
    justifyContent:'center',
    marginTop: 50,
    padding:16,
    backgroundColor:'white'
 },
 boldText: {
    fontSize: 15,
    color: 'red',
 },

 container3: {
  flex: 1,
  backgroundColor: '#fff',
  alignItems: 'center',
  justifyContent: 'center'
},
big: {
  fontSize: 10,
  color: 'red'
}

});


/* moved from render block
 <View style = {styles.container2}>
          <Image
            source={{uri:'https://png.icons8.com/dusk/100/000000/compass.png'}}
            style={{width: 100, height: 100}}
          />
          <Text style = {styles.boldText}>
             You are Here
          </Text>
          <Text style={{justifyContent:'center',alignItems: 'center',marginTop:16}}>
            Longitude: {this.state.currentLongitude}
          </Text>
          <Text style={{justifyContent:'center',alignItems: 'center',marginTop:16}}>
            Latitude: {this.state.currentLatitude}
          </Text>
       </View>
       **********************/
      
/*****************
    componentDidMount = () => {

        async function requestLocationPermission() {
          try {
            const { status, permissions } = await Permissions.askAsync(Permissions.LOCATION);

            if (status === 'granted') {
              //To Check, If Permission is granted
              that.callLocation(that);
            } else {
              alert("Permission Denied");
            }
          } catch (err) {
            alert("err",err);
            console.warn(err)
          }
        }
        requestLocationPermission();
      }    


     callLocation(that){
      //alert("callLocation Called");
        navigator.geolocation.getCurrentPosition(
          //Will give you the current location
           (position) => {
              const currentLongitude = JSON.stringify(position.coords.longitude);
              //getting the Longitude from the location json
              const currentLatitude = JSON.stringify(position.coords.latitude);
              //getting the Latitude from the location json
              that.setState({ currentLongitude:currentLongitude });
              //Setting state Longitude to re re-render the Longitude Text
              that.setState({ currentLatitude:currentLatitude });
              //Setting state Latitude to re re-render the Longitude Text
           },
           (error) => alert(error.message),
           { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
        that.watchID = navigator.geolocation.watchPosition((position) => {
          //Will give you the location on location change
            console.log(position);
            const currentLongitude = JSON.stringify(position.coords.longitude);
            //getting the Longitude from the location json
            const currentLatitude = JSON.stringify(position.coords.latitude);
            //getting the Latitude from the location json
           that.setState({ currentLongitude:currentLongitude });
           //Setting state Longitude to re re-render the Longitude Text
           that.setState({ currentLatitude:currentLatitude });
           //Setting state Latitude to re re-render the Longitude Text
        });
     }
     componentWillUnmount = () => {
        navigator.geolocation.clearWatch(this.watchID);
     }
**************************************/

//  in case of errors run following code may be in componentDidMount
    /*
    console.log('HouseNumber componentDidmount',db)
  
    db.transaction( tx => { tx.executeSql('select * from MeatPackageDistribution', [], (tx, results) => {  console.log('Results: ', results)
            if (results.rows.length > 0){
                  console.log('Results.rows: ', results.rows)
           } else {
             alert('No record found');
             
         }},(t,error)=> {console.log('Db1 error: ',error);})}) 
    **************/



    
//let VillageName1= "Goth Khan sb"
//console.log('before insert: ',HouseNumber, LivestockTag, PackageNumber,  updateTagData.timestamp, this.state.where.lat, this.state.where.lng, this.state.where.Ald)
/*
db.transaction(tx => { 
  tx.executeSql('insert into MeatPackageDistribution ( HouseHold, LivestockTag, PackageNumber, PackageHandedoverDate,Latitude, Longitude, Altitude ) values (?, ?, ?, ?, ?, ?, ? )', [HouseNumber, LivestockTag, PackageNumber,  updateTagData.timestamp, this.state.where.lat, this.state.where.lng, this.state.where.Ald],
  (tx, results) => {  console.log('Results: ', results)},(t,error)=> {console.log('Db2 error: ',error);})} 
  )
 
db.transaction(tx => { 
   tx.executeSql('select * from MeatPackageDistribution', [], (tx, results) => { 
    console.log ('results after insertion: ', results)
      if (results.rows.length > 0){
        console.log ('All rows from MeatPackageDistribution table: ', results.rows)
      } else {
          alert('No record found in the table MeatPackageDistribution');
      }},(t,error)=> {console.log('Db3 error: ',error);})})
**/  

