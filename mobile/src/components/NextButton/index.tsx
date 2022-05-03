import React from 'react';
import {View} from 'react-native';
import {Icon} from 'react-native-elements';
import {styles} from '@styles'

const NextButton = () => {
  return (
    <View style={styles.city}>
     <Icon  name='arrow-right-bold' type={'material-community'}/>
    </View>
  );
};

export {NextButton}
