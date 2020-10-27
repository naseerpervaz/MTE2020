
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
// import { BarCodeScanner } from 'expo';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Permissions from 'expo-permissions';

//import { DisplayScannedTag } from './DisplayScannedTag';
export  class ScanTheTag extends React.Component {
    static navigationOptions = {
        header: null
    };
    constructor (props) {
        super(props)
     this.state = {
        hasCameraPermission: null,
        scanned: false,
        scannedItem: {
            type: null,
            data: null
        },
        barcodeType: '',
        barcodeData: '',
        updateTagData: false
       
      }
    }

  async componentDidMount() {
        //  console.log('\n from FreezPackage: props: \n',this.props)
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
    }

  render() {
    const { hasCameraPermission } = this.state;

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }
    return (
      <View style={{ flex: 1 }}>
        <BarCodeScanner
          onBarCodeScanned={this.handleBarCodeScanned}
        //   onBarCodeScanned={this.scannedItem ? undefined : this.handleBarCodeScanned}
          style={StyleSheet.absoluteFill}
        />
                 
      </View>
    );
  }
  handleBarCodeScanned = async ({ type, data }) => {
  const {callingModule}= this.props.route.params
//   console.log('\n from FreezPackage.handleBarCodeScanned: calling<odule: ',callingModule);
    if (this.state.scannedItem.data) {
       // alert(`Bar code has been scanned!`);
        this.props.navigation.pop()
     //  console.log('scanned data from scanTag: ',this.state.scannedItem.data);
     if(callingModule==='Inventory'){
            this.props.navigation.push("ProcessFreezTag", {data: JSON.parse(data), type: type})
        }else{
            this.props.navigation.push("DistributeMeatPackages", {data: JSON.parse(data), type: type})
             }
    } else {
    this.setState({ scannedItem: {type, data }, scanned: true })
            }   
    //console.log ('scanned item  ',this.state.scannedItem.data);
    //console.log(`Bangali Bar code with type ${type} and data ${data} has been scanned!`);
}
}
//   handleBarCodeScanned = async ({ type, data }) => {
//     let barcodeType = type;
//     let barcodeData = data;
//     // this.setState({
//     //   barcodeType: barcodeType,
//     //   barcodeData: barcodeData,
//     // });
//       this.setState({ scannedItem: {type: barcodeType},scannedItem: {data: barcodeData}})
      
//       if ((type === this.state.scannedItem.type && data === this.state.scannedItem.data) || data === null) {
//           console.log('returing...')
//           return
//           //    alert(`Bar code has been scanned!`);
//           // this.props.navigation.pop()
//           //   console.log('scanned data from scanTag: ',this.state.scannedItem.data);
//           // this.props.navigation.navigate('DisplayScannedTagRT',{data:this.state.scannedItem.data})
//           // this.setState({ scanned: true })
//           // this.props.navigation.push("ProcessFreezTag", {data:this.state.scannedItem.data})
//         } else {
//             // this.setState({  scanned: true })
//             console.log('Bar code has been scanned! this.state.barcodeData: ',this.state.scannedItem)
//             if (this.state.scannedItem.data != null ) {
//                 // console.log(`Bangali Bar code with type ${type} and data ${data} has been scanned!`);
//             return(this.props.navigation.push("ProcessFreezTag", {data: data, type: type}))
//             }
//             }   
//     // console.log ('scanned item  ',this.state.scannedItem.data);
// }
// onBarCodeScanned =()=>{
//    return( console.log('\n BarCodeScanner.BarCodeScannerResult', BarCodeScanner.BarCodeScannerResult)
// //    this.props.navigation.push("ProcessFreezTag", {data:this.state.scannedItem.data})
//    )
// }
// }
