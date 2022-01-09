import React from 'react'
import { View} from 'react-native'
import {Matches} from '@components'
import {tabBarSize} from '@constants'
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
      <View style={{marginBottom: tabBarSize}}>
        <Matches navigation={navigation}/>
      </View>
    </>
  );
}
export { Likes }
