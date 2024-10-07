import {observer} from "mobx-react-lite"
import React, {useState, ComponentType} from "react"
import {Alert} from "react-native"
import {Header, Button, Screen, Text, Icon, TextField, TextFieldAccessoryProps} from "../../components"
import {navigate, goBack} from "../../navigators"
import {colors} from "../../theme"
import {useStores} from "../../models"
import {storePasswordSecurely} from "../../models/AuthenticationStore"
import {styles} from "./styles/ForgotPasswordNewPassword.styles"

interface ForgotPasswordNewPasswordScreenProps {}

export const ForgotPasswordNewPasswordScreen: FC<ForgotPasswordNewPasswordScreenProps> = observer(function ForgotPasswordNewPasswordScreen(_props) {
  const {userStore, authenticationStore} = useStores()
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isNewPasswordHidden, setIsNewPasswordHidden] = useState(true) // Add toggle for new password visibility
  const [isConfirmPasswordHidden, setIsConfirmPasswordHidden] = useState(true) // Add toggle for confirm password visibility

  const resetPassword = () => {
    if (!authenticationStore.verificationPhoneCode || !newPassword) {
      setError("Please enter both the verification code and the new password.")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please make sure both passwords are identical.")
      return
    }

    setIsLoading(true)
    authenticationStore
      .resetPassword(newPassword)
      .then(() => {
        //alert("Password successfully reset.")
        authenticationStore.setProp("isPasswordRecentlyUpdated", true);

        // Ask the user if they want to store the new password with Face ID
        Alert.alert(
          "Password Updated",
          "Your password has been successfully reset. Do you want to save it using Face ID?",
          [{
            text: "No",
            onPress: () => {
              console.log("User opted not to store password with Face ID");
              navigate("Login"); // Go back to login screen
            },
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: async () => {
              await storePasswordSecurely(userStore.phoneNumber, newPassword, authenticationStore); // Store the password securely
              console.log("Password stored securely with Face ID.");
              navigate("Login"); // Go back to login screen
            },
          },
          ],
          {cancelable: false}
        );
      })
      .catch((err) => {
        setIsLoading(false)
        setError(err.message || "Error resetting password.")
      })
  }
  const PasswordRightAccessory: ComponentType<TextFieldAccessoryProps> = (props) => (
    <Icon
      icon={isNewPasswordHidden ? "view" : "hidden"}
      color={colors.palette.neutral800}
      containerStyle={props.style}
      size={20}
      onPress={() => setIsNewPasswordHidden(!isNewPasswordHidden)}
    />
  )
  const ConfirmPasswordRightAccessory: ComponentType<TextFieldAccessoryProps> = (props) => (
    <Icon
      icon={isConfirmPasswordHidden ? "view" : "hidden"}
      color={colors.palette.neutral800}
      containerStyle={props.style}
      size={20}
      onPress={() => setIsConfirmPasswordHidden(!isConfirmPasswordHidden)}
    />
  )

  return (
    <Screen
      preset="auto"
      contentContainerStyle={styles.screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <Header leftIcon={"back"} onLeftPress={() => goBack()} />
      <Text testID="new-password-heading" text="Reset Password" preset="heading" style={styles.signIn} />
      <Text text="Enter the verification code and your new password" preset="subheading" style={styles.enterDetails} />

      <TextField
        value={authenticationStore.verificationPhoneCode ?? ""}
        onChangeText={authenticationStore.setVerificationPhoneCode}  // Set verification code
        containerStyle={styles.textField}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="number-pad"
        label="Verification Code"
        placeholder="Enter verification code"
        helper={error}
        status={error ? "error" : undefined}
      />

      <TextField
        value={newPassword}
        onChangeText={setNewPassword}  // Set new password
        containerStyle={styles.textField}
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry={isNewPasswordHidden}
        RightAccessory={PasswordRightAccessory}  // Show the password icon
        label="New Password"
        placeholder="Enter new password"
        helper={error}
        status={error ? "error" : undefined}
      />
      <TextField
        value={confirmPassword}
        onChangeText={setConfirmPassword}  // Set confirm password
        containerStyle={styles.textField}
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry={isConfirmPasswordHidden}
        RightAccessory={ConfirmPasswordRightAccessory}
        label="Confirm Password"
        placeholder="Re-enter new password"
        helper={error}
        status={error ? "error" : undefined}
      />

      <Button
        testID="reset-password-button"
        text="Reset Password"
        style={styles.tapButton}
        preset="reversed"
        onPress={resetPassword}
        loading={isLoading}
      />
    </Screen>
  )
})
