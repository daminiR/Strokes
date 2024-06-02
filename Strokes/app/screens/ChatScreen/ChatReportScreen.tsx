import { observer } from "mobx-react-lite"
import { type ContentStyle } from "@shopify/flash-list"
import { navigate, goBack } from "../../navigators"
import React, { FC, useState, useCallback } from "react"
import { Linking, TextStyle, ViewStyle } from "react-native"
import { useStores } from "../../models"
import { colors, spacing } from "../../theme"
import { useHeader } from "../../utils/useHeader"
import { ListItem, ConfirmationModal, ListView, Button, Screen } from "../../components"
import { ChatListStackScreenProps } from "../../navigators"
import reportMethods from '../../config/reportMethods';

interface ChatReportScreen extends ChatListStackScreenProps<"ChatReport"> {}

export const ChatReportScreen: FC<ChatReportScreen> = observer(function ChatSettingsScreen(_props) {
  const { userStore, authenticationStore } = useStores()
  const {
    chatStore,
    mongoDBStore,
    authenticationStore: { logout },
  } = useStores()
  const currentChatProfile = chatStore.currentChatProfile;
  const [isVisible, setIsVisible] = useState(false)
  const [, updateState] = useState({});
  const forceUpdate = useCallback(() => updateState({}), [])
  const [currentReportObj, setReportObj] = useState(null)
  const onDone = () => {
    navigate("ChatList")
  }
  const onClose = () => {
    setIsVisible(false)
  }
  useHeader(
    {
leftIcon: "back",
      onLeftPress: goBack,
    },
    [goBack],
  )
  const handlePress = (item: any) => {
    const reportData = {
      reporterId: userStore._id, // This should come from your user context or a similar source
      reportedUserId: currentChatProfile.matchedUserId, // Assuming `userId` is the ID of the reported user
      reportType: item.label, // Type of the report
      description: item.quickMessage, // Detailed description of the report
      status: "pending", // Default status, assumed to be handled on the backend too
    }
    mongoDBStore
      .createReport(reportData)
      .then((response: any) => {
        if (response.success) {
          console.log("Report created successfully:", response.message)
          mongoDBStore.unmatchPlayer(currentChatProfile.matchId, forceUpdate)
          // You need to define this function or ensure it's imported if defined elsew
          setReportObj({
            quickMessage: item.quickMessage,
            title: item.title,
            label: item.label,
          })
          setIsVisible(true)
        } else {
          alert(`Failed to create report: ${response.message}`)
        }
      })
      .catch((error: any) => {
        alert(`Error creating report: ${error.message}`)
      })
  }
return (
  <Screen preset="auto" safeAreaEdges={["top", "bottom"]}>
    <ConfirmationModal
      isVisible={isVisible}
      onClose={onClose}
      quickMessage={currentReportObj ? currentReportObj.quickMessage : ""}
      onDone={onDone}
    />
    <ListView
      contentContainerStyle={$listContentContainer}
      data={reportMethods}
      estimatedItemSize={55}
      renderItem={({ item }) => (
        <ListItem
          text={item.title}
          style={$listItem}
          topSeparator={true}
          bottomSeparator={true}
          rightIcon={"caretRight"}
          rightIconColor={item.hasMoreOptions ? colors.background : colors.background}
          onPress={() => handlePress(item)}
        />
      )}
    />
  </Screen>
)
})

const $listContentContainer: ContentStyle = {
  paddingHorizontal: spacing.md, // Adjust if necessary to align with the card's horizontal margin
  paddingTop: spacing.lg + spacing.xl,
  paddingBottom: spacing.lg,
}

const $listItem: ViewStyle = {
  paddingHorizontal: spacing.lg,
};

const $hint: TextStyle = {
  color: colors.tint,
  marginBottom: spacing.md,
}

const $tapButton: ViewStyle = {
  marginTop: spacing.xs,
}

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
}
