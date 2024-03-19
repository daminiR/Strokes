import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {ProfileUpdateScreen, ProfilePreviewScreen} from "app/screens"

const ProfileTopTab = createMaterialTopTabNavigator();
import { useHeader } from "../utils/useHeader"

export function ProfileTopTabNavigator() {
  useHeader(
    {
      leftIcon: "back",
    },
    [],
  )
  return (
    <ProfileTopTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#e91e63',
        tabBarIndicatorStyle: { backgroundColor: '#e91e63' },
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
