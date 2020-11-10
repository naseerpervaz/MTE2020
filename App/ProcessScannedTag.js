import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, Linking } from 'react-native';
const axios = require('axios');
import * as SQLite from 'expo-sqlite';
import {BackEndApi} from "../App/config/constants";
const slaughteredLivestockDetailsTable = require('../App/model/slaughteredLivestockDetailsTable')
import Button from '../App/styles/Buttons';
const db = SQLite.openDatabase('PRICELocal.db');

export class DisplayScannedTag extends React.Component {
    static navigationOptions = { header: null };
    constructor (props) {
        super(props)
        this.state = { dataLoaded: false, scannedTagData: null, VillageNameFound: true,  where: {lat:null, lng:null, Ald: null}, }
    };
   
   componentDidMount(){
    //    console.log('\n from DisplayScnnedTag: props: \n',this.props)
   
       const {data}=this.props.data.params
    // console.log('\n data: ',data)
    //   if (this.IsValidJSONString(data)){
        //    let tag= JSON.parse(data)
    
        //  console.log('tag data: ',tag)
         // console.log('object Values:   ',Object.values(tag))
       //   console.log('object keys:   ',Object.keys(tag))
        
        if ("LivestockTag" in data == false || "PN" in data==false || "PC" in data == false){
            Alert.alert('invalid Tag:','Livestock tag number or package number or project code not found جانورن جو ٽيگ نمبر يا پئڪيج نمبر يا پراجيڪٽ ڪوڊ نه مليو',data)
            this.exitHome()
       }
       if ("LivestockTag" in data == true && "PN" in data==true && data.PC=== "DML"){
       // Alert.alert('tag for daily milk found')
        console.log('from DisplayScannedTag, tag: ',data)
        // this.props.navigation.navigate('SelectFeedCowRT',{tag})
         }

       this.setState({ scannedTagData: data,   dataLoaded: true})
      // this.setState({ scannedTagData: JSON.parse(this.props.navigation.getParam('data')),   dataLoaded: true}, () => console.log('hi Data loaded in state: ',this.state))
       if ("VillageName" in data == false){
          this.setState({VillageNameFound: false}, () => console.log('Village Name not found in the tag empty VillageName loaded in state: ',this.state))
    }
    // }
    
    let resultCreateTable = slaughteredLivestockDetailsTable.createMeatPackageDistributionTable()
           
            let geoOptions = {
                enableHighAccuracy: true,
                timeOut: 20000,
                maximumAge: 60 * 60 * 24
                            };
                navigator.geolocation.getCurrentPosition( this.geoSuccess, this.geoFailure, geoOptions)
                this.validateMeatInventory(data)
    };// end of ComponentDidMount


    
// shouldComponentUpdate(nextProps, nextState) {
//     console.log ('\n\n nextProps: ',nextProps)
//     // return true
//  if (nextProps.data !== this.props.data){
//      return true
//  }
//  else{return false}
// }


    geoSuccess = (position) => {
         
        this.setState({
            ready:true,
            where: {lat: position.coords.latitude,lng:position.coords.longitude, Ald:position.coords.altitude }
        })
       // console.log('hy Data loaded in state: ',this.state)
    }
      geoFailure = (err) => {
        this.setState({error: err.message});
    }
    IsValidJSONString(str) {
        try {
            JSON.parse(str);
        } catch (err) {
            Alert.alert('invalid Tag: JSON Format')
            console.log('invalid Tag: JSON Format',err)
            this.exitHome()
            return false;
        }
        return true;
    }
  
    exitHome =()=> {this.props.navigation.popToTop() }
    // exitHome =()=> {this.props.navigation.navigate('HomeRT') }
    
    validateMeatInventory=(data)=>{
        // console.log ('\n from ProcessScannedTag.validateMeatInventory: data ',data)
        const {PN,LivestockTag}= data
        let packageNumber= parseInt(PN)
        // console.log ('\n from ProcessScannedTag.validateMeatInventory: packageNumber, LivestockTag: ',packageNumber,LivestockTag)
        db.transaction(tx => { 
            tx.executeSql(`select * from MeatPackageDistribution where LivestockTag =? AND PackageNumber = ?`, [LivestockTag, packageNumber], (tx, results) => { 
            // console.log ('\n\n Results after local MeatPackageDistribution table search: ', results)
               if (results.rows.length > 0){
                 if ( results.rows._array[0].DateMeatFrozen !==null){
                    console.log ('\n\n DateMeatFrozen: ', results.rows._array[0].DateMeatFrozen)
                    Alert.alert ('Already Frozen Package', '  اڳ ئي منجهيل گوشت جو پيڪيج '+ results.rows._array[0].DateMeatFrozen,[{text: 'Ok  ٺيڪ آهي', onPress: ()=> this.exitHome()},] )
                   }
                 }})})
     } // end of valiateMeatInventory
     FreezePackage = () =>{
    
        let PackageNumber = this.state.scannedTagData.PN
        let LivestockTag = this.state.scannedTagData.LivestockTag
        let VillageName = this.state.scannedTagData.VillageName
          
         const updateTagData = {
            projectCode: 'MTE',
           villageName: VillageName,
           packageNumber: parseInt(PackageNumber),
        //    LivestockTag: LivestockTag,
           slaughterLivestockTag: LivestockTag,
        //    timestamp: new Date().toLocaleString(),
           packageRefrigerationTimestamp: Date(),
        //    Lat: this.state.where.lat,
        //   Lng: this.state.where.lng,
        //   Ald: this.state.where.Ald
          latitude: this.state.where.lat,
          longitude: this.state.where.lng,
          altitude: this.state.where.Ald
         }
       // console.log (`from freezepackage LivestockTag: ${LivestockTag}, PackageNumber: ${PackageNumber},Timestamp: ${ updateTagData.timestamp},  Location: ${this.state.where.lat} ${this.state.where.lng} ${this.state.where.Ald} `)
     //Update LocalDb 
     // VillageName, LivestockTag, PackageTag, PackageNumber, DateMeatFrozen, PackageHandedoverDate,Latitude, Longitude, Altitude,ProjectCode, SynchronizeStatus 
     // add validate if same package has been already consumed 
    //  console.log ('from freezepackage : updateTagData ',updateTagData)
    //  db.transaction(tx => { 
    //     tx.executeSql('UPDATE MeatPackageDistribution set VillageName = ?, DateMeatFrozen = ?, Latitude= ?,Longitude=?, Altitude=? WHERE LivestockTag = ? AND PackageNumber= ?',[VillageName,updateTagData.packageRefrigerationTimestamp,this.state.where.lat,this.state.where.lng,this.state.where.Ald,LivestockTag,PackageNumber],
    //     // (tx, results) => {  console.log('Package Frozen status has been updated: ', results),(t,error)=> {console.log('Db23 error: ',error);}})
    //     (tx, results) => { 
    //          console.log('Package Frozen status results: ', results);
    //          if (results.rowsAffected > 0) {
    //          Alert.alert ('Package has been marked for Freezer')
    //          this.exitHome()
    //          } else {
    //             alert('Updation Failed');
    //             this.exitHome()
    //          }
    //         }
    //         )})
    
    
    
    
    console.log ('\n\n updateTagData.slaughterLivestockTag, updateTagData.packageNumber beforeee local MeatPackageDistribution table search: ', updateTagData.slaughterLivestockTag, PackageNumber)
     db.transaction(tx => { 
       tx.executeSql(`select * from MeatPackageDistribution where LivestockTag =? AND PackageNumber = ?`, [updateTagData.slaughterLivestockTag, PackageNumber], (tx, results) => { 
       console.log ('\n\n Results after local MeatPackageDistribution table search: ', results)
          if (results.rows.length > 0){
            if ( results.rows._array[0].DateMeatFrozen ===null){
                // console.log ('DateMeatFrozen: ', results.rows._array[0].DateMeatFrozen)
               
                console.log(VillageName,updateTagData.packageRefrigerationTimestamp,this.state.where.lat,this.state.where.lng,this.state.where.Ald,LivestockTag,PackageNumber)
    
                // tx.executeSql(`UPDATE MeatPackageDistribution SET VillageName = ${VillageName}, DateMeatFrozen = ${updateTagData.packageRefrigerationTimestamp}, LivestockTag =${LivestockTag}, PackageNumber=${PackageNumber}, Latitude= ${this.state.where.lat},Longitude=${this.state.where.lng}, Altitude=${this.state.where.Ald} WHERE LivestockTag = ${LivestockTag} AND PackageNumber= ${PackageNumber}`,
                tx.executeSql('UPDATE MeatPackageDistribution SET VillageName = ?, DateMeatFrozen = ?, Latitude= ?,Longitude=?, Altitude=? WHERE LivestockTag = ? AND PackageNumber= ?',[VillageName,updateTagData.packageRefrigerationTimestamp,this.state.where.lat,this.state.where.lng,this.state.where.Ald,updateTagData.slaughterLivestockTag, updateTagData.packageNumber],
                // (tx, results) => {  console.log('Package Frozen status has been updated: ', results),(t,error)=> {console.log('Db23 error: ',error);}})
                (tx, results) => { 
                     console.log('Package Frozen status results: ', results);
                     if (results.rowsAffected > 0) {
                     Alert.alert ('Package has been marked for Freezer','پيڪس کي فريزر لاءِ نشان لڳايو ويو آهي')
                     } else {
                        alert('Updation Failed');
                        this.exitHome()
                     }
                    })
    
          } else {
                console.log ('\n\n DateMeatFrozen: ', results.rows._array[0].DateMeatFrozen)
                Alert.alert ('Package has already been Frozen on ', 'پيڪيج پهريان ئي منجمد ٿي چڪو آهي'+ results.rows._array[0].DateMeatFrozen )
                this.exitHome()
          }
          } else {
                console.log('inserting')
                // PackageHandedoverDate, SynchronizeStatus
             tx.executeSql('insert into MeatPackageDistribution ( VillageName , HouseHold , DateMeatFrozen, LivestockTag, PackageNumber, Latitude, Longitude, Altitude,ProjectCode) values (?, ?, ?, ?, ?, ?, ?,?,? )', [updateTagData.villageName,updateTagData.houseHold, updateTagData.packageRefrigerationTimestamp, updateTagData.slaughterLivestockTag, updateTagData.packageNumber,  updateTagData.latitude, updateTagData.longitude, updateTagData.altitude,updateTagData.projectCode],
             (tx, results) => {  console.log('Package Frozen status has been updated: ', results)
             Alert.alert ('Package has been registered for Freezer inventory')
               // send meat Package gift geolocation to house hold
     
               // update backend
                 //  axios.post(`https://4cfb7159.ngrok.io/updatescannedtag, ${PackageNumber}${HouseNumber}${timestamp}${this.state.where.lat}${this.state.where.lng}`)
               // console.log('updateTagData before calling backend: ',updateTagData)
                //    axios.post('http://32cba08da5ce.ngrok.io/updateScannedTagFreezer', updateTagData)
                // console.log('updateTagData from DisplayScannedTag.js ',updateTagData)
    
                //    axios.patch('http://32cba08da5ce.ngrok.io/FreezeMeatPackage', updateTagData)
                    
                   // update backend
                    // import {BackEndApi} from "../config/constants";
                    const backendUrl= BackEndApi+'/FreezeMeatPackage'
                    axios.patch(backendUrl, updateTagData)
                   
                   .then((response) => { // Success
                    //  console.log('success response from server: ')
                    //  console.log(response.data, response.status)
                     // Synchronize if back-end update is success
                     if (response.status == 200 && response.data.affectedRows > 0){
                       db.transaction(tx => { 
                    //    tx.executeSql(`UPDATE MeatPackageDistribution set SynchronizeStatus = ? where LivestockTag ='${updateTagData.LivestockTag}' AND PackageNumber = ${updateTagData.PackageNumber}`, ["Synchronized"], (tx, results) => { console.log ('results after Synchronization update: ', results) },(t,error)=> {console.log('Db4 error: ',error);   this.exitHome()})})
                       tx.executeSql('UPDATE MeatPackageDistribution set SynchronizeStatus = ? where LivestockTag =? AND PackageNumber = ?', ["Synchronized",updateTagData.slaughterLivestockTag,updateTagData.packageNumber], (tx, results) => { console.log ('results after Synchronization update: ', results) },(t,error)=> {console.log('Db4 error: ',error);   this.exitHome()})})
                     
                       // throw all records on console log for testing
                       db.transaction(tx => { 
                         tx.executeSql('select * from MeatPackageDistribution', [], (tx, results) => { 
                           if (results.rows.length > 0){
                             console.log ('All rows from MeatPackageDistribution table: ', results.rows)
                           } else {
                               alert('No record found in the table MeatPackageDistribution');
                           }},(t,error)=> {console.log('Db3 error: ',error);})})
                     }
     
                     alert(`Package ${PackageNumber} status has been marked for Freezer `)
                     console.log("Success")
                     this.exitHome()
                     
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
     
     }},(t,error)=> {console.log('Db4 error: ',error);})})
     
       };// end of  FreezePackage
    
    render()
    {
        return(
            <View style = {styles.container}>
             
            
             {this.state.dataLoaded && this.state.scannedTagData.PN && this.state.scannedTagData.LivestockTag &&      <Text style={{width: '90%', height: 26,textAlign:'center', marginLeft:13,backgroundColor: 'powderblue'}}>Package # {this.state.scannedTagData.PN} of Livestock #  {this.state.scannedTagData.LivestockTag}
             </Text>}
           
             {this.state.dataLoaded && this.state.scannedTagData.PN && this.state.scannedTagData.LivestockTag &&      <Text style={{width: '90%', height: 26,textAlign:'center', marginLeft:13,backgroundColor: 'powderblue'}}> پيڪيج نمبر {this.state.scannedTagData.PN} ٽيگ نمبر  {this.state.scannedTagData.LivestockTag}     
             </Text>}
             <Text></Text>
             <Text></Text>
           
                     
             {this.state.dataLoaded && this.state.scannedTagData.PN && this.state.scannedTagData.LivestockTag &&  <Button  text1="Please Clik here to confirm Meat package has been stored in the Freezer"
                   text2="تصديق ڪريو گوشت جو  پيڪيج فريزر اندر رکيل ٿي ويو"     onPress={() => this.FreezePackage()}
                   type='filled'
                   bordered
                    />
             }
             <Text></Text>
             <Text></Text>
             {this.state.dataLoaded && this.state.scannedTagData.PN && this.state.scannedTagData.LivestockTag &&  <Button  text1="Cancel"
                   text2="روڪيو"     onPress={() => this.exitHome()}
                   type='filled'
                   bordered
                    />
             }
         </View>
           
        //    <View style = {styles.container}>
             
        //         <Text style={styles.labels}>Please confirm Meat package has been stored in the Freezer تصديق ڪريو گوشت جو  پيڪيج فريزر اندر رکيل ٿي ويو </Text>
             
        //     {this.state.dataLoaded && this.state.scannedTagData.PN && this.state.scannedTagData.LivestockTag &&   <TouchableOpacity style={styles.buttonStyles} onPress={this.FreezePackage}>
        //         <Text style={styles.inputs}>Package # {this.state.scannedTagData.PN} of Livestock #  {this.state.scannedTagData.LivestockTag} </Text>
        //         <Text style={styles.inputs}>   پيڪيج نمبر {this.state.scannedTagData.PN}   نمبر   ٽيگ {this.state.scannedTagData.LivestockTag} </Text>
        //     </TouchableOpacity>
        //     }
      
        //      </View>
        );
    }

}
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
// <Text>Salughter Date: {TagObj.SDate}</Text>
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#35605a'
//     },
//     buttonRow: {
//         flex: 2,
//         flexDirection: 'row',
//         alignItems: 'center',
//         borderColor: '#ffffff',
//         borderBottomWidth: 1,
//         // backgroundColor: '#35605a'
//     },
//     buttonStyles: {
//         backgroundColor: 'yellow',
//         // backgroundColor: '#35605a',
      
//         marginRight:20,
//         marginLeft:20,
//         width: '80%',
//         height: '30%',
//         justifyContent: 'center',
//         alignItems: 'stretch'
//     },
//     buttonText:{
//         // color: '#ffffff',
//         color: 'red',
//         fontSize: 15,
//         marginLeft: 20,
//         marginRight:36,
//         // width: '96%',
//     },
//     heading: {
//         fontSize: 16,
//       //  flex: 1
//     },
// });

 // validate if Scanned Tag exist in the back end. This approach was removed by npq on May 5, 2019
    /*
     async componentDidMount(){
        console.log('tag data set:  ',this.props.navigation.getParam('data'))
     await this.setState({
            scannedTagData: JSON.parse(this.props.navigation.getParam('data'))
        }, () => {
            this.getDbTag()

        });
    };
    async getDbTag(){
        let PackageNumber = this.state.scannedTagData.PN;
        let databTagData = await axios.get(`https://29c86745.ngrok.io/Findscannedtag/${PackageNumber}`);
        const {data} = await databTagData;
        const dbData = JSON.parse(JSON.stringify(data[0]));
        console.log ('return from sqldb: ',dbData);
        this.setState({dbTagData: dbData, dataLoaded: true});
        /******************
         // getDbTag =()=>{
         axios.get(`https://4cfb7159.ngrok.io/Findscannedtag/${PackageNumber}`)
     .then((response) => {
      // console.log('response: ',response)
      //const dbData = JSON.parse(JSON.stringify(response[0]))
      //console.log('databTagData: ',databTagData)
       //const {data} = databTagData;
       //console.log('data: ', data)
       //const dbData = JSON.parse(JSON.stringify(data[0])); 
      //  console.log ('return from sqldb: ',dbData)
      //   this.setState({dbTagData: dbData, dataLoaded: true})
      })
      .catch((error) => {
        // Error
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log('Error reported by response.data: ',error.response.data);
            console.log('Error reported by response.status: ',error.response.status);
            console.log('Error reported by response.headers: ',error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the 
            // browser and an instance of
            // http.ClientRequest in node.js
            console.log('Error reported by error.request: ',error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }
        console.log('Error reported by error.config: ',error.config);
        alert('some thing went wrong call PRICE with error code DisplayScannedTag')
        this.exitHome()
    });
         

    };
*************************************************************************/



 
 //   onPress=()=>{
       // const dbTagDataJ= JSON.parse(this.state. dbTagData)
   //    console.log ('Db tag data for SlaughterDate :  ', this.state.dbTagData.SlaughterDate);
     //   Alert.alert('NPQ create the component to capture livestock salughtering data',this.state. scannedTagData.PC)
        /*
        shareToWhatsAppWithContact = (text, phoneNumber) => {
            Linking.openURL(`whatsapp://send?text=${text}&phone=${phoneNumber}`);
           }
            Try this module
            https://github.com/react-native-community/react-native-share
        */
    //};
    
/* dicarded on May 5 2019
 content = () => {
   // console.log ('content function: ', this.state.dataLoaded, this.state.dbTagData.SlaughterDate )
    if (this.state.dbTagData.SlaughterDate === ""){
        return(
         <TouchableOpacity style={styles.buttonStyles} onPress={this.onPress}>
         <Text style={styles.buttonText}>Confirm Livestock Tag number {this.state.dbTagData.SlaughterLivestockTag} has been Slaughter Today</Text>
        </TouchableOpacity>
        )
    }
         return ( <Text> Package number: {this.state.dbTagData.PackageNumber} for livestock tag: {this.state.dbTagData.SlaughterLivestockTag} Slaughtered on {this.state.dbTagData.SlaughterDate}  </Text>)
 }

   content2 = () => {
       // console.log ('content2 function: Package Number on Tag and DB ', this.state.scannedTagData.PN, this.state.dbTagData.PackageNumber )
        if ( (this.state.displayTagCofirmation) && this.state.dbTagData.PackageNumber === parseInt(this.state.scannedTagData.PN)){
            return(
                <TouchableOpacity style={styles.buttonStyles} onPress={this.getHouseHold}>
                <Text style={styles.buttonText}>Select House Number for meat package number {this.state.scannedTagData.PN} </Text>
               </TouchableOpacity>
            )
        }
             return (  <TouchableOpacity style={styles.buttonStyles} onPress={this.exitHome}>
             <Text> Invalid Package number </Text>
             </TouchableOpacity>)
     }
     getHouseHold = ()=>{
        this.props.navigation.navigate(
            'GetHouseHoldRT', { PackageNumber: this.state.scannedTagData.PN

            })
     };

     /*
     // Moved from render block 
      {this.state.confirmHouseHold && (<HouseNumber selectHouseHold ={this.getHouseHold} />)}
     getHouseHold = (houseHold)=>{
         console.log('confirmHouseHold: and HouseHold',  this.state.confirmHouseHold, houseHold )
         if (!this.state.confirmHouseHold)
        this.setState({confirmHouseHold: true,  displayTagCofirmation: false})
        else
        this.setState({selectedHouseHold: houseHold})
     };
       
     render(){
        const { dataLoaded } = this.state
        return(
            <View style= {styles.container}>
            <View style ={styles.buttonRow}>
           
                {dataLoaded ? this.content() : null}
               
            </View>

            <View style ={styles.buttonRow}>
            {dataLoaded ? this.content2() : null}
           
           </View>

            <View style ={styles.buttonRow}>
            {dataLoaded ? 
                <TouchableOpacity style={styles.buttonStyles} onPress={this.exitHome}>
                    <Text style={styles.buttonText}>Confirm Meat package {this.state.scannedTagData.PN} is placed in freezer</Text>
                </TouchableOpacity>
                      : null}
             <TouchableOpacity style={styles.buttonStyles} onPress={this.exitHome}>
                    <Text style={styles.buttonText}>Home</Text>
                </TouchableOpacity>
            </View>
            
            
        </View>
        );
    }
********************/