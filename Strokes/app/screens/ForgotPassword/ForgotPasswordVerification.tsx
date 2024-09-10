import { observer } from "mobx-react-lite"
import React, { useState } from "react"
import { TextStyle, ViewStyle } from "react-native"
import { Header, Button, Screen, Text, TextField } from "../../components"
import { navigate, goBack } from "../../navigators"
import { colors, spacing } from "../../theme"
import { useStores } from "../../models"

interface ForgotPasswordVerificationScreenProps {}

export const ForgotPasswordVerificationScreen: FC<ForgotPasswordVerificationScreenProps> = observer(function ForgotPasswordVerificationScreen(_props) {
  const { authenticationStore } = useStores()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const verifyCode = () => {
    setIsLoading(true)
    authenticationStore
      .confirmVerificationCode()
      .then(() => {
         navigate("ForgotPasswordNewPassword")
      })
      .catch((error) => {
        setIsLoading(false)
        setError(error.message || "Verification failed")
      })
  }

  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <Header leftIcon={"back"} onLeftPress={() => goBack()} />
      <Text testID="verification-heading" text="Verification" preset="heading" style={$signIn} />
      <Text text="Enter the verification code sent to your phone or email" preset="subheading" style={$enterDetails} />

      <TextField
        value={authenticationStore.verificationPhoneCode ?? undefined}
        onChangeText={authenticationStore.setVerificationPhoneCode}
        containerStyle={$textField}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="number-pad"
        label="Verification Code"
        placeholder="Enter verification code"
        helper={error}
        status={error ? "error" : undefined}
      />
      <Button
        testID="verify-code-button"
        text="Verify Code"
        style={$tapButton}
        preset="reversed"
        onPress={verifyCode}
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

