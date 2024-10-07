import { observer } from "mobx-react-lite"
import { navigate, goBack } from "../../navigators"
import React, { FC, useState, useCallback } from "react"
import { useStores } from "../../models"
import { colors } from "../../theme"
import { useHeader } from "../../utils/useHeader"
import { ListItem, ConfirmationModal, ListView, Screen } from "../../components"
import { ChatListStackScreenProps } from "../../navigators"
import { Alert } from "react-native" // Import Alert from React Native
import reportMethods from '../../config/reportMethods';
import { styles } from "./styles/ReportUserBehaviorScreen.styles"

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

  // Function to handle report creation after confirmation
  const confirmReport = (item: any) => {
    const reportData = {
      reporterId: userStore._id,
      reportedUserId: currentChatProfile.matchedUserId,
      reportType: item.label,
      description: item.quickMessage,
      status: "pending",
    }

    mongoDBStore
      .createReport(reportData)
      .then((response: any) => {
        if (response.success) {
          console.log("Report created successfully:", response.message)
          mongoDBStore.unmatchPlayer(currentChatProfile.matchId, "reported")
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

  // Function to show an Alert before reporting
  const handlePress = (item: any) => {
    Alert.alert(
      "Confirm Report",
      "Are you sure you want to report this user?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes, Report",
          onPress: () => confirmReport(item), // Call confirmReport if "Yes" is pressed
        },
      ],
      { cancelable: true }
    )
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
        contentContainerStyle={styles.listContentContainer}
        data={reportMethods}
        estimatedItemSize={55}
        renderItem={({ item }) => (
          <ListItem
            text={item.title}
            style={styles.listItem}
            topSeparator={true}
            bottomSeparator={true}
            rightIcon={"caretRight"}
            rightIconColor={item.hasMoreOptions ? colors.background : colors.background}
            onPress={() => handlePress(item)} // Call handlePress to show confirmation modal
          />
        )}
      />
    </Screen>
  )
})

