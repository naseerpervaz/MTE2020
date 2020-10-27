
 import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  DrawerItem,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
const Synchronize = require('../App/database/Synchronize')
import {
  useTheme,
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple,
  Switch,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export function DrawerContent(props) {
  synchronizeWithHeadOffice= async ()=>{
    // Synchronize.getAllMeatPackage()
//   let resultMeatPackages= await Synchronize.getAllMeatPackages()
//    let resultSyncMeatPackages= await Synchronize.getNullSynchronizeMeatPackages()
   let resultSyncMeatPackages= await Synchronize.meatPackages()
   let resultSynLivestockPicture= await Synchronize.LivestockPicture()
   let resultSSynHouseholdPicture= await Synchronize.HouseholdPicture()
  let resultSyncLivestoc = await Synchronize.slaughteredLivestock()
  let resultSyncPLivestoc = await Synchronize.ProcureLivestock()
    
}
  return (
    <DrawerContentScrollView {...props}>
      <View
        style={
          styles.drawerContent
        }
      >
        <View style={styles.topLinks}>
          <Avatar.Image
            source={require('../assets/PRICEtoponly.png')}
            size={80}
          />
          {/* <Title style={styles.title}>Dawid Urbaniak</Title> */}
          <Caption style={styles.name}>Poverty Reduction Initiatives and Capacity Enhancement</Caption>
          {/* <Caption style={styles.caption}>Poverty Reduction Initiatives and Capacity Enhancement</Caption> */}
          {/* <View style={styles.row}>
            <View style={styles.section}>
              <Paragraph style={[styles.paragraph, styles.caption]}>
                202
              </Paragraph>
              <Caption style={styles.caption}>Following</Caption>
            </View>
            <View style={styles.section}>
              <Paragraph style={[styles.paragraph, styles.caption]}>
                159
              </Paragraph>
              <Caption style={styles.caption}>Followers</Caption>
            </View>
          </View> */}
        </View>
        <Drawer.Section style={styles.drawerSection}>
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons
                name="cloud-sync"
                color={color}
                size={size}
              />
            )}
            label="Synchronize data with Head Office"
            onPress={() => {synchronizeWithHeadOffice()}}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons
                name="account-outline"
                color={color}
                size={size}
              />
            )}
            label="Profile"
            onPress={() => {}}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons name="tune" color={color} size={size} />
            )}
            label="Preferences"
            onPress={() => {}}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons
                name="bookmark-outline"
                color={color}
                size={size}
              />
            )}
            label="Bookmarks"
            onPress={() => {}}
          />
        </Drawer.Section>
        <Drawer.Section title="Preferences">
          <TouchableRipple onPress={() => {}}>
            <View style={styles.preference}>
              <Text>Dark Theme</Text>
              <View pointerEvents="none">
                <Switch value={false} />
              </View>
            </View>
          </TouchableRipple>
          <TouchableRipple onPress={() => {}}>
            <View style={styles.preference}>
              <Text>RTL</Text>
              <View pointerEvents="none">
                <Switch value={false} />
              </View>
            </View>
          </TouchableRipple>
        </Drawer.Section>
      </View>
    </DrawerContentScrollView>
  );
} // end of DrawerContent

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,backgroundColor: 'lightgray',
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    marginTop: 20,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  topLinks:{height:160,backgroundColor:'black', },
  name:{fontSize:12,paddingBottom:5,color:'white',textAlign:'left',},
    footer: {height:50,flexDirection:'row',alignItems:'center',backgroundColor:'white',borderTopWidth:1,borderTopColor:'lightgray',},
    version:{textAlign:'right',marginRight:18,color:'gray',fontSize:10,},
    description:{flex:1,marginLeft:18,fontSize:12,},

});

