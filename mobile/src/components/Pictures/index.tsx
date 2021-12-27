import React, {useState } from 'react'
import {View } from 'react-native'
import styles from '../../assets/styles/'
import { SingleImage} from '../SingleImage'

const Pictures =() => {
  const [loadPictures, setLoadPictures] = useState(false)
  return (
    <>
      {!loadPictures && (
        <View style={styles.imagecontainer}>
          <View style={styles.verticalImageplaceholder}>
            <View style={styles.horizontalImageplaceholder}>
              <SingleImage img_idx={0} />
              <SingleImage img_idx={1} />
              <SingleImage img_idx={2} />
            </View>
            <View style={styles.horizontalImageplaceholder}>
              <SingleImage img_idx={3} />
              <SingleImage img_idx={4} />
              <SingleImage img_idx={5} />
            </View>
          </View>
        </View>
      )}
    </>
  );
}
export {Pictures}
