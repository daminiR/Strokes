import { observer } from "mobx-react-lite"
import Config from 'react-native-config';
import React, {useEffect, useRef, useState, useMemo} from "react"
import { isRTL, translate, TxKeyPath } from "../i18n"
import { TextInput, TextStyle, ViewStyle, View } from "react-native"
import { Button, Icon, Screen, Text, TextField, SelectField, Toggle } from "../components"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"

interface ChatScreenProps extends AppStackScreenProps<"Chat"> {}

export const ChatScreen: FC<ChatScreenProps> = observer(function ChatScreen(_props) {
  const { userStore, authenticationStore } = useStores()
  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
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
