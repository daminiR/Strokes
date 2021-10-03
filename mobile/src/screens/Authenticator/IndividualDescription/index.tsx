import React, { useEffect, useLayoutEffect, useContext, useState, ReactElement } from 'react'
import { useQuery, useMutation, useLazyQuery, HTTPFetchNetworkInterface} from '@apollo/client'
import {Theme, Text, Chip, Card, Input, Button,withBadge, ListItem, Icon, Avatar, Badge } from 'react-native-elements'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import {
  View
} from 'react-native';
import * as Yup from 'yup'
import { onScreen, goBack } from '../../../constants'
import  auth  from '@react-native-firebase/auth'
import { HeaderBackButton, StackHeaderLeftButtonProps } from '@react-navigation/stack';
import {RootIndividualProfileInputParamList } from '../../../navigation/individualProfileStack'
import {FirstNameVar} from '../../../cache'
import {GET_DESCRIPTION} from '../../../graphql/queries/profile'
import {UPDATE_DESCRIPTION} from '../../../graphql/mutations/profile'
import {UserContext} from '../../../UserContext'
import {ProfileContext} from '../Profile/index'

export type DescriptionScreenNavigationProp = StackNavigationProp<RootIndividualProfileInputParamList, 'DESCRIPTION'>
export type DescriptionScreenRouteProp = RouteProp<RootIndividualProfileInputParamList, 'DESCRIPTION'>;
export type DescriptionT = {
  navigation: DescriptionScreenNavigationProp
  route: DescriptionScreenRouteProp
}
const Description = ({navigation, route}: DescriptionT): ReactElement => {
const [currentFirstName, setCurrentFirstName] = useState(null)
const {currentUser} = useContext(UserContext)
const [loading, setLoading] = useState(true)
const [updateDescription] = useMutation(UPDATE_DESCRIPTION);
const [descriptionValue, onChangeDescription] = React.useState('Useless Placeholder')
let {
  loading: apolloLoading,
  error: apolloError,
  data: apolloDescription,
} = useQuery(GET_DESCRIPTION);

useEffect(() => {
      setLoading(true)
      onChangeDescription(apolloDescription.description);
      setLoading(false)
}, []);
  const _updateDescription = () => {
    updateDescription({variables: {_id: currentUser.uid, description: descriptionValue}})
    navigation.goBack()
  }
  const [data, setData] = useState("checking")
  return (
    <>
      {!loading && (
        <View>
          <Input
            placeholder="Description"
            label="Description"
            leftIcon={{type: 'font-awesome', name: 'chevron-left'}}
            onChangeText={onChangeDescription}
            value={descriptionValue}
          />
        </View>
      )}
      <Button
        title="Update"
        onPress={() => {
          _updateDescription();
        }}
      />
    </>
  );
}
export { Description }
