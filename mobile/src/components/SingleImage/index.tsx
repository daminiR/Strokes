import { Icon, Avatar } from 'react-native-elements'
import React, {useEffect, useState, ReactElement } from 'react'
import {launchImageLibrary} from 'react-native-image-picker';
import { generateRNFile } from '../../utils/Upload'
import { _check_single } from '../../utils/Upload'
import styles from '../../assets/styles/'
import { EditFields, SignIn} from '../../localModels/UserSportsList'
import { useFormikContext} from 'formik';

const SingleImage = ({img_idx}) => {
  //const didMountRef = useRef(false)
  const [Image, setImage] = React.useState(null)
  const [loading, setLoading] = React.useState(null)
  const {setFieldValue, values: formikValues, submitForm, handleChange, handleSubmit } = useFormikContext<EditFields>();
  const [displayImage, setDisplayImage] = React.useState(null)
  const [displayObj, setDisplayObj] = React.useState(null)
  const [disablePress, setDisablePress] = useState(false)

  useEffect(() => {
    const display = formikValues.image_set?.find(imgObj => imgObj.img_idx == img_idx)
    setDisplayObj(display)
    setDisplayImage(display?.imageURL);
  }, []);
  useEffect(() => {
    if (Image){
      if (Image?.didCancel == true) {
      } else {
        // localimage is gettign set => add to uplaod images formik
        setDisplayImage(Image.assets[0].uri);
        const imageObj = [
          {
            imageURL: Image.assets[0].uri,
            img_idx: img_idx,
            filePath: Image.assets[0].uri,
          },
        ];
        const values = formikValues.image_set;
        if (values != null) {
          const new_values = formikValues.image_set.concat(imageObj);
          setFieldValue('image_set', new_values);
        } else {
          setFieldValue('image_set', imageObj);
        }
        //
        const local_images = formikValues.add_local_images;
        if (local_images != null) {
          const new_values = local_images.concat(imageObj);
          setFieldValue('add_local_images', new_values);
        } else {
          setFieldValue('add_local_images', imageObj);
        }
      }
    }
  }, [Image])
  const _removeImage = async (): Promise<void> => {
      setLoading(true)
      setImage(null)

      const displayValues = formikValues.image_set
      if (displayValues != null){
      const new_values = displayValues.filter(imgObj => imgObj.img_idx != img_idx)
      setFieldValue('image_set', new_values)
      }
      else{
        // this here means this i the only image it cannot be deleted
      console.error("image connot be deleted")
      }
      if (displayImage.startsWith('https')) {
        const remove_uploaded_images = formikValues.remove_uploaded_images;
        if (remove_uploaded_images != null) {
          const new_values = remove_uploaded_images.concat(displayObj);
          setFieldValue('remove_uploaded_images', new_values);
        } else {
          setFieldValue('remove_uploaded_images', displayObj);
        }
      }
      setDisplayImage(null)
      setLoading(false)
      console.log("/////////////////////////////////// removed HHH", displayObj)
  }
  const _singleUpload = async (): Promise<void> => {
      setLoading(true);
      const options = {
        mediaType: 'photo',
      };
      launchImageLibrary(
        {
          mediaType: 'photo',
        },
        setImage,
      );
  };
    const cancelProps = {
      onPress: displayImage ? _removeImage : null,
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
          size={120}
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
          onPress={!displayImage ? () => _singleUpload() : null }
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
