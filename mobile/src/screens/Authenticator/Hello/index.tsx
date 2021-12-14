import React, { useContext, ReactElement } from 'react'
import { Button} from 'react-native-elements';
import { StackNavigationProp } from '@react-navigation/stack'
import { Space} from '../../../components'
import { RootStackSignOutParamList } from '../../../navigation/SignOutStack'
import  styles  from '../../../assets/styles'
import { UserContext } from '../../../UserContext'
import { Text, View} from 'react-native'
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
      <View style={styles.helloContainer}>
        <View style={styles.buttonIndStyle}>
          <Button
            title="Sign In"
            titleStyle={styles.buttonText}
            onPress={() => _onPressSignIn()}
            style={styles.buttonIndStyle}
            buttonStyle={styles.buttonStyle}
          />
        </View>
        <View style={styles.buttonIndStyle}>
          <Button
            title="Sign Up"
            titleStyle={styles.buttonText}
            style={styles.buttonIndStyle}
            onPress={() => _onPressSignUp()}
            buttonStyle={styles.buttonStyle}
          />
        </View>
      </View>
    </>
  );
}
export { Hello }
