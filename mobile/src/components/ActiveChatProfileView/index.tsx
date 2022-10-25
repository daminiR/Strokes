import React, { useState, useEffect } from 'react'
import {View, StyleSheet} from 'react-native'
import _ from 'lodash'
import {styles} from '@styles'
import { CardItem } from '@components';
import { Card } from 'react-native-card-stack-swiper';

const ActiveChatProfileView= ({route}) => {
  const [loading, setLoading] = React.useState(true)
  const [newImageSet, setNewImageSet] = React.useState([])
  const [profileTitle, setProfileTitle] = React.useState('')
  const [userProfile, setUserProfile] = React.useState(null)
  const [profileImageValue, setProfileImageValue] = React.useState(null)
  const {profileViewData} = route.params
  useEffect(() => {
    setLoading(true);
    // TODO: not important sort image by order
    const user = profileViewData;
    console.log('profile view', profileViewData);
    setUserProfile(user);
    const profileImage = user.image_set.find((imgObj) => imgObj.img_idx == 0);
    setProfileImageValue(profileImage);
    const image_set_copy = user.image_set.filter(
      (imgObj) => imgObj.img_idx != 0,
    );
    setNewImageSet(image_set_copy);
    const title = user.first_name + ', ' + user.age;
    setProfileTitle(title);
    setLoading(false);
  }, [])
  return (
    <>
      {!loading && (
        <View style={styles.containerHome}>
          <Card>
            <CardItem
              isProfileView={true}
              profileImage={profileImageValue}
              image_set={newImageSet}
              description={userProfile.description}
              location={userProfile.location.city}
              profileTitle={profileTitle}
              sportsList={userProfile.sports}
              onPressLeft={() => this.swiper.swipeLeft()}
              onPressRight={() => this.swiper.swipeRight()}
            />
          </Card>
        </View>
      )}
    </>
  );
}
export {ActiveChatProfileView}
