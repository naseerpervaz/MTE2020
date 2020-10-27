import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image,Dimensions,ScrollView } from 'react-native';
const WIDTH= Dimensions.get('window').width
const HEIGHT= Dimensions.get('window').height

export const MenuDrawer = ({ navigation }) => (
    <ScreenContainer>
       return(
        <View style={styles.container}>
           <View style={styles.topLinks}>
                <View style={styles.profile}>
                    <View style={styles.imageView}>
                        <Image style={styles.img} source={require('../assets/PRICE.jpg')}/>
                    </View>
                </View>
                <View style={styles.profileText} >
                        <Text style={styles.name}>Poverty Reduction Initiatives and Capacity Enhancement</Text>
                </View>
            </View>
           
            <View style={styles.footer} >
                    <Text style={styles.description}>DoctorDesk {'\u00A9'}</Text>
                    <Text style={styles.version} >  Copyright v1.0 2019</Text>
            </View>
        </View>
        </ScreenContainer>
    )

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: 'lightgray'},
    scroller:{flex:1,},
    link: { flex:1,fontSize:20,padding:6,paddingLeft:14,margin:5,textAlign:'left',marginTop:20,  },
    topLinks:{height:160,backgroundColor:'black', },
    bottomLinks:{flex:1,backgroundColor:'white',paddingTop:10,paddingBottom:450},
    profile:{flex:1,flexDirection:'row',alignItems:'center',paddingTop:25,borderBottomWidth:1,borderBottomColor:'#777777',},
    imageView:{flex:1,paddingLeft:20,paddingRight:20,},img:{height:70,width:70,borderRadius:50,},
    profileText:{flex:3,flexDirection:'column',justifyContent:'space-around',marginLeft:20,textAlign:'center'},
    name:{fontSize:12,paddingBottom:5,color:'white',textAlign:'left',},
    footer: {height:50,flexDirection:'row',alignItems:'center',backgroundColor:'white',borderTopWidth:1,borderTopColor:'lightgray',},
    version:{textAlign:'right',marginRight:18,color:'gray',fontSize:10,},
    description:{flex:1,marginLeft:18,fontSize:12,},
})