import React, { useContext, useState, ReactElement } from 'react'
import { StackNavigationProp } from '@react-navigation/stack'
import { Text, Button } from 'react-native'
import { onScreen, goBack } from '../../../constants'
import { AppContainer } from '../../../components'
import auth from '@react-native-firebase/auth'
import {UserContext} from '../../../UserContext'
import { useQuery, useMutation } from '@apollo/client'
import {  RootStackSportAppParamList } from '../../../navigation/SignInStack'
import { GET_PROFILE_STATUS, READ_SQUASH, GET_SELECTED_SQUASH, READ_SQUASHES } from '../../../graphql/queries/profile'
import {isProfileCompleteVar} from '../../../cache'

type ProfileCompleteScreenNavigationProp = StackNavigationProp<RootStackSportAppParamList, 'COMPLETE'>

type CompleteT = {
  navigation: ProfileCompleteScreenNavigationProp
}

const ProfileComplete = ({ navigation }: CompleteT ): ReactElement => {
  const {data, loading, error} = useQuery(GET_PROFILE_STATUS);
  const isProfileComplete = isProfileCompleteVar()
  const [loading2, setLoading] = useState(false)
  const [error2, setError] = useState('')
  const {confirmResult, setConfirmResult} = useContext(UserContext)
  const _onPressDelete = async () : Promise<void> => {
      console.log(isProfileComplete)
  }

  return (
    <>
      <AppContainer title="Complete" loading={loading}>
        <Text>
          {'check if deleted?'}
          {JSON.stringify(data)}
          </Text>
        <Button title="Delete" onPress={_onPressDelete}/>
      </AppContainer>
    </>
  )
}
export { ProfileComplete }
