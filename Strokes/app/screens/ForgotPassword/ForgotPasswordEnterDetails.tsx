import { observer } from "mobx-react-lite"
import React, { useState } from "react"
import { TextStyle, ViewStyle } from "react-native"
import { Header, Button, Screen, Text, TextField } from "../../components"
import { navigate, goBack } from "../../navigators"
import { colors, spacing } from "../../theme"
import { useStores } from "../../models"

interface ForgotPasswordEnterDetailsScreenProps {}

export const ForgotPasswordEnterDetailsScreen: FC<ForgotPasswordEnterDetailsScreenProps> = observer(function ForgotPasswordEnterDetailsScreen(_props) {
  const { authenticationStore } = useStores()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const requestReset = () => {
    setIsLoading(true)
    authenticationStore
      .sendPasswordResetRequest()
      .then(() => {
        navigate("ForgotPasswordVerificationScreen")
      })
      .catch((error) => {
        setIsLoading(false)
        setError(error.message || "An unknown error occurred")
      })
  }

  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <Header leftIcon={"back"} onLeftPress={() => goBack()} />
      <Text testID="enter-details-heading" text="Forgot Password" preset="heading" style={$signIn} />
      <Text text="Enter your phone number or email" preset="subheading" style={$enterDetails} />

      <TextField
        value={authenticationStore.userEmail ?? ""}
        onChangeText={authenticationStore.setUserEmail}
        containerStyle={$textField}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        label="Email or Phone"
        placeholder="Enter email or phone"
        helper={error}
        status={error ? "error" : undefined}
      />
      <Button
        testID="request-reset-button"
        text="Request Reset"
        style={$tapButton}
        preset="reversed"
        onPress={requestReset}
        loading={isLoading}
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

const $textField: ViewStyle = {
  marginBottom: spacing.lg,
}

const $tapButton: ViewStyle = {
  marginTop: spacing.xs,
}

