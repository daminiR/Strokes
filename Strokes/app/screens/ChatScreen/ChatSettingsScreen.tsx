import { observer } from "mobx-react-lite"
import { type ContentStyle } from "@shopify/flash-list"
import { navigate, goBack} from "../../navigators"
import { translate } from "../../i18n"
import React, { FC, useEffect, useState } from "react"
import { Linking, TextStyle, ViewStyle } from "react-native"
import { useStores } from "../../models"
import settingsMethods from '../../config/settingsMethods';
import { colors, spacing } from "../../theme"
import { useHeader } from "../../utils/useHeader"
import { useSafeAreaInsetsStyle } from "../../utils/useSafeAreaInsetsStyle"
import { ConfirmationModal, ListItem, ListView, Button, Screen } from "../../components"
import { ChatListStackScreenProps } from "../../navigators"


interface ChatSettingsScreen extends ChatListStackScreenProps<"ChatSettings"> {}
export const ChatSettingsScreen: FC<ChatSettingsScreen> = observer(function ChatSettingsScreen(_props) {
  const { userStore, authenticationStore } = useStores()
  const {
    authenticationStore: { logout },
  } = useStores()
  const openURL = (url) => {
    Linking.openURL(url).catch((err) => Alert.alert("Cannot open URL", err.message))
  };
  const [isVisible, setIsVisible] = useState(false)
  const [currentReportObj, setReportObj] = useState(null)
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
    if (item.hasMoreOptions) {
      navigate("ChatReport")
    } else {
      setReportObj({
        quickMessage: item.quickMessage,
        title: item.title,
        label: item.label,
      })
    }
    setIsVisible(true)
  }
  const [modalState, setModalState] = useState({ isVisible: false, mode: '' });
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
      />
      <ListView
        contentContainerStyle={$listContentContainer}
        data={settingsMethods}
        estimatedItemSize={55}
        renderItem={({ item }) => (
            <ListItem
              text={item.label}
              style={$listItem}
              topSeparator={true}
              bottomSeparator={true}
              rightIcon={item.hasMoreOptions ? "caretRight" : null} // Conditionally set the right icon
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
