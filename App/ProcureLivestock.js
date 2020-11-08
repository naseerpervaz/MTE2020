
import React, { Component } from 'react';
import { StyleSheet, View, TouchableHighlight, Text, TextInput, Alert,ScrollView,FlatList,Picker } from 'react-native';
//import t from 'tcomb-form-native'; //npm i tcomb-form-native https://github.com/gcanti/tcomb-form-native
import {BackEndApi} from "./config/constants";
//import { _confirmProps } from 'react-native/Libraries/Modal/Modal';
import DateTimePicker from 'react-native-modal-datetime-picker';
import * as SQLite from 'expo-sqlite';
const axios = require('axios');

const db = SQLite.openDatabase('PRICELocal.db');

export class AddCow extends Component {
 static navigationOptions = {
        header: null
    };
 constructor(props) {
        super(props);
        this.state = { 
            isDateTimePickerVisible: false,
            isDoBTimePickerVisible: false,
            VillageName: 'Goth Khan Sahab',
            ProjectId: 'MTE',
            MoveToProjectApprovalStatus: 'Requested',
            CowTag: '',
            CowLiveWeight: '',
            PurchaseDate: new Date().toDateString(),
          //  PurchaseDate: '',
             CowDateOfBirth:'',
             CowDescription:'',
             CowAge:'',
             FeedId:1,
             FeedTable:[],
             FeedlotId:1, // HFL
             TransactionTimeStamp:new Date().toLocaleString(),
             where: {lat:null, lng:null, Ald: null},
             SynchronizeStatus:'',
             ValidCowTag: false,
            ValidPurchaseDate:true,
            ValidDoB:true,
            ValidCowLiveWeight: true,
            IsLivestockDetailsConfirmed: false
         }
    } // End of constructor
    async componentDidMount() {
    //console.log('props:\n',this.props)
      // Geo coodinates
      // maximumAge is sec * Min * hrs to keep the current lat and log coordinates. It is upto your app requirements that for how long you want to keep coordinates or you want to track for each movement etc
      let geoOptions = {
        enableHighAccuracy: true,
        timeOut: 20000,
        maximumAge: 60 * 60 * 24
                      };
        navigator.geolocation.getCurrentPosition( this.geoSuccess, this.geoFailure, geoOptions);

    //   // keep minimum info on Android Front-End. Maintain revalant tables on server-side. For example create tables on server side to generate QR codes and status of each meat package
      db.transaction(tx => {
        
        tx.executeSql(
          'create table if not exists Livestock(id integer primary key not null, LivestockTag text, PurchaseDate text, BirthDate text, Age text, OwnerId integer, DonorId integer, FeedId integer, ShortDescription text, PurchaseId integer, SaleId integer, SlaughterDate text, SlaughterId integer, ProjectId text, MoveToProjectApprovalStatus text,Latitude real, Longitude real, Altitude real, LiveWeight real,LivestockKindId integer, TransactionTimeStamp text, SynchronizeStatus text)'
        );
        
      });
    // this.DeleteLivestockFeedTransactions()
        
    } // end of component did mount

    geoSuccess = (position) => { this.setState({ ready:true,
          where: {lat: position.coords.latitude,lng:position.coords.longitude, Ald:position.coords.altitude }})
         // console.log('After pull geo location state data set: ',this.state)
     }
    geoFailure = (err) => {
      this.setState({error: err.message});
     }


       
  

validateLivestock=()=> {
   // Validate Livestock Tag Number

  //  event.preventDefault();
    const CowTagData = this.state.CowTag;
    console.log(`Cow Data: ${CowTagData}`)
    let numreg1 = /HFL/;
   if (numreg1.test(CowTagData) && CowTagData.length <= 16) {
      //test ok
     // alert('test ok')
      this.setState({ValidCowTag: true})
      //this.saveAtLocalStorage
    } else {
      //test not ok
      this.setState({ValidCowTag: false})
      this.setState({CowTag: ''})
     Alert.alert('Invalid value in Tag Number. Format: ABC-YYYYMMDD-999')
      } 
      // check if Livestock slaughter data already exist
     
      if (this.state.ValidCowTag) {
        this.searchLocalDb(CowTagData)
      }
  // Validate Slaughter Date

  // Validate weight of animal
  let numreg =new RegExp(/^[0-9.]+$/);
  if (numreg.test(this.state.CowLiveWeight) && Number(this.state.CowLiveWeight) > 22 && Number(this.state.CowLiveWeight) <= 800 ){
    //test ok
  //  alert('test ok')
    this.setState({ValidCowLiveWeight: true})
    //this.saveAtLocalStorage
  } else {
    //test not ok
    this.setState({ValidCowLiveWeight: false})
    this.setState({CowLiveWeight: ''})
   Alert.alert('Invalid weight. Range: 22.01 to 800.00')
    } 
    

if ( this.state.ValidCowTag && this.state.ValidPurchaseDate && this.state.ValidCowLiveWeight ){
  
    Alert.alert(
        //Title
       'Please confirm :',
        //Message
      
       `Cow Tag: ${this.state.CowTag}, Purchase Date: ${this.state.PurchaseDate},Live Weight: ${this.state.CowLiveWeight} Kg, Date of Birth: ${this.state.CowDateOfBirth}`, 
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
}
// END of validation

searchLocalDb = (CowTagData)=>{
  console.log('search if cow already exist in the local table: ', CowTagData, this.state.ProjectId)
   // throw all records on console log for testing
        //  db.transaction(tx => { 
        //   tx.executeSql('select * from Livestock', [], (tx, results) => { 
        //      if (results.rows.length > 0){
        //        console.log ('All rows from  Livestock table: ', results.rows)
        //      } else {
        //          alert('No record found in the table Livestock');
        //      }},(t,error)=> {console.log('Db3 Livestock TABLE error: ',error);})})
      
  
  
  db.transaction( tx => { 
         tx.executeSql('select * from Livestock where trim(LivestockTag) == ? AND trim(ProjectId) == ?', [CowTagData.trim(),this.state.ProjectId.trim()], (tx, results) =>{ 
          
          if (results.rows.length > 0){
           console.log('searchLocalDb Read from file: ',results.rows)
           Alert.alert('Check Livestock Tag number','This number is already used! هي نمبر پهريان ئي استعمال ٿيل آهي! لائيو اسٽاڪ ٽيگ نمبر چيڪ ڪريو')
           this.setState({ValidCowTag: false})
          this.setState({CowTag: ''})
          } 
        },(t,error)=> {console.log('Db6 Livestock table error: ',error);})})
    

  }

addDbDetails = () =>{
   db.transaction(tx => { 
      tx.executeSql('insert into Livestock(LivestockTag, ProjectId, MoveToProjectApprovalStatus, PurchaseDate, BirthDate, Age, ShortDescription, Latitude, Longitude,Altitude,LiveWeight,TransactionTimeStamp, SynchronizeStatus) values (?, ?, ?, ?, ?,?,?,?,?,?,?,?,?)', [this.state.CowTag, this.state.ProjectId, this.state.MoveToProjectApprovalStatus,this.state.PurchaseDate,this.state.CowDateOfBirth,this.state.CowAge,this.state.CowDescription,this.state.where.lat,this.state.where.lng, this.state.where.Ald,this.state.CowLiveWeight,this.state.TransactionTimeStamp,this.state.SynchronizeStatus], (tx, results) => { console.log ('results after Livestock insert: ', results) },(t,error)=> {console.log('Livestock table Db4 error: ',error);   this.exitHome()})
      
    });
    // this.setState({IsLivestockDetailsConfirmed: true})
   // console.log('data set from addDbDetails: ',this.state.CowTag, this.state.ProjectId, this.state.MoveToProjectApprovalStatus,this.state.PurchaseDate,this.state.CowDateOfBirth,this.state.CowAge,this.state.CowDescription,this.state.where.lat,this.state.where.lng, this.state.where.Ald,this.state.CowLiveWeight,this.state.TransactionTimeStamp,this.state.SynchronizeStatus)
    // update backend

    const updateCowTagData = {
      VillageName: this.state.VillageName,
     LivestockTag: this.state.CowTag,
     ProjectId: this.state.ProjectId,
     MoveToProjectApprovalStatus: this.state.MoveToProjectApprovalStatus,
     PurchaseDate: this.state.PurchaseDate,
     CowDateOfBirth: this.state.CowDateOfBirth,
     CowAge: this.state.CowAge,
     CowDescription: this.state.CowDescription,
     Lat: this.state.where.lat,
     Lng: this.state.where.lng,
     Ald: this.state.where.Ald,
     CowLiveWeight: this.state.CowLiveWeight, 
     FeedlotId: this.state.FeedlotId,
     TransactionTimestamp:this.state.TransactionTimeStamp,
     
    }
    // axios.post('http://be79db59.ngrok.io/DailyMilk/Add_Daily_Milk_Cow', updateCowTagData)
    
    const backendUrl= BackEndApi+'/DailyMilk/Add_Daily_Milk_Cow'
    axios.post(backendUrl, updateCowTagData)
    .then((response) => { // Success
      console.log('success response from server for AddDailyMilkCow update: ')
      console.log(response.data, response.status)
      // Synchronize if back-end update is success
     
      if (response.status == 200 ){
        db.transaction(tx => { 
        tx.executeSql(`UPDATE Livestock set SynchronizeStatus = ? where LivestockTag ='${updateCowTagData.LivestockTag}'`, ["Synchronized"], (tx, results) => { console.log ('results after Synchronization update: ', results) },(t,error)=> {console.log('Db4 error: ',error);   this.exitHome()})})
       
        // throw all records on console log for testing
        db.transaction(tx => { 
          tx.executeSql('select * from Livestock', [], (tx, results) => { 
             if (results.rows.length > 0){
               console.log ('All rows from SlaughteredLivestockDetails table: ', results.rows)
             } else {
                 alert('No record found in the table SlaughteredLivestockDetails');
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
   
    //add comment
   if (year == CurrentDate.getFullYear() || year >= CurrentDate.getFullYear() -3)
    {
    this.setState({PurchaseDate: pDate}) 
    this._hideDateTimePicker();
    this.setState({ValidPurchaseDate: true})
    }
    else {
        console.log('current year: ', CurrentDate.getFullYear());
        console.log('whereas picked date: ', pDate);
        this.setState({ValidPurchaseDate: false})
        this.setState({PurchaseDate:  new Date().toDateString()}) 
        this._hideDateTimePicker();
          }

  };
  
_showDoBTimePicker = () => this.setState({  isDoBTimePickerVisible: true });

_hideDoBTimePicker = () => this.setState({  isDoBTimePickerVisible: false });

_handleDoBPicked = (pickeddate) => {
  console.log('pickeddate: ', pickeddate);
  let pDate= pickeddate.toDateString();
  console.log('pickeddate to string: ', pDate);
  let  year  = pickeddate.getFullYear();
   let CurrentDate= new Date();
   
    //add comment
   if (year <= CurrentDate.getFullYear() )
    {
    this.setState({CowDateOfBirth: pDate}) 
    this._hideDoBTimePicker();
    this.setState({ValidDoB: true})
    }
    else {
        console.log('current year: ', CurrentDate.getFullYear());
        console.log('whereas picked date: ', pDate);
        this.setState({ValidDoB: false})
        this.setState({CowDateOfBirth:  new Date().toDateString()}) 
        this._hideDoBTimePicker();
          }

  };
  

    render() { 
 
        return ( 
            <ScrollView > 
             
            <View style={{flex: 1,flexDirection: 'column',justifyContent: 'center', marginLeft:10}}>
          
                  <Text style={{textAlign:'center', marginTop: 30, width: '90%', height: 50, backgroundColor: 'powderblue'}}> PRICE Local partner: Haque Feedlots SMC-Pvt Ltd Incorporated </Text>
                  <Text style={{textAlign:'center', marginTop: 6,marginLeft:13, width: '80%', height: 30, backgroundColor: 'powderblue'}}> Village Name: Goth Khan Sahab </Text>
                  <Text style={{textAlign:'center', marginTop: 1,marginLeft:13, width: '80%', height: 30, backgroundColor: 'powderblue'}}>Project Id: MTE </Text>
          
            
              <Text style={{textAlign:'center', marginLeft:13,marginTop: 20, width: '90%', height: 26, backgroundColor: 'lightgray'}}> Livsetock Tag #</Text>
              <TextInput style={{width: '90%', height: 26,textAlign:'center',   backgroundColor: 'yellow'}}
                            onChangeText={(text)=>this.setState({CowTag: text})}
                            value={this.state.CowTag}
                            placeholder = 'Type here'
                            placeholderTextColor= 'red' 
                            
                        />
                 <Text></Text>
               <Text style={{textAlign:'center', marginLeft:13,marginTop: 5, width: '90%', height: 26, backgroundColor: 'lightgray'}}> Purchase Date</Text>
                  
                    <TextInput /* Date of Purchase */
                    style={{width: '50%', height: 26, textAlign:'center', marginLeft:80,backgroundColor: 'yellow' /*backgroundColor: 'red'*/}}
                      onFocus={ () => this._showDateTimePicker() }
                      value={this.state.PurchaseDate}
                      
                  />
                    <DateTimePicker
                            isVisible={this.state.isDateTimePickerVisible}
                            onConfirm={this._handleDatePicked}
                            onCancel={this._hideDateTimePicker}
                            mode={'date'}
                            datePickerModeAndroid={'spinner'}

                          />
                  
            
                  <Text></Text>
                 <Text style={{textAlign:'center', marginLeft:13, marginTop: 1, width: '90%', height: 26, backgroundColor: 'lightgray'}}> Date of Birth (if known)</Text>
                 <TextInput /* Date of birth */
                    style={{width: '50%', height: 26,textAlign:'center', marginLeft:80,backgroundColor: 'yellow'}}
                      onFocus={ () => this._showDoBTimePicker() }
                      value={this.state.CowDateOfBirth}
                      
                  />
                    <DateTimePicker
                            isVisible={this.state.isDoBTimePickerVisible}
                            onConfirm={this._handleDoBPicked}
                            onCancel={this._hideDoBTimePicker}
                            mode={'date'}
                            datePickerModeAndroid={'spinner'}

                          />
                 <Text></Text>
                  <Text style={{textAlign:'center', marginLeft:13,marginTop: 5, width: '90%', height: 26, backgroundColor: 'lightgray'}}>Discription /Notes</Text>
                    <TextInput style={{width: '90%', height: 90, backgroundColor: 'yellow',marginLeft:13,/*backgroundColor: 'skyblue'*/}} multiline= {true} numberOfLines = {5}  maxLength = {100}
                    onChangeText={(text)=>this.setState({CowDescription: text})}
                    value={this.state.CowDescription}
                    placeholder = 'Type here notes/ discription of the Cattle'
                    placeholderTextColor= 'red' 
                    
                    />
               <Text></Text>
                  <Text style={{textAlign:'center', marginLeft:13,marginTop: 2, width: '90%', height: 26, backgroundColor: 'lightgray'}}>Cattle Age         Weight</Text>
              <View style={{flex: 1,flexDirection: 'row', justifyContent: 'center'}}>  
                    
             
              <TextInput style={{width: '40%', height: 20, backgroundColor: 'yellow' /*backgroundColor: 'skyblue'*/}}
              
              onChangeText={(text)=>this.setState({CowAge: text})}
              value={this.state.CowAge}
              placeholder = 'Type here Age'
              placeholderTextColor= 'red' 
              
               />
                
             <TextInput style={{width: '40%', height: 20, marginLeft:30, /*backgroundColor: 'skyblue'*/}}
             
             onChangeText={(text)=>this.setState({CowLiveWeight: text})}
             value={this.state.CowLiveWeight}
             placeholder = '    Weight'
             placeholderTextColor= 'red' 
             
              />
            </View>        

            <View style={{flex: 1,flexDirection: 'row', justifyContent: 'center',marginTop: 30,}}>
              <TouchableHighlight  style={{width: '95%', height: '95%', alignItems: 'center', backgroundColor: '#35605a'}} onPress={this.validateLivestock()}>
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

