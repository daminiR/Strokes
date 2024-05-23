import { observer } from "mobx-react-lite"
import React, { useEffect, useRef, useState, useMemo } from "react"
import { TextInput, Dimensions, TextStyle, ViewStyle, View } from "react-native"
import {
  Button,
  Screen,
  FilterModal,
  Text,
  SBItem,
  TextField,
  SelectField,
  Toggle,
  SportCard,
} from "../../components"
import { useStores } from "../../models"
import { goBack,AppStackScreenProps } from "../../navigators"
import { useFocusEffect } from '@react-navigation/native';

const PAGE_WIDTH = Dimensions.get("window").width
const PAGE_HEIGHT = Dimensions.get("window").height

interface ChatCardProp extends AppStackScreenProps<"ChartCardProps"> {}

export const ChatPreviewScreen: FC<ChatCardProp> = observer(function ChatPreviewScreen(_props: any) {
  const { chatStore } = useStores();
  const profile = chatStore.currentChatProfile;

  useFocusEffect(
    React.useCallback(() => {
      if (!profile) {
        // If profile does not exist, navigate back
        goBack();
      }
      return () => {
        // Optional: Any cleanup actions if needed when component loses focus
      };
    }, [profile])
  );

  return (
    <Screen preset="auto" style={$screenContentContainer} >
      {profile && <SportCard match={profile} />}
    </Screen>
  );
});
const $screenContentContainer: ViewStyle = {
  flex: 1,
  paddingVertical: 0,
  paddingHorizontal: 0,
  height: "100%",
  //justifyContent: "center", // Centers the swiper vertically
  //alignItems: "center", // Centers the swiper horizontally
}
