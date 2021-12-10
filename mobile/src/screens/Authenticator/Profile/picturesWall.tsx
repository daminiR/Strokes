import React from 'react'
import { ProfileSettingsInput } from "./profileSettingInput"
import { Pictures } from '../../../components/';
import {View, ScrollView } from 'react-native'
import { _check_single } from '../../../utils/Upload'
import styles from '../../../assets/styles'

const PictureWall = () => {
  return (
    <>
      <ScrollView>
        <View style={styles.picturesContainer}>
          <Pictures/>
          <View style={styles.profileSettings}>
            <ProfileSettingsInput/>
          </View>
        </View>
      </ScrollView>
    </>
  );
}


export  { PictureWall }
