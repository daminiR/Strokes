import { ReactNativeFile } from 'apollo-upload-client'
import * as mime from 'react-native-mime-types'

export const generateRNFile = (file) => {
    console.log(file.path)
    return file.path
      ? new ReactNativeFile({
          uri:file.path,
          type: file.mime|| 'image',
          //TODO: need to come up with a better way to work on this
          name: `picture-${Date.now()}` ,
        })
      : null;
  };

