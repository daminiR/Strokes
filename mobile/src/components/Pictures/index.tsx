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
  const [image, setImage] = useState(null)
  const [images, setImages] = useState([])
  const [loadPictures, setLoadPictures] = useState(false)
  const [displayImages, setDisplayImages] = useState(null)
  const {values: formikValues, submitForm, handleChange, handleSubmit } = useFormikContext<ProfileFields | EditFields>();
  return (
    <>
      {!loadPictures && (
        <View style={styles.imagecontainer}>
          <View style={styles.verticalImageplaceholder}>
            <View style={styles.horizontalImageplaceholder}>
              <SingleImage img_idx={0} />
              <SingleImage img_idx={1} />
              <SingleImage img_idx={2} />
            </View>
            <View style={styles.horizontalImageplaceholder}>
              <SingleImage img_idx={3} />
              <SingleImage img_idx={4} />
              <SingleImage img_idx={5} />
            </View>
          </View>
        </View>
      )}
    </>
  );
}
export {Pictures}
