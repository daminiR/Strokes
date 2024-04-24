import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
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
        tabBarActiveTintColor: '#e91e63',
        tabBarIndicatorStyle: { backgroundColor: '#e91e63' },
      }}
    >
      <ChatTopTab.Screen
        name="Chat"
        component={ChatScreen}
        options={{ tabBarLabel: 'Update' }}
      />
      <ChatTopTab.Screen
        name="ChatProfilePreview"
        component={ChatPreviewScreen}
        options={{ tabBarLabel: 'Preview' }}
      />
    </ChatTopTab.Navigator>
  );
}

