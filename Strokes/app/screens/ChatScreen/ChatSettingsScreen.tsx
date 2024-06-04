import { observer } from "mobx-react-lite"
import { type ContentStyle } from "@shopify/flash-list"
import { navigate, goBack} from "../../navigators"
import React, { FC, useEffect, useState, useCallback} from "react"
import { Linking, TextStyle, ViewStyle } from "react-native"
import { useStores } from "../../models"
import settingsMethods from '../../config/settingsMethods';
import { colors, spacing } from "../../theme"
import { useHeader } from "../../utils/useHeader"
import { ConfirmationModal, ListItem, ListView, Button, Screen } from "../../components"
import { ChatListStackScreenProps } from "../../navigators"


interface ChatSettingsScreen extends ChatListStackScreenProps<"ChatSettings"> {}
export const ChatSettingsScreen: FC<ChatSettingsScreen> = observer(function ChatSettingsScreen(_props) {
  const { mongoDBStore, userStore, authenticationStore, chatStore } = useStores()
  const {
    authenticationStore: { logout },
  } = useStores()
  const [isVisible, setIsVisible] = useState(false)
  const [currentReportObj, setReportObj] = useState(null)
  const onDone = () => {
    navigate("ChatList")
  }
  const onClose = () => {
    setIsVisible(false)
  }
  const [, updateState] = useState({});
  const forceUpdate = useCallback(() => updateState({}), [])
  useHeader(
    {
      leftIcon: "back",
      onLeftPress: goBack,
    },
    [goBack],
  )
  const handlePress = (item: any) => {
    if (item.label === "unmatch_player") {
      // Call the unmatchPlayer function, assuming it's defined elsewhere in your context
      mongoDBStore.unmatchPlayer(chatStore.currentChatProfile.matchId, "unmatched")
      setReportObj({
        quickMessage: item.quickMessage,
        title: item.title,
        label: item.label,
      })
      setIsVisible(true)
    } else if (item.hasMoreOptions) {
      navigate("ChatReport")
    }

      //setIsVisible(true)
  }
  const [modalState, setModalState] = useState({ isVisible: false, mode: "" })
  // Add more settings items as needed

  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <ConfirmationModal
        isVisible={isVisible}
        onClose={onClose}
        quickMessage={currentReportObj ? currentReportObj.quickMessage : ""}
        onDone={onDone}
      />
      <ListView
        contentContainerStyle={$listContentContainer}
        data={settingsMethods}
        estimatedItemSize={55}
        renderItem={({ item }) => (
          <ListItem
            text={item.title}
            style={$listItem}
            topSeparator={true}
            bottomSeparator={true}
            rightIcon={"caretRight"} // Conditionally set the right icon
            rightIconColor={item.hasMoreOptions ? colors.text : colors.background}
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
