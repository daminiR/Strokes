import { observer } from "mobx-react-lite"
import React, { useState } from "react"
import { TextStyle, ViewStyle } from "react-native"
import { Header, Button, Screen, Text, TextField } from "../../components"
import { navigate, goBack } from "../../navigators"
import { colors, spacing } from "../../theme"
import { useStores } from "../../models"

interface ForgotPasswordNewPasswordScreenProps {}

export const ForgotPasswordNewPasswordScreen: FC<ForgotPasswordNewPasswordScreenProps> = observer(function ForgotPasswordNewPasswordScreen(_props) {
  const { authenticationStore } = useStores()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const resetPassword = () => {
    setIsLoading(true)
    authenticationStore
      .resetPassword()
      .then(() => {
        alert("Password successfully reset.")
        navigate("LoginScreen")
      })
      .catch((error) => {
        setIsLoading(false)
        setError(error.message || "Error resetting password")
      })
  }

  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <Header leftIcon={"back"} onLeftPress={() => goBack()} />
      <Text testID="new-password-heading" text="New Password" preset="heading" style={$signIn} />
      <Text text="Enter your new password" preset="subheading" style={$enterDetails} />

      <TextField
        value={authenticationStore.newPassword ?? ""}
        onChangeText={authenticationStore.setNewPassword}
        containerStyle={$textField}
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry
        label="New Password"
        placeholder="Enter new password"
        helper={error}
        status={error ? "error" : undefined}
      />

      <TextField
        value={authenticationStore.confirmPassword ?? ""}
        onChangeText={authenticationStore.setConfirmPassword}
        containerStyle={$textField}
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry
        label="Confirm Password"
        placeholder="Confirm new password"
        helper={error}
        status={error ? "error" : undefined}
      />

      <Button
        testID="reset-password-button"
        text="Reset Password"
        style={$tapButton}
        preset="reversed"
        onPress={resetPassword}
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

