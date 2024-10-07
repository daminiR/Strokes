import { observer } from "mobx-react-lite"
import { navigate, goBack } from "../../navigators"
import { Alert } from "react-native"
import React, { FC, useState } from "react"
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
   const handleUnmatch = () => {
    mongoDBStore.unmatchPlayer(chatStore.currentChatProfile.matchId, "unmatched")
    navigate("ChatList")
  }

 // Function to handle the press action
  const handlePress = (item: any) => {
    if (item.label === "unmatch_player") {
      // Show alert dialog with options
      Alert.alert(
        "Unmatch Player",
        "Are you sure you want to unmatch this player?",
        [
          {
            text: "No, Don't",
            style: "cancel", // This button will just dismiss the alert
          },
          {
            text: "Yes, Unmatch",
            onPress: handleUnmatch, // Call the unmatch function on confirmation
          },
        ],
        { cancelable: true }
      )
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

