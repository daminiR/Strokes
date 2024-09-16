import { observer } from "mobx-react-lite"
import { styles } from "./styles/VerificationSignUpScreen.styles"
import React, {useEffect, useState} from "react"
import { navigate, goBack} from "../../navigators"
import { LoadingActivity, Header, Button, Screen, Text, TextField} from "../../components"
import { useStores } from "../../models"
import { AppStackScreenProps } from "../../navigators"

interface VerificationSignUpScreenProps extends AppStackScreenProps<"VerificationSignUp"> {}

export const VerificationSignUpScreen: FC<VerificationSignUpScreenProps> = observer(function VerificationSignUpScreen(_props) {

  const { userStore, authenticationStore } = useStores()
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
      contentContainerStyle={styles.screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <Header leftIcon= {"back"} onLeftPress={() => goBack()}/>
      <Text testID="login-heading" tx="VerificationSignUpScreen.title" preset="heading" style={styles.signIn} />
      <Text tx="VerificationSignUpScreen.enterDetails" preset="subheading" style={styles.enterDetails} />

      <TextField
        value={authenticationStore.verificationPhoneCode ?? undefined}
        onChangeText={authenticationStore.setVerificationPhoneCode}
        containerStyle={styles.textField}
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
        style={styles.tapButton}
        preset="reversed"
        onPress={sendCode}
      />
      <Button
        testID="login-button"
        tx="VerificationSignUpScreen.tapToVerify"
        style={styles.tapButton}
        preset="reversed"
        onPress={verify}
      />
    </Screen>
  )
})

