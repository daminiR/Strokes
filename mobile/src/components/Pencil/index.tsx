import React, {useContext, useEffect} from 'react'
import { Icon } from 'react-native-elements'
import styles from '../../assets/styles'


const EditPencil = ({_edit}) => {
  return (
  <Icon
    color="#ff7f02"
    size={28}
    onPress={() => _edit(true)}
    name="pencil"
    type="material-community"
    style={styles.pencilEdit}
  />
  )
};

export {EditPencil}
