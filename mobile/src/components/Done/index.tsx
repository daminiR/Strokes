import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import {styles} from '@styles'
const Done = ({_onPressDone}) => {
  return (
    <TouchableOpacity onPress={()=> _onPressDone()} style={styles.city}>
      <Text style={styles.cityText}>
        Done
      </Text>
    </TouchableOpacity>
  );
};

export {Done}
