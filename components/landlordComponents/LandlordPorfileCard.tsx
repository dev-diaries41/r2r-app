import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { themes, sizes } from '../../constants/layout'

interface LandlordProfileProps {
    currentUser: any;
    landlordRequests: any;
    landlordAgreements: any;
    user: any;
}

 const LandlordPorfileCard = ({currentUser, landlordRequests, landlordAgreements, user}: LandlordProfileProps) => {
    const UserProfile = require('../../assets/UserProfile.png');
    return (
    <View style={styles.profileContainer}>
        {currentUser?.photoURL ? (
        // Render the current user's photo if UserProfile is available
        <Image source={{ uri: currentUser?.photoURL }} style={styles.profileImage} />
        ) : (
        // Render the UserProfile image if UserProfile is not available
        <Image source={UserProfile} style={[styles.profileImage, {tintColor:themes.placeholder}]} />
        )}                        
        <View style={styles.profileInfoContainer}>
            <Text style={styles.profileName}>{user.firstName} {user.lastName}</Text>
            <Text style={styles.profileText}>Listed Properties: {user.listings? user.listings.length :0}</Text>
            <Text style={styles.profileText}>Active Agreements: {landlordAgreements?.length}</Text>
            <Text style={styles.profileText}>Requests: {landlordRequests?.length}</Text>
        </View>
    </View>
  )
}


const styles = StyleSheet.create({
      profileContainer: {
        padding:  sizes.layout.small,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: sizes.layout.medium,
        borderRadius:  sizes.layout.medium,
      },
      profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginRight: 32,
      },
      profileInfoContainer: {
        flex: 1,
      },
      profileName: {
        fontSize: sizes.font.small,
        fontFamily: 'monserrat-bold',
        marginBottom:  sizes.layout.xSmall,
      },
      profileText:{
        fontSize: sizes.font.small,
        fontFamily: 'monserrat-regular',
      }
   
})

export default LandlordPorfileCard;