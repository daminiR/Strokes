import React from 'react'
import { View} from 'react-native'
import {Matches} from '@screens'
import {StackNavigationProp } from '@react-navigation/stack'
import { RootStackSignInParamList } from '@NavStack'

type LikeScreenNavigationProp = StackNavigationProp<RootStackSignInParamList, 'LIKES'>
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
