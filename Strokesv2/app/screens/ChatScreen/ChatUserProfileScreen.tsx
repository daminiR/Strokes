import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { Screen, SportCard } from "../../components"
import { useStores } from "../../models"
import { goBack, AppStackScreenProps } from "../../navigators"
import { useFocusEffect } from "@react-navigation/native"
import { styles } from "./styles/ChatUserProfileScreen.styles"

interface ChatCardProp extends AppStackScreenProps<"ChartCardProps"> {}

export const ChatPreviewScreen: FC<ChatCardProp> = observer(function ChatPreviewScreen(_props: any) {
  const { chatStore } = useStores()
  const profile = chatStore.currentChatProfile

  useFocusEffect(
    React.useCallback(() => {
      if (!profile) {
        goBack() // Navigate back if profile does not exist
      }
    }, [profile]),
  )

  return (
    <Screen preset="auto" style={styles.screenContentContainer}>
      {profile && <SportCard match={profile} />}
    </Screen>
  )
})

