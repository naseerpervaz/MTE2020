
import React, { Component  } from 'react';
import { StyleSheet, View, TouchableHighlight, Text, TextInput, Alert,ScrollView} from 'react-native';
// import { useNavigation } from '@react-navigation/native';
import {BackEndApi} from "./config/constants";
//import { _confirmProps } from 'react-native/Libraries/Modal/Modal';
import DateTimePicker from 'react-native-modal-datetime-picker';
// const {SelectCattleFeeder} =require('./functionalComponents/selectFeedlot')

// import {createTable} from './database/CRUD'
import * as CRUD from './database/CRUD'
import * as validations from './functionalComponents/validations'
import * as SQLite from 'expo-sqlite';
const axios = require('axios');

const db = SQLite.openDatabase('PRICELocal.db');

export class HandingOverLivestock extends Component {
 static navigationOptions = {
        header: null
    };
 constructor(props) {
        super(props);
        this.state = { 
            isDateTimePickerVisible: false,
            selectedId:null,
            VillageName: 'Goth Khan Sahab',
            ProjectId: 'MTE',
            where: {lat:null, lng:null, Ald: null},
            ContractStatus:"Open",
            feedlotRegistrationTimestamp: new Date().toDateString(),
             SynchronizeStatus:'',
             LivestockTag1: null,
             LivestockTag2: null,
             LivestockTag3: null,
             LivestockTag4: null,
             LivestockTag5: null,
             FeedLotId: null,
             FeedlotContractorName: null,
             LivestockWeight1: null,
             LivestockWeight2: null,
             LivestockWeight3: null,
             LivestockWeight4: null,
             LivestockWeight5: null,
             Latitude: null,
             Longitude: null,
             Altitude: null,
             TransactionTimestamp: null,
             Household: null,
             ProjectCode: null,
             Remarks:  null,
             VillageName: null,
             LivestockFeederContractDate: new Date().toDateString(),
             LivestockFeederContractExpDate: new Date().toDateString(),
             LivestockFeederContractDuration: null,
             LivestockFeederContractName: "Press here to select Contract Name",
             LivestockFeederContractId:null,
             NumberOfLivestockRecieved: null,
             LivestockRecievedTimeStamp: null,
             LivesstockRecievedLatitude: null,
             LivesstockRecievedLongitute: null,
             LivesstockRecievedAltitude: null,
            
         }
    } // End of constructor
    async componentDidMount() {
    console.log('\n trace from HandingOveLivestock: props:\n',this.props)
    this.updateSateWithRoute()
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
        //       'DROP TABLE Contract;', [],
        //       (tx, results) => {  console.log('table LivestockFeederContract dropped result: \n',results)},
        //       (tx, error) => {console.log(error);}
        //     )
        //   });
        // NPQ to move following to initlization of app and CRUD module iA 03-NOV-2020
        CRUD.createTable ('LivestockFeederContract','id integer primary key not null,LivestockFeederContractName text,LivestockFeederContractId integer,FeedlotName text, FeedLotId integer,LivestockTag1 text,LivestockWeight1 real,LivestockTag2 text,LivestockWeight2 real,LivestockTag3 text,LivestockWeight3 real,LivestockTag4 text,LivestockWeight4 real,LivestockTag5 text,LivestockWeight5 real,Latitude real,Longitude real,Altitude real,TransactionTimestamp text,Household integer,ProjectCode text,Remarks text,VillageName text,LivestockFeederContractDate text,LivestockFeederContractExpDate text,LivestockFeederContractDuration text,NumberOfLivestockRecieved integer,LivestockRecievedTimeStamp text,LivesstockRecievedLatitude real,LivesstockRecievedLongitute real,LivesstockRecievedAltitude real,SynchronizeStatus text,ContractStatus text')
       let result=await CRUD.MetaTable_Contracts()
       let result2= await CRUD.MetaTable_Contracts_Insert()
        
         
    } // end of component did mount

    geoSuccess = (position) => { this.setState({ ready:true,
          where: {lat: position.coords.latitude,lng:position.coords.longitude, Ald:position.coords.altitude },
          LivesstockRecievedAltitude: position.coords.altitude ,LivesstockRecievedLatitude:  position.coords.latitude, LivesstockRecievedLongitute: position.coords.longitude
        })
         // console.log('After pull geo location state data set: ',this.state)
     }
    geoFailure = (err) => {
      this.setState({error: err.message});
     }
 updateSateWithRoute=()=>{
  //  console.log('\nfrom HamdingOverLivestock.updateSateWithRoute:  this.props.route.params:\n ', this.props.route.params)
  const  {contractor, contractorId}= this.props.route.params
       const  {contract, contractId}= this.props.route.params
       if(contractor){this.setState({ FeedlotContractorName: contractor, FeedLotId: contractorId})}
       if(contract){this.setState({LivestockFeederContractName: contract,LivestockFeederContractId: contractId })}
 }

      checkMandatory=()=>{
        // console.log('this.state.LivestockFeederContractDate >=  this.state.LivestockFeederContractExpDate ',this.state.LivestockFeederContractDate, this.state.LivestockFeederContractExpDate )
        if (this.state.LivestockFeederContractName === null || this.state.LivestockFeederContractName.trim() ==="Press here to select Contract Name" ){
          Alert.alert(' Contract Name is empty'); return true
        }
        if (this.state.FeedlotContractorName === null || this.state.FeedlotContractorName.trim() ==="" ){
          Alert.alert(' Livestock Feeder Name is empty'); return true
        }
        if (this.state.LivestockFeederContractDate ===  this.state.LivestockFeederContractExpDate ){
          Alert.alert(' Invalid: Contract date',' is same as Contract expiry date'); return true
        }
        if (new Date (this.state.LivestockFeederContractDate )>= new Date( this.state.LivestockFeederContractExpDate) ){
          Alert.alert(' Invalid: Contract date',' shoud be less then Contract expiry date'); return true
        }
        // console.log('\n trace from HandingOverLivestock.validate:NumberOfLivestockRecieved: ', this.state.NumberOfLivestockRecieved)
        if (this.state.NumberOfLivestockRecieved === null || parseInt(this.state.NumberOfLivestockRecieved) <=0 || parseInt(this.state.NumberOfLivestockRecieved)>5){
          Alert.alert(' Invalid: number of livestock recieved   ',this.state.NumberOfLivestockRecieved); return true
        }
        if (this.state.LivestockTag1 === null || this.state.LivestockTag1.trim() ==="" ){
          Alert.alert(' Livestock Tag Number is required'); return true
        }
        if (this.state.LivestockWeight1 === null || this.state.LivestockWeight1.trim() ==="" ){
          Alert.alert(' Livestock weight is empty'); return true
        }
      }
  

validate=()=> {
if ( this.checkMandatory()) {return}
if(parseInt(this.state.NumberOfLivestockRecieved)>0 && !validations.ValidateTag(this.state.LivestockTag1)){ return}
if(parseInt(this.state.NumberOfLivestockRecieved)>0 && !validations.ValidateLiveWeight(this.state.LivestockWeight1)){ return}
if(parseInt(this.state.NumberOfLivestockRecieved)>1 && !validations.ValidateTag(this.state.LivestockTag2)){ return}
if(parseInt(this.state.NumberOfLivestockRecieved)>1 && !validations  .ValidateLiveWeight(this.state.LivestockWeight2)){ return}
if(parseInt(this.state.NumberOfLivestockRecieved)>2 && !validations  .ValidateTag(this.state.LivestockTag3)){ return}
if(parseInt(this.state.NumberOfLivestockRecieved)>2 && !validations  .ValidateLiveWeight(this.state.LivestockWeight3)){ return}
if(parseInt(this.state.NumberOfLivestockRecieved)>3 && !validations  .ValidateTag(this.state.LivestockTag4)){ return}
if(parseInt(this.state.NumberOfLivestockRecieved)>3 && !validations  .ValidateLiveWeight(this.state.LivestockWeight4)){ return}
if(parseInt(this.state.NumberOfLivestockRecieved)>4 && !validations  .ValidateTag(this.state.LivestockTag5)){ return}
if(parseInt(this.state.NumberOfLivestockRecieved)>4 && !validations  .ValidateLiveWeight(this.state.LivestockWeight5)){ return}
  //  console.log('\n trace from HandingOverLivestock.validate: ', this.state)

   
 if( this.searchLocalDb()){return}
  
    Alert.alert( 'Please confirm that:', "YOU WANT TO SAVE CONTRACT", 
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
//   console.log('search if LivestockFeederContractName already exist in the local table: ',this.state.LivestockFeederContractName)
   // throw all records on console log for testing
        //  db.transaction(tx => { 
        //   tx.executeSql('select * from LivestockFeederContract', [], (tx, results) => { 
        //      if (results.rows.length > 0){
        //        console.log ('All rows from  LivestockFeederContract table: ', results.rows)
        //      } else {
        //          alert('No record found in the table LivestockFeederContract table');
        //      }},(t,error)=> {console.log('Db3 LivestockFeederContract TABLE error: ',error);})})
      
  
  
  db.transaction( tx => { 
         tx.executeSql('select * from LivestockFeederContract where trim(LivestockFeederContractName) = ? AND trim(FeedlotName) = ?', [this.state.LivestockFeederContractName.trim(),this.state.FeedlotContractorName.trim()], (tx, results) =>{ 
          
          if (results.rows.length > 0){
           console.log('searchLocalDb results table LivestockFeederContract: ',results.rows)
           Alert.alert('Check Contract Name','This contract is already registered for this Feedlot ')
         
          this.setState({LivestockFeederContractName: ''})
          return false
          } 
          return true
        },(t,error)=> {console.log('Db6 LivestockFeederContract table error: ',error);})})
    

  }
   



addDbDetails = () =>{
  // console.log('\n\n\naddDbDetail:   this.state: \n',this.state)
  // console.log('\n\n\naddDbDetail:\n',this.state.LivestockFeederContractName,this.state.LivestockFeederContractId,this.state.FeedlotContractorName ,this.state.FeedLotId ,this.state.LivestockTag1 ,this.state.  LivestockWeight1 ,this.state.  LivestockTag2 ,this.state.  LivestockWeight2 ,this.state.  LivestockTag3 ,this.state.  LivestockWeight3,this.state.  LivestockTag4,this.state.  LivestockWeight4 ,this.state.  LivestockTag5 ,this.state.  LivestockWeight5 ,this.state.  Latitude ,this.state.  Longitude ,this.state.  Altitude ,this.state.  TransactionTimestamp ,this.state.  Household ,this.state.  ProjectCode ,this.state.  Remarks ,this.state.  VillageName ,this.state.  LivestockFeederContractDate ,this.state.  LivestockFeederContractExpDate ,this.state.  LivestockFeederContractDuration ,this.state.  NumberOfLivestockRecieved ,this.state.  LivestockRecievedTimeStamp ,this.state.  LivesstockRecievedLatitude ,this.state.  LivesstockRecievedLongitute ,this.state.  LivesstockRecievedAltitude ,this.state.  SynchronizeStatus)
  
  
    if (this.state.LivestockFeederContractName === null || this.state.LivestockFeederContractName.trim() ==="" ){console.log("LivestockFeederContractName not define"); return}
   db.transaction(tx => { 
      tx.executeSql('insert into LivestockFeederContract(LivestockFeederContractName,LivestockFeederContractId,FeedlotName , FeedLotId ,LivestockTag1 ,LivestockWeight1 ,LivestockTag2 ,LivestockWeight2 ,LivestockTag3 ,LivestockWeight3,LivestockTag4,LivestockWeight4 ,LivestockTag5 ,LivestockWeight5 ,Latitude ,Longitude ,Altitude ,TransactionTimestamp ,Household ,ProjectCode ,Remarks ,VillageName ,LivestockFeederContractDate ,LivestockFeederContractExpDate ,LivestockFeederContractDuration ,NumberOfLivestockRecieved ,LivestockRecievedTimeStamp ,LivesstockRecievedLatitude ,LivesstockRecievedLongitute ,LivesstockRecievedAltitude ,SynchronizeStatus,ContractStatus) values (?, ?,?, ?, ?, ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [this.state.LivestockFeederContractName,this.state.LivestockFeederContractId,this.state.FeedlotContractorName ,this.state.FeedLotId ,this.state.LivestockTag1 ,this.state.  LivestockWeight1 ,this.state.  LivestockTag2 ,this.state.  LivestockWeight2 ,this.state.  LivestockTag3 ,this.state.  LivestockWeight3,this.state.  LivestockTag4,this.state.  LivestockWeight4 ,this.state.  LivestockTag5 ,this.state.  LivestockWeight5 ,this.state.  Latitude ,this.state.  Longitude ,this.state.  Altitude ,this.state.  TransactionTimestamp ,this.state.  Household ,this.state.  ProjectCode ,this.state.  Remarks ,this.state.  VillageName ,this.state.  LivestockFeederContractDate ,this.state.  LivestockFeederContractExpDate ,this.state.  LivestockFeederContractDuration ,this.state.  NumberOfLivestockRecieved ,this.state.  LivestockRecievedTimeStamp ,this.state.  LivesstockRecievedLatitude ,this.state.  LivesstockRecievedLongitute ,this.state.  LivesstockRecievedAltitude ,this.state.  SynchronizeStatus,this.state.ContractStatus], (tx, results) => { console.log ('results after LivestockFeederContract insert: ', results);
      
        // tx.executeSql('select * from Feedlots where trim(FeedlotName) == ? ', [this.state.FeedlotName.trim()], (tx, results) =>{  
        //     console.log('inserted record from Feedlots: ',results.rows)
        //  if (results.rows.length > 0){
        //   this.setState({FeedlotId: results.rows._array[0].id}) 
        //  } 
        //          },(t,error)=> {console.log('Db7 Feedlots table error: ',error);})
      
     },(t,error)=> {console.log('LivestockFeederContract table Db4 error: ',error);   this.exitHome()})
      
     // update FeedlotId
        // db.transaction(tx => { 
            // tx.executeSql(`UPDATE Feedlots set FeedlotId = ? where TRIM(FeedlotName) = ? `, [this.state.FeedlotId,this.state.FeedlotName.trim()], (tx, results) => { /*console.log ('results after FeedlotId update: ', results)},(t,error)=> {console.log('Db8 error: ',error);   this.exitHome()})
        // });
    })
    // update backend
   
     // NPQ to add ContractStatus for into Data and upgrade backend to recieve ContractStatus 06-Nov-2020
    const Data = {
     FeedLotId: this.state.FeedLotId, UserId: this.props.route.params.userId,FeedlotName: this.state.FeedlotContractorName ,ContractName: this.state.LivestockFeederContractName,ContractId: this.state.LivestockFeederContractId,LivestockTag1: this.state.LivestockTag1 ,LivestockWeight1: this.state.LivestockWeight1 ,LivestockTag2: this.state.LivestockTag2 ,LivestockWeight2: this.state.  LivestockWeight2 ,LivestockTag3: this.state.  LivestockTag3 ,LivestockWeight3: this.state.  LivestockWeight3,LivestockTag4: this.state.  LivestockTag4,LivestockWeight4: this.state.  LivestockWeight4 ,LivestockTag5: this.state.  LivestockTag5 ,LivestockWeight5: this.state.  LivestockWeight5 ,Latitude: this.state.  Latitude ,Longitude: this.state.  Longitude ,Altitude: this.state.  Altitude ,TransactionTimestamp: this.state.TransactionTimestamp ,Household: this.state.  Household ,ProjectCode: this.state.  ProjectCode ,Remarks: this.state.  Remarks ,VillageName: this.state.  VillageName ,LivestockFeederContractDate: this.state.  LivestockFeederContractDate ,LivestockFeederContractExpDate: this.state.  LivestockFeederContractExpDate ,LivestockFeederContractDuration: this.state.  LivestockFeederContractDuration ,NumberOfLivestockRecieved: this.state.  NumberOfLivestockRecieved ,LivestockRecievedTimeStamp: this.state.  LivestockRecievedTimeStamp ,LivesstockRecievedLatitude: this.state.  LivesstockRecievedLatitude ,LivesstockRecievedLongitute: this.state.  LivesstockRecievedLongitute ,LivesstockRecievedAltitude: this.state.  LivesstockRecievedAltitude, ContractStatus: this.state.ContractStatus
    }
    // console.log('Ddddddddddddddddddata: \n',Data)
    // // axios.post('http://be79db59.ngrok.io/feedlots/contract', Data)
    
    const backendUrl= BackEndApi+'/feedlots/contract'
    axios.post(backendUrl, Data)
    .then((response) => { // Success
      console.log('success response from server for Register LivestockFeederContract update: ')
      console.log(response.data, response.status)
      // Synchronize if back-end update is success
     
      if (response.status == 200 ){
        db.transaction(tx => { 
        tx.executeSql(`UPDATE LivestockFeederContract set SynchronizeStatus = ? where TRIM(LivestockFeederContractName) = ?  AND trim(FeedlotName) = ?`, ["Synchronized",this.state.LivestockFeederContractName.trim(),this.state.FeedlotContractorName.trim()], (tx, results) => { console.log ('results after Synchronization update: ', results) },(t,error)=> {console.log('Db9 error: ',error);   this.exitHome()})})
       
        // throw all records on console log for testing
        db.transaction(tx => { 
          tx.executeSql('select * from LivestockFeederContract', [], (tx, results) => { 
             if (results.rows.length > 0){
               console.log ('All rows from LivestockFeederContract table: ', results.rows)
             } else {
                 alert('No record found in the table LivestockFeederContract');
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
    this.props.navigation.popToTop()

   
}; //end of addDbDetails
    exitHome =()=> {  this.props.navigation.goBack() }

   
 _showDateTimePicker = (fieldName) => this.setState({ isDateTimePickerVisible: fieldName });

_hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });
// _handleDatePicked = (pickeddate) => {
_handleContractDate = (pickeddate) => {
  // console.log('pickeddate: ', pickeddate);
  let pDate= pickeddate.toDateString();
  // console.log('pickeddate to string: ', pDate);
   let year  = pickeddate.getFullYear();
  let  CurrentDate= new Date();
   
    //DATE LESS THEN THREE YEARS NOT VALIDE
   if (year == CurrentDate.getFullYear() || year >= CurrentDate.getFullYear() -3)
    {
    this.setState({LivestockFeederContractDate: pDate,isDateTimePickerVisible: false }) 
    // this._hideDateTimePicker();
    // this.setState({ValidRegistrationDate: true})
    }
    else {
        Alert.alert("Invalid Contract Date")
        console.log('current year: ', CurrentDate.getFullYear());
        console.log('whereas picked date: ', pDate);
        // this.setState({ValidPurchaseDate: false})
        this.setState({LivestockFeederContractDate:  new Date().toDateString(),isDateTimePickerVisible: false }) 
        // this._hideDateTimePicker();
          }

  };
_handleContractExpDate = (pickeddate) => {
  // console.log('pickeddate: ', pickeddate);
  let pDate= pickeddate.toDateString();
  // console.log('pickeddate to string: ', pDate);
   let year  = pickeddate.getFullYear();
  let  CurrentDate= new Date();
   
    //DATE LESS THEN THREE YEARS NOT VALIDE
   if (year == CurrentDate.getFullYear() || year >= CurrentDate.getFullYear() -3)
    {
    this.setState({LivestockFeederContractExpDate: pDate,isDateTimePickerVisible: false }) 
    // this._hideDateTimePicker();
    // this.setState({ValidRegistrationDate: true})
    }
    else {
        Alert.alert("Invalid Contract Expiry Date")
        console.log('current year: ', CurrentDate.getFullYear());
        console.log('whereas picked date: ', pDate);
        // this.setState({ValidPurchaseDate: false})
        this.setState({LivestockFeederContractExpDate:  new Date().toDateString(),isDateTimePickerVisible: false }) 
        // this._hideDateTimePicker();
          }

  };

  
  render() { 
     
      return ( 
            <ScrollView > 
             
            <View style={{flex: 1,flexDirection: 'column',justifyContent: 'center', marginLeft:10}}>
          
                  <Text style={{textAlign:'center', marginTop: 10, width: '97%', height: 50, backgroundColor: 'powderblue'}}> PRICE Local partner: Haque Feedlots SMC-Pvt Ltd Incorporated </Text>
                  <Text style={{textAlign:'center', marginTop: 6,marginLeft:13, width: '90%', height: 30, backgroundColor: 'powderblue'}}> Handing Over Cattle to Feederlot </Text>
                  <Text style={{textAlign:'center', marginTop: 1,marginLeft:13, width: '90%', height: 30, backgroundColor: 'powderblue'}}>Project Id: MTE </Text>
          
                
                  {/* <Image source={{uri: 'https://lh5.googleusercontent.com/p/AF1QipMsJAiTlGC4xdtWIUn1Dx1ChuF1XwFCI0k7oM_1=w408-h271-k-no'}}
                  style={{width:'100%', height:300, marginTop: 30, marginBottom: 10}}/> */}
               
                  
              <Text style={{textAlign:'center', marginLeft:13,marginTop: 8, width: '90%', height: 26, backgroundColor: 'lightgray'}}> Livestock Feeder Name </Text>
    
                <Text style={{width: '90%', height: 26,textAlign:'center', marginLeft:13,backgroundColor: 'powderblue'}}>{this.state.FeedlotContractorName}</Text>
              
              
                <Text style={{textAlign:'center', marginLeft:13,marginTop: 10, width: '90%', height: 26, backgroundColor: 'lightgray'}}> Livestock Feeder Contract Name </Text>
              
          
             <TouchableHighlight   onPress={()=>this.props.navigation.push("Select Contract", { contractor: this.state.FeedlotContractorName, contractorId: this.state.FeedLotId}) }>
                      <Text style={{width: '70%', height: 26, textAlign:'center', marginLeft:60,backgroundColor: 'yellow' /*backgroundColor: 'red'*/}} >{this.state.LivestockFeederContractName}</Text>
              </TouchableHighlight>
            
            
              
            
                  <Text style={{textAlign:'center', marginLeft:13,marginTop: 5, width: '90%', height: 26, backgroundColor: 'lightgray'}}> Contract Date</Text>
                  <TextInput style={{width: '50%', height: 26, textAlign:'center', marginLeft:80,backgroundColor: 'yellow'}}
                    onFocus={ () => this._showDateTimePicker('contract') } value={this.state.LivestockFeederContractDate} />
                  <DateTimePicker isVisible={this.state.isDateTimePickerVisible === 'contract'} onConfirm={this._handleContractDate} onCancel={this._hideDateTimePicker}  mode={'date'}  /*datePickerModeAndroid={'spinner'}*/ />

                  <Text style={{textAlign:'center', marginLeft:13,marginTop: 5, width: '90%', height: 26, backgroundColor: 'lightgray'}}> Contract Expiry Date</Text>
                  <TextInput style={{width: '50%', height: 26, textAlign:'center', marginLeft:80,backgroundColor: 'yellow'}}
                    onFocus={ () => this._showDateTimePicker('contractExp') } value={this.state.LivestockFeederContractExpDate} />
                  <DateTimePicker isVisible={this.state.isDateTimePickerVisible === 'contractExp'} onConfirm={this._handleContractExpDate} onCancel={this._hideDateTimePicker}  mode={'date'}  /*datePickerModeAndroid={'spinner'}*/ />      
                  
                  <Text style={{textAlign:'center', marginLeft:13,marginTop: 5, width: '90%', height: 26, backgroundColor: 'lightgray'}}> Contract Duration</Text>

                  <TextInput style={{width: '90%', height: 26,textAlign:'center',  marginLeft:13,  backgroundColor: 'yellow'}}
                            onChangeText={(text)=>this.setState({LivestockFeederContractDuration: text})}
                            value={this.state.LivestockFeederContractDuration}
                            placeholder = 'Type here number contract days'
                            placeholderTextColor= 'red' 
                            keyboardType= 'numeric'
                        />
                  <Text style={{textAlign:'center', marginLeft:13,marginTop: 5, width: '90%', height: 26, backgroundColor: 'lightgray'}}> Number of cattle received </Text>

                  <TextInput style={{width: '90%', height: 26,textAlign:'center',  marginLeft:13,  backgroundColor: 'yellow'}}
                            onChangeText={(text)=>this.setState({NumberOfLivestockRecieved: text,LivestockRecievedTimeStamp: new Date().toString()})}
                            value={this.state.NumberOfLivestockRecieved}
                            placeholder = 'Type number cattle recieved'
                            placeholderTextColor= 'red' 
                            keyboardType= 'numeric'
                        />
                  {parseInt(this.state.NumberOfLivestockRecieved)>0 &&
                  <Text style={{textAlign:'center', marginLeft:13,marginTop: 5, width: '90%', height: 26, backgroundColor: 'lightgray'}}> Livestock Tags Numbers and weight </Text>}

                  {parseInt(this.state.NumberOfLivestockRecieved)>0 && <TextInput style={{width: '90%', height: 26,textAlign:'center',  marginLeft:13,  backgroundColor: 'yellow'}}
                            onChangeText={(text)=>this.setState({  LivestockTag1: text})}
                            value={this.state.  LivestockTag1}
                            placeholder = 'Type Tag Number 1 here'
                            placeholderTextColor= 'red' 
                              />}
                  {parseInt(this.state.NumberOfLivestockRecieved)>0 &&
                  <TextInput style={{width: '90%', height: 26,textAlign:'center',  marginLeft:13, marginTop: 5, backgroundColor: 'yellow'}}
                            onChangeText={(text)=>this.setState({  LivestockWeight1: text})}
                            value={this.state.LivestockWeight1}
                            placeholder = 'Type weight of livestock 1 here'
                            placeholderTextColor= 'red' 
                            keyboardType= 'numeric'
                  /> }
                  {parseInt(this.state.NumberOfLivestockRecieved)>1 &&             
                  <TextInput style={{width: '90%', height: 26,textAlign:'center',  marginLeft:13,marginTop: 5,  backgroundColor: 'yellow'}}
                            onChangeText={(text)=>this.setState({  LivestockTag2: text})}
                            value={this.state.  LivestockTag2}
                            placeholder = 'Type Tag Number 2 here'
                            placeholderTextColor= 'red' 
                  /> }
                  {parseInt(this.state.NumberOfLivestockRecieved)>1 &&
                  <TextInput style={{width: '90%', height: 26,textAlign:'center',  marginLeft:13, marginTop: 5, backgroundColor: 'yellow'}}
                            onChangeText={(text)=>this.setState({  LivestockWeight2: text})}
                            value={this.state.  LivestockWeight2}
                            placeholder = 'Type weight of livestock 2 here'
                            placeholderTextColor= 'red' 
                            keyboardType= 'numeric'
                              />}
                  {parseInt(this.state.NumberOfLivestockRecieved)>2 &&
                  <TextInput style={{width: '90%', height: 26,textAlign:'center',  marginLeft:13, marginTop: 5, backgroundColor: 'yellow'}}
                            onChangeText={(text)=>this.setState({  LivestockTag3: text})}
                            value={this.state.  LivestockTag3}
                            placeholder = 'Type Tag Number 3 here'
                            placeholderTextColor= 'red' 
                              />}
                  {parseInt(this.state.NumberOfLivestockRecieved)>2 &&
                  <TextInput style={{width: '90%', height: 26,textAlign:'center',  marginLeft:13, marginTop: 5, backgroundColor: 'yellow'}}
                            onChangeText={(text)=>this.setState({  LivestockWeight3: text})}
                            value={this.state.  LivestockWeight3}
                            placeholder = 'Type weight of livestock 3 here'
                            placeholderTextColor= 'red' 
                            keyboardType= 'numeric'
                              />}
                  {parseInt(this.state.NumberOfLivestockRecieved)>3 &&
                  <TextInput style={{width: '90%', height: 26,textAlign:'center',  marginLeft:13, marginTop: 5, backgroundColor: 'yellow'}}
                            onChangeText={(text)=>this.setState({  LivestockTag4: text})}
                            value={this.state.  LivestockTag4}
                            placeholder = 'Type Tag Number 4 here'
                            placeholderTextColor= 'red' 
                              />}
                  {parseInt(this.state.NumberOfLivestockRecieved)>3 &&
                  <TextInput style={{width: '90%', height: 26,textAlign:'center',  marginLeft:13, marginTop: 5, backgroundColor: 'yellow'}}
                            onChangeText={(text)=>this.setState({  LivestockWeight4: text})}
                            value={this.state.  LivestockWeight4}
                            placeholder = 'Type weight of livestock 4 here'
                            placeholderTextColor= 'red' 
                            keyboardType= 'numeric'
                              />}
                  {parseInt(this.state.NumberOfLivestockRecieved)>4 &&
                  <TextInput style={{width: '90%', height: 26,textAlign:'center',  marginLeft:13,marginTop: 5,  backgroundColor: 'yellow'}}
                            onChangeText={(text)=>this.setState({  LivestockTag5: text})}
                            value={this.state.  LivestockTag5}
                            placeholder = 'Type Tag Number 5 here'
                            placeholderTextColor= 'red' 
                              />}
                  {parseInt(this.state.NumberOfLivestockRecieved)>4 &&
                   <TextInput style={{width: '90%', height: 26,textAlign:'center',  marginLeft:13, marginTop: 5, backgroundColor: 'yellow'}}
                            onChangeText={(text)=>this.setState({  LivestockWeight5: text})}
                            value={this.state.  LivestockWeight5}
                            placeholder = 'Type weight of livestock 1 here'
                            placeholderTextColor= 'red' 
                            keyboardType= 'numeric'
                              />}
                  <Text style={{textAlign:'center', marginLeft:13,marginTop: 5, width: '90%', height: 26, backgroundColor: 'lightgray'}}> Remarks</Text>
                  <TextInput style={{width: '90%', height: 60,textAlign:'center',  marginLeft:13,  backgroundColor: 'yellow'}}
                            onChangeText={(text)=>this.setState({Remarks: text})}
                            value={this.state.Remarks}
                            placeholder = 'Type here any remarks'
                            placeholderTextColor= 'red' 
                            multiline={true}
                              />

                       
                                                   
                     

            <View style={{flex: 1,flexDirection: 'row', justifyContent: 'center',marginTop: 10,}}>
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
    },
    item: {
      backgroundColor: '#f9c2ff',
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
    },
    title: {
      fontSize: 32,
    },
});

