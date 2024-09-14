import { observer } from "mobx-react-lite"
import { navigate, goBack } from "../../navigators"
import React, { FC, useState, useCallback } from "react"
import { useStores } from "../../models"
import settingsMethods from "../../config/settingsMethods"
import { useHeader } from "../../utils/useHeader"
import { ConfirmationModal, ListItem, ListView, Screen } from "../../components"
import { ChatListStackScreenProps } from "../../navigators"
import { styles } from "./styles/ChatSettingsScreen.styles"

interface ChatSettingsScreenProps extends ChatListStackScreenProps<"ChatSettings"> {}

export const ChatSettingsScreen: FC<ChatSettingsScreenProps> = observer(function ChatSettingsScreen(_props) {
  const { mongoDBStore, chatStore } = useStores()
  const [isVisible, setIsVisible] = useState(false)
  const [currentReportObj, setReportObj] = useState(null)

  useHeader(
    {
      leftIcon: "back",
      onLeftPress: goBack,
    },
    [goBack],
  )

  const handlePress = (item: any) => {
    if (item.label === "unmatch_player") {
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
  }

  const onDone = () => navigate("ChatList")
  const onClose = () => setIsVisible(false)

  return (
    <Screen
      preset="auto"
      contentContainerStyle={styles.screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <ConfirmationModal
        isVisible={isVisible}
        onClose={onClose}
        quickMessage={currentReportObj ? currentReportObj.quickMessage : ""}
        onDone={onDone}
      />
      <ListView
        contentContainerStyle={styles.listContentContainer}
        data={settingsMethods}
        estimatedItemSize={55}
        renderItem={({ item }) => (
          <ListItem
            text={item.title}
            style={styles.listItem}
            topSeparator
            bottomSeparator
            rightIcon="caretRight"
            rightIconColor={item.hasMoreOptions ? "black" : "transparent"}
            onPress={() => handlePress(item)}
          />
        )}
      />
    </Screen>
  )
})

