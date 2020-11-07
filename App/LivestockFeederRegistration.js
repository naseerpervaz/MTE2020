
import React, { Component } from 'react';
import { StyleSheet, View, TouchableHighlight, Text, TextInput, Alert,ScrollView,FlatList,Picker } from 'react-native';
//import t from 'tcomb-form-native'; //npm i tcomb-form-native https://github.com/gcanti/tcomb-form-native
import {BackEndApi} from "./config/constants";
//import { _confirmProps } from 'react-native/Libraries/Modal/Modal';
import DateTimePicker from 'react-native-modal-datetime-picker';
import * as SQLite from 'expo-sqlite';
const axios = require('axios');

const db = SQLite.openDatabase('PRICELocal.db');

export class LivestockFeederRegistration extends Component {
 static navigationOptions = {
        header: null
    };
 constructor(props) {
        super(props);
        this.state = { 
            isDateTimePickerVisible: false,
            
            VillageName: 'Goth Khan Sahab',
            ProjectId: 'MTE',
            where: {lat:null, lng:null, Ald: null},
           
            feedlotRegistrationTimestamp: new Date().toDateString(),
             SynchronizeStatus:'',
             ValidCowTag: false,
             IsLivestockDetailsConfirmed: false,
             FeedlotId:  null,
             FeedlotName:  "",
             FeedlotOwnerId:  null,
             FeedlotAddress:  null,
             FeedlotVillage:  null,
             FeedlotLatitude:  null,
             feedlotLongitude:  null,
             feedlotAltitude:  null,
             feedlotOwnerName:  null,
             feedlotOwnerNIC:  null,
             feedlotBankAccountNumber:  null,
             feedlotsBankName:  null,
             feedlotBankAddress:  null,
             feedlotOwnerPhone:  null,
             feedlotHouseholdNumber:  null,
             feedlotRemarks:null,
         }
    } // End of constructor
    async componentDidMount() {
    // console.log('props:\n',this.props)
      // Geo coodinates
      // maximumAge is sec * Min * hrs to keep the current lat and log coordinates. It is upto your app requirements that for how long you want to keep coordinates or you want to track for each movement etc
      let geoOptions = {
        enableHighAccuracy: true,
        timeOut: 20000,
        maximumAge: 60 * 60 * 24
                      };
        navigator.geolocation.getCurrentPosition( this.geoSuccess, this.geoFailure, geoOptions);

        // db.transaction(tx => {
        //     tx.executeSql(
        //       'DROP TABLE Feedlots;', [],
        //       (tx, results) => {  console.log('table Feedlots dropped result: \n',results)},
        //       (tx, error) => {console.log(error);}
        //     )
        //   });
      db.transaction(tx => {
        
        tx.executeSql(
          'create table if not exists Feedlots(id integer primary key not null,FeedlotId integer, FeedlotName text,FeedlotOwnerId integer, FeedlotAddress text,FeedlotVillage text,feedlotHouseholdNumber integer,FeedlotLatitude real,feedlotAltitude real,feedlotLongitude real,feedlotBankAccountNumber text,feedlotsBankName text,feedlotBankAddress text,feedlotOwnerPhone text,feedlotRegistrationTimestamp text,feedlotOwnerName text,feedlotOwnerNIC text,feedlotRemarks text, SynchronizeStatus text)'
        );
        
      });
            
    } // end of component did mount

    geoSuccess = (position) => { this.setState({ ready:true,
          where: {lat: position.coords.latitude,lng:position.coords.longitude, Ald:position.coords.altitude }})
         // console.log('After pull geo location state data set: ',this.state)
     }
    geoFailure = (err) => {
      this.setState({error: err.message});
     }


       
  

validate=()=> {
//    console.log('\n trace from LivestockFeederRegistration: ', this.state)
   if (this.state.FeedlotName === null || this.state.FeedlotName.trim() ==="" ){console.log("FeedlotName not define"); return}
  this.searchLocalDb()
  
    Alert.alert(
        //Title
       'Please confirm :',
        //Message
      
       this.state.FeedlotId +"  "+ this.state.FeedlotName +"  "+this.state.FeedlotOwnerId +"  "+ this.state.FeedlotAddress +"  "+this.state.FeedlotVillage +"  "+this.state.feedlotOwnerName+" "+this.state.feedlotHouseholdNumber +"  "+this.state.where.lat+"  "+ this.state.where.Ald+"  "+this.state.where.lng+"  "+this.state.feedlotBankAccountNumber +"  "+this.state.feedlotsBankName +"  "+this.state.feedlotBankAddress +"  "+this.state.feedlotOwnerPhone +"  "+this.state.feedlotRegistrationTimestamp +"  "+this.state.SynchronizeStatus+" "+this.state.feedlotRemarks, 
        //Button
       [
         {text: 'No, edit data', onPress: () => {console.log('Ask me later pressed')
        return}},
         {text: 'Cancel', onPress: ()=> this.props.navigation.goBack(), style: 'cancel'},
         {text: 'Confirm', onPress: () => this.addDbDetails()},
       ],
        //Options
       { cancelable: false } 
     )

}
// END of validation

searchLocalDb = ()=>{
//   console.log('search if Feedlot already exist in the local table: ',this.state.FeedlotName)
   // throw all records on console log for testing
        //  db.transaction(tx => { 
        //   tx.executeSql('select * from Feedlots', [], (tx, results) => { 
        //      if (results.rows.length > 0){
        //        console.log ('All rows from  Feedlots table: ', results.rows)
        //      } else {
        //          alert('No record found in the table Feedlots Registration table');
        //      }},(t,error)=> {console.log('Db3 Livestock TABLE error: ',error);})})
      
  
  
  db.transaction( tx => { 
         tx.executeSql('select * from Feedlots where trim(FeedlotName) == ? ', [this.state.FeedlotName.trim()], (tx, results) =>{ 
          
          if (results.rows.length > 0){
           console.log('searchLocalDb Read from file: ',results.rows)
           Alert.alert('Check Feedlot Name','This Feedlot is already Registered! ')
         
          this.setState({FeedlotName: ''})
         
          } 
        },(t,error)=> {console.log('Db6 Livestock table error: ',error);})})
    

  }

addDbDetails = () =>{
    if (this.state.FeedlotName === null || this.state.FeedlotName.trim() ==="" ){console.log("FeedlotName not define"); return}
   db.transaction(tx => { 
      tx.executeSql('insert into Feedlots(FeedlotId, FeedlotName ,FeedlotOwnerId , FeedlotAddress ,FeedlotVillage ,feedlotOwnerName,feedlotHouseholdNumber ,FeedlotLatitude ,feedlotAltitude ,feedlotLongitude ,feedlotBankAccountNumber ,feedlotsBankName ,feedlotBankAddress ,feedlotOwnerPhone ,feedlotRegistrationTimestamp , SynchronizeStatus,feedlotRemarks,feedlotOwnerNIC) values (?, ?, ?, ?, ?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [this.state.FeedlotId, this.state.FeedlotName ,this.state.FeedlotOwnerId , this.state.FeedlotAddress ,this.state.FeedlotVillage,this.state.feedlotOwnerName,this.state.feedlotHouseholdNumber ,this.state.where.lat, this.state.where.Ald,this.state.where.lng,this.state.feedlotBankAccountNumber ,this.state.feedlotsBankName ,this.state.feedlotBankAddress ,this.state.feedlotOwnerPhone ,this.state.feedlotRegistrationTimestamp ,this.state.SynchronizeStatus,this.state.feedlotRemarks,this.state.feedlotOwnerNIC], (tx, results) => { console.log ('results after Feedlot insert: ', results);
      
        tx.executeSql('select * from Feedlots where trim(FeedlotName) == ? ', [this.state.FeedlotName.trim()], (tx, results) =>{  
            console.log('inserted record from Feedlots: ',results.rows)
         if (results.rows.length > 0){
          this.setState({FeedlotId: results.rows._array[0].id}) 
         } 
                 },(t,error)=> {console.log('Db7 Feedlots table error: ',error);})
      
     },(t,error)=> {console.log('Feedlots table Db4 error: ',error);   this.exitHome()})
      
     // update FeedlotId
        db.transaction(tx => { 
            tx.executeSql(`UPDATE Feedlots set FeedlotId = ? where TRIM(FeedlotName) = ? `, [this.state.FeedlotId,this.state.FeedlotName.trim()], (tx, results) => { /*console.log ('results after FeedlotId update: ', results)*/ },(t,error)=> {console.log('Db8 error: ',error);   this.exitHome()})
        });
    })
    // update backend

    const Data = {
        FeedlotId: this.state.FeedlotId, FeedlotName: this.state.FeedlotName ,FeedlotOwnerId: this.state.FeedlotOwnerId , FeedlotAddress: this.state.FeedlotAddress ,FeedlotVillage: this.state.FeedlotVillage ,feedlotHouseholdNumber: this.state.feedlotHouseholdNumber ,feedlotOwnerName: this.state.feedlotOwnerName,FeedlotLatitude: this.state.where.lat,feedlotAltitude: this.state.where.Ald,feedlotLongitude: this.state.where.lng,feedlotBankAccountNumber: this.state.feedlotBankAccountNumber ,feedlotsBankName: this.state.feedlotsBankName ,feedlotBankAddress: this.state.feedlotBankAddress ,feedlotOwnerPhone: this.state.feedlotOwnerPhone ,feedlotRegistrationTimestamp: this.state.feedlotRegistrationTimestamp, feedlotRemarks:this.state.feedlotRemarks,feedlotOwnerNIC:this.state.feedlotOwnerNIC
    }
    // console.log('Ddddddddddddddddddata: \n',Data)
    // axios.post('http://be79db59.ngrok.io/Feedlots', Data)
    
    const backendUrl= BackEndApi+'/feedlots'
    axios.post(backendUrl, Data)
    .then((response) => { // Success
      console.log('success response from server for Register Feedlots update: ')
      console.log(response.data, response.status)
      // Synchronize if back-end update is success
     
      if (response.status == 200 ){
        db.transaction(tx => { 
        tx.executeSql(`UPDATE Feedlots set SynchronizeStatus = ? where TRIM(FeedlotName) = ?`, ["Synchronized",this.state.FeedlotName.trim()], (tx, results) => { console.log ('results after Synchronization update: ', results) },(t,error)=> {console.log('Db9 error: ',error);   this.exitHome()})})
       
        // throw all records on console log for testing
        db.transaction(tx => { 
          tx.executeSql('select * from Feedlots', [], (tx, results) => { 
             if (results.rows.length > 0){
               console.log ('All rows from Feedlots table: ', results.rows)
             } else {
                 alert('No record found in the table Feedlots');
             }},(t,error)=> {console.log('Db3 error: ',error);})})
      }

          
    }) // end of response
     
    .catch((error) => { // Error
      if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          alert('back end server error 1. Check console log for details. '+error.response.data+ 'Status: '+error.response.status)
          console.log('Error reported by response.data: ',error.response.data);
          console.log('Error reported by response.status: ',error.response.status);
          console.log('Error reported by response.headers: ',error.response.headers);
          this.exitHome()
      } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the 
          // browser and an instance of
          // http.ClientRequest in node.js
          console.log('Error reported by error 2.request: ',error.request);
          alert('back end server error. Check console log')
          this.exitHome()
      } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
          alert('back end server error 3. Check console log')
          this.exitHome()
      }
        console.log('Error reported by error 4.config: ',error.config);
        alert('back end server error. Check console log')
        this.exitHome()
    }); // end of catch error
    this.props.navigation.goBack()

    }; //end of addDbDetails
    exitHome =()=> {  this.props.navigation.goBack() }

   
 _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

_hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });
_handleDatePicked = (pickeddate) => {
  console.log('pickeddate: ', pickeddate);
  let pDate= pickeddate.toDateString();
  console.log('pickeddate to string: ', pDate);
   let year  = pickeddate.getFullYear();
  let  CurrentDate= new Date();
   
    //DATE LESS THEN THREE YEARS NOT VALIDE
   if (year == CurrentDate.getFullYear() || year >= CurrentDate.getFullYear() -3)
    {
    this.setState({feedlotRegistrationTimestamp: pDate}) 
    this._hideDateTimePicker();
    // this.setState({ValidRegistrationDate: true})
    }
    else {
        Alert.alert("Invalid Registration Date")
        console.log('current year: ', CurrentDate.getFullYear());
        console.log('whereas picked date: ', pDate);
        // this.setState({ValidPurchaseDate: false})
        this.setState({feedlotRegistrationTimestamp:  new Date().toDateString()}) 
        this._hideDateTimePicker();
          }

  };
 
    render() { 
 
        return ( 
            <ScrollView > 
             
            <View style={{flex: 1,flexDirection: 'column',justifyContent: 'center', marginLeft:10}}>
          
                  <Text style={{textAlign:'center', marginTop: 15, width: '97%', height: 50, backgroundColor: 'powderblue'}}> PRICE Local partner: Haque Feedlots SMC-Pvt Ltd Incorporated </Text>
                  <Text style={{textAlign:'center', marginTop: 6,marginLeft:13, width: '90%', height: 30, backgroundColor: 'powderblue'}}> Livestock Feeder Registration </Text>
                  <Text style={{textAlign:'center', marginTop: 1,marginLeft:13, width: '90%', height: 30, backgroundColor: 'powderblue'}}>Project Id: MTE </Text>
          
            
              <Text style={{textAlign:'center', marginLeft:13,marginTop: 20, width: '90%', height: 26, backgroundColor: 'lightgray'}}> Livestock Feeder Name </Text>
              <TextInput style={{width: '90%', height: 26,textAlign:'center', marginLeft:13,backgroundColor: 'yellow'}}
                            onChangeText={(text)=>this.setState({FeedlotName: text})}
                            value={this.state.FeedlotName}
                            placeholder = 'Type here'
                            placeholderTextColor= 'red' 
                            
                        />
                        
            
              <Text style={{textAlign:'center', marginLeft:13,marginTop: 20, width: '90%', height: 26, backgroundColor: 'lightgray'}}> Livestock Feeder Village Name </Text>
              <TextInput style={{width: '90%', height: 26,textAlign:'center', marginLeft:13,   backgroundColor: 'yellow'}}
                            onChangeText={(text)=>this.setState({FeedlotVillage: text})}
                            value={this.state.FeedlotVillage}
                            placeholder = 'Type here'
                            placeholderTextColor= 'red' 
                            
                        />
              <Text style={{textAlign:'center', marginLeft:13,marginTop: 20, width: '90%', height: 26, backgroundColor: 'lightgray'}}> Livestock Feeder Address </Text>
              <TextInput style={{width: '90%', height: 26,textAlign:'center', marginLeft:13,   backgroundColor: 'yellow'}}
                            onChangeText={(text)=>this.setState({FeedlotAddress: text})}
                            value={this.state.FeedlotAddress}
                            placeholder = 'Type here'
                            placeholderTextColor= 'red' 
                            
                        />
              <Text style={{textAlign:'center', marginLeft:13,marginTop: 20, width: '90%', height: 26, backgroundColor: 'lightgray'}}> Livestock Feeder Owner Name </Text>
              <TextInput style={{width: '90%', height: 26,textAlign:'center', marginLeft:13,   backgroundColor: 'yellow'}}
                            onChangeText={(text)=>this.setState({feedlotOwnerName: text})}
                            value={this.state.feedlotOwnerName}
                            placeholder = 'Type here'
                            placeholderTextColor= 'red' 
                            
                        />
              <Text style={{textAlign:'center', marginLeft:13,marginTop: 20, width: '90%', height: 26, backgroundColor: 'lightgray'}}>Owner Household Number </Text>
              <TextInput style={{width: '90%', height: 26,textAlign:'center',  marginLeft:13,  backgroundColor: 'yellow'}}
                            onChangeText={(text)=>this.setState({feedlotHouseholdNumber: text})}
                            value={this.state.feedlotHouseholdNumber}
                            placeholder = 'Type here'
                            placeholderTextColor= 'red' 
                            keyboardType= 'numeric'
                            
                        />
              <Text style={{textAlign:'center', marginLeft:13,marginTop: 20, width: '90%', height: 26, backgroundColor: 'lightgray'}}>Owner Phone Number </Text>
              <TextInput style={{width: '90%', height: 26,textAlign:'center',  marginLeft:13,  backgroundColor: 'yellow'}}
                            onChangeText={(text)=>this.setState({feedlotOwnerPhone: text})}
                            value={this.state.feedlotOwnerPhone}
                            placeholder = 'Type here'
                            placeholderTextColor= 'red' 
                            keyboardType='phone-pad'
                            
                        />
              <Text style={{textAlign:'center', marginLeft:13,marginTop: 20, width: '90%', height: 26, backgroundColor: 'lightgray'}}>Owner National Id Card Number </Text>
              <TextInput style={{width: '90%', height: 26,textAlign:'center',   marginLeft:13, backgroundColor: 'yellow'}}
                            onChangeText={(text)=>this.setState({feedlotOwnerNIC: text})}
                            value={this.state.feedlotOwnerNIC}
                            placeholder = 'Type here'
                            placeholderTextColor= 'red' 
                            
                        />
                        
              <Text style={{textAlign:'center', marginLeft:13,marginTop: 20, width: '90%', height: 26, backgroundColor: 'lightgray'}}> Livestock Feeder Bank Name </Text>
              <TextInput style={{width: '90%', height: 26,textAlign:'center',  marginLeft:13,  backgroundColor: 'yellow'}}
                            onChangeText={(text)=>this.setState({feedlotsBankName: text})}
                            value={this.state.feedlotsBankName}
                            placeholder = 'Type here'
                            placeholderTextColor= 'red' 
                            
                        />
                        
              <Text style={{textAlign:'center', marginLeft:13,marginTop: 20, width: '90%', height: 26, backgroundColor: 'lightgray'}}> Livestock Feeder Bank Address </Text>
              <TextInput style={{width: '90%', height: 26,textAlign:'center', marginLeft:13,   backgroundColor: 'yellow'}}
                            onChangeText={(text)=>this.setState({feedlotBankAddress: text})}
                            value={this.state.feedlotBankAddress}
                            placeholder = 'Type here'
                            placeholderTextColor= 'red' 
                            
                        />
                        
              <Text style={{textAlign:'center', marginLeft:13,marginTop: 20, width: '90%', height: 26, backgroundColor: 'lightgray'}}> Livestock Feeder Bank Account Number </Text>
              <TextInput style={{width: '90%', height: 26,textAlign:'center',  marginLeft:13,  backgroundColor: 'yellow'}}
                            onChangeText={(text)=>this.setState({feedlotBankAccountNumber: text})}
                            value={this.state.feedlotBankAccountNumber}
                            placeholder = 'Type here'
                            placeholderTextColor= 'red' 
                            
                        />
               
                 <Text></Text>
                  <Text style={{textAlign:'center', marginLeft:13,marginTop: 5, width: '90%', height: 26, backgroundColor: 'lightgray'}}>Discription /Notes</Text>
                    <TextInput style={{width: '90%', height: 90, backgroundColor: 'yellow',marginLeft:13,/*backgroundColor: 'skyblue'*/}} multiline= {true} numberOfLines = {5}  maxLength = {100}
                    onChangeText={(text)=>this.setState({feedlotRemarks: text})}
                    value={this.state.feedlotRemarks}
                    placeholder = 'Type here notes (if any) on Feedlot'
                    placeholderTextColor= 'red' 
                    
                    />
               <Text style={{textAlign:'center', marginLeft:13,marginTop: 5, width: '90%', height: 26, backgroundColor: 'lightgray'}}> Feedlot Registration Date</Text>
                  
                  <TextInput /* Date of Purchase */
                  style={{width: '50%', height: 26, textAlign:'center', marginLeft:80,backgroundColor: 'yellow' /*backgroundColor: 'red'*/}}
                    onFocus={ () => this._showDateTimePicker() }
                    value={this.state.feedlotRegistrationTimestamp}
                    
                />
                  <DateTimePicker
                          isVisible={this.state.isDateTimePickerVisible}
                          onConfirm={this._handleDatePicked}
                          onCancel={this._hideDateTimePicker}
                        
                          mode={'date'}
                          datePickerModeAndroid={'spinner'}

                        />
                     

            <View style={{flex: 1,flexDirection: 'row', justifyContent: 'center',marginTop: 30,}}>
              <TouchableHighlight  style={{width: '95%', height: '95%', alignItems: 'center', backgroundColor: '#35605a'}} onPress={()=>this.validate()}>
                        <Text style={styles.buttonText}>Submit</Text>
              </TouchableHighlight>
            </View>
            
           </View>
            </ScrollView>
         );
        }
      }
         
// React Native flex basics watch https://www.youtube.com/watch?v=-xFF5KF-KpE
const styles = StyleSheet.create({
    container: {
        //flex: 1,
        flexDirection: 'row', // default is 'column'
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: '5%',
        paddingTop: '10%'
    },
    heading: {
       // alignItems: 'flex-end',
        width: 50,
        fontSize: 12,
        backgroundColor: '#DCDCDC'
     //   flex: 1
    },
    inputs: {
     // flex: .21,
        width: '50%',
        backgroundColor: 'yellow',
        padding: 1,
        textAlign: "center",
        borderColor: 'gray', borderWidth: 1
    },
    buttons:{
        marginTop: 10,
        fontSize: 16
    },
    labels: {
        marginLeft:15,
        paddingBottom: 5,
        alignItems: 'center',
    },
    labels2: {
        marginLeft:15,
        paddingBottom: 5,
        alignItems: 'center',
        color: '#e7203e'
    },
    
    buttonRow: {
       // flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ffffff',
        borderBottomWidth: 1
    },
    buttonStyles: {
        backgroundColor: '#35605a',
        width: '50%',
        height: '50%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonStyles2: {
        backgroundColor: '#35605a',
        width: '33%',
        height: '50%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonStyles3: {
      backgroundColor: '#35605a',
      width: '48%',
      height: '50%',
      justifyContent: 'center',
      alignItems: 'center'
  },
    buttonText:{
        color: '#ffffff',
        fontSize: 15
    }
});

