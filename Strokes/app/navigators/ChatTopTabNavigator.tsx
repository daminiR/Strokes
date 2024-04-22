import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {ChatScreen, ProfilePreviewScreen} from "app/screens"
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
        name="ProfileUpdate"
        component={ChatScreen}
        options={{ tabBarLabel: 'Update' }}
      />
      <ChatTopTab.Screen
        name="ProfilePreview"
        component={ChatScreen}
        options={{ tabBarLabel: 'Preview' }}
      />
    </ChatTopTab.Navigator>
  );
}

