import React, { useEffect, useContext, useState, ReactElement } from 'react'
import {styles} from '@styles'
import { View, Text, TouchableOpacity } from 'react-native';
import {Icon} from '@components';
import {Overlay} from 'react-native-elements'
import LottieView from 'lottie-react-native';
const MatchCard = ({matched, setMatched}) => {
  const [removeOverlay, setRemoveOverlay] = useState(false)
  setTimeout(() => setMatched(false), 20000);
  setTimeout(() => setRemoveOverlay(true), 5000);
  return (
    <Overlay
      overlayStyle={styles.matchedOverlay}
      isVisible={matched}
      onBackdropPress={() => removeOverlay && setMatched(!matched)}>
      <LottieView
        source={require('../../assets/images/matched/handShakeMatched.json')}
        style={{
          width: 350,
          aspectRatio: 2,
          overflow: 'hidden',
        }}
        autoPlay
      />
      <Text style={styles.matchedText}>Matched!</Text>
    </Overlay>
  );
};

export {MatchCard}
