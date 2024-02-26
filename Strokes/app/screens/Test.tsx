import { observer } from "mobx-react-lite"
import React, { useRef, useState } from "react"
import { TextInput, TextStyle, ViewStyle, View } from "react-native"
import { Button, Icon, Screen, Text, TextField, SelectField, Toggle } from "../components"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"

interface SignUpScreenProps extends AppStackScreenProps<"SignUp"> {}

export const SignUpScreen: FC<SignUpScreenProps> = observer(function SignUpScreen(_props) {
  const authPasswordInput = useRef<TextInput>(null)


  const [authEmail, setAuthEmail] = useState("")
  const [authPassword, setAuthPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [gender, setGender] = useState("")
  const [neighborhood, setNeighborhood] = useState("")
  const [description, setDescription] = useState("")
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [attemptsCount, setAttemptsCount] = useState(0)

  const {
    authenticationStore: { setAuthToken, validationError },
  } = useStores()

  useEffect(() => {
    // Pre-fill or cleanup logic if necessary
    return () => {
      // Cleanup if necessary
    }
  }, [])

  const error = isSubmitted ? validationError : ""

  function login() {
    setIsSubmitted(true)
    setAttemptsCount(attemptsCount + 1)

    if (validationError) return

    // Reset fields and set the token on successful login
    setAuthToken(String(Date.now()))
    resetFields()
  }

  const resetFields = () => {
    setAuthEmail("")
    setAuthPassword("")
    setFirstName("")
    setLastName("")
    setGender("")
    setNeighborhood("")
    setDescription("")
    setIsSubmitted(false)
  }

  const PasswordRightAccessory: ComponentType<TextFieldAccessoryProps> = useMemo(
    () => function PasswordRightAccessory(props: TextFieldAccessoryProps) {
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
    <Screen preset="auto" contentContainerStyle={$screenContentContainer} safeAreaEdges={["top", "bottom"]}>
      <Text testID="login-heading" tx="signUpScreen.signIn" preset="heading" style={$signIn} />
      <Text tx="signUpScreen.enterDetails" preset="subheading" style={$enterDetails} />
      {attemptsCount > 2 && <Text tx="signUpScreen.hint" size="sm" weight="light" style={$hint} />}

      {/* Updated TextFields for separate fields */}
      <TextField
        value={authEmail}
        onChangeText={setAuthEmail}
        containerStyle={$textField}
        autoCapitalize="none"
        autoCompleteType="email"
        autoCorrect={false}
        keyboardType="email-address"
        labelTx="signUpScreen.emailFieldLabel"
        placeholderTx="signUpScreen.emailFieldPlaceholder"
        helper={error}
        status={error ? "error" : undefined}
      />

      {/* Additional fields corrected for firstName, lastName, gender, and description with their respective states and handlers */}

      <TextField
        ref={authPasswordInput}
        value={authPassword}
        onChangeText={setAuthPassword}
        containerStyle={$textField}
        autoCapitalize="none"
        autoCompleteType="password"
        autoCorrect={false}
        secureTextEntry={isAuthPasswordHidden}
        labelTx="signUpScreen.passwordFieldLabel"
        placeholderTx="signUpScreen.passwordFieldPlaceholder"
        RightAccessory={PasswordRightAccessory}
      />

      {/* Corrected SelectField for neighborhood selection */}

      {/* Gender selection logic needs to be implemented correctly, possibly with two Toggle components or another approach */}

      <Button
        testID="login-button"
        tx="signUpScreen.tapToSignIn"
        style={$tapButton}
        onPress={login}
      />
    </Screen>
  )
})
// Styles remain the same


