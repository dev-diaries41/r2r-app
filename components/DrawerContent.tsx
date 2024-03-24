// import React from 'react';
// import { View, StyleSheet, Image, Text } from 'react-native';
// import {
//     Drawer,
// } from 'react-native-paper';
// import {
//     DrawerContentScrollView,
//     DrawerItem,
// } from '@react-navigation/drawer';

// import { Ionicons as Icon } from '@expo/vector-icons';
// import { themes, sizes} from '../constants/layout';
// import { useSettingsContext } from '../context/settingsContext';

const DrawerContent = (props: any) => {
    // const {theme} = useSettingsContext();
    // const isDark = theme === 'dark'
    // return(
    //     <View style={{flex:1, backgroundColor:isDark? themes.dark.card:themes.light.card}}>
    //         <DrawerContentScrollView {...props}>
    //             <View style={[styles.drawerContent]}>
    //                 <View style={styles.userInfoSection}>
    //                     <View style={{flexDirection:'row',marginTop: 15, alignItems:'center'}}>
    //                     <Image
    //                         source={require('../assets/UserProfile.png')}
    //                         style={{width:50,
    //                         height:50,
    //                         borderRadius:25}}
    //                         tintColor={themes.dark.primary}
    //                     />
    //                         <View style={{marginLeft:15, flexDirection:'column'}}>
    //                             <Text style={[styles.title, {color:isDark? themes.dark.text:themes.light.text}]}>John Doe</Text>
    //                             <Text style={[styles.caption, {color:isDark? themes.dark.text:themes.light.text}]}>@j_doe</Text>
    //                         </View>
    //                     </View>
    //                     <View style={styles.row}>
    //                         {/* Optional additional info */}
    //                         {/* <View style={styles.section}>
    //                             <Paragraph style={[styles.paragraph, styles.caption]}>8</Paragraph>
    //                             <Caption style={styles.caption}>Extra info</Caption>
    //                         </View> */}
    //                     </View>
    //                 </View>

    //                 <Drawer.Section title="Leads Hub">
    //                 <DrawerItem 
    //                         icon={({color, size}) => (
    //                             <Icon 
    //                             name="home-outline" 
    //                             color={isDark? themes.dark.icon:themes.light.icon}
    //                             size={size}
    //                             />
    //                         )}
    //                         label="Home"
    //                         labelStyle={{fontFamily:'monserrat-bold', color:isDark? themes.dark.text:themes.light.text}}
    //                         onPress={() => {props.navigation.navigate('Home')}}
    //                     />
                        
    //                     <DrawerItem 
    //                         icon={({color, size}) => (
    //                             <Icon 
    //                             name='briefcase-outline' 
    //                             color={isDark? themes.dark.icon:themes.light.icon}
    //                             size={size}
    //                             />
    //                         )}
    //                         label='Leads'
    //                         labelStyle={{fontFamily:'monserrat-bold', color:isDark? themes.dark.text:themes.light.text}}
    //                         onPress={() => {props.navigation.navigate('Leads')}}
    //                     />
    //                     {/* <DrawerItem 
    //                         icon={({color, size}) => (
    //                             <Icon 
    //                             name="bar-chart-outline" 
    //                             color={color}
    //                             size={size}
    //                             />
    //                         )}
    //                         label="Summary Reports"
    //                         labelStyle={{fontFamily:'monserrat-bold'}}
    //                         onPress={() => {props.navigation.navigate('Summary Reports')}}
    //                     /> */}
    //                 </Drawer.Section>

                    

    //                 <Drawer.Section title="Preferences">
    //                 <DrawerItem 
    //                         icon={({color, size}) => (
    //                             <Icon 
    //                             name="settings-outline" 
    //                             color={isDark? themes.dark.icon:themes.light.icon}
    //                             size={size}
    //                             />
    //                         )}
    //                         label="Settings"
    //                         labelStyle={{fontFamily:'monserrat-bold', color:isDark? themes.dark.text:themes.light.text}}
    //                         onPress={() => {props.navigation.navigate('Settings Screen')}}
    //                     />
                        
                       
    //                 </Drawer.Section>
    //             </View>
    //         </DrawerContentScrollView>
    //         {/* Optional sign out button at the bottom */}
    //        <Drawer.Section style={styles.bottomDrawerSection}>
    //             <DrawerItem 
    //                 icon={({color, size}) => (
    //                     <Icon 
    //                     name="exit-outline" 
    //                     color={isDark? themes.dark.icon:themes.light.icon}
    //                     size={size}
    //                     />
    //                 )}
    //                 label="Sign Out"
    //                 labelStyle={{fontFamily:'monserrat-bold', color:isDark? themes.dark.text:themes.light.text}}
    //                 onPress={() => props.navigation.navigate('Sign Out')}
    //             />
    //         </Drawer.Section>
                   
    //     </View>
    // );
}

// const styles = StyleSheet.create({
//     drawerContent: {
//       flex: 1,
//     },
//     userInfoSection: {
//       paddingLeft: sizes.layout.medium,
//     },
//     title: {
//       fontSize: sizes.font.large,
//       marginVertical: sizes.layout.small,
//       fontFamily:'monserrat-bold',    
//       color: themes.dark.text
//     },
//     caption: {
//         fontSize: sizes.font.medium,
//         lineHeight: sizes.font.medium,
//         color: themes.dark.text,
//         fontFamily:'monserrat-semibold',    
//     },
//     row: {
//       marginTop: 20,
//       flexDirection: 'row',
//       alignItems: 'center',
//     },
//     section: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       marginRight: sizes.layout.medium,
//     },
//     paragraph: {
//       fontWeight: 'bold',
//       marginRight: sizes.layout.xSmall,
//     },
//     drawerSection: {
//       marginTop: sizes.layout.medium,
//     },
//     bottomDrawerSection: {
//         marginBottom: sizes.layout.medium,
//         borderTopColor: themes.dark.primary,
//         // borderTopWidth: 1
//     },
//     preference: {
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//       paddingVertical: sizes.layout.medium,
//       paddingHorizontal: sizes.layout.medium,
      
//     },
//   });

  export default DrawerContent;