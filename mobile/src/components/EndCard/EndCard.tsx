import React from 'react';
import {styles} from '@styles'
import {ScrollView, Text, View} from 'react-native';


const EndCard = () => {
  return (
    <>
      <ScrollView>
        <View style={styles.containerCardItem}>
          {/* IMAGE */}
          <Text style={styles.firstImageText}>sdfaslfdasl</Text>
          <Text style={styles.nameStyle}>asldfasldfla</Text>
        </View>
      </ScrollView>
    </>
  );
};

export {EndCard};
