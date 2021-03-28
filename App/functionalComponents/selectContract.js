
import React, { useState,useEffect  } from 'react';

import { FlatList, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation,useRoute } from '@react-navigation/native';
import * as CRUD from '../database/CRUD'

export const SelectContract = () => { 
    const [selectedId, setSelectedId] = useState(false);
    const [feedlotList, setFeedlotList] = useState([]);
    const navigation = useNavigation();
    const route=useRoute()
    // console.log("useEfgggggggggggfect called");
    
useEffect(()=>{
       
        getContractor()
        // return ()=>{
        //     console.log("useEffect unmounted clean up");
        // }
      },[])// end of useEffect

  const getContractor= async ()=>{
    
        const CONTRACTORS= await CRUD.readTable('Contract')
        let newFeedlotList= CONTRACTORS.map(({ContractName,id})=>({ContractName,id}))
        // console.log('\nmap Contract:\n',newFeedlotList)

        setFeedlotList(newFeedlotList);
        setSelectedId(true);
}

  const Item = ({ item, onPress, style }) => (
      <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
      <Text style={styles.title}>{item.ContractName}</Text>
    </TouchableOpacity>
  );

     

      const contractManagement = ({ item }) => {
        const backgroundColor =  "#f0f8ff" ;  
        // console.log("\n trace from contractManagement navigation: \n",navigation)
        // console.log("\n trace from contractManagement: route:\n",route)
        // console.log("\n trace from contractManagement: {contractor}= route.params:\n",route.params.contractor)
        const  {contractor, contractorId}= route.params
        return (
            <Item
            item={item}
            //   onPress={() => console.log('item',item) }
            // onPress={() => {console.log('from selectContract item.FeedlotName',item.ContractName); navigation.goBack("Feedlot Contract Management", { name: "Feedlots Contract Management ",contractor: item.ContractName }) }}
            // onPress={() => {console.log('from selectContract item.ContractName',item.ContractName);  
            // console.log("\n trace from contractManagement navigation,route:\n",navigation,route)
            // navigation.setParams({contract: item.ContractName})
            // console.log("\n trace from bbbcontractManagement",navigation,route)
            onPress={() => {
                navigation.push("Feedlot Contract Management",{contract: item.ContractName,contractId: item.id,contractor:contractor, contractorId: contractorId,userId: 'nadeemabbas'})
            }}
          
            style={{ backgroundColor }}
            />
        );
      }
      
      return (
     <SafeAreaView style={styles.container}>
         {selectedId &&(  <FlatList
          data={feedlotList}
        //   renderItem={renderItem}
          renderItem={contractManagement}
          keyExtractor={(item) => item.id.toString()}
          extraData={selectedId}
        />
         )} 
      </SafeAreaView>
    );

}; // end of SelectCattleFeeder
 
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: StatusBar.currentHeight || 0,
    },
    item: {
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
    },
    title: {
      fontSize: 15,
    },
  });

