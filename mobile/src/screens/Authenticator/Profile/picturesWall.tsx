import {Button,withBadge, Icon, Avatar, Badge } from 'react-native-elements'
import React, { useContext, useEffect, useState, ReactElement } from 'react'
import {UPLOAD_FILE} from '../../../graphql/mutations/profile'
import { ProfileSettingsInput } from "./profileSettingInput"
import {View, ScrollView, StyleSheet } from 'react-native'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { _check_single } from '../../../utils/Upload'
import { useQuery, useMutation} from '@apollo/client'

const PictureWall = (props) => {
  return (
    <>
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.top}>
          <View style={styles.verticalImageplaceholder}>
            <View style={styles.horizontalImageplaceholder}>
              <SingleImagePlaceholder/>
              <SingleImagePlaceholder/>
              <SingleImagePlaceholder/>
            </View>
            <View style={styles.horizontalImageplaceholder}>
              <SingleImagePlaceholder/>
              <SingleImagePlaceholder/>
              <SingleImagePlaceholder/>
            </View>
          </View>
        </View>
       <View style={styles.middle}>
          <ProfileSettingsInput/>
        </View>
      </View>
    </ScrollView>
    </>
  );
}

const SingleImagePlaceholder = (props) => {
  const [Image, setImage] = React.useState(null)
  const [loading, setLoading] = React.useState(null)
  const [uploadFile] = useMutation(UPLOAD_FILE);
  useEffect(() => {
    if (Image) {
    }
    return () => {
      console.log("unmounted")
    }
  }, [Image])
  const _singleUpload = async (): Promise<void> => {
    console.log("what")
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
        name:"close-circle-outline",
            type:"material-community",
            size: 30}
    return (
      <>
            <Avatar
              size={130}
              icon={{name: 'camera-plus-outline', type: 'material-community'}}
              overlayContainerStyle={{
                backgroundColor: '#D3D3D3',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
              }}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 2,
    margin: 0,
  },
  top: {
    flex: 0.9,
    margin: 1,
    backgroundColor: 'white',
    borderWidth: 5,
  },
  middle: {
    flex: 1.1,
    backgroundColor: 'white',
    borderWidth: 5,
  },
  horizontalImageplaceholder: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  verticalImageplaceholder: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
});

export  { PictureWall }
