import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TextButton  from '../TextButton';
import { themes, sizes } from '../../constants/layout';

interface Request {
  address: string;
  subletterName: string;
  message: string;
  references: string[];
  requestID: string;
  landlordID: string;
  subletterID: string,
  status: string;
}

interface RequestsProps {
  requests: Request[];
  textColor: string;
}

const SubletterRequests = ({
  requests,
  textColor,
}: RequestsProps) => {
    const [expandedIndex, setExpandedIndex] = useState(-1);

    //Function to handle dropdown toggle for requests
    const toggleExpanded = (index: number) => {
        if (expandedIndex === index) {
        setExpandedIndex(-1);
        } else {
        setExpandedIndex(index);
        }
    };
  return (
    <>
    <Text style={[styles.title, {color:textColor}]}>Requests</Text> 
      {requests.length === 0 ? (
        <Text style={[styles.noRequests, { color: textColor }]}>No requests</Text>
      ) : (
        requests.map((request, index) => (
          <View style={styles.requestContainer} key={index}>
            <TouchableOpacity onPress={() => toggleExpanded(index)}>
              <View style={styles.infoContainer}>
                <Text style={[styles.address,  { color: textColor }]}>{request.address}</Text>
                <Text style={[styles.inputText,  { color: textColor }]}>Landlord ID: {request.landlordID}</Text>
                <Text style={[styles.inputText,  { color: textColor }]}>Message: {request.message}</Text>
              </View>
              <View style={styles.toggleButton}>
                <Ionicons
                  name={expandedIndex === index ? 'chevron-up' : 'chevron-down'}
                  size={24}
                  color="gray"
                />
              </View>
            </TouchableOpacity>
            {expandedIndex === index && (
              <>
                <View style={styles.expandedInfo}>
                  <Text style={[styles.inputText, { color: textColor }]}>References Attachment:</Text>
                  {request.references.map((reference, index) => (
                    <TextButton key={index} onPress={() => Linking.openURL(reference)} buttonText={reference} color={themes.colors.darkBlue} />
                  ))}
                </View>
              </>
            )}
          </View>
        ))
      )}
    </>
  );
};

const styles = StyleSheet.create({
    title: {
        fontSize: sizes.font.medium,
        fontFamily: 'monserrat-bold'
      },
    requestContainer: {
      borderWidth: 1,
      borderColor: '#E4E4E4',
      borderRadius: sizes.layout.small,
      marginTop: sizes.layout.medium,
      padding: sizes.layout.medium,
    },
    infoContainer: {
      marginBottom: sizes.layout.medium,
    },
    address: {
      fontSize: sizes.font.small,
      fontFamily: 'monserrat-bold'
    },
    toggleButton: {
      alignSelf: 'flex-end',
      paddingTop: sizes.layout.xSmall,
    },
    expandedInfo: {
      marginBottom: sizes.layout.medium,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignSelf: 'center',
      gap:sizes.layout.small
    },

    inputText:{
      fontSize: sizes.font.small,
      color: themes.placeholder
    },
    noRequests: {
      fontSize: sizes.font.small,
      marginTop:sizes.layout.small,
      marginStart:sizes.layout.small,
    },
  });

  export default SubletterRequests;
  
