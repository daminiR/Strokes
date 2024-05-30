import { observer } from "mobx-react-lite"
import React, { ComponentType, FC, useEffect, useMemo, useRef, useState } from "react"
import { MMKV } from "react-native-mmkv"
import { TextInput, TextStyle, ViewStyle } from "react-native"
import { Header, Button, Icon, Screen, Text, TextField, TextFieldAccessoryProps } from "../components"
import { navigate, goBack} from "../navigators"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
const ROOT_STATE_STORAGE_KEY = "root-v1";

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen(_props) {
  const authPasswordInput = useRef<TextInput>(null)
  const [authPassword, setAuthPassword] = useState("")
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [attemptsCount, setAttemptsCount] = useState(0)
  const { userStore, authenticationStore } = useStores()
  useEffect(() => {
    // Here is where you could fetch credentials from keychain or storage
    // and pre-fill the form fields.
    //setAuthEmail("ignite@infinite.red")
    //setAuthPassword("ign1teIsAwes0m3")

    // Return a "cleanup" function that React will run when the component unmounts
    return () => {
      //setAuthPassword("")
      //setAuthEmail("")
    }
  }, [])

  //const error = isSubmitted ? validationError : ""
  function login() {
    authenticationStore.signIn()
  }
const logCurrentState = async () => {
  const currentState = await MMKV.getstring(ROOT_STATE_STORAGE_KEY);
  console.log('Current State:', currentState);
};
useEffect(() => {
  const fetchData = async () => {
    await logCurrentState() // Assuming logCurrentState is an async function
  }

  fetchData()
}, [])


  const PasswordRightAccessory: ComponentType<TextFieldAccessoryProps> = useMemo(
    () =>
      function PasswordRightAccessory(props: TextFieldAccessoryProps) {
        return (
          <Icon
            icon={isAuthPasswordHidden ? "view" : "hidden"}
            color={colors.palette.neutral800}
            containerStyle={props.style}
            size={20}
            onPress={() => setIsAuthPasswordHidden(!isAuthPasswordHidden)}
          />
        )
      },
    [isAuthPasswordHidden],
  )

  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <Header leftIcon= {"back"} onLeftPress={() => goBack()}/>
      <Text testID="login-heading" tx="loginScreen.signIn" preset="heading" style={$signIn} />
      <Text tx="loginScreen.enterDetails" preset="subheading" style={$enterDetails} />
      {attemptsCount > 2 && <Text tx="loginScreen.hint" size="sm" weight="light" style={$hint} />}

      <TextField
        value={userStore.phoneNumber ?? undefined}
        onChangeText={userStore.setPhoneNumber}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="tel-device"
        autoCorrect={false}
        keyboardType="number-pad"
        labelTx="signUpScreen.phoneFieldLabel"
        placeholderTx="signUpScreen.phoneFieldLabel"
        //helper={error}
        //status={error ? "error" : undefined}
        //onSubmitEditing={() => authPasswordInput.current?.focus()}
      />

      <TextField
        ref={authPasswordInput}
        value={userStore.authPassword ?? undefined}
        onChangeText={userStore.setAuthPassword}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="password"
        autoCorrect={false}
        secureTextEntry={isAuthPasswordHidden}
        labelTx="signUpScreen.passwordFieldLabel"
        placeholderTx="signUpScreen.passwordFieldPlaceholder"
        //onSubmitEditing={authenticationStore.signIn()}
        RightAccessory={PasswordRightAccessory}
      />
      <Button
        testID="login-button"
        tx="loginScreen.tapToSignIn"
        style={$tapButton}
        preset="reversed"
        onPress={login}
      />
    </Screen>
  )
})

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
}

const $signIn: TextStyle = {
  marginBottom: spacing.sm,
}

const $enterDetails: TextStyle = {
  marginBottom: spacing.lg,
}

const $hint: TextStyle = {
  color: colors.tint,
  marginBottom: spacing.md,
}

const $textField: ViewStyle = {
  marginBottom: spacing.lg,
}

const $tapButton: ViewStyle = {
  marginTop: spacing.xs,
}
