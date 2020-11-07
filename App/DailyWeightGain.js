
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

export class DailyWeightGain extends Component {
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
     
             SynchronizeStatus:'',
             LivestockTag1: null,
             LivestockTag2: null,
             LivestockTag3: null,
             LivestockTag4: null,
             LivestockTag5: null,
             FeedLotId: null,
             FeedlotContractorName: null,
             LivestockFeederContractName: null,
             LivestockFeederContractId:null,
             LivestockWeight1: null,
             LivestockWeight2: null,
             LivestockWeight3: null,
             LivestockWeight4: null,
             LivestockWeight5: null,
             Latitude: null,
             Longitude: null,
             Altitude: null,
             TransactionTimestamp: new Date().toString(),
             Household: null,
             ProjectCode: 'MTE',
             Remarks:  null,
      
             WeightDate: new Date().toDateString(),
             
            
         }
    } // End of constructor
    async componentDidMount() {
        // console.log('\n trace from HandingOveLivestock: props:\n',this.props)
        this.updateSateWithRoute()
        this.getLivestockTags()
        let geoOptions = {
        enableHighAccuracy: true,
        timeOut: 20000,
        maximumAge: 60 * 60 * 24
                      };
        navigator.geolocation.getCurrentPosition( this.geoSuccess, this.geoFailure, geoOptions);
        ////////////// Drop Table
        // db.transaction(tx => {
        //     tx.executeSql(
        //       'DROP TABLE livestockDailyWeightGain;', [],
        //       (tx, results) => {  console.log('table Feedlots dropped result: \n',results)},
        //       (tx, error) => {console.log(error);}
        //     )
        //   });
        
        CRUD.createTable_livestockDailyWeightGain()
        
        //  CRUD.createTable ('Contract','id integer primary key not null,ContractName text,ContractId text,ContractDiscription text')
        //  (table,fields,values,data)
        // await CRUD.insertRow('contract','ContractId,ContractName,ContractDiscription','?,?,?',[{"MTE2021"},"Meat The Eid 2021","abc"])
    } // end of component did mount

    geoSuccess = (position) => { this.setState({ ready:true,
       
          Altitude: position.coords.altitude ,Latitude:  position.coords.latitude, Longitude: position.coords.longitude
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
        if (this.state.LivestockFeederContractName === null || this.state.LivestockFeederContractName.trim() ==="Press here to select Contract Name" ){
          Alert.alert(' Contract Name is empty'); return true
        }
        if (this.state.FeedlotContractorName === null || this.state.FeedlotContractorName.trim() ==="" ){
          Alert.alert(' Livestock Feeder Name is empty'); return true
        }
       
      }
  

validate=()=> {
if ( this.checkMandatory()) {return}

if(this.state.LivestockTag1 && !validations.ValidateLiveWeight(this.state.LivestockWeight1)){ return}

if(this.state.LivestockTag2 && !validations  .ValidateLiveWeight(this.state.LivestockWeight2)){ return}

if(this.state.LivestockTag3 && !validations  .ValidateLiveWeight(this.state.LivestockWeight3)){ return}

if(this.state.LivestockTag4 && !validations  .ValidateLiveWeight(this.state.LivestockWeight4)){ return}

if(this.state.LivestockTag5 && !validations  .ValidateLiveWeight(this.state.LivestockWeight5)){ return}
  //  console.log('\n trace from HandingOverLivestock.validate: ', this.state)

   
 if( this.searchLocalDb()){return}
  
    Alert.alert( 'Please confirm that:', "YOU WANT TO SAVE CATTLE WEIGHT", 
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

getLivestockTags=()=>{
    db.transaction(tx => { 
        tx.executeSql('select * from LivestockFeederContract where trim(LivestockFeederContractName) = ? AND trim(FeedlotName) = ? AND trim(ContractStatus) = ?', [this.state.LivestockFeederContractName.trim(),this.state.FeedlotContractorName.trim(),"Open"], (tx, results) =>{ 
             if (results.rows.length > 0){
              //  console.log ('\n\ntrace from DailyWeightGain.getLivestockTags: All rows for this.state.LivestockFeederContractName  this.state.FeedlotContractorName ', this.state.LivestockFeederContractName,this.state.FeedlotContractorName)
              //  console.log ('\n\ntrace from DailyWeightGain.getLivestockTags: All rows from  LivestockFeederContract table: ', results.rows)
              //  console.log ('\n\ntrace from DailyWeightGain.getLivestockTags: LivestockTag1 from  LivestockFeederContract table: ', results.rows._array[0].LivestockTag1)
               this.setState({LivestockTag1:  results.rows._array[0].LivestockTag1, LivestockTag2:  results.rows._array[0].LivestockTag2, LivestockTag3:  results.rows._array[0].LivestockTag3, LivestockTag4:  results.rows._array[0].LivestockTag4, LivestockTag5:  results.rows._array[0].LivestockTag5})
             } else {
               Alert.alert('No record found in the table LivestockFeederContract table',this.state.LivestockFeederContractName+"    "+this.state.FeedlotContractorName+" may be contract is closed");
             }},(t,error)=> {console.log('Db33 LivestockFeederContract TABLE error: ',error);})}) 
}


searchLocalDb = ()=>{

   // throw all records on console log for testing
        //  db.transaction(tx => { 
        //   tx.executeSql('select * from livestockDailyWeightGain', [], (tx, results) => { 
        //      if (results.rows.length > 0){
        //        console.log ('All rows from  livestockDailyWeightGain table: ', results.rows)
        //      } else {
        //          alert('No record found in the table livestockDailyWeightGain table');
        //      }},(t,error)=> {console.log('Db3 livestockDailyWeightGain TABLE error: ',error);})})
      
  
  
  db.transaction( tx => { 
         tx.executeSql('select * from livestockDailyWeightGain where trim(ContractName) = ? AND trim(FeedlotName) = ? AND trim(WeightDate) = ?', [this.state.LivestockFeederContractName.trim(),this.state.FeedlotContractorName.trim(),this.state.WeightDate.trim()], (tx, results) =>{ 
          
          if (results.rows.length > 0){
           console.log('searchLocalDb results  livestockDailyWeightGain table:\n ',results.rows)
           Alert.alert('Check date','Cattle Weights for this date already saved ')
         
          this.setState({WeightDate: new Date().toDateString()})
          return false
          } 
          return true
        },(t,error)=> {console.log('Db6  livestockDailyWeightGain table error: ',error);})})
    

  }
   

addDbDetails = () =>{
  // console.log('\n\n\naddDbDetail:   this.state: \n',this.state)
//   console.log('\n\n\naddDbDetail:\n',this.state.LivestockFeederContractName,this.state.LivestockFeederContractId,this.state.FeedlotContractorName ,this.state.FeedLotId ,this.state.LivestockTag1 ,this.state.  LivestockWeight1 ,this.state.  LivestockTag2 ,this.state.  LivestockWeight2 ,this.state.  LivestockTag3 ,this.state.  LivestockWeight3,this.state.  LivestockTag4,this.state.  LivestockWeight4 ,this.state.  LivestockTag5 ,this.state.  LivestockWeight5 ,this.state.  Latitude ,this.state.  Longitude ,this.state.  Altitude ,this.state.  TransactionTimestamp ,this.state.  Household ,this.state.  ProjectCode ,this.state.  Remarks ,this.state.  VillageName ,this.state.SynchronizeStatus,this.state.WeightDate)
  
  
    if (this.state.LivestockFeederContractName === null || this.state.LivestockFeederContractName.trim() ==="" ){console.log("LivestockFeederContractName not define"); return}
   db.transaction(tx => { 
      tx.executeSql('insert into livestockDailyWeightGain(ContractName,ContractId,FeedlotName , FeedLotId ,LivestockTag1 ,LivestockWeight1 ,LivestockTag2 ,LivestockWeight2 ,LivestockTag3 ,LivestockWeight3,LivestockTag4,LivestockWeight4 ,LivestockTag5 ,LivestockWeight5 ,Latitude ,Longitude ,Altitude ,TransactionTimestamp ,Household ,ProjectCode ,Remarks ,VillageName ,SynchronizeStatus,WeightDate) values (?, ?,?, ?, ?, ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [this.state.LivestockFeederContractName,this.state.LivestockFeederContractId,this.state.FeedlotContractorName ,this.state.FeedLotId ,this.state.LivestockTag1 ,this.state.  LivestockWeight1 ,this.state.  LivestockTag2 ,this.state.  LivestockWeight2 ,this.state.  LivestockTag3 ,this.state.  LivestockWeight3,this.state.  LivestockTag4,this.state.  LivestockWeight4 ,this.state.  LivestockTag5 ,this.state.  LivestockWeight5 ,this.state.  Latitude ,this.state.  Longitude ,this.state.  Altitude ,this.state.  TransactionTimestamp ,this.state.  Household ,this.state.  ProjectCode ,this.state.  Remarks ,this.state.  VillageName  ,this.state.  SynchronizeStatus,this.state.WeightDate], (tx, results) => {/* console.log ('results after livestockDailyWeightGain insert: ', results);*/
           
     },(t,error)=> {console.log('livestockDailyWeightGain table Db4 error: ',error);   this.exitHome()})
      
     // update FeedlotId
        // db.transaction(tx => { 
            // tx.executeSql(`UPDATE Feedlots set FeedlotId = ? where TRIM(FeedlotName) = ? `, [this.state.FeedlotId,this.state.FeedlotName.trim()], (tx, results) => { /*console.log ('results after FeedlotId update: ', results)},(t,error)=> {console.log('Db8 error: ',error);   this.exitHome()})
        // });
    })
    // update backend
   
     
    const Data = {
     FeedLotId: this.state.FeedLotId, FeedlotName: this.state.FeedlotContractorName ,ContractName: this.state.LivestockFeederContractName,ContractId: this.state.LivestockFeederContractId,LivestockTag1: this.state.LivestockTag1 ,LivestockWeight1: this.state.LivestockWeight1 ,LivestockTag2: this.state.LivestockTag2 ,LivestockWeight2: this.state.  LivestockWeight2 ,LivestockTag3: this.state.  LivestockTag3 ,LivestockWeight3: this.state.  LivestockWeight3,LivestockTag4: this.state.  LivestockTag4,LivestockWeight4: this.state.  LivestockWeight4 ,LivestockTag5: this.state.  LivestockTag5 ,LivestockWeight5: this.state.  LivestockWeight5 ,Latitude: this.state.  Latitude ,Longitude: this.state.  Longitude ,Altitude: this.state.  Altitude ,TransactionTimestamp: this.state.TransactionTimestamp ,Household: this.state.  Household ,ProjectCode: this.state.  ProjectCode ,Remarks: this.state.  Remarks ,VillageName: this.state.  VillageName ,WeightDate: this.state.WeightDate}
    // console.log('Ddddddddddddddddddata: \n',Data)
    // // axios.post('http://be79db59.ngrok.io/feedlots/DailyWeightGain', Data)
    
    const backendUrl= BackEndApi+'/feedlots/DailyWeightGain'
    axios.post(backendUrl, Data)
    .then((response) => { // Success
      console.log('success response from server for  livestockDailyWeightGain update: ')
      console.log(response.data, response.status)
      // Synchronize if back-end update is success
   
      if (response.status == 200 ){
        db.transaction(tx => { 
        tx.executeSql(`UPDATE livestockDailyWeightGain set SynchronizeStatus = ? where TRIM(ContractName) = ?  AND trim(FeedlotName) = ?  AND trim(WeightDate) = ?`, ["Synchronized",this.state.LivestockFeederContractName.trim(),this.state.FeedlotContractorName.trim(),this.state.WeightDate.trim()], (tx, results) => { console.log ('results after Synchronization update: ', results) },(t,error)=> {console.log('Db9 error: ',error);   this.exitHome()})})
       
        // throw all records on console log for testing
        // db.transaction(tx => { 
        //   tx.executeSql('select * from livestockDailyWeightGain', [], (tx, results) => { 
        //      if (results.rows.length > 0){
        //        console.log ('All rows from livestockDailyWeightGain table: ', results.rows)
        //      } else {
        //          alert('No record found in the table livestockDailyWeightGain');
        //      }},(t,error)=> {console.log('Db3 error: ',error);})})
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
 
    // "SUCCESFULLY RECORDED CATTLE WEIGHT", 
    Alert.alert( 'SUCCESFULLY RECORDED CATTLE WEIGHT', "", 
          [ {text: 'Ok', onPress: ()=> this.props.navigation.goBack(), style: 'cancel'},],
        { cancelable: false } 
     )
}; //end of addDbDetails
    exitHome =()=> {  this.props.navigation.popToTop() }
    // exitHome =()=> {  return }

   

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
    this.setState({WeightDate: pDate,isDateTimePickerVisible: false }) 
    // this._hideDateTimePicker();
    // this.setState({ValidRegistrationDate: true})
    }
    else {
        Alert.alert("Invalid Contract Date")
        console.log('current year: ', CurrentDate.getFullYear());
        console.log('whereas picked date: ', pDate);
        // this.setState({ValidPurchaseDate: false})
        this.setState({WeightDate:  new Date().toDateString(),isDateTimePickerVisible: false }) 
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
                <Text style={{width: '90%', height: 26,textAlign:'center', marginLeft:13,backgroundColor: 'powderblue'}}>{this.state.LivestockFeederContractName}</Text>
              
                  <Text style={{textAlign:'center', marginLeft:13,marginTop: 5, width: '90%', height: 26, backgroundColor: 'lightgray'}}> Cattle Weight Date</Text>
                  <TextInput style={{width: '50%', height: 26, textAlign:'center', marginLeft:80,backgroundColor: 'yellow'}}
                    onFocus={ () => this._showDateTimePicker('contract') } value={this.state.WeightDate} />
                  <DateTimePicker isVisible={this.state.isDateTimePickerVisible==='contract'} onConfirm={this._handleContractDate} onCancel={this._hideDateTimePicker}  mode={'date'}  /*datePickerModeAndroid={'spinner'}*/ />
     
                 
                  <Text style={{textAlign:'center', marginLeft:13,marginTop: 5, width: '90%', height: 26, backgroundColor: 'lightgray'}}> Livestock Tags Numbers and weight </Text>
                  
                  {this.state.LivestockTag1 && <Text style={{width: '90%', height: 26,textAlign:'center', marginLeft:13,backgroundColor: 'powderblue'}}>{this.state.LivestockTag1}</Text>}
                  {this.state.LivestockTag1 &&
                  <TextInput style={{width: '90%', height: 26,textAlign:'center',  marginLeft:13, marginTop: 5, backgroundColor: 'yellow'}}
                            onChangeText={(text)=>this.setState({  LivestockWeight1: text})}
                            value={this.state.LivestockWeight1}
                            placeholder = 'Type weight of livestock 1 here'
                            placeholderTextColor= 'red' 
                            keyboardType= 'numeric'
                  /> }
                 
                  {this.state.LivestockTag2 && <Text style={{width: '90%', height: 26,textAlign:'center', marginLeft:13,backgroundColor: 'powderblue'}}>{this.state.LivestockTag2}</Text>}
                  {this.state.LivestockTag2 &&
                  <TextInput style={{width: '90%', height: 26,textAlign:'center',  marginLeft:13, marginTop: 5, backgroundColor: 'yellow'}}
                            onChangeText={(text)=>this.setState({  LivestockWeight2: text})}
                            value={this.state.LivestockWeight2}
                            placeholder = 'Type weight of livestock 2 here'
                            placeholderTextColor= 'red' 
                            keyboardType= 'numeric'
                  /> }
                 
                  {this.state.LivestockTag3 && <Text style={{width: '90%', height: 26,textAlign:'center', marginLeft:13,backgroundColor: 'powderblue'}}>{this.state.LivestockTag3}</Text>}
                  {this.state.LivestockTag3 &&
                  <TextInput style={{width: '90%', height: 26,textAlign:'center',  marginLeft:13, marginTop: 5, backgroundColor: 'yellow'}}
                            onChangeText={(text)=>this.setState({  LivestockWeight3: text})}
                            value={this.state.LivestockWeight3}
                            placeholder = 'Type weight of livestock 3 here'
                            placeholderTextColor= 'red' 
                            keyboardType= 'numeric'
                  /> }
                 
                  {this.state.LivestockTag4 && <Text style={{width: '90%', height: 26,textAlign:'center', marginLeft:13,backgroundColor: 'powderblue'}}>{this.state.LivestockTag4}</Text>}
                  {this.state.LivestockTag4 &&
                  <TextInput style={{width: '90%', height: 26,textAlign:'center',  marginLeft:13, marginTop: 5, backgroundColor: 'yellow'}}
                            onChangeText={(text)=>this.setState({  LivestockWeight4: text})}
                            value={this.state.LivestockWeight4}
                            placeholder = 'Type weight of livestock 4 here'
                            placeholderTextColor= 'red' 
                            keyboardType= 'numeric'
                  /> }
                 
                  {this.state.LivestockTag5 && <Text style={{width: '90%', height: 26,textAlign:'center', marginLeft:13,backgroundColor: 'powderblue'}}>{this.state.LivestockTag5}</Text>}
                  {this.state.LivestockTag5 &&
                  <TextInput style={{width: '90%', height: 26,textAlign:'center',  marginLeft:13, marginTop: 5, backgroundColor: 'yellow'}}
                            onChangeText={(text)=>this.setState({  LivestockWeight5: text})}
                            value={this.state.LivestockWeight5}
                            placeholder = 'Type weight of livestock 5 here'
                            placeholderTextColor= 'red' 
                            keyboardType= 'numeric'
                  /> }
                 
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

