import React, {useContext, useEffect} from 'react'
import { Icon } from 'react-native-elements'
import {styles} from '@styles'


const EditPencil = ({_edit}) => {
  return (
  <Icon
    color="black"
    size={28}
    onPress={_edit}
    name="pencil"
    type="material-community"
    style={styles.pencilEdit}
  />
  )
};

export {EditPencil}
