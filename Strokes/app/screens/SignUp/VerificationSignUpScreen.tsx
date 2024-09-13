import { observer } from "mobx-react-lite"
import Config from 'react-native-config';
import React, {useEffect, useRef, useState, useMemo} from "react"
import { navigate, goBack} from "../../navigators"
import { TextInput, TextStyle, ViewStyle, View } from "react-native"
import { LoadingActivity, Header, Button, Icon, Screen, Text, TextField, SelectField, Toggle } from "../../components"
import { useStores } from "../../models"
import { AppStackScreenProps } from "../../navigators"
import { colors, spacing } from "../../theme"

interface VerificationSignUpScreenProps extends AppStackScreenProps<"VerificationSignUp"> {}

export const VerificationSignUpScreen: FC<VerificationSignUpScreenProps> = observer(function VerificationSignUpScreen(_props) {

  const { mongoDBStore, userStore, authenticationStore } = useStores()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false); // Add state for loading
  useEffect(() => {
    // Pre-fill logic if necessary
    return () => userStore.reset()
  }, [userStore])
const verify = () => {
  setIsLoading(true); // Start loading
  authenticationStore
    .confirmRegistration()
    .then(() => {
      authenticationStore.setProp("isAuthenticated", true) // Ensure the authenticated state is set
      setIsLoading(false) // Stop loading after setting authentication
      navigate("Welcome")
    })
    .catch((error) => {
      setIsLoading(false); // Stop loading before handling the error
      console.error("Verification failed:", error.message || error);
      // Set the error state here to display the error message in your component
      setError(error.message || "An unknown error occurred");
    });
};
function sendCode() {
    authenticationStore
      .sendConfirmationCode()
      .then(() => {
        // Handle successful verification, e.g., navigate to the next screen
        console.log("succesful")
      })
      .catch((error) => {
        // Now, error contains the message thrown from confirmRegistration
        console.error("Verification failed:", error.message || error)
        // Set the error state here to display the error message in your component
        setError(error.message || "An unknown error occurred")
      })
  }

   if (isLoading) {
     return <LoadingActivity />
   }
  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <Header leftIcon= {"back"} onLeftPress={() => goBack()}/>
      <Text testID="login-heading" tx="VerificationSignUpScreen.title" preset="heading" style={$signIn} />
      <Text tx="VerificationSignUpScreen.enterDetails" preset="subheading" style={$enterDetails} />

      <TextField
        value={authenticationStore.verificationPhoneCode ?? undefined}
        onChangeText={authenticationStore.setVerificationPhoneCode}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="tel-device"
        autoCorrect={false}
        keyboardType="number-pad"
        labelTx="VerificationSignUpScreen.verificationCode"
        placeholderTx="VerificationSignUpScreen.verificationCode"
        helper={error}
        status={error ? "error" : undefined}
        //onSubmitEditing={() => authPasswordInput.current?.focus()}
      />
      <Button
        testID="login-button"
        tx="VerificationSignUpScreen.tapToResendCode"
        style={$tapButton}
        preset="reversed"
        onPress={sendCode}
      />
      <Button
        testID="login-button"
        tx="VerificationSignUpScreen.tapToVerify"
        style={$tapButton}
        preset="reversed"
        onPress={verify}
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
const $inputWrapperStyle: ViewStyle = {
  marginBottom: spacing.lg,
  flexDirection: "row", // Aligns children side by side
  justifyContent: "space-around", // Distributes children evenly with space around them
  alignItems: "center", // Centers children vertically in the container
  flexWrap: "wrap", // Allows items to wrap to the next line if the container is too narrow
  backgroundColor: colors.palette.neutral200,
  overflow: "hidden",
}
