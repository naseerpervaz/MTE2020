// import React, { Component } from 'react';
// import { StyleSheet, View, TouchableHighlight, Text, TextInput, Alert,ScrollView } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { Alert } from 'react-native';
const axios = require('axios');
const Package = require('../model/Package')
const updateSlaughteredLivestock = require('../database/updateSlaughteredLivestock')
const slaughterTable = require('../model/slaughteredLivestockDetailsTable')
 import {BackEndApi} from "../config/constants";
   
const db = SQLite.openDatabase('PRICELocal.db'); 
altertable= async ()=>{
    // example to add columns in existing table
    // let resultAlter = await slaughterTable.alterSlaughteredTable()
   
    // console log all records
    // let resultList = await slaughterTable.selectAllSlaughteredTable()
    // let resultLog = await slaughterTable.selectAllMeatPackageDistribution()
   
   
    // Delete all rows from MeatPackageDistribution
    // let resultdeleteAllRows = await slaughterTable.deleteAllRows()
    
    

    
    // console log all records from table Picture
    let resultPics = await slaughterTable.selectAllLivestockPictures()

}

// deleteRows= async (table)=>{
//     let resultdrop = await slaughterTable.DeleteRows(table)
// }
// export function listRows(table) {
//     let resultdrop = await slaughterTable.ListRows(table);
// }
// dropTable= async (table)=>{
//     // drop table
//     // let resultdrop = await slaughterTable.dropSlaughteredTable()
//     let resultdrop = await slaughterTable.dropTable(table)
// }
// backendTables=async()=>{
//     // list all rows from backend livestock tables
//     // let response = await axios.get('http://165.22.226.40:3000/livestocks')
// //    console.log('BackEndApi: ',BackEndApi)
//     // const {API_URL:backend}=API_URL
//     // const backendUrl= backend+'/livestocks'
//     const backendUrl= BackEndApi+'/livestocks'
//     let response = await axios.get(backendUrl)
//     const {data}= response
//     console.log('\n All rows response from bakend:\n',data)
// }

const GETALL_NULL_SYNCHRONIZE_PROCURE_LIVESTOCK_SQL = 'select * from Livestock where SynchronizeStatus is null'
module.exports.ProcureLivestock = async function ProcureLivestock(){
    console.log('\n\n from Synchronize.ProcureLivestock \n\n')
    try {
          // throw all records on console log for testing
                // console log all records from table Picture
                 let resultdrop = await slaughterTable.ListRows('Livestock')
       
       const result = await new Promise((resolve, reject) =>{
            db.transaction(tx => { 
                    tx.executeSql(GETALL_NULL_SYNCHRONIZED_HOUSEHOLD_PICTURE_SQL, [], 
                    (tx, results) =>{resolve(results)},
                    (tx,err)=> {reject(err)})
                
            }) });
        
    console.log ('trace  from Synchronize.ProcureLivestock: result  ',result)
    const  {rows:{_array}, rows:{length}}  =  result
     // console.log ('trace  from Synchronize.getNullSynchronizeMeatPackages: result length ',length)
    //     console.log ('trace  from Synchronize.getNullSynchronizeMeatPackages: result rows ',_array, typeof _array)
        // for (i=0;i<length;i++){
            // console.log (`\nSynchronize.getNullSynchronizeMeatPackages:  `,_array[i].LivestockTag)}
            
            if(length > 0) {
                     
                
                /********************************************/
                // axios.patch('http://32cba08da5ce.ngrok.io'/DailyMilk/Add_Daily_Milk_Cow', _array)
                

                // update backend
                // import {BackEndApi} from "../config/constants";
                const backendUrl= BackEndApi+'/DailyMilk/Add_Daily_Milk_Cow'
                axios.post(backendUrl, _array)
                
                .then((response) => { // Success
                    // console.log('success response from server: ',response)
                    // const {data, data:[errorMessages]}= response
                    const {data}= response
                   let resultUpdate=  updateSlaughteredLivestock.UpdateProcureLivestock(data)             
              }) // end of response
             .catch((error)=>console.log('\nfailed to update server \n',error))
                                  
             } else { console.log('\n No record of Livestoc procured for Headoffice synchronization') }
        
    }catch(err) { console.log('Synchronize.ProcureLivestock: error getting Data from Livestocktable: '+ err)   }   
}// end of ProcureLivestock



const GETALL_NULL_SYNCHRONIZED_HOUSEHOLD_PICTURE_SQL = 'select * from mTEHousehold where SynchronizeStatus is null'
module.exports.HouseholdPicture = async function HouseholdPicture(){
    console.log('\n\n from Synchronize.HouseholdPicture \n\n')
    try {
          // throw all records on console log for testing
                // console log all records from table Picture
                 let resultdrop = await slaughterTable.ListRows('mTEHousehold')
       
       const result = await new Promise((resolve, reject) =>{
            db.transaction(tx => { 
                    tx.executeSql(GETALL_NULL_SYNCHRONIZED_HOUSEHOLD_PICTURE_SQL, [], 
                    (tx, results) =>{resolve(results)},
                    (tx,err)=> {reject(err)})
                
            }) });
        
    //  Array/Object Destructuring
    //   https://www.youtube.com/watch?v=NIq3qLaHCIs 
     console.log ('trace  from Synchronize.HouseholdPicture: result  ',result)
    const  {rows:{_array}, rows:{length}}  =  result
    // console.log ('trace  from Synchronize.getNullSynchronizeMeatPackages: result length ',length)
        // console.log ('trace  from Synchronize.HouseholdPicture: result rows ',_array, typeof _array)
        for (i=0;i<length;i++){
            // console.log (`\nSynchronize.HouseholdPicture: _array[i].LivestockTag,_array[i].pictureWdith   `,_array[i].LivestockTag,_array[i].pictureWidth)
           
         if(length > 0) {
            var livestock=_array[i].LivestockTag
            const fd = new FormData();
            fd.append('LivestockTag',_array[i].LivestockTag);
            fd.append('pictureDate', _array[i].pictureDate);
            fd.append('pictureHeight', _array[i].pictureHeight);
            fd.append('pictureWdith', _array[i].pictureWidth);
            //  fd.append('name','price');
            fd.append('fileData',{uri: _array[i].picture,
                    type: 'image/jpeg', 
                    name: 'myImage.jpg'
                        });
            fd.append('Lat', _array[i].Latitude);
            fd.append('Lng', _array[i].Longitude,);
            fd.append('Ald', _array[i].Altitude,);
            fd.append('Household', _array[i].Household,);
            fd.append('ProjectCode', _array[i].ProjectCode,);
            fd.append('DonorId', _array[i].DonorId,);
            fd.append('Remarks', _array[i].Remarks,);
            fd.append('PackageNumber', _array[i].PackageNumber,);
            fd.append('VillageName', _array[i].VillageName,);
            fd.append('TransactionTimestamp', _array[i].TransactionTimestamp);
                       
                // axios({
                //         url:'http://984c7b281d8c.ngrok.io/upload',
                //     method: 'POST',
                //     data: fd,
                //     headers: {
                //     Accept: 'application/json',
                //     'Content-Type': 'multipart/form-data'
                //         }
                //     })
            // update backend
                // import {BackEndApi} from "../config/constants";
                const options ={headers: { Accept: 'application/json', 'Content-Type': 'multipart/form-data' }}
                const backendUrl= BackEndApi+'/upload'
                axios.post(backendUrl,fd,options)
        .then((response) => { // Success
            console.log('\n Response from server for HouseholdPicture mTEHousehold update: ')
            console.log(response.data, response.status)
            // Synchronize if back-end update is success
            
            if (response.status == 200 ){
                db.transaction(tx => { 
                tx.executeSql(`UPDATE mTEHousehold set SynchronizeStatus = ? where LivestockTag ='${livestock}'`, ["Synchronized"], (tx, results) => { console.log ('results after Synchronization update: ', results) },(t,error)=> {console.log('Db4 error: ',error);   this.exitHome()})})
            
            }

            // Alert.alert(`Livestock Picture status has been updated for livestock tag ${livestockTag}`)
            console.log("Successfully updated mTEHousehold Picture status")
     
     
         }) // end of response
    
        .catch((error) => { // Error
            if (error.response) {
                console.log('Server Error  reported by response.data: ',error.response.data);
                console.log('Server Error  reported by response.status: ',error.response.status);
                console.log('Server Error  reported by response.headers: ',error.response.headers);
                
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the 
            // browser and an instance of
            // http.ClientRequest in node.js
            console.log('Server Error  reported by error 2.request: ',error.request);
        //   alert('back end server error. Check console log')
        //  this.exitHome()
        } else {
            // Something happened in setting up the request that triggered an Server Error 
            console.log('Server Error ', error.message);
            // alert('back end server error 3. Check console log')
        //  this.exitHome()
        }
        console.log('Backend server Error reported by error 4.config: ',error.config);
        // alert('back end server error. Check console log')
        // this.exitHome()
        });// end of catch
      }  }   //  end of rows      
    }catch(err) { console.log('Synchronize.HouseholdPicture: error getting Data from mTEHouseholdtable: '+ err)   }   
}// end of HouseholdPicture


const GETALL_NULL_SYNCHRONIZED_LIVESTOCK_PICTURE_SQL = 'select * from LivestockPicture where SynchronizeStatus is null'
// const GETALL_NULL_SYNCHRONIZED_LIVESTOCK_PICTURE_SQL = 'select * from LivestockPicture '

module.exports.LivestockPicture = async function LivestockPicture(){
    console.log('\n\n from Synchronize.LivestockPicture \n\n')
    try {
          // throw all records on console log for testing
                // console log all records from table Picture
                 let resultPics = await slaughterTable.selectAllLivestockPictures()
       
       const result = await new Promise((resolve, reject) =>{
            db.transaction(tx => { 
                    tx.executeSql(GETALL_NULL_SYNCHRONIZED_LIVESTOCK_PICTURE_SQL, [], 
                    (tx, results) =>{resolve(results)},
                    (tx,err)=> {reject(err)})
                
            }) });
        
    //  Array/Object Destructuring
    //   https://www.youtube.com/watch?v=NIq3qLaHCIs 
     console.log ('trace  from Synchronize.getNullSynchronizeMeatPackages: result  ',result)
    const  {rows:{_array}, rows:{length}}  =  result
    // console.log ('trace  from Synchronize.getNullSynchronizeMeatPackages: result length ',length)
        // console.log ('trace  from Synchronize.LivestockPicture: result rows ',_array, typeof _array)
        for (i=0;i<length;i++){
            // console.log (`\nSynchronize.LivestockPicture: _array[i].LivestockTag,_array[i].pictureWdith   `,_array[i].LivestockTag,_array[i].pictureWidth)
           
         if(length > 0) {
            var livestock=_array[i].LivestockTag
            const fd = new FormData();
            fd.append('LivestockTag',_array[i].LivestockTag);
            fd.append('pictureDate', _array[i].pictureDate);
            fd.append('pictureHeight', _array[i].pictureHeight);
            fd.append('pictureWdith', _array[i].pictureWidth);
            //  fd.append('name','price');
            fd.append('fileData',{uri: _array[i].picture,
                    type: 'image/jpeg', 
                    name: 'myImage.jpg'
                        });
            fd.append('Lat', _array[i].Latitude);
            fd.append('Lng', _array[i].Longitude,);
            fd.append('Ald', _array[i].Altitude,);
            fd.append('TransactionTimestamp', new Date().toLocaleString());
             
                // axios({
                //         url:'http://984c7b281d8c.ngrok.io/upload',
                //     method: 'POST',
                //     data: fd,
                //     headers: {
                //     Accept: 'application/json',
                //     'Content-Type': 'multipart/form-data'
                //         }
                //     })
            // update backend
                // import {BackEndApi} from "../config/constants";
                const options ={headers: { Accept: 'application/json', 'Content-Type': 'multipart/form-data' }}
                const backendUrl= BackEndApi+'/upload'
                axios.post(backendUrl,fd,options)
        .then((response) => { // Success
            console.log('\n Response from server for Livestock Picture update: ')
            console.log(response.data, response.status)
            // Synchronize if back-end update is success
            
            if (response.status == 200 ){
                db.transaction(tx => { 
                tx.executeSql(`UPDATE LivestockPicture set SynchronizeStatus = ? where LivestockTag ='${livestock}'`, ["Synchronized"], (tx, results) => { console.log ('results after Synchronization update: ', results) },(t,error)=> {console.log('Db4 error: ',error);   this.exitHome()})})
            
            }

            // Alert.alert(`Livestock Picture status has been updated for livestock tag ${livestockTag}`)
            console.log("Successfully updated Livestock Picture status")
     
     
         }) // end of response
    
        .catch((error) => { // Error
            if (error.response) {
                console.log('Server Error  reported by response.data: ',error.response.data);
                console.log('Server Error  reported by response.status: ',error.response.status);
                console.log('Server Error  reported by response.headers: ',error.response.headers);
                
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the 
            // browser and an instance of
            // http.ClientRequest in node.js
            console.log('Server Error  reported by error 2.request: ',error.request);
        //   alert('back end server error. Check console log')
        //  this.exitHome()
        } else {
            // Something happened in setting up the request that triggered an Server Error 
            console.log('Server Error ', error.message);
            // alert('back end server error 3. Check console log')
        //  this.exitHome()
        }
        console.log('Backend server Error reported by error 4.config: ',error.config);
        // alert('back end server error. Check console log')
        // this.exitHome()
        });// end of catch
      }  }   //  end of rows      
    }catch(err) { console.log('Synchronize.LivestockPicture: error getting Data from LivestockPicture table: '+ err)   }   
}// end of LivestockPicture

///////////////////////////
 const GETALL_NULL_SYNCHRONIZED_MEATPACAKGES_SQL = 'select * from MeatPackageDistribution where SynchronizeStatus is null'
// const GETALL_NULL_SYNCHRONIZED_MEATPACAKGES_SQL = 'select * from MeatPackageDistribution where SynchronizeStatus =?'
// module.exports.getNullSynchronizeMeatPackages = async function getNullSynchronizeMeatPackages(){
module.exports.meatPackages = async function meatPackages(){
    console.log('\n\n from Synchronize.meatPackages \n\n')
     let resultdrop = await slaughterTable.ListRows('MeatPackageDistribution')
    try {
        const result = await new Promise((resolve, reject) =>{
            db.transaction(tx => { 
                    tx.executeSql(GETALL_NULL_SYNCHRONIZED_MEATPACAKGES_SQL, [], 
                    (tx, results) =>{resolve(results)},
                    (tx,err)=> {reject(err)})
                
            }) });
        
    //  Array/Object Destructuring
    //   https://www.youtube.com/watch?v=NIq3qLaHCIs 
    //  console.log ('trace  from Synchronize.getNullSynchronizeMeatPackages: result  ',result)
    const  {rows:{_array}, rows:{length}}  =  result
    // console.log ('trace  from Synchronize.getNullSynchronizeMeatPackages: result length ',length)
    //     console.log ('trace  from Synchronize.getNullSynchronizeMeatPackages: result rows ',_array, typeof _array)
        // for (i=0;i<length;i++){
            // console.log (`\nSynchronize.getNullSynchronizeMeatPackages:  `,_array[i].LivestockTag)}
       /********************************************/      
            if(length > 0) {
                // console.log ('All rows from MeatPackageDistribution table result: ', result)
                // packageRow= result.map(packageMaping);
                //   Package2= _array.forEach(row=>packageMaping(row))
                //   console.log ('packageRow from MeatPackageDistribution table : ', Package2)
                // return result.map(packageMaping);        
                
               
                // axios.patch('http://2c3a4b362597.ngrok.io/SynchronizeConsumedPackages', _array)


                 // update backend
                // import {BackEndApi} from "../config/constants";
                const backendUrl= BackEndApi+'/SynchronizeConsumedPackages'
                axios.patch(backendUrl, _array)
                
                .then((response) => { // Success
                    // console.log('from Synchronize.meatPackages response from server:\n ',response)
                // Synchronize if back-end update is success
                // const {data}= response
                const {data, data:{errorMessages},data:{hasError},data:{status}}= response
                console.log('\nfrom Synchronize.meatPackages data from server:\n ',data)
                console.log('\nfrom Synchronize.meatPackages errorMessages from server:\n ',errorMessages)
                if (errorMessages>0){
                console.log('\nfrom Synchronize.meatPackages errorMessages[0].errorMessage from server:\n ',errorMessages[0].errorMessage)
                console.log('\nfrom Synchronize.meatPackages hasError from server:\n ',hasError)
                 }
                console.log('\nfrom Synchronize.meatPackages status from server:\n ',status)
                if (status == 200 ||status =='OK' ){
                        let resultUpdate=  updateSlaughteredLivestock.UpdateMeatPackageDistribution(data)
                          
                          // throw all records on console log for testing
                          db.transaction(tx => { 
                              tx.executeSql('select * from MeatPackageDistribution', [], (tx, results) => { 
                                  if (results.rows.length > 0){
                                      console.log ('\nAll rows from MeatPackageDistribution table after backend server synchronized: \n', results.rows)
                                    } else {
                                        alert('No record found in the table MeatPackageDistribution');
                                    }},(t,error)=> {console.log('Db3 error: ',error);})})
                                
                                  }               
                                
                                
                }) // end of response
             .catch((error)=>console.log('\nfailed to update server \n',error))
                                  
             } else {
                 console.log('some thing went wrong')           
            Alert.alert(
                // 'Alert Title',
                'Meat The Eid',
                // 'My Alert Msg',
                `No record for Headoffice synchronization`,
                [
                  {
                    // text: 'Ask me later',
                    text: 'Ok',
                    // onPress: () => this.exitHome()
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
         }
            
       
    }catch(err) {
        console.log('Synchronize.meatPackages: error getting Data from MeatPackageDistribution table: '+ err)
            }
}// end of meatPackages
/////////////////////////////////
const GETALL_NULL_SLAUGHTERED_LIVESTOCK_DETAILS_SQL = 'select * from SlaughteredLivestockDetails where SynchronizeStatus is null'

module.exports.slaughteredLivestock = async function slaughteredLivestock(){
    console.log('\n from Synchronize.slaughteredLivestock \n')
     let resultdrop = await slaughterTable.ListRows('SlaughteredLivestockDetails')
    try {
        const result = await new Promise((resolve, reject) =>{
            db.transaction(tx => { tx.executeSql(GETALL_NULL_SLAUGHTERED_LIVESTOCK_DETAILS_SQL, [],
                (tx,results)=>{resolve(results)},
                (tx,error) =>{reject(error)}
                    
                )})});
            console.log ('result from Synchronize.slaughteredLivestock search table: ', result)  
           //  Array/Object Destructuring
    //   https://www.youtube.com/watch?v=NIq3qLaHCIs 
    // console.log ('trace  from Synchronize.getNullSynchronizeMeatPackages: result  ',result)
    const  {rows:{_array}, rows:{length}}=result
    // console.log ('trace  from Synchronize.getNullSynchronizeMeatPackages: result length ',length)
    //     console.log ('trace  from Synchronize.getNullSynchronizeMeatPackages: result rows ',_array, typeof _array)
        // for (i=0;i<length;i++){
            // console.log (`\nSynchronize.getNullSynchronizeMeatPackages:  `,_array[i].LivestockTag)}
            
            if(length > 0) {
                // console.log ('All rows from MeatPackageDistribution table result: ', result)
                // packageRow= result.map(packageMaping);
                //   Package2= _array.forEach(row=>packageMaping(row))
                //   console.log ('packageRow from MeatPackageDistribution table : ', Package2)
                // return result.map(packageMaping);        
                
                /********************************************/
                // axios.patch('http://32cba08da5ce.ngrok.io/SynchronizeSlaughteredLivestock', _array)
                

                // update backend
                // import {BackEndApi} from "../config/constants";
                const backendUrl= BackEndApi+'/SynchronizeSlaughteredLivestock'
                axios.patch(backendUrl, _array)
                
                .then((response) => { // Success
                    // console.log('success response from server: ',response)
                    // const {data, data:[errorMessages]}= response
                    const {data}= response
                   let resultUpdate=  updateSlaughteredLivestock.UpdateSlaughteredLivestock(data)             
              }) // end of response
             .catch((error)=>console.log('\nfailed to update server \n',error))
                                  
             } else {
                            
            Alert.alert(
                // 'Alert Title',
                'Meat The Eid',
                // 'My Alert Msg',
                `No record for Headoffice synchronization`,
                [
                  {
                    // text: 'Ask me later',
                    text: 'Ok',
                    // onPress: () => this.exitHome()
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
         }
            
       
    }catch(err) {
        console.log('Synchronize: error getting Data from slaughteredLivestock: '+ err)
               }
}// end of slaughteredLivestock













/****************************************** example *************************************************
export default function select(database, table) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(database);
        const queries = [];
        db.each(`SELECT rowid as key, * FROM ${table}`, (err, row) => {
            if (err) {
                reject(err); // optional: you might choose to swallow errors.
            } else {
                queries.push(row); // accumulate the data
            }
        }, (err, n) => {
            if (err) {
                reject(err); // optional: again, you might choose to swallow this error.
            } else {
                resolve(queries); // resolve the promise
            }
        });
    });
}
 ************************************************************** end of example *********************/

////////////////////////////////////////


/*************************************** example 2 ***************************************
let  SQLite = require('react-native-sqlite-storage');
const  DB = SQLite.openDatabase({name:'test.db',createFromLocation:'~sqlitedb.db'});

class Database{
    db;
    constructor(db){
        this.db =db;
    }
    executeSql = (sql,params=[])=>new Promise((resolve , reject)=>{
        this.db.transaction((trans)=>{
            trans.executeSql(sql,params,(db,results)=>{

                resolve(results);
            },
            (error)=>{
                reject(error);
            });
        });
    });

}
export default  (new Database(DB));
*/
/******************************************************* use of Database()
 import Database from 'database';

 try
 {
   results = await DB.excuteSql("SQL",['params']);
 }
 catch(e)
 {

 }
******************************** end of example 2     ***********************************************/


function packageMaping(row){
    console.log('\n\n row from Synchronize.packageMaping row.PackageNumber:  ', row.PackageNumber)
    console.log('\n\n row from Synchronize.packageMaping row.PackageNumber:  ', row)
    return new Package({
        // rowNumber: row.RowNumber,
        packageNumber: row.PackageNumber,
        projectCode: row.ProjectCode,
        slaughterLivestockTag: row.SlaughterLivestockTag,
        GPSCoordinates: row.GPSCoordinates,
        slaughterDate: row.SlaughterDate,
        QRCodeGenrateTimestamp: row.QRCodeGenrateTimestamp,
        packageRefrigerationTimestamp: row.PackageRefrigerationTimestamp,
        packageConsumedTimestamp: row.PackageConsumedTimestamp,
        donorId: row.DonorID,
        packageConsumtionStatus: row.PackageConsumtionStatus,
        latitude: row.Latitude,
        longitude: row.Longitude,
        altitude: row.Altitude,
        slaughterLat: row.SlaughterLat,
        slaughterLng: row.SlaughterLng,
        slaughterAld: row.SlaughterAld,
        villageName: row['Village-Name'],
        houseHold: row.HouseHold,
        tagConsumptionTime: row.TagConsumptionTime,
    })
    
}// end of packageMaping