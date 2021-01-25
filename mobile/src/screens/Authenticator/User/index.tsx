import React, { useContext, useState, ReactElement } from 'react'
import { StackNavigationProp } from '@react-navigation/stack'
import { Text, Button } from 'react-native'
import { onScreen, goBack } from '../../../constants'
import { AppContainer } from '../../../components'
import { RootStackParamList } from '../../../AppNavigator'
import auth from '@react-native-firebase/auth'
import {UserContext} from '../../../UserContext'
import { useQuery, useMutation } from '@apollo/client'
import { READ_SQUASH, GET_SELECTED_SQUASH, READ_SQUASHES } from '../../../graphql/queries/profile'
type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'USER'>

type UserT = {
  navigation: ProfileScreenNavigationProp
}

const User = ({ navigation }: UserT ): ReactElement => {
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
  const {currentUser} = useContext(UserContext)
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
          </Text>
        <Button title="Sign Out" onPress={_onPressSignOut}/>
        <Button title="Profile" onPress={_onPressProfile}/>
      </AppContainer>
    </>
  )
}
export { User }
