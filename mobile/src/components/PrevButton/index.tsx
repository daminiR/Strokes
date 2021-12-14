import React from 'react';
import {View} from 'react-native';
import {Icon} from 'react-native-elements';
import styles from '../../assets/styles'

const PrevButton = () => {
  return (
    <View style={styles.city}>
      <Icon  name='arrow-left-bold' type={'material-community'}/>
    </View>
  );
};

export {PrevButton}
