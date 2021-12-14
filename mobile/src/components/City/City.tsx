import React, { useEffect, useState } from 'react'
import styles from '../../assets/styles';

import { View, Text} from 'react-native';
import {Icon} from 'react-native-elements';
import  {cityVar} from '../../cache'
const City = () => {
  const [city, setCity] = useState(null)
  useEffect(() => {
    const City = cityVar()
    setCity(City)
  }, [cityVar()]);
  return (
    <View style={styles.cityText}>
      <Icon name="city" type='material-community' size={38}/>
      <Text style={{marginLeft: 4, marginTop: 10}}>
        {city}
      </Text>
    </View>
  );
};

export {City}
