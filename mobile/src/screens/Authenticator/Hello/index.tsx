import React, { useContext, ReactElement } from 'react'
import { Button } from 'react-native-elements';
import { StackNavigationProp } from '@react-navigation/stack'
import { Space} from '../../../components'
import { RootStackSignOutParamList } from '../../../navigation/SignOutStack'
import { UserContext } from '../../../UserContext'
import { Text } from 'react-native'
export type HelloTScreenNavigationProp = StackNavigationProp<RootStackSignOutParamList, 'HELLO'>

export type HelloT = {
  navigation: HelloTScreenNavigationProp
}
const Hello = ({ navigation }: HelloT): ReactElement => {
  const {currentUser} = useContext(UserContext)
  const _onPressSignIn = () => {
    navigation.navigate('SIGN_IN');
  };
  const _onPressSignUp = () => {
    navigation.navigate('SIGNUP');
  };
  return (
    <>
      <Space height={80} />
      <Button title="Sign In" onPress={() => _onPressSignIn()} />
      <Button title="Sign Up" onPress={() => _onPressSignUp()} />
      <Text>{JSON.stringify(currentUser)}</Text>
      <Space height={10} />
    </>
  );
}
export { Hello }
