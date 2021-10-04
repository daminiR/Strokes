import React from 'react';
import styles from '../../assets/styles';
import {ProfileContext} from '../../screens/Authenticator/Profile/index'
import { useRef, useEffect, useContext, useState, ReactElement } from 'react'
import {ImageBackground, ScrollView, Text, View, Image, Dimensions, TouchableOpacity} from 'react-native';
import {Card, FAB } from 'react-native-elements'
import {Icon} from '../Icon/Icon';
import {SportChips, SportChipsstyles} from '../../screens/Authenticator/Profile/profileSettingInput'


const EndCard = ({
  variant=null,
}) => {
  const fullWidth = Dimensions.get('window').width;
  const imageStyle = [
    {
      borderRadius: 8,
      width: variant ? fullWidth / 2 - 30 : fullWidth - 80,
      height: variant ? 170 : 350,
      margin: variant ? 0 : 20
    }
  ];

  const nameStyle = [
    {
      paddingTop: variant ? 10 : 15,
      paddingBottom: variant ? 5 : 7,
      color: '#363636',
      fontSize: variant ? 15 : 30
    }
  ];
  return (
    <>
      <ScrollView>
        <View style={styles.containerCardItem}>
          {/* IMAGE */}
          <Text style={styles.firstImageText}>sdfaslfdasl</Text>
          <Text style={nameStyle}>asldfasldfla</Text>
        </View>
      </ScrollView>
    </>
  );
};

export {EndCard};
