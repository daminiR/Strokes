import { observer } from "mobx-react-lite"
import Config from 'react-native-config';
import React, {useEffect, useRef, useState, useMemo} from "react"
import { navigate, goBack} from "../navigators"
import { isRTL, translate, TxKeyPath } from "../i18n"
import { TextInput, TextStyle, ViewStyle, View } from "react-native"
import { Header, Button, Icon, Screen, Text, TextField, SelectField, Toggle } from "../components"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"

interface HelloScreenProps extends AppStackScreenProps<"Hello"> {}

export const HelloScreen: FC<HelloScreenProps> = observer(function HelloScreen(_props) {

  const { userStore, authenticationStore } = useStores()
  useEffect(() => {
    // Pre-fill logic if necessary
    return () => userStore.reset()
  }, [userStore])
  function login() {
    console.log("logged")
    //authenticationStore.signUp()

    //if (validationError) return

    // Reset fields and set the token on successful login
    //resetFields()
    //
  }

  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <Header leftIcon= {"back"} onLeftPress={() => goBack()}/>
      <Text testID="login-heading" tx="Hello.title" preset="heading" style={$signIn} />
      <Text tx="Hello.enterDetails" preset="subheading" style={$enterDetails} />

      <Button
        testID="login-button"
        tx="Hello.signIn"
        style={$tapButton}
        preset="reversed"
        onPress={()=>navigate("Login")}
      />
      <Button
        testID="login-button"
        tx="Hello.signUp"
        style={$tapButton}
        preset="reversed"
        onPress={()=>navigate("SignUp")}
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
