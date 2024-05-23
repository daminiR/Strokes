import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { TextStyle, ViewStyle } from "react-native"
import { colors, spacing, typography } from "../theme"
import {ChatScreen, ChatPreviewScreen} from "app/screens"
import { navigate, goBack} from "../navigators"

const ChatTopTab = createMaterialTopTabNavigator();
import { useHeader } from "../utils/useHeader"

export function ChatTopTabNavigator() {
  useHeader(
    {
      leftIcon: "back",
      onLeftPress: () => goBack(),
    },
    [],
  )
  return (
    <ChatTopTab.Navigator
      screenOptions={{
        //tabBarActiveTintColor: "#e91e63",
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.text,
        tabBarLabelStyle: $tabBarLabel,
        tabBarItemStyle: $tabBarItem,
        tabBarIndicatorStyle: { backgroundColor: colors.tint },
        tabBarStyle: {
          backgroundColor: "#fff",
          height: 48, // Reduce the height to make tabs less bulky
          paddingTop: 4,
          paddingBottom: 4,
        },
      }}
    >
      <ChatTopTab.Screen name="Chat" component={ChatScreen} options={{ tabBarLabel: "Chat" }} />
      <ChatTopTab.Screen
        name="ChatProfilePreview"
        component={ChatPreviewScreen}
        options={{ tabBarLabel: "Preview" }}
      />
    </ChatTopTab.Navigator>
  )
}

const $tabBar: ViewStyle = {
  backgroundColor: colors.background,
  borderTopColor: colors.transparent,
}

const $tabBarItem: ViewStyle = {
  paddingTop: spacing.md,
}

const $tabBarLabel: TextStyle = {
  fontSize: 14,
  fontFamily: typography.primary.medium,
  lineHeight: 16,
}
