import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import styles from '../../assets/styles/'

const Cancel = ({_onPressCancel=null}) => {
  return (
    <TouchableOpacity onPress={() => _onPressCancel()} style={styles.city}>
      <Text style={styles.cityText}>
       Cancel
      </Text>
    </TouchableOpacity>
  );
};

export {Cancel}
