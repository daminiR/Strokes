import {Button,withBadge, Icon, Avatar, Badge } from 'react-native-elements'
import React, { useRef, useContext, useEffect, useState, ReactElement } from 'react'
import {UserContext} from '../../../UserContext'
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

const Pictures =({getImages = null}) => {
  const didMountRef = useRef(false)
  const [image, setImage] = useState(null)
  const [images, setImages] = useState([])
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
        <View style={styles.imagecontainer}>
          <View style={styles.verticalImageplaceholder}>
            <View style={styles.horizontalImageplaceholder}>
              <SingleImage img_idx={0} getSingleImage={getSingleImage}/>
              <SingleImage img_idx={1} getSingleImage={getSingleImage}/>
              <SingleImage img_idx={2} getSingleImage={getSingleImage}/>
            </View>
            <View style={styles.horizontalImageplaceholder}>
              <SingleImage img_idx={3} getSingleImage={getSingleImage}/>
              <SingleImage img_idx={4} getSingleImage={getSingleImage}/>
              <SingleImage img_idx={5} getSingleImage={getSingleImage}/>
            </View>
          </View>
        </View>
    </>
  );
}
export {Pictures}
