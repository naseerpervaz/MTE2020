
import React, { useState,useEffect  } from 'react';
import { FlatList, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useNavigation,useRoute } from '@react-navigation/native';
import * as CRUD from '../database/CRUD'


export const SelectCattleFeeder = () => { 
    const [selectedId, setSelectedId] = useState(false);
    const [feedlotList, setFeedlotList] = useState([]);
    const navigation = useNavigation();
    const route=useRoute()
   
useEffect(()=>{
        // console.log("useEffect called");
        getContractor()
        // return ()=>{
        //     console.log("useEffect unmounted clean up");
        // }
      },[])// end of useEffect

  const getContractor= async ()=>{
    
        const CONTRACTORS= await CRUD.readTable('Feedlots')
        let newFeedlotList= CONTRACTORS.map(({FeedlotName,id})=>({FeedlotName,id}))
        // console.log('\nforeach selectedContractor:\n',newFeedlotList)

        setFeedlotList(newFeedlotList);
        setSelectedId(true);
}

  const Item = ({ item, onPress, style }) => (
      <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
      <Text style={styles.title}>{item.FeedlotName}</Text>
    </TouchableOpacity>
  );

     

      const contractManagement = ({ item }) => {
        const backgroundColor =  "#f0f8ff" ;  
        //  console.log("\n trace from selectFeedlot.contractManagement",navigation,route)
        return (
            <Item
            item={item}
            //   onPress={() => console.log('item',item) }
        
        onPress={() => {/*console.log('item.FeedlotName',item.FeedlotName);*/ navigation.push("Feedlot Contract Management", { name: "Feedlots Contract Management ",contractor: item.FeedlotName,contractorId: item.id }) }}
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

  
// export const Hello = () => {
//     useEffect(() => {
//         console.log("render");
        
//         return () => {
//             console.log("unmount");
//         };
//     }, []);
//     return <Text></Text>
// }

/////////////////////////////// another option example ///////////////////////  
/*  
import {useFetch} from './loadFeedlots'

export const SelectCattleFeeder = (props) => {
    const [selectedId, setSelectedId] = useState(true); 
    const { data, loading } = useFetch("Feedlots");
    const Item = ({ item, onPress, style }) => (
        <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
        <Text style={styles.title}>{item.FeedlotName}</Text>
      </TouchableOpacity>
    );


     const contractManagement = ({ item }) => {
            const backgroundColor =  "#f0f8ff" ;  
            return (
                <Item
                item={item}
                //   onPress={() => console.log('item',item) }
                onPress={() => {console.log('item',item); navigation.push("Feedlot Contract Management", { name: "Feedlots Contract Management ",contractor: item.title }) }}
                style={{ backgroundColor }}
                />
            );
     }
          
return (
         <SafeAreaView style={styles.container}>
           
         
    //       <Hello/>
    //       {data && ( <FlatList
    //           data={data}
    //         //   renderItem={renderItem}
    //           renderItem={contractManagement}
    //           keyExtractor={(item) => item.id}
    //           extraData={selectedId}
    //         />
    //        ) } 
    //       </SafeAreaView>
    //     );
    //   };
   */
////////////////////////////////////////////////////////



// const DATA = [
//     {
//       id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
//       title: "First Item",
//     },
//     {
//       id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
//       title: "Second Item",
//     },
//     {
//       id: "58694a0f-3da1-471f-bd96-145571e29d72",
//       title: "Third Item",
//     },
//   ];
