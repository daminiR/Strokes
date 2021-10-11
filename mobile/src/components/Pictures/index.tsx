import {Button,withBadge, Icon, Avatar, Badge } from 'react-native-elements'
import React, { useRef, useContext, useEffect, useState, ReactElement } from 'react'
import {UserContext} from '../../UserContext'
import {ProfileContext} from './index'
import {UPLOAD_FILE, DELETE_IMAGE} from '../../../graphql/mutations/profile'
import {READ_SQUASH} from '../../../graphql/queries/profile'
import { ProfileSettingsInput } from "./profileSettingInput"
import {View, ScrollView, StyleSheet } from 'react-native'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { generateRNFile } from '../../../utils/Upload'
import { _check_single } from '../../../utils/Upload'
import styles from '../../assets/styles/'
import { useQuery, useMutation, useLazyQuery} from '@apollo/client'
import { SingleImage} from '../../components'
import { ProfileFields, EditFields, SignIn} from '../../../localModels/UserSportsList'
import { useFormikContext} from 'formik';

const Pictures =() => {
  const didMountRef = useRef(false)
  const [image, setImage] = useState(null)
  const [images, setImages] = useState([])
  const [loadPictures, setLoadPictures] = useState(true)
  const [displayImages, setDisplayImages] = useState(null)
  const {values: formikValues, submitForm, handleChange, handleSubmit } = useFormikContext<ProfileFields | EditFields>();
  useEffect(() => {
    setLoadPictures(true)
    console.log("displaying formik",formikValues)
    setDisplayImages(formikValues.image_set);
    console.log("displaying image", displayImages)
    setLoadPictures(false)
  }, [formikValues]);
  const getSingleImage = (imgObj) => {
    setImage(imgObj)
  }
  useEffect(() => {
    if (didMountRef.current){
    images.push(image)
    setImages(images)
    }
    else {
      didMountRef.current = true
    }

  }, [image])

  return (
    <>
      {!loadPictures &&
        <View style={styles.imagecontainer}>
          <View style={styles.verticalImageplaceholder}>
            <View style={styles.horizontalImageplaceholder}>
              <SingleImage img_idx={0} image_uri={displayImages? displayImages.find(imageObj => imageObj.img_idx == 0)?.imageURL: null}/>
              <SingleImage img_idx={1} image_uri={displayImages? displayImages.find(imageObj =>imageObj.img_idx == 1)?.imageURL: null}/>
              <SingleImage img_idx={2} image_uri={displayImages? displayImages.find(imageObj =>imageObj.img_idx == 2)?.imageURL: null}/>
            </View>
            <View style={styles.horizontalImageplaceholder}>
              <SingleImage img_idx={3} image_uri={displayImages?displayImages.find(imageObj =>imageObj.img_idx == 3)?.imageURL: null}/>
              <SingleImage img_idx={4} image_uri={displayImages?displayImages.find(imageObj =>imageObj.img_idx == 4)?.imageURL: null}/>
              <SingleImage img_idx={5} image_uri={displayImages?displayImages.find(imageObj =>imageObj.img_idx == 5)?.imageURL: null}/>
            </View>
          </View>
        </View>}
    </>
  );
}
export {Pictures}
