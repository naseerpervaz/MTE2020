import {Alert} from "react-native"
export const ValidateTag=(text)=>{
    // Validate Livestock Tag Number
    
    let numreg1 = /HFL/;
   if (numreg1.test(text) && text.length <= 18) {
      
      return true
    } else {
      //test not ok
      Alert.alert('Invalid value in Tag Number. Format: HFL-YYYYMMDD-999',text)
      return false
      } 

}
export const ValidateLiveWeight=(text)=>{
    let numreg =new RegExp(/^[0-9.]+$/);
    if (numreg.test(text) && Number(text) > 22 && Number(text) <= 800 ){
      return true
    } else {
      Alert.alert('Invalid weight. Range: 22.01 to 800.00')
      return false
      } 
}