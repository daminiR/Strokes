import React from 'react'
import { View} from 'react-native'
import {Matches} from './Matches'
import {StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from '../../../AppNavigator'

type LikeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'LIKES'>
export type LikeScreenRouteProp = RouteProp<RootStackSignInParamList, 'LIKES'>;
type LikesT = {
  navigation: LikeScreenNavigationProp
  route: LikeScreenRouteProp
}
const Likes  = ({navigation, route})  => {
  return (
    <>
      <View>
        <Matches navigation={navigation}/>
      </View>
    </>
  );
}
export { Likes }
