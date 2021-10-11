import {Button, Image, withBadge, Icon, Avatar, Badge } from 'react-native-elements'
import { ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useState, ReactElement } from 'react'
import CardStack, { Card } from 'react-native-card-stack-swiper';
import {UserContext} from '../../../UserContext'
import {ProfileContext} from './index'
import {UPLOAD_FILE, DELETE_IMAGE} from '../../../graphql/mutations/profile'
import {READ_SQUASH} from '../../../graphql/queries/profile'
import { ProfileSettingsInput } from "./profileSettingInput"
import { CardItem } from '../../../components/CardItem/CardItem';
import {ImageBackground,View, ScrollView, StyleSheet } from 'react-native'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import styles from '../../../assets/styles';
import { generateRNFile } from '../../../utils/Upload'
import { _check_single } from '../../../utils/Upload'
import { useQuery, useMutation, useLazyQuery} from '@apollo/client'
import Demo from '../../../assets/data/demo.js';

const ProfileView = (props) => {
  const [loading, setLoading] = React.useState(true)
  const [newImageSet, setNewImageSet] = React.useState([])
  const [profileTitle, setProfileTitle] = React.useState('')
  const {currentUser, userData, userLoading} = useContext(UserContext);
  const [userProfile, setUserProfile] = React.useState(null)
  const [profileImageValue, setProfileImageValue] = React.useState()
  useEffect(() => {
    setLoading(true)
    if (!userLoading){
    // TODO: not important sort image by order
      const user = userData.squash
      setUserProfile(user);
      const profileImage = user.image_set.find(imgObj => imgObj.img_idx == 0)
      setProfileImageValue(profileImage)
      const image_set_copy = user.image_set.filter(imgObj => imgObj.img_idx != 0)
      setNewImageSet(image_set_copy)
      const title = user.first_name +', ' + user.age
      setProfileTitle(title)
      setLoading(false);
    }
  }, [userLoading])
  return (
    <>
        {!loading && (
          <ImageBackground
            source={require('../../../assets/images/bg.png')}
            style={styles.bg}>
            <View style={styles.containerHome}>
                <Card>
                  <CardItem
                    profileImage={profileImageValue}
                    image_set={newImageSet}
                    description={userProfile.description}
                    profileTitle={profileTitle}
                    sportsList={userProfile.sports}
                    onPressLeft={() => this.swiper.swipeLeft()}
                    onPressRight={() => this.swiper.swipeRight()}
                  />
                </Card>
            </View>
          </ImageBackground>
        )}
    </>
  );
}
const ProfileStyles = StyleSheet.create({
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
  profileViewImageDisplay: {
    flex:1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  verticalImageplaceholder: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
});

export  { ProfileView }
