import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { themes, sizes } from '../constants/layout';

interface Agreement {
  address: string;
  subletterName: string;
}

interface AgreementsProps {
  landlordAgreements: Agreement[];
  textColor: string;
}

 const Agreements = ({ landlordAgreements, textColor }: AgreementsProps) => {
  return (
    <>
      <Text style={[styles.agreementTitle, { color:textColor }]}>Active Agreements</Text>
      {landlordAgreements.length === 0 ? (
        <Text style={[styles.noRequests,  { color: textColor }]}>No active agreements</Text>
      ) : (
        landlordAgreements.map((agreement, index) => (
          <View style={styles.activeAgreementContainer} key={index}>
            <View style={styles.activeAgreementInfo}>
              <Text style={[styles.address, { color: textColor }]}>{agreement.address}</Text>
              <Text style={styles.inputText}>Subletter Name: {agreement.subletterName}</Text>
              <Text style={styles.inputText}>Duration: 01/07/2023 – 01/07/2024</Text>
            </View>
          </View>
        ))
      )}
    </>
  );
};

const styles = StyleSheet.create({
    agreementTitle: {
        fontSize: sizes.font.medium,
        fontFamily: 'monserrat-bold',
        marginTop: sizes.layout.xxLarge,
      },
      activeAgreementContainer: {
        borderWidth: 1,
        borderColor: 'green',
        borderRadius: sizes.layout.small,
        marginTop: sizes.layout.medium,
        padding: sizes.layout.medium,
      },
      activeAgreementInfo: {
        marginBottom: sizes.layout.medium,
      },
      activeAgreementDetails: {
        marginBottom: sizes.layout.medium,
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
      address: {
        fontSize: sizes.font.small,
        fontFamily: 'monserrat-bold'
      },
});

export default Agreements;
