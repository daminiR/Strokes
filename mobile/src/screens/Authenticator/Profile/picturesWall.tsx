import {Button,withBadge, Icon, Avatar, Badge } from 'react-native-elements'
import React, { useContext, useEffect, useState, ReactElement } from 'react'
import {UserContext} from '../../../UserContext'
import {ProfileContext} from './index'
import { ProfileSettingsInput } from "./profileSettingInput"
import { Pictures } from '../../../components/';
import {View, ScrollView, StyleSheet } from 'react-native'
import {launchImageLibrary} from 'react-native-image-picker';
import { _check_single } from '../../../utils/Upload'
import { ProfileFields, SignIn} from '../../../localModels/UserSportsList'
import { useFormikContext} from 'formik';

const PictureWall = (props) => {
  console.log(props)
  const {values: formikValues, submitForm, handleChange, handleSubmit } = useFormikContext<ProfileFields>();
  const [loading, setLoading] = React.useState(null)
  const [values, setValues] = React.useState(null)
  const {currentUser, userData, userLoading} = useContext(UserContext);
  const getImages = (images) =>{
        setValues({... values, 'images': images})
    }
  useEffect(() => {
    if (!userLoading) {

    }
  }, [userLoading]);

  return (
    <>
      <ScrollView>
        <View style={styles.container}>
          <Pictures getImages={getImages}/>
          <View style={styles.middle}>
            <ProfileSettingsInput/>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
const SingleImagePlaceholder = ({img_idx}) => {
  const [Image, setImage] = React.useState(null)
  const [loading, setLoading] = React.useState(null)
  const {currentUser} = useContext(UserContext);
  const {squashData, loadingSportsData} = useContext(ProfileContext);
  const [displayImage, setDisplayImage] = React.useState(null)
  useEffect(() => {
      console.log(Image)
    if (Image){
      setDisplayImage(Image.assets[0].uri)
      if (getSingleImage){
        getSingleImage({image: Image.assets[0].uri, img_idx: img_idx});
      }

    }
  }, [Image])
  useEffect(() => {
    if (squashData?.squash?.image_set != undefined || squashData?.squash?.image_set.find(image_info => image_info.img_idx === img_idx) != undefined){
      const imageURL = squashData?.squash?.image_set.find(image_info => image_info.img_idx === img_idx)?.imageURL
      setDisplayImage(imageURL)
    }
  }, [loadingSportsData])

  const _removeImage = async (): Promise<void> => {
      setLoading(true)
       setDisplayImage(null)
      setLoading(false)
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
