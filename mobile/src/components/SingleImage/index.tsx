import { Icon, Avatar } from 'react-native-elements'
import React, {useEffect, useState, ReactElement } from 'react'
import {launchImageLibrary} from 'react-native-image-picker';
import { generateRNFile } from '../../utils/Upload'
import { _check_single } from '../../utils/Upload'
import styles from '../../assets/styles/'
import { EditFields, SignIn} from '../../localModels/UserSportsList'
import { useFormikContext} from 'formik';

const SingleImage = ({img_idx, image_uri = null}) => {
  console.log("single_image", image_uri)
  const [Image, setImage] = React.useState(null)
  const [loading, setLoading] = React.useState(null)
  const [displayImage, setDisplayImage] = React.useState(image_uri)
  const {setFieldValue, values: formikValues, submitForm, handleChange, handleSubmit } = useFormikContext<EditFields>();

  useEffect(() => {
     console.log(Image)
    if (Image){
      setDisplayImage(Image.assets[0].uri)
      const new_values = formikValues.image_set.concat([{imageURL: Image.assets[0].uri, img_idx: img_idx, filePath: Image.assets[0].uri}])
      setFieldValue('image_set', new_values)
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
    let imageVal = {}
    //var uri = {displayImage}
    //var placeHolder = require('../../assets/camera-enhance.svg')
    if (displayImage) {
      imageVal = {uri: displayImage}
    }
    else {
    imageVal = require('../../assets/camera-enhance.svg')
    }
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
          source={{uri: displayImage}}
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
