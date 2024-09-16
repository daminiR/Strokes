import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {ProfileUpdateScreen, ProfilePreviewScreen} from "app/screens"
import { TextStyle, ViewStyle } from "react-native"
import { goBack} from "../navigators"
import { colors, spacing, typography } from "../theme"

const ProfileTopTab = createMaterialTopTabNavigator();
import { useHeader } from "../utils/useHeader"

export function ProfileTopTabNavigator() {
  useHeader(
    {
      leftIcon: "back",
      onLeftPress: () => goBack(),
    },
    [],
  )
  return (
    <ProfileTopTab.Navigator
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
      <ProfileTopTab.Screen
        name="ProfileUpdate"
        component={ProfileUpdateScreen}
        options={{ tabBarLabel: 'Update' }}
      />
      <ProfileTopTab.Screen
        name="ProfilePreview"
        component={ProfilePreviewScreen}
        options={{ tabBarLabel: 'Preview' }}
      />
    </ProfileTopTab.Navigator>
  );
}


const $tabBarItem: ViewStyle = {
  paddingTop: spacing.md,
}
const $tabBarLabel: TextStyle = {
  fontSize: 14,
  fontFamily: typography.primary.medium,
  lineHeight: 16,
}
