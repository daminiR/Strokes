import React from 'react';
import styles from '../../assets/styles';
import {ProfileContext} from '../../screens/Authenticator/Profile/index'
import { useRef, useEffect, useContext, useState, ReactElement } from 'react'
import {ImageBackground, ScrollView, Text, View, Image, Dimensions, TouchableOpacity} from 'react-native';
import {Card, FAB } from 'react-native-elements'
import {Icon} from '../Icon/Icon';
import {SportChips, SportChipsstyles} from '../../screens/Authenticator/Profile/profileSettingInput'


const CardItem = ({
  profileImage,
  image_set,
  profileTitle,
  sportsList,
  description,
  variant=null,
  onPressLeft= null,
  onPressRight=null,

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
          <ImageBackground source={{uri:profileImage.imageURL}} style={imageStyle}>
          <View
            style={{
              position: 'absolute',
              marginBottom: 10,
              marginLeft:10,
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: 'flex-end',
              alignItems: 'flex-start',
            }}>
            <Text style={styles.firstImageText}>{profileTitle}</Text>
          </View>
          </ImageBackground>
          {/* NAME */}
          <Text style={nameStyle}>{profileTitle}</Text>
          {/* SPORTS List */}
          <View style={{marginVertical: 10}}>
            <View style={SportChipsstyles.sportChipSet}>
              {sportsList.map((sport, i) => (
                  <SportChips key={i} sport={sport.sport} isDisplay={true} />
                ))}
            </View>
          </View>
          {image_set && image_set.map((imgObj, index) => (
            <Image key={index} source={{uri: imgObj.imageURL}} style={imageStyle}/>)
          )}
          {/* DESCRIPTION */}
          {description && (
            <Text style={styles.descriptionCardItem}>{description}</Text>
          )}
        </View>
      </ScrollView>
    </>
  );
};

export {CardItem};
