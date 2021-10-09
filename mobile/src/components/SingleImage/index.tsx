import { Icon, Avatar } from 'react-native-elements'
import React, {useEffect, useState, ReactElement } from 'react'
import {launchImageLibrary} from 'react-native-image-picker';
import { generateRNFile } from '../../utils/Upload'
import { _check_single } from '../../utils/Upload'
import styles from '../../assets/styles/'

const SingleImage = ({img_idx, getSingleImage = null}) => {
  const [Image, setImage] = React.useState(null)
  const [loading, setLoading] = React.useState(null)
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
  const _removeImage = async (): Promise<void> => {
      setLoading(true)
      setDisplayImage(null)
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
      name: 'close-circle-outline',
      type: 'material-community',
      size: 30,
    };
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
          source={displayImage? {uri: displayImage}: require("../../assets/camera-enhance.svg")}
          overlayContainerStyle={styles.imageIndividualContainer}
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
export { SingleImage }
