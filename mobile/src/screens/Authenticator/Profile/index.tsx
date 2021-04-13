import React, { useContext, useState, ReactElement } from 'react'
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack'
import { View, Text, Button } from 'react-native'
import { onScreen, goBack } from '../../../constants'
import { AppContainer } from '../../../components'
import { RootStackParamList } from '../../../AppNavigator'
import auth from '@react-native-firebase/auth'
import {UserContext} from '../../../UserContext'
import { useQuery, useMutation } from '@apollo/client'
import { GET_PROFILE_STATUS, READ_SQUASH, GET_SELECTED_SQUASH, READ_SQUASHES } from '../../../graphql/queries/profile'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PROFILE'>

type ProfileT = {
  navigation: ProfileScreenNavigationProp
}

const Profile = ({ navigation }: ProfileT ): ReactElement => {
  //const {
    //data: {selectSquash},
  //} = useQuery(GET_SELECTED_SQUASH)
  //console.log(selectSquash)
  //cosnt { loading, error, data } = useQuery(READ_SQUASH, {
        //variables: squashid,
        //skip: squashid === undefine
  //})
  console.log("user page data")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const {confirmResult, setConfirmResult} = useContext(UserContext)
  const {data} = useQuery(GET_PROFILE_STATUS);
  const {currentUser} = useContext(UserContext)
  console.log(currentUser)
  const _onPressProfile = () => {
      onScreen('PROFILE', navigation)()
  }
  const _onPressSignOut = async () : Promise<void> => {
    setLoading(true)
    setError('')
    await auth()
      .signOut()
      .then((res) => {
        console.log('Succesful signout')
        console.log(currentUser)
        setConfirmResult(null)
        setLoading(false)
        setError('')
        //onScreen('HELLO', navigation)()
      })
      .catch((err) => {
        console.log(err.code);
        setError(err.code)
      });
  }

  return (
    <>
      <AppContainer title="User" loading={loading}>
        <Text>
          {'you are loged in!'}
        {JSON.stringify(currentUser)}
        {JSON.stringify(currentUser.additionalInfor)}
          </Text>
        <Button title="Sign Out" onPress={_onPressSignOut}/>
        <Button title="Profile" onPress={_onPressProfile}/>
      </AppContainer>
    </>
  )
}
export { Profile }
