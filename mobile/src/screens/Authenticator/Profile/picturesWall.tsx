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
import { useQuery, useMutation, useLazyQuery} from '@apollo/client'

const PictureWall = (props) => {
  console.log(props)
  const [loading, setLoading] = React.useState(null)
  const {currentUser} = useContext(UserContext);
  const {squashData, newSportList} = useContext(ProfileContext);
  return (
    <>
        <View style={styles.container}>
          <View style={styles.top}>
            <View style={styles.verticalImageplaceholder}>
              <View style={styles.horizontalImageplaceholder}>
                <SingleImagePlaceholder img_idx={0} />
                <SingleImagePlaceholder img_idx={1} />
                <SingleImagePlaceholder img_idx={2} />
              </View>
              <View style={styles.horizontalImageplaceholder}>
                <SingleImagePlaceholder img_idx={3} />
                <SingleImagePlaceholder img_idx={4} />
                <SingleImagePlaceholder img_idx={5} />
              </View>
            </View>
          </View>
          <View style={styles.middle}>
            <ProfileSettingsInput />
          </View>
        </View>
    </>
  );
}
const SingleImagePlaceholder = ({img_idx}) => {
  const [Image, setImage] = React.useState(null)
  const [loading, setLoading] = React.useState(null)
  const {currentUser} = useContext(UserContext);
  const {squashData} = useContext(ProfileContext);
  const [displayImage, setDisplayImage] = React.useState(null)
  const [uploadFile, {data: imageURL}] = useMutation(UPLOAD_FILE, {
      onCompleted: (data) => _displayImage(data)
  });
  const _displayImage = async (data): Promise<void> => {
      setDisplayImage(data.uploadFile.imageURL)
  }
  const [deleteImage, {data: image_set}] = useMutation(DELETE_IMAGE);
  useEffect(() => {
    if (squashData?.squash?.image_set != undefined || squashData?.squash?.image_set.find(image_info => image_info.img_idx === img_idx) != undefined){
      const imageURL =squashData?.squash?.image_set.find(image_info => image_info.img_idx === img_idx)?.imageURL
      setDisplayImage(imageURL)
    }
  }, [squashData?.squash?.image_set])
  useEffect(() => {
    if (Image) {
    if (currentUser){
     const RNFile = generateRNFile(Image.assets[0].uri, currentUser.uid)
     uploadFile({variables: {file: RNFile, img_idx: img_idx, _id: currentUser.uid}})
     setLoading(false)
      }
    }
    return () => {
      console.log("unmounted")
    }
  }, [Image])

  const _removeImage = async (): Promise<void> => {
      setLoading(true)
    if (currentUser){
       deleteImage({variables: {img_idx: img_idx, _id:currentUser.uid}})
       //TODO: change to icon image
       setDisplayImage(null)
      }
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
        name:"close-circle-outline",
            type:"material-community",
            size: 30}
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
          source={{uri: displayImage}}
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
