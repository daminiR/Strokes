import {Button,withBadge, Icon, Avatar, Badge } from 'react-native-elements'
import React, { useContext, useEffect, useState, ReactElement } from 'react'
import {UserContext} from '../../../UserContext'
import {ProfileContext} from './index'
import {UPLOAD_FILE, DELETE_IMAGE} from '../../../graphql/mutations/profile'
import {READ_SQUASH} from '../../../graphql/queries/profile'
import { ProfileSettingsInput } from "./profileSettingInput"
import {View, ScrollView, StyleSheet } from 'react-native'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { generateRNFile } from '../../../utils/Upload'
import { _check_single } from '../../../utils/Upload'
import styles from '../../../assets/styles/'
import { useQuery, useMutation, useLazyQuery} from '@apollo/client'

const SingleImageInitiator = ({img_idx}) => {
  const [Image, setImage] = React.useState(null)
  const [loading, setLoading] = React.useState(null)
  const [displayImage, setDisplayImage] = React.useState(null)
  useEffect(() => {
      console.log("dads")
      console.log(Image)
    if (Image){
      setDisplayImage(Image.assets[0].uri)
    }
  }, [Image])
  const _removeImage = async (): Promise<void> => {
      setLoading(true)
      setDisplayImage(null)
      setLoading(false)
      console.log("remove")
  }
  const _singleUpload = async (): Promise<void> => {
    setLoading(true)
    const options = {
      mediaType: 'photo',
    };
    launchImageLibrary(
      {
        mediaType: 'photo',
      },
      setImage,
    )
  };
    const cancelProps = {
      onPress: _removeImage,
      name: 'close-circle-outline',
      type: 'material-community',
      size: 30,
    };
    return (
      <>
        <Avatar
          size={130}
          renderPlaceholderContent={
            <Icon
              reverse
              name="ios-american-football"
              type="ionicon"
              color="#517fa4"
            />
          }
          //{name: 'camera-plus-outline', type: 'material-community'}
          source={displayImage? {uri: displayImage}: require("../../../assets/camera-enhance.svg")}
          //source={{uri: displayImage}}
          overlayContainerStyle={styles.imageIndividualContainer}
          onPress={() => _singleUpload()}
          activeOpacity={0.7}
          containerStyle={{
            padding: 0,
            marginLeft: 0,
            marginTop: 0,
          }}>
          <Avatar.Accessory {...cancelProps} />
        </Avatar>
      </>
    );
}
export const Pictures =(props) => {
  return (
    <>
      <ScrollView>
        <View style={styles.imagecontainer}>
          <View style={styles.verticalImageplaceholder}>
            <View style={styles.horizontalImageplaceholder}>
              <SingleImageInitiator img_idx={0} />
              <SingleImageInitiator img_idx={1} />
              <SingleImageInitiator img_idx={2} />
            </View>
            <View style={styles.horizontalImageplaceholder}>
              <SingleImageInitiator img_idx={3} />
              <SingleImageInitiator img_idx={4} />
              <SingleImageInitiator img_idx={5} />
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

