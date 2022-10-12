import React from 'react';
import {TouchableOpacity, Image} from 'react-native';
import { styles } from '@styles'

const SportsIcon = ({}) => {
  return (
    <TouchableOpacity style={styles.city}>
      <Image
        source={require('../../assets/images/sportsIcons/ball.png')}
      />
    </TouchableOpacity>
  );
};

export {SportsIcon}
