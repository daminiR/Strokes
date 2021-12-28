import React from 'react'
import { ProfileSettingsInput, Pictures} from "@components"
import {View, ScrollView } from 'react-native'
import { _check_single } from '@utils'
import {styles} from '@styles'

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
