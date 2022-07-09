import { Icon, Avatar } from 'react-native-elements'
import React, {useEffect, useState, useContext } from 'react'
import {launchImageLibrary} from 'react-native-image-picker';
import { _check_single} from '@utils'
import  {styles, SECONDARY_THEME} from '@styles'
import { useFormikContext} from 'formik';
import _ from 'lodash';
import {EditFields, ProfileFields} from '@localModels';
import {UserContext} from '@UserContext'
import imageCompression from 'browser-image-compression';
import RNFetchBlob from 'rn-fetch-blob'

const SingleImage = ({img_idx}) => {
  const [Image, setImage] = React.useState(null);
  const [loading, setLoading] = React.useState(null);
  const {
    setFieldValue,
    values: formikValues,
    submitForm,
    handleChange,
    handleSubmit,
  } = useFormikContext<EditFields | ProfileFields>();
  const [displayImage, setDisplayImage] = React.useState(null);
  const [displayObj, setDisplayObj] = React.useState(null);
  const {setImageErrorVisible} = useContext(UserContext);

  useEffect(() => {
    const display = formikValues.image_set?.find(
      (imgObj) => imgObj.img_idx == img_idx,
    );
    setDisplayObj(display);
    setDisplayImage(display?.imageURL);
  }, []);

  const convertToBlob = async (image) => {
    const Blob = RNFetchBlob.polyfill.Blob;
    const fs = RNFetchBlob.fs;
    let uploadBlob;
    return await new Promise(async (resolve, reject) => {
      await fs
        .readFile(image.assets[0].uri, 'base64')
        .then((data) => {
          return Blob.build(data, {type: `BASE64`});
        })
        .then((blob) => {
          resolve(blob);
          uploadBlob = blob;
          console.log(uploadBlob, 'uploadBlob');
        })
        .catch((error) => {
          console.log('error bulding image blob', error);
          reject(null);
        });
    });
  };
  const handleImageUpload = async (event) => {
    //var imageFile = event.assets[0].uri;
    convertToBlob(event).then(
      (blob) => {
    var imageFile = event.assets[0]
    imageFile = blob
    console.log('originalFile instanceof Blob', typeof imageFile); // true
    console.log('originalFile instanceof Blob', imageFile instanceof Blob); // true
    console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);
      }

    )
    var options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    return await new Promise((resolve, reject) => {
      imageCompression(imageFile, options)
        .then(function (compressedFile) {
          console.log(
            'compressedFile instanceof Blob',
            compressedFile instanceof Blob,
          ); // true
          console.log(
            `compressedFile size ${compressedFile.size / 1024 / 1024} MB`,
          ); // smaller than maxSizeMB

          resolve(compressedFile);
          //return compressedFile // write your own logic
        })
        .catch(function (error) {
          reject(null);
          console.log(error.message);
        });
    });
  };
  useEffect(() => {
    if (Image) {
      if (Image?.didCancel == true) {
      } else {
        // localimage is gettign set => add to uplaod images formik
        // /////////////////// allter image here
        console.log('compressed Image', Image);
        //handleImageUpload(Image).then(() => {
          console.log('compressed successfully');
        //}).catch(() => {
          //console.log('compressed failed');
        //})
        // /////////////////// allter image here
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
  }, [Image]);
  const _removeImage = async (): Promise<void> => {
    setLoading(true);
    setImage(null);
    const displayValues = formikValues.image_set;
    if (displayValues.length > 1) {
      const new_values = displayValues.filter(
        (imgObj) => imgObj.img_idx != img_idx,
      );
      setFieldValue('image_set', new_values);
      // two senarios if starts wth https or right when someone loads file update profile with https images and not local
      // breaks with case when image uploaded and imeditaely removes(doesnt delete old image"
      if (displayImage.startsWith('https')) {
        const remove_uploaded_images = formikValues.remove_uploaded_images;
        if (remove_uploaded_images != null) {
          const new_values = remove_uploaded_images.concat(displayObj);
          setFieldValue('remove_uploaded_images', new_values);
        } else {
          const new_values = displayObj;
          setFieldValue('remove_uploaded_images', new_values);
        }
      } else {
        // remove image from locals!!
        const currentLocals = formikValues.add_local_images;
        if (currentLocals != null) {
          // filter out
          _.remove(
            currentLocals,
            (localImage) => localImage.img_idx == img_idx,
          );
          setFieldValue('add_local_images', currentLocals);
        }
      }
      setDisplayImage(null);
      setLoading(false);
    } else {
      // this here means there is  only one image and it cannot be deleted
      setImageErrorVisible(true);
      setLoading(false);
    }
  };
  const _singleUpload = async (): Promise<void> => {
    setLoading(true);
    const options = {
      mediaType: 'photo',
    };
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 600,
        maxHeight: 800,
        quality: 0.7,
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
  const renderPLaceHolderCamera = () => {
    return (
      <Icon
        reverse
        name="camera-enhance"
        type="material-community"
        color={SECONDARY_THEME}
      />
    );
  };
  return (
    <>
      <Avatar
        size={120}
        renderPlaceholderContent={renderPLaceHolderCamera()}
        source={displayImage ? {uri: displayImage} : undefined}
        overlayContainerStyle={styles.imageIndividualContainer}
        onPress={!displayImage ? () => _singleUpload() : null}
        activeOpacity={0.7}
        containerStyle={{
          padding: 0,
          marginLeft: 0,
          marginTop: 0,
        }}
        placeholderStyle={{backgroundColor: 'transparent'}}>
        <Avatar.Accessory {...cancelProps} />
      </Avatar>
    </>
  );
}
export { SingleImage }
