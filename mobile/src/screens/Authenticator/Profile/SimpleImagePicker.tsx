import React, { useState } from 'react';
import { View, Text } from 'react-native';
import ImagePicker from 'react-native-image-picker'

export default function SimpleImagePicker() {
  const [imageSource, setImageSource] = useState(null);
  function selectImage() {
    let options = {
      title: 'You can choose one image',
      maxWidth: 256,
      maxHeight: 256,
      storageOptions: {
        skipBackup: true
      }
    };

    ImagePicker.showImagePicker(options, response => {
      console.log({ response });

      if (response.didCancel) {
        console.log('User cancelled photo picker');
        Alert.alert('You did not select any image');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        let source = { uri: response.uri };
        console.log({ source });
      }
    });
  }

  const [imageSource, setImageSource] = useState(null);
  return (
    <View>
      <Text>
        Simple Image Picker
      </Text>
       <TouchableOpacity
        onPress={selectImage}>
        <Text>Pick an image</Text>
      </TouchableOpacity>
    </View>
  );
}
