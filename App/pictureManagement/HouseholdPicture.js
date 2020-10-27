import React from 'react';
import { Image, View, Text, StyleSheet,TouchableHighlight, Alert, ActivityIndicator } from 'react-native';
// import Geolocation from '@react-native-community/geolocation';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
const householdDb=require('../database/HouseholdDb')
// capture Picture
export  class MTEhouseholdPicture extends React.Component {
    constructor(props) {
      super(props);
      this.state = { 
      hasCameraPermission: null,
      type: Camera.Constants.Type.back,
      capturingPhoto: true,
      image: null,
      pictureDate: null,
      pictureHeight: null,
      pictureWdith: null,
      ready: false,
      where: {lat:null, lng:null, Ald: null},
      initialPosition: 'unknown',
    lastPosition: 'unknown',
      error: null,
        }}
    
    async componentDidMount() {
        // console.log('\n from pictureServices.mTEhouseholdPicture: props: ',this.props)
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      this.setState({ hasCameraPermission: status === 'granted' });
  // Get GEO coordinates
//   Geolocation.getCurrentPosition(info => console.log(info));
                //   Geolocation.getCurrentPosition(
                //     position => {
                //       const initialPosition = JSON.stringify(position);
                //       this.setState({initialPosition});
                //     },
                //     error => Alert.alert('Error', JSON.stringify(error)),
                //     {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
                //   );
                    //   let geoOptions = {
                    //     enableHighAccuracy: true,
                    //     timeOut: 20000,
                    //     maximumAge: 60 * 60 * 24
                    //                    };
                    // this.setState({ready:false, error: null, LivestockTag: this.props.navigation.getParam('LivestockTag') });
                    // navigator.geolocation.getCurrentPosition( this.geoSuccess, this.geoFailure, geoOptions);
      }// end of componentDidMount
    //   geoSuccess = (position) => {
    //      this.setState({
    //         ready:false,
    //         where: {lat: position.coords.latitude,lng:position.coords.longitude, Ald:position.coords.altitude }
    //     })
    // }
    //   geoFailure = (err) => {
    //     this.setState({error: err.message});
    // }

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
      exitHome =()=> { this.props.navigation.popToTop()}
      addToDb =async (props) =>{
        //   console.log('\n props from AddToDb',props)
        // let tagData={...props.navigation.state.params}
        
       const {updateTagData: tagData}=this.props.data.params
        const mTEHouse= { 
            LivestockTag: tagData.slaughterLivestockTag,
            PictureDate:this.state.pictureDate,
            PictureHeight: this.state.pictureHeight,
            PictureWidth: this.state.pictureWdith,
            Picture: this.state.image,
            Latitude: tagData.latitude,
            Longitude: tagData.longitude,
            Altitude: tagData.altitude,
            Household: tagData.houseHold,
            ProjectCode:tagData.projectCode,
            DonorId:0,
            Remarks: "no remarks",
            PackageNumber:tagData.packageNumber,
            TransactionTimestamp: new Date().toLocaleString(),
            VillageName: tagData.villageName,
            SynchronizeStatus: null
    }
       
        this.setState({ready: true})
        let resultUpload=householdDb.InsertHouseholdPicture(mTEHouse)
        this.exitHome() 
      }
      render() {
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
                                  <Text style={styles.buttonText}>Take picture of the recipient وصول ڪندڙ جي تصوير وٺو</Text>
                        </TouchableHighlight>
                     }
    
                     {image && !ready &&
                         <TouchableHighlight style={styles.buttonStyles2} onPress= {() => {this.addToDb(this.props)}}>
                             <Text style={styles.buttonText}>Save Picture  تصوير محفوظ ڪريو</Text>
                         </TouchableHighlight>
                     }
                  </View>
                </View>
                
    
            </View>
          );
        }
      }
      
    
    }
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
      