
import React, { Component } from 'react';
import { StyleSheet, View, TouchableHighlight, Text, TextInput, Alert,ScrollView } from 'react-native';
import { _confirmProps } from 'react-native/Libraries/Modal/Modal';
import DateTimePicker from 'react-native-modal-datetime-picker';
import * as SQLite from 'expo-sqlite';
import {BackEndApi} from "./config/constants";
// import {LivestockPic} from "../App/pictureManagement/LivestockPicture"
const axios = require('axios');
const slaughterTable = require('../App/model/slaughteredLivestockDetailsTable')
const db = SQLite.openDatabase('PRICELocal.db');


export class SlaughterLivestock extends Component {
 static navigationOptions = {
        header: null
    };
 constructor(props) {
        super(props);
        this.state = { 
            isDateTimePickerVisible: false,
            VillageName: 'Goth Khan Sahab',
            SlaughterLivestockTag: '',
            LivestockSlaughterDate: new Date().toDateString(),
            LivestockLiveWeight: '',
            LivestockTotalMeatWeight: '',
            TotalNumberOfMeatPackages: '',
            LivestockMeatPackageWeight: '',
            ValidSlaughterLivestockTag: false,
            ValidLivestockSlaughterDate:true,
            ValidLivestockLiveWeight: true,
            ValidLivestockTotalMeatWeight:  true,
            ValidTotalNumberOfMeatPackages: true,
            ValidLivestockMeatPackageWeight: true,
            IsLivestockDetailsConfirmed: false
         }
    } // End of constructor
    async componentDidMount() {
      console.log('SlaughterLivestock didmount')
    
     
      // Geo coodinates
      // maximumAge is sec * Min * hrs to keep the current lat and log coordinates. It is upto your app requirements that for how long you want to keep coordinates or you want to track for each movement etc
      let geoOptions = {
        enableHighAccuracy: true,
        timeOut: 20000,
        maximumAge: 60 * 60 * 24
                      };
        navigator.geolocation.getCurrentPosition( this.geoSuccess, this.geoFailure, geoOptions);
       let resultCreateTable = slaughterTable.createSlaughteredTable()
    } // end of component did mount

    geoSuccess = (position) => { this.setState({ ready:true,
          where: {lat: position.coords.latitude,lng:position.coords.longitude, Ald:position.coords.altitude }})
         // console.log('After pull geo location state data set: ',this.state)
     }
    geoFailure = (err) => {
      this.setState({error: err.message});
     }


    onPress=()=>{
        Alert.alert('you tapped the button');
    };


    cancelSlaughter = ()=> {
        Alert.alert('Livestock Slaughtering cancelled');
        this.props.navigation.navigate('MeatTheEidRT');
   };


      
  

validateLivestock=()=> {
   // Validate Livestock Tag Number
    const SlaughterData = this.state.SlaughterLivestockTag;
    console.log(`Slaughter Data: ${SlaughterData}`)
    let numreg1 = /HFL/;
   if (numreg1.test(SlaughterData) && SlaughterData.length <= 16) {
      //test ok
     // alert('test ok')
      this.setState({ValidSlaughterLivestockTag: true})
      //this.saveAtLocalStorage
    } else {
      //test not ok
      this.setState({ValidSlaughterLivestockTag: false})
      this.setState({SlaughterLivestockTag: ''})
     Alert.alert('Invalid value in Tag Number. Format: ABC-YYYYMMDD-999')
      } 
      // check if Livestock slaughter data already exist
     
      if (this.state.ValidSlaughterLivestockTag) {
        this.searchLocalDb(SlaughterData)
      }
  // Validate Slaughter Date

  // Validate weight of animal
  let numreg =new RegExp(/^[0-9.]+$/);
  if (numreg.test(this.state.LivestockLiveWeight) && Number(this.state.LivestockLiveWeight) > 22 && Number(this.state.LivestockLiveWeight) <= 800 ){
    //test ok
  //  alert('test ok')
    this.setState({ValidLivestockLiveWeight: true})
    //this.saveAtLocalStorage
  } else {
    //test not ok
    this.setState({ValidLivestockLiveWeight: false})
    this.setState({LivestockLiveWeight: ''})
   Alert.alert('Invalid weight. Range: 22.01 to 800.00')
    } 
    

     // Validate total weight of meat after slaughtering
  let totalWeight = Number(this.state.LivestockTotalMeatWeight);
  let rangeLow = Number(this.state.LivestockLiveWeight)*.4;
  let rangeHigh = Number(this.state.LivestockLiveWeight)*.55;

  if (numreg.test(totalWeight) && totalWeight >= rangeLow && totalWeight <= rangeHigh ){
    //test ok
   // alert('test ok')
    this.setState({ValidLivestockTotalMeatWeight: true})
    //this.saveAtLocalStorage
  } else {
    //test not ok
    console.log(`Live: ${totalWeight} Rang : ${rangeLow} and ${rangeHigh}`)
    this.setState({ValidLivestockTotalMeatWeight: false})
    this.setState({LivestockTotalMeatWeight: ''})
   Alert.alert('Invalid weight. Range: 40% to 55% of live animal')
    } 

   // Validate weight of each meat package
   let PackageWeight = Number(this.state.LivestockMeatPackageWeight)
   if (numreg.test(PackageWeight) && PackageWeight >= 0.5 && PackageWeight <= 3 ){
     //test ok
    // alert('test ok')
     this.setState({ValidLivestockMeatPackageWeight: true})
     //this.saveAtLocalStorage
   } else {
     //test not ok
     console.log(`Package Weight: ${PackageWeight} `)
     this.setState({ValidLivestockMeatPackageWeight: false})
     this.setState({LivestockMeatPackageWeight: ''})
    Alert.alert('Invalid weight. Range: 0.5 Kg to 3Kg')
     } 

     // Validate total number of meat Packages after slaughtering
   let numreg3  = new RegExp(/^[0-9]+$/);
   let TotalPackages= Number(this.state.TotalNumberOfMeatPackages)
   if (numreg3.test(TotalPackages) && TotalPackages*PackageWeight ==  totalWeight){
     //test ok
    // alert('test ok')
     this.setState({ValidTotalNumberOfMeatPackages: true})
     //this.saveAtLocalStorage
   } else {
     //test not ok
     console.log(`Total Meat weight: ${totalWeight} Package Weight : ${PackageWeight} and Total number of packages ${TotalPackages}`)
     this.setState({ValidTotalNumberOfMeatPackages: false})
     this.setState({TotalNumberOfMeatPackages: ''})
    Alert.alert('Invalid number of packages')
     } 
if ( this.state.ValidSlaughterLivestockTag && this.state.ValidLivestockSlaughterDate && this.state.ValidLivestockLiveWeight && this.state.ValidLivestockTotalMeatWeight && this.state.ValidLivestockMeatPackageWeight && this.state.ValidTotalNumberOfMeatPackages){
    Alert.alert(
        //Title
       'Please confirm details of salughtered livestock :',
        //Message
       `Livestock Tag: ${this.state.SlaughterLivestockTag}, Slaughter Date: ${this.state.LivestockSlaughterDate}   Live Weight: ${this.state.LivestockLiveWeight}, Meat Weight: ${this.state.LivestockTotalMeatWeight}, Prepared Total ${this.state.TotalNumberOfMeatPackages} meat packages and the weight of each package is ${this.state.LivestockMeatPackageWeight} Kg`, 
        //Button
       [
         {text: 'No, edit data', onPress: () => console.log('Ask me later pressed')},
         {text: 'Cancel', onPress: ()=> this.exitHome(), style: 'cancel'},
         {text: 'Confirm', onPress: () => this.addDbDetails()},
       ],
        //Options
       { cancelable: false } 
     )
}
}
// END of validation

searchLocalDb = (SlaughterData)=>{
  db.transaction( tx => { 
         tx.executeSql('select * from SlaughteredLivestockDetails where LivestockTag = ?', [SlaughterData], (tx, results) =>{ 
          if (results.rows.length > 0){
           console.log('searchLocalDb Read from file: ',results.rows)
           Alert.alert('Check Livestock Tag number. This number is already used!')
           this.setState({ValidSlaughterLivestockTag: false})
          this.setState({SlaughterLivestockTag: ''})
          } 
        },(t,error)=> {console.log('Db6 error: ',error);})})
    

  }
  
  addDbDetails = () =>{
    // console.log('\n from SlaughterLivestock: props: \n',this.props)
    
              const updateSlaughterData = {
                VillageName: this.state.VillageName,
              LivestockTag: this.state.SlaughterLivestockTag,
              timestamp: this.state.LivestockSlaughterDate,
                LivestockLiveWeight: this.state.LivestockLiveWeight, 
                LivestockTotalMeatWeight: this.state.LivestockTotalMeatWeight,
                LiveStockMeatPackageWeight: this.state.LivestockMeatPackageWeight,
                TotalNumberOfMeatPackages: this.state.TotalNumberOfMeatPackages,
                Lat: this.state.where.lat,
              Lng: this.state.where.lng,
              Ald: this.state.where.Ald,
              TransactionTimestamp: new Date().toLocaleString(),
              //  TransactionTimestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
              }
      db.transaction(
      tx => { 
        tx.executeSql('insert into SlaughteredLivestockDetails (LivestockTag, SlaughterDate, LiveWeight, TotalMeatWeight, TotalNumberOfMeatPackages, MeatPackageWeight,Latitude,Longitude,Altitude,TransactionTimestamp,VillageName  ) values (?, ?, ?, ?, ?, ?,?,?,?,?,?)', [this.state.SlaughterLivestockTag, this.state.LivestockSlaughterDate,this.state.LivestockLiveWeight,this.state.LivestockTotalMeatWeight,this.state.TotalNumberOfMeatPackages,this.state.LivestockMeatPackageWeight,this.state.where.lat,this.state.where.lng,this.state.where.Ald,updateSlaughterData.TransactionTimestamp,this.state.VillageName],
        (tx, results) => { console.log ('\n from AddDbDetails: results: \n',results)},
        (t,error)=> {console.log('Db3 error: ',error); this.exitHome()})}
        )
        //  tx.executeSql('select * from SlaughteredLivestockDetails', [], (_, { rows }) =>
        //  // console.log('Read from file: ',JSON.stringify(rows))
        //   console.log('Read from file: ',rows)
        // );
    //   },
    //   null,
    //  // this.update
    // );
   // this.setState({IsLivestockDetailsConfirmed: true})
    // update backend
    // import {BackEndApi} from "../config/constants";
    const backendUrl= BackEndApi+'/livestockSlaughter'
    axios.post(backendUrl, updateSlaughterData)



    // axios.post('http://ab35456867f0.ngrok.io/livestockSlaughter', updateSlaughterData)
    .then((response) => { // Success
      console.log('\n Response from server for Livestock Slaughter update: ')
      console.log(response.data, response.status)
      // Synchronize if back-end update is success
     
      if (response.status == 200 ){
        db.transaction(tx => { 
        tx.executeSql(`UPDATE SlaughteredLivestockDetails set SynchronizeStatus = ? where LivestockTag ='${updateSlaughterData.LivestockTag}'`, ["Synchronized"], (tx, results) => { console.log ('results after Synchronization update: ', results) },(t,error)=> {console.log('Db4 error: ',error);   this.exitHome()})})
       
        // throw all records on console log for testing
        // db.transaction(tx => { 
        //   tx.executeSql('select * from SlaughteredLivestockDetails', [], (tx, results) => { 
        //      if (results.rows.length > 0){
        //        console.log ('All rows from SlaughteredLivestockDetails table: ', results.rows)
        //      } else {
        //          alert('No record found in the table SlaughteredLivestockDetails');
        //      }},(t,error)=> {console.log('Db3 error: ',error);})})
      }

      // get livestock picture
    
    this.props.navigation.push("LivestockPhoto", { LivestockTag: this.state.SlaughterLivestockTag })
    // <LivestockPic LivestockTag= {this.state.SlaughterLivestockTag}/>
   
    
     
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
    this.props.navigation.push("LivestockPhoto", {LivestockTag: this.state.SlaughterLivestockTag})
  // this.props.navigation.navigate('GetPictureRT',{LivestockTag: this.state.SlaughterLivestockTag})

    }; //end of addDbDetails
    // exitHome =()=> {  this.exitHome() }
    exitHome =()=> {  this.props.navigation.popToTop() }

_showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

_hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

_handleDatePicked = (pickeddate) => {
  console.log('pickeddate: ', pickeddate);
  let pDate= pickeddate.toDateString();
  console.log('pickeddate to string: ', pDate);
    year  = pickeddate.getFullYear();
    CurrentDate= new Date();
   
    //add comment
   if (year == CurrentDate.getFullYear() )
    {
    this.setState({LivestockSlaughterDate: pDate}) 
    this._hideDateTimePicker();
    this.setState({ValidLivestockSlaughterDate: true})
    }
    else {
        console.log('current year: ', CurrentDate.getFullYear());
        console.log('whereas picked date: ', pDate);
        this.setState({ValidLivestockSlaughterDate: false})
        this.setState({LivestockSlaughterDate:  new Date().toDateString()}) 
        this._hideDateTimePicker();
          }

  };
  

    render() { 
        
        return ( 
            <ScrollView > 
            <View style = {styles.container}>
            <Text style = {styles.heading}> Select Livestock for Slaughtering </Text>
            <Text style = {styles.heading}> ذبح ڪرڻ لاءِ حياتي پسند ڪريو </Text>

            <TextInput
                style={styles.inputs}
                onChangeText={(text)=>this.setState({SlaughterLivestockTag: text})}
                value={this.state.SlaughterLivestockTag}
                placeholder = 'Type here'
                placeholderTextColor= 'red' 
            />
            {this.state.ValidSlaughterLivestockTag || this.state.SlaughterLivestockTag === '' || this.state.SlaughterLivestockTag.length< 16 ? 
            <Text style = {styles.labels}>Enter Animal Tag Number</Text>
            
            : <Text style = {styles.labels2}>Enter Valid Tag Number</Text>}

            <TextInput
                style={styles.inputs}
                onFocus={ () => this._showDateTimePicker() }
               // keyboardType = 'number-pad'
                // onChangeText={(text)=>this.setState({LivestockSlaughterDate: text})}
                value={this.state.LivestockSlaughterDate}
            />
               {this.state.ValidLivestockSlaughterDate ? <Text style = {styles.labels}>Confirm Animal Slaughter Date </Text> : <Text style = {styles.labels2}>Enter Valid Date</Text>}
            
               <DateTimePicker
                      isVisible={this.state.isDateTimePickerVisible}
                      onConfirm={this._handleDatePicked}
                      onCancel={this._hideDateTimePicker}
                      mode={'date'}
                      datePickerModeAndroid={'spinner'}

                    />
           
             <TextInput
                style={styles.inputs}
                keyboardType = 'number-pad'
                onChangeText={(text)=>this.setState({LivestockLiveWeight: text})}
                value={this.state.LivestockLiveWeight}
            />
         
            {this.state.ValidLivestockLiveWeight ? 
            <Text style = {styles.labels}>Enter weight of Animal before Slaughtering </Text>
            
            : <Text style = {styles.labels2}>Enter Valid Weight</Text>}


            <TextInput
                style={styles.inputs}
                keyboardType = 'number-pad'
                onChangeText={(text)=>this.setState({LivestockTotalMeatWeight: text})}
                value={this.state.LivestockTotalMeatWeight}
            />
            {this.state.ValidLivestockTotalMeatWeight ? 
            <Text style = {styles.labels}>Enter Total Weight of Meat after salughtering and cleaning </Text>
            : <Text style = {styles.labels2}>Enter Valid Meat Weight</Text>}



            <TextInput
                style={styles.inputs}
                keyboardType = 'number-pad'
                onChangeText={(text)=>this.setState({TotalNumberOfMeatPackages: text})}
                value={this.state.TotalNumberOfMeatPackages}
            />
              {this.state.ValidTotalNumberOfMeatPackages ? 
            <Text style = {styles.labels}>Enter Total Number of meat packages prepared from salughtered animal </Text>
            : <Text style = {styles.labels2}>Enter valid Number of packages</Text>}
           
           
           
            <TextInput
                style={styles.inputs}
                keyboardType = 'number-pad'
                onChangeText={(text)=>this.setState({LivestockMeatPackageWeight: text})}
                value={this.state.LivestockMeatPackageWeight}
            />
              {this.state.ValidLivestockMeatPackageWeight ? 
                    <Text style = {styles.labels}>Enter weight of each meat package </Text>
            : <Text style = {styles.labels2}>Enter valid weight of meat packages</Text>}

          

            <View>
                <View style ={styles.buttonRow}>
                    {!this.state.IsLivestockDetailsConfirmed &&
                    <TouchableHighlight style={styles.buttonStyles3} onPress={this.validateLivestock()}>
                        <Text style={styles.buttonText}>Submit</Text>
                    </TouchableHighlight>
                     } 
                           
                    {/* <TouchableHighlight style={styles.buttonStyles3} onPress={()=> this.exitHome()}>
                        <Text style={styles.buttonText}>Home</Text>
                    </TouchableHighlight> */}
                </View>
            </View>
            </View>   
            </ScrollView>
         );
    }
}
// {this.state.ValidSlaughterLivestockTag &&
//   <TouchableHighlight style={styles.buttonStyles3} onPress={()=>this.props.navigation.navigate('GetPictureRT',{LivestockTag: this.state.SlaughterLivestockTag})}>
//       <Text style={styles.buttonText}>Picture</Text>
//   </TouchableHighlight>
//   } 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingBottom: '5%',
        paddingTop: '10%'
    },
    heading: {
        alignItems: 'center',
        fontSize: 12,
        backgroundColor: '#DCDCDC'
     //   flex: 1
    },
    inputs: {
     //   flex: 1,
        width: '40%',
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
      width: '95%',
      height: '50%',
      justifyContent: 'center',
      alignItems: 'center'
  },
    buttonText:{
        color: '#ffffff',
        fontSize: 15
    }
});


