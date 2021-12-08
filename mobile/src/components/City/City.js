import React from 'react';
import styles from '../../assets/styles';

import { View, Text} from 'react-native';
import {Icon} from 'react-native-elements';

const City = ({city}) => {
  const [city, setCity] = useState(null)
  useEffect(() => {
    setCity(city)
  }, []);
  return (
    <View style={styles.cityText}>
      <Icon name="city" type='material-community'/>
      <Text>
        {city}
      </Text>
    </View>
  );
};

export {City}
