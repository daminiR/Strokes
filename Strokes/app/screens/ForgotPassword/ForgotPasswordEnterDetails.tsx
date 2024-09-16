import { observer } from "mobx-react-lite"
import React, { useState} from "react"
import { Header, Button, Screen, Icon, Text, TextField, TextFieldAccessoryProps} from "../../components"
import { navigate, goBack } from "../../navigators"
import { useStores } from "../../models"
import { styles } from "./styles/ForgotPasswordEnterDetails.styles"

interface ForgotPasswordEnterDetailsScreenProps {}

export const ForgotPasswordEnterDetailsScreen: FC<ForgotPasswordEnterDetailsScreenProps> = observer(function ForgotPasswordEnterDetailsScreen(_props) {
  const { authenticationStore, userStore} = useStores()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const requestReset = () => {
    setIsLoading(true)
    authenticationStore
      .sendPasswordResetRequest()
      .then(() => {
        navigate("ForgotPasswordNewPassword")
      })
      .catch((error: any) => {
        setIsLoading(false)
        setError(error.message || "An unknown error occurred")
      })
  }

  return (
    <Screen
      preset="auto"
      contentContainerStyle={styles.screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <Header leftIcon={"back"} onLeftPress={() => goBack()} />
      <Text testID="enter-details-heading" text="Forgot Password" preset="heading" style={styles.signIn} />
      <Text text="Enter your phone number or email" preset="subheading" style={styles.enterDetails} />

      <TextField
        value={userStore.displayPhoneNumber ?? undefined}
        onChangeText={(text) => userStore.setPhoneNumber(text)}
        containerStyle={styles.textField}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="number-pad"
        label="Email or Phone"
        placeholder="Enter email or phone"
        helper={error}
        status={error ? "error" : undefined}
      />
      <Button
        testID="request-reset-button"
        text="Request Reset"
        style={styles.tapButton}
        preset="reversed"
        onPress={requestReset}
        loading={isLoading}
      />
    </Screen>
  )
})
