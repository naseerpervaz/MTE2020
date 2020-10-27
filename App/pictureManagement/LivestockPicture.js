import React from 'react';
import { Image, View, Text, StyleSheet,TouchableHighlight, Alert, ActivityIndicator } from 'react-native';
// import { Camera, Permissions,FileSystem } from 'expo';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import * as SQLite from 'expo-sqlite';
import {BackEndApi} from "../config/constants";
                
const axios = require('axios');
// NPQ to weite code to delete/drop following db May 19,2019 table name:SlaughteredLivestock
//const db = SQLite.openDatabase('SlaughterLivestock.db');
const db = SQLite.openDatabase('PRICELocal.db');
  
// capture Picture
export class LivestockPic extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    capturingPhoto: true,
    image: null,
    pictureDate: null,
    LivestockTag: null,
    pictureHeight: null,
    pictureWdith: null,
    ready: false,
    where: {lat:null, lng:null, Ald: null},
    error: null,
      }}
  
  async componentDidMount() {
    //   console.log('LivestockPic componentDidMount')
    //   console.log('LivestockPic componentDidMount.this.props:\n', this.props)
    //   console.log('LivestockPic componentDidMount.this.props.LivestockTag:\n', this.props.LivestockTag)
      
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
// Get GEO coordinates
    let geoOptions = {
      enableHighAccuracy: true,
      timeOut: 20000,
      maximumAge: 60 * 60 * 24
                     };
//   this.setState({ready:false, error: null, LivestockTag: this.props.navigation.getParam('LivestockTag') });
  this.setState({ready:false, error: null, LivestockTag: this.props.LivestockTag });
  navigator.geolocation.getCurrentPosition( this.geoSuccess, this.geoFailure, geoOptions);

    db.transaction(tx => {
      tx.executeSql(
        'create table if not exists LivestockPicture (id integer primary key not null, LivestockTag text, pictureHeight integer, pictureWidth integer, pictureDate text, picture blob,SynchronizeStatus text,Latitude text, Longitude text, Altitude text);'
      );
    });
  }// end of componentDidMount
  
  geoSuccess = (position) => {
    /*
    console.log('postion object returned by geolocation navigator: ', position)
    console.log('latitude in DD decimal degress: ',position.coords.latitude);
    console.log('Longitude: ',position.coords.longitude);
    console.log('Altitude: ',position.coords.altitude);
    *************/

    this.setState({
        ready:false,
        where: {lat: position.coords.latitude,lng:position.coords.longitude, Ald:position.coords.altitude }
    })
}
  geoFailure = (err) => {
    this.setState({error: err.message});
}

  
  takePhoto = async () => {
    if (this.camera) {
      this.setState({ capturingPhoto: true });
      try {
        const photo = await this.camera.takePictureAsync();
          this.setState({ image: photo.uri, pictureHeight: photo.height, pictureWdith: photo.width,pictureDate: new Date().toLocaleDateString()});
        } catch (error) {console.log('Picture error: ',error)
      } finally {
        this.setState({ capturingPhoto: false });
      }
    }
  };

  testOnPress = () => {
    alert('you pressed on press')
    console.log('yellow')
  }

  Dir = () => {
   console.log('FileSystem.documentDirectory: ', FileSystem.documentDirectory)
   console.log('FileSystem.cacheDirectory: ', FileSystem.cacheDirectory)
   console.log('FileSystem.readDirectoryAsync(fileUri): ', FileSystem.readDirectoryAsync(this.state.image))
  }
  exitHome =()=> { this.props.navigation.popToTop() }

  addToDb =async () =>{
   
//    console.log('\n from addToDb',this.state.LivestockTag, this.state.pictureHeight,this.state.pictureWdith,this.state.pictureDate,this.state.image)

     
  this.setState({ready: true})
    db.transaction(
      tx => { 
        tx.executeSql('insert into LivestockPicture (LivestockTag, pictureHeight, pictureWidth, pictureDate, picture,SynchronizeStatus, Latitude, Longitude, Altitude ) values (?, ?, ?, ?, ?,?,?,?,?)', [this.state.LivestockTag, this.state.pictureHeight,this.state.pictureWdith,this.state.pictureDate,this.state.image,null,this.state.where.lat, this.state.where.lng, this.state.where.Ald],
        (tx, results) => { console.log ('\n from addToDb insert picture: results:\n ',results)},
        (t,error)=> {console.log('Db3 error: ',error); this.exitHome()})}
            );
        //  console.log('\n from addToDb insert picture: result:\n ',result)
    // update backend
   const fd = new FormData();
    fd.append('LivestockTag',this.state.LivestockTag);
   fd.append('pictureDate', this.state.pictureDate);
   fd.append('pictureHeight', this.state.pictureHeight);
   fd.append('pictureWdith', this.state.pictureWdith);
  //  fd.append('name','price');
   fd.append('fileData',{uri: this.state.image,
     type: 'image/jpeg', 
   name: 'myImage.jpg'
   });
   fd.append('Lat', this.state.where.lat);
   fd.append('Lng', this.state.where.lng,);
   fd.append('Ald', this.state.where.Ald,);
   fd.append('TransactionTimestamp', new Date().toLocaleString());
//    console.log('FormData: ', fd)
  // console.log('Array.form: ', Array.from(fd));
  //  for (let obj of fd ){
  //    console.log(obj)
  //  }
    const updatePicture = {
     LivestockTag:   this.state.LivestockTag,
     timestamp: this.state.pictureDate,
      pictureHeight: this.state.pictureHeight, 
      pictureWdith: this.state.pictureWdith,
      picture: this.state.image,
      Lat: this.state.where.lat,
     Lng: this.state.where.lng,
     Ald: this.state.where.Ald,
     TransactionTimestamp: new Date().toLocaleString(),
    }
    
  //  axios.post('https://5e5297dc.ngrok.io/livestockPicture', updatePicture)
   //axios.post('https://1a656934.ngrok.io/uploadpic', updatePicture)
  //  axios.post('https://1a656934.ngrok.io/uploadpic', fd)
      // axios({
      //   url:'http://984c7b281d8c.ngrok.io/upload',
      //   method: 'POST',
      //   data: fd,
      //   headers: {
      //     Accept: 'application/json',
      //     'Content-Type': 'multipart/form-data'
      //   }
      // })
  
    //   console.log('before call server for Livestock Picture update: ')
        // update backend
                // import {BackEndApi} from "../config/constants";
                const options ={headers: { Accept: 'application/json', 'Content-Type': 'multipart/form-data' }}
                const backendUrl= BackEndApi+'/upload'
                axios.post(backendUrl,fd,options)
    .then((response) => { // Success
    //   console.log('success response from server for Livestock Picture update: ')
    //   console.log(response.data, response.status)
      // Synchronize if back-end update is success
     
      if (response.status == 200 ){
        db.transaction(tx => { 
        tx.executeSql(`UPDATE LivestockPicture set SynchronizeStatus = ? where LivestockTag ='${updatePicture.LivestockTag}'`, ["Synchronized"], (tx, results) => { console.log ('results after LivestockPicture Synchronization update: ', results) },(t,error)=> {console.log('Db4 error: ',error);   this.exitHome()})})
       
        // throw all records on console log for testing
        // db.transaction(tx => { 
        //   tx.executeSql('select * from LivestockPicture', [], (tx, results) => { 
        //      if (results.rows.length > 0){
        //        console.log ('All rows from SlaughteredLivestockDetails table: ', results.rows)
        //      } else {
        //          alert('No record found in the table SlaughteredLivestockDetails');
        //      }},(t,error)=> {console.log('Db6 error: ',error);})})
      }

     // Alert.alert(`Livestock Picture status has been updated for livestock tag ${updatePicture.LivestockTag}`)
      console.log("Successfully updated Livestock Picture status")
      this.setState({ready: false})
   
    // console.log('\n from LivestockPic.addDb:   this.props.navigation: \n ',  this.props.navigation)
    // this.props.navigation.popToTop()
     // this.exitHome()
     
    }) // end of response
     
    .catch((error) => { // Error
      if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
        //  alert('back end server error 1. Check console log for details. '+error.response.data+ 'Status: '+error.response.status)
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
    }); // end of catch error
    Alert.alert(`Livestock data has been updated for livestock tag ${updatePicture.LivestockTag}`)
    this.exitHome()    
    }; //end of addToDb

    // render(){
    //   return (
    //     <View>
    //       <View style={{ flexDirection: 'column', height: 100, padding: 20,}}>
    //       <View style={{backgroundColor: 'blue', flex: 0.3}} />
    //       <View style={{backgroundColor: 'red', flex: 0.5}} />
    //       <Text>Please wait</Text>
    //       </View>
    //         <View style={[styles.container2, styles.horizontal]}>
    //           <ActivityIndicator size="large" color="#0000ff" />
    //        </View>
    //     </View>
    //   )
    // }

  
  render() {
    //   console.log('\n from LivestockPicture: props: \n',this.props)
    //   console.log('\n from LivestockPicture: props: \n',this.props.LivestockTag)
    //   console.log('\n from LivestockPicture: this.props.navigation.getParam(LivestockTag): \n',this.props.navigation.getParam('LivestockTag'))
    let { image, capturingPhoto, ready } = this.state;
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          { capturingPhoto && <Camera style={{ flex: 1 }} type={this.state.type}
              ref={(cam) => {this.camera = cam;}}>
            </Camera>
           }
            <View>
            {image &&   <Image source={{ uri: image }} style={{ width: 300, height: 300 }}/>}
            </View> 

            {ready &&  
                <View>
                  <View style={{ flexDirection: 'column', height: 100, padding: 20,}}> 
                  <View style={{backgroundColor: 'blue', flex: 0.3}} />
                  <View style={{backgroundColor: 'red', flex: 0.5}} />
                  <Text>Please wait</Text>
                  </View>
                    <View style={[styles.container2, styles.horizontal]}>
                      <ActivityIndicator size="large" color="#0000ff" />
                  </View>
                </View>
            }



            <View>
                <View style ={styles.buttonRow}>
                
                 {capturingPhoto &&
                      <TouchableHighlight style={styles.buttonStyles2} onPress= {() => {this.takePhoto()}}>
                              <Text style={styles.buttonText}>Take Picture</Text>
                    </TouchableHighlight>
                 }

                 {image && !ready &&
                     <TouchableHighlight style={styles.buttonStyles2} onPress= {() => {this.addToDb()}}>
                         <Text style={styles.buttonText}>Save Picture</Text>
                     </TouchableHighlight>
                 }
              </View>
            </View>
            

        </View>
      );
    }
  }
  

}


  

// {/* // {/* <TouchableHighlight style={styles.buttonStyles2} onPress={()=>this.props.navigation.navigate('SlaughterLivestockRT')}>
// <Text style={styles.buttonText}>Back</Text>
// </TouchableHighlight>
// <TouchableHighlight style={styles.buttonStyles2} onPress={()=>{this.Dir()}}>
// <Text style={styles.buttonText}>Dir</Text>
// </TouchableHighlight>      
// <TouchableHighlight style={styles.buttonStyles2} onPress={()=>this.props.navigation.navigate('HomeRT')}>
// <Text style={styles.buttonText}>Home</Text>
// </TouchableHighlight> */}

/*********************
 *  <TouchableOpacity
                    style={{flex: 0.1, alignSelf: 'flex-end', alignItems: 'center',}}
                    onPress={() => {this.takePhoto()}}>
                    <Text 
                      style={{ fontSize: 30,  marginLeft:10, paddingBottom: 5, alignItems: 'center', color: '#e7203e', marginBottom: 40 }}>
                      Take Picture
                    </Text>
              </TouchableOpacity>  
 */


/************** Camera selection fron or back
          <Camera style={{ flex: 1 }} type={this.state.type}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={{
                  flex: 0.1,
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                }}
                onPress={() => {
                  this.setState({
                    type: this.state.type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back,
                  });
                }}>
                <Text
                  style={{ fontSize: 10,  marginLeft:10,
                    paddingBottom: 5,
                    alignItems: 'center', color: '#e7203e',
                    marginBottom: 40 }}>
                  Flip
                </Text>
              </TouchableOpacity>
            </View>
          </Camera>
 */


/*
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
       <Button title = "Add livestock Picture from Camera roll" onPress={()=> this._pickImage()}/>
       {image &&
          <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      </View>

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      base64:true
    });
   
  // console.log('Result from picture selectection: ',result);
    if (!result.cancelled) {
      
        try{
           
            // convert image to image type base 64
          //  let messageImg= 'data:image/png;base64, '+result.base64;
          //  console.log('messageImg: ', messageImg)
            // set state with base64 urp
            this.setState({ messageImg: 'data:image/png;base64, '+result.base64, image: result.uri, pictureHeight: result.height, pictureWdith: result.width});
            this.setState({LivestockTag: 'HFL123'})
            //add into SQLite
            this.add()
          //  this.setState({ captured: true });
            
        }
        catch(err){
            console.log(err);
        }
    }
    
  };
  add() {
   
    
    db.transaction(
      tx => { 
        tx.executeSql('insert into SlaughterMTE (LivestockTag, pictureHeight, pictureWidth, pictureBase64, picture ) values (?, ?, ?, ?, ?)', [this.state.LivestockTag, this.state.pictureHeight,this.state.pictureWdith,this.state.messageImg,this.state.image])
        tx.executeSql('select * from SlaughterMTE', [], (_, { rows }) =>
         // console.log('Read from file: ',JSON.stringify(rows))
          console.log('Read from file: ',rows)
        );
      },
      null,
     // this.update
    );
    
   //console.log(`tag: ${this.state.LivestockTag}, height: ${this.state.pictureHeight}, width: ${this.state.pictureWdith}, image: ${this.state.image}`)
   }

 
} */
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
     // width: '33%',
     // height: '60%',
      width: '80%',
      height: '70%',
      marginLeft: 25,
      justifyContent: 'center',
      alignItems: 'center'
  },
  buttonText:{
      color: '#ffffff',
      fontSize: 15
  },
  container2: {
    flex: 1,
    justifyContent: 'center'
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  }
});
