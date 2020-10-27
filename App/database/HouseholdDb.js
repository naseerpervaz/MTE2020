import * as SQLite from 'expo-sqlite';

const axios = require('axios');

 import {BackEndApi} from "../config/constants";
// import { Props } from 'react-native-image-pan-zoom/built/image-zoom/image-zoom.type';
   
const db = SQLite.openDatabase('PRICELocal.db'); 

// 'create table if not exists LivestockPicture (id integer primary key not null, LivestockTag text, pictureHeight integer, pictureWidth integer, pictureDate text, picture blob,SynchronizeStatus text,Latitude text, Longitude text, Altitude text,Household integer,ProjectCode text,DonorId integer,Remarks text,PackageNumber integer, TransactionTimestamp text,VillageName text);

const INSERT_HOUSEHOLD_PICTURE_SQL = 'INSERT INTO mTEHousehold ( LivestockTag, PictureDate, PictureHeight, PictureWidth, Picture, Latitude, Longitude, Altitude, Household,ProjectCode,DonorId,Remarks,PackageNumber,TransactionTimestamp,VillageName, SynchronizeStatus) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) '

module.exports.InsertHouseholdPicture = async function InsertHouseholdPicture(mTEHouse){
    // console.log('\n\n from householdDb.InsertHouseholdPicture: data: \n\n',mTEHouse)
    
     db.transaction(
        tx => { 
          tx.executeSql(INSERT_HOUSEHOLD_PICTURE_SQL, [mTEHouse.LivestockTag, mTEHouse.PictureDate,mTEHouse.PictureHeight,mTEHouse.PictureWdith,mTEHouse.Picture,mTEHouse.Latitude,mTEHouse.Longitude,mTEHouse.Altitude,mTEHouse.Household,mTEHouse.ProjectCode,mTEHouse.DonorId,mTEHouse.Remarks,mTEHouse.PackageNumber,mTEHouse.TransactionTimestamp,mTEHouse.VillageName,mTEHouse.SynchronizeStatus],
          (tx, results) => { console.log ('\n from householdDb.InsertHouseholdPicture insert picture: results:\n ',results)},
          (t,error)=> {console.log('Db3 error: ',error); })}
              );
    try {
            const fd = new FormData();
            fd.append('LivestockTag',mTEHouse.LivestockTag);
            fd.append('pictureDate', mTEHouse.PictureDate);
            fd.append('pictureHeight', mTEHouse.PictureHeight);
            fd.append('pictureWdith', mTEHouse.PictureWidth);
            //  fd.append('name','price');
            fd.append('fileData',{uri: mTEHouse.Picture,
                    type: 'image/jpeg', 
                    name: 'myImage.jpg'
                        });
            fd.append('Latitude', mTEHouse.Latitude);
            fd.append('Longitude', mTEHouse.Longitude,);
            fd.append('Altitude', mTEHouse.Altitude,);
            fd.append('Household', mTEHouse.Household,);
            fd.append('ProjectCode', mTEHouse.ProjectCode,);
            fd.append('DonorId', mTEHouse.DonorId,);
            fd.append('Remarks', mTEHouse.Remarks,);
            fd.append('PackageNumber', mTEHouse.PackageNumber,);
            fd.append('VillageName', mTEHouse.VillageName,);
            fd.append('TransactionTimestamp', mTEHouse.TransactionTimestamp);
           
                // axios({
                //         url:'http://970ef359b6eb.ngrok.io/mTEhouseholdPicture',
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
                const backendUrl= BackEndApi+'/mTEhouseholdPicture'
                axios.post(backendUrl,fd,options)
        .then((response) => { // Success
            // console.log('\n Response from server for mTEhouseholdPicture : ')
            // console.log(response.data, response.status)
            // Synchronize if back-end update is success
            
            if (response.status == 200 ){
                db.transaction(tx => { 
                tx.executeSql(`UPDATE mTEHousehold set SynchronizeStatus = ? where LivestockTag ='${mTEHouse.LivestockTag}' AND PackageNumber = ${mTEHouse.PackageNumber}`, ["Synchronized"], (tx, results) => { console.log ('results after Synchronization mTEHousehold update: ', results) },(t,error)=> {console.log('Db4 error: ',error);   this.exitHome()})})
            
            }
            // throw all records on console log for testing
                        //   db.transaction(tx => { 
                        //     tx.executeSql('select * from mTEHousehold', [], (tx, results) => { 
                        //       if (results.rows.length > 0){
                        //         console.log ('All rows from mTEHousehold table: ', results.rows)
                        //       } else {
                        //         alert('No record found in the table mTEHousehold');
                        //       }},(t,error)=> {console.log('Db3 error: ',error);})})
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
          
    }catch(err) { console.log('Synchronize.LivestockPicture: error getting Data from LivestockPicture table: '+ err)   }   
}// end of InsertHouseholdPicture