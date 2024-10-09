import { observer } from "mobx-react-lite"
import Icon from 'react-native-vector-icons/MaterialIcons';
//import Icon from 'react-native-vector-icons/FontAwesome';
import React, {useEffect} from "react"
import { navigate, goBack} from "../../navigators"
import { Header, Button, Screen, Text } from "../../components"
import { useStores } from "../../models"
import { AppStackScreenProps } from "../../navigators"
import { styles } from "./styles/HelloScreen.styles"
import { Image } from 'react-native';

interface HelloScreenProps extends AppStackScreenProps<"Hello"> {}

export const HelloScreen: FC<HelloScreenProps> = observer(function HelloScreen(_props) {
  const { userStore } = useStores()
  useEffect(() => {
    // Pre-fill logic if necessary
    return () => userStore.reset()
  }, [userStore])
    function login() {
    console.log("logged")
  }
  return (
    <Screen
      preset="auto"
      contentContainerStyle={styles.screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <Header leftText="so why no icon" leftIcon= {"back"} onLeftPress={() => goBack()}/>
      <Icon name="close" size={350}/>
      <Text testID="login-heading" tx="Hello.title" preset="heading" style={styles.signIn} />
      <Text tx="Hello.enterDetails" preset="subheading" style={styles.enterDetails} />
      <Button
        testID="login-button"
        tx="Hello.signIn"
        style={styles.tapButton}
        preset="reversed"
        onPress={()=>navigate("Login")}
      />
      <Button
        testID="login-button"
        tx="Hello.signUp"
        style={styles.tapButton}
        preset="reversed"
        onPress={()=>
        navigate("SignUp")}
      />
    </Screen>
  )
})
