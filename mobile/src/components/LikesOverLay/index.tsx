import {styles} from '@styles'
import React, { useRef, useEffect,useContext, useState } from 'react'
import { View} from 'react-native';
import {Overlay, Card, FAB} from 'react-native-elements'
import { useLazyQuery, useMutation} from '@apollo/client'
import {UserContext} from '@UserContext'
import {  Done, Cancel, CardItem} from '@components'
import _ from 'lodash'
import {createProfileImage, swipeRightLiked, swipeLeftDisliked} from '@utils'
import {likeIconStyle, dislikeIconStyle } from '@constants'
import {_retriveGameLevel, _retriveAgeRangeFilter, _retriveSportFilter} from '@localStore'
import { READ_SQUASH, UPDATE_MATCHES, UPDATE_DISLIKES, UPDATE_LIKES} from '@graphQL2'

  //// TODO : this needs to update every time user changes list of activities
const LikesOverLay = ({like, setLike, likeProfile = null}) => {
  const [loading, setLoading] = React.useState(true)
  const [newImageSet, setNewImageSet] = React.useState([])
  const [profileTitle, setProfileTitle] = React.useState('')
  const [userProfile, setUserProfile] = React.useState(null)
  const [profileImageValue, setProfileImageValue] = React.useState(null)
  const {currentUser, data, userData, setData, userLoading} = useContext(UserContext)
  const [matched, setMatched] = useState(false)
  const [updateLikes] = useMutation(UPDATE_LIKES, {
    onCompleted: () => {
      /// enable disabled like/ dislike after complete
    },
  });
  const [updateDislikes] = useMutation(UPDATE_DISLIKES, {
    onCompleted: () => {
      getSquashProfile({variables: {id: currentUser.uid}});
    },
  });
  const [ getSquashProfile] = useLazyQuery(READ_SQUASH, {
    variables: {id: currentUser.uid},
    //fetchPolicy:"cache-and-network",
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      //TODO: if data doesnt exists input is incorrect => add checks
      if (data) {
        setData(data)
      }
    }
  })
  const [updateMatches] = useMutation(UPDATE_MATCHES, {
    //refetchQueries: [{query: READ_SQUASH, variables: {id: currentUser.uid}}],
    //awaitRefetchQueries: true,
    onCompleted: () => {
      getSquashProfile({variables: {id: currentUser.uid}});
    },
  })
  useEffect(() => {
    setLoading(true);
    // TODO: not important sort image by order
    if (likeProfile) {
      const user = likeProfile;
      const profileImage = createProfileImage(user.image_set);
      setUserProfile(user);
      setProfileImageValue(profileImage);
      const newImageSet = _.filter(
        likeProfile.image_set,
        (imageObj) => imageObj.img_idx != profileImage.img_idx,
      );
      setNewImageSet(newImageSet);
      const title = user.first_name + ', ' + user.age;
      console.log("like", title)
      setProfileTitle(title);
      setLoading(false);
    }
  }, [likeProfile])
  const _onCancel = () => {
    setLike(false);
  };
  const _onDone = () => {
    setLike(false);
  };
  const match = (matchVal) => {
    setMatched(matchVal)
  }
  const renderFilter = () => {
    return (
      // TODO:set the sports car filters, age, and game level thats all for now
      <Overlay isVisible={like}>
        <View>
          <View style={styles.containerHome}>
            <Card>
              <CardItem
                isProfileView={true}
                profileImage={profileImageValue}
                image_set={newImageSet}
                description={likeProfile.description}
                location={likeProfile.location.city}
                profileTitle={profileTitle}
                sportsList={likeProfile.sportsList}
                onPressLeft={() => this.swiper.swipeLeft()}
                onPressRight={() => this.swiper.swipeRight()}
              />
            </Card>
          </View>
          <View style={styles.top}>
            <FAB
              icon={likeIconStyle}
              color="transparent"
              //disabled={
              //lastMatch || disableLikes || disableDisLikes || disableMatches
              //}
              onPress={() => {
                setLike(false);
                swipeRightLiked(
                  userData.squash,
                  currentUser.uid,
                  likeProfile,
                  updateLikes,
                  updateMatches,
                  match,
                  true
                );

                //setDisableLikes(true);
                //this.swiper.swipeRight();
              }}
              buttonStyle={styles.likeDislikeFAB}
              containerStyle={{width: 60, height: 60}}
            />
            <Cancel _onPressCancel={_onCancel} />
            <FAB
              icon={dislikeIconStyle}
              style={{margin: 0, padding: 0}}
              color="transparent"
              //disabled={
              //lastMatch || disableDisLikes || disableLikes || disableMatches
              //}
              onPress={() => {
                swipeLeftDisliked(
                  currentUser.uid,
                  likeProfile,
                  updateDislikes,
                  true
                );
                setLike(false);
                //setDisableDislikes(true);
                //this.swiper.swipeLeft();
              }}
              buttonStyle={styles.likeDislikeFAB}
              containerStyle={{width: 60, height: 60}}
            />
          </View>
        </View>
      </Overlay>
    );
  };
  return likeProfile && renderFilter();
};

export {LikesOverLay}
