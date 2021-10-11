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

const Pictures =({getImages = null, }) => {
  const didMountRef = useRef(false)
  const [image, setImage] = useState(null)
  const [images, setImages] = useState([])
  const [loadPictures, setLoadPictures] = useState(true)
  const [displayImages, setDisplayImages] = useState(null)
  const {currentUser, userData, userLoading} = useContext(UserContext)
  useEffect(() => {
    setLoadPictures(true)
    if (!userLoading) {
      setDisplayImages(userData.squash.image_set)
      console.log("displaying image", displayImages)
    setLoadPictures(false)
    }
  }, [userLoading]);
  const getSingleImage = (imgObj) => {
    setImage(imgObj)
  }
  useEffect(() => {
    if (didMountRef.current){
    console.log(image)
    images.push(image)
    setImages(images)
    if (getImages) {
      getImages(images)
    }
    console.log(images)
    }
    else {
      didMountRef.current = true
    }

  }, [image])
  return (
    <>
      {!loadPictures && !userLoading &&
        <View style={styles.imagecontainer}>
          <View style={styles.verticalImageplaceholder}>
            <View style={styles.horizontalImageplaceholder}>
              <SingleImage img_idx={0} getSingleImage={getSingleImage} image_uri={displayImages.find(imageObj => imageObj.img_idx == 0)?.imageURL}/>
              <SingleImage img_idx={1} getSingleImage={getSingleImage} image_uri={displayImages.find(imageObj =>imageObj.img_idx == 1)?.imageURL}/>
              <SingleImage img_idx={2} getSingleImage={getSingleImage} image_uri={displayImages.find(imageObj =>imageObj.img_idx == 2)?.imageURL}/>
            </View>
            <View style={styles.horizontalImageplaceholder}>
              <SingleImage img_idx={3} getSingleImage={getSingleImage} image_uri={displayImages.find(imageObj =>imageObj.img_idx == 3)?.imageURL}/>
              <SingleImage img_idx={4} getSingleImage={getSingleImage} image_uri={displayImages.find(imageObj =>imageObj.img_idx == 4)?.imageURL}/>
              <SingleImage img_idx={5} getSingleImage={getSingleImage} image_uri={displayImages.find(imageObj =>imageObj.img_idx == 5)?.imageURL}/>
            </View>
          </View>
        </View>}
    </>
  );
}
export {Pictures}
