import React, { useEffect, useContext, useState, ReactElement } from 'react'
import {styles} from '@styles'
import { Text, TouchableOpacity } from 'react-native';
import {Icon} from '@components';
import {Overlay} from 'react-native-elements'
const MatchCard = ({matched, setMatched}) => {
  //const [matched, setMatched] = useState(false)
  return (
      <Overlay isVisible={matched} onBackdropPress={() => setMatched(!matched)}>
        <Text>Matched!</Text>
      </Overlay>
  );
};

export {MatchCard}
