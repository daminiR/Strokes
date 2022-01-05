import React, { memo } from 'react'
import { Text, StyleSheet, View } from 'react-native'
import Spinner, { SpinnerType } from 'react-native-spinkit'
import  AnimatedLoader from 'react-native-animated-loader'
import { secondary } from '../../constants'

const styles = StyleSheet.create({
  activityIndicator: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 10,
    right: 10,
    top: 10,
    bottom: 10
  }
})

interface LoadingT {
  size?: number
  type?: SpinnerType
  animating?: boolean
}

const Loading = memo<LoadingT>(({ size, animating, type }) => {
  const {activityIndicator} = styles;
  return (
    <View style={activityIndicator}>
      {!animating &&
      <AnimatedLoader
        visible={true}
        overlayColor="rgba(255,255,255,0.75)"
        animationStyle={styles2.lottie}
        source={require('../../assets/images/loading/lf30_editor_c1eqkx20.json')}
        speed={0.9}>
          <Text> Loading ...</Text>
        </AnimatedLoader>
      }
    </View>
  );
})
const styles2 = StyleSheet.create({
  lottie: {
    width: 100,
    height: 100,
  },
});

      //{!animating && <Spinner size={size} type={type} color={secondary} />}
export { Loading }
