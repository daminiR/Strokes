import React, {useEffect} from 'react'
import { CardItem } from '@components';
import { Card } from 'react-native-card-stack-swiper';
import {View} from 'react-native'
import { styles } from '@styles';
import { _check_single } from '@utils'
import { useFormikContext} from 'formik';
import { EditFields} from '@localModels'

const ProfileView = () => {
  const [loading, setLoading] = React.useState(true)
  const [newImageSet, setNewImageSet] = React.useState([])
  const [profileTitle, setProfileTitle] = React.useState('')
  const [userProfile, setUserProfile] = React.useState(null)
  const [profileImageValue, setProfileImageValue] = React.useState(null)
  const {values: formikValues} = useFormikContext<EditFields>();
  useEffect(() => {
    setLoading(true)
    // TODO: not important sort image by order
      const user = formikValues
      setUserProfile(user);
      const profileImage = user.image_set.find(imgObj => imgObj.img_idx == 0)
      setProfileImageValue(profileImage)
      const image_set_copy = user.image_set.filter(imgObj => imgObj.img_idx != 0)
      setNewImageSet(image_set_copy)
      const title = user.first_name +', ' + user.age
      setProfileTitle(title)
      setLoading(false);
  }, [formikValues])
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

export  { ProfileView }