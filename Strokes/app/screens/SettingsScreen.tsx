import { observer } from "mobx-react-lite"
import { type ContentStyle } from "@shopify/flash-list"
import { navigate, goBack} from "../navigators"
import { translate } from "../i18n"
import React, { FC, useState } from "react"
import {
  Linking,
  TextStyle,
  ViewStyle,
} from "react-native"
import { useStores } from "../models"
import { ProfileStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
import { useHeader } from "../utils/useHeader"
import { useSafeAreaInsetsStyle } from "../utils/useSafeAreaInsetsStyle"
import {
  ImagePickerWall,
  ImageUploadComponent,
  ListItem,
  ListView,
  Header,
  Button,
  Screen,
  Text,
  TextField,
  SelectField,
  Toggle,
  LoadingActivity,
} from "../components"


interface SettingsScreen extends ProfileStackScreenProps<"Settings"> {}

export const SettingsScreen: FC<SettingsScreen> = observer(function SettingsScreen(_props) {
  const { userStore, authenticationStore } = useStores()
const [isLoading, setIsLoading] = useState(false);
  const { navigation } = _props
  const {
    authenticationStore: { logout },
  } = useStores()
  const openURL = (url) => {
    Linking.openURL(url).catch((err) => Alert.alert("Cannot open URL", err.message))
  };
  useHeader(
    {
      leftIcon: "back",
      onLeftPress: goBack,
    },
    [goBack],
  )

const handleLogout = async () => {
  //setIsLoading(true) // Start loading
  try {
    await authenticationStore.signOut()
  } finally {
    //setIsLoading(false) // Stop loading
  }
}
  const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])
  const settingsMethods = [
    {
      label: "Terms And Conditions",
      iconName: "phone",
      onPress: () => openURL(translate("settings.termsAndConditionsURL")),
    },
    {
      label: "Privacy Policy",
      iconName: "privacy",
      onPress: () => openURL(translate("settings.privacyPolicy")),
    },
    // Add more settings items as needed
  ]

   if (isLoading) {
     return <LoadingActivity />
   }

  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <ListView
        contentContainerStyle={$listContentContainer}
        data={settingsMethods}
        estimatedItemSize={55}
        renderItem={({ item }) => (
            <ListItem
              text={item.label}
              style={$listItem}
              topSeparator={true}
              bottomSeparator={true}
              rightIcon={"caretRight"}
              onPress={item.onPress}

            />
        )}
      />
      <Button
        testID="login-button"
        tx="UpdateProfile.logout"
        style={$tapButton}
        preset="reversed"
        onPress={handleLogout}
      />
    </Screen>
  )
})

const $listContentContainer: ContentStyle = {
  paddingHorizontal: spacing.md, // Adjust if necessary to align with the card's horizontal margin
  paddingTop: spacing.lg + spacing.xl,
  paddingBottom: spacing.lg,
}

const $listItem: ViewStyle = {
  paddingHorizontal: spacing.lg,
};

const $hint: TextStyle = {
  color: colors.tint,
  marginBottom: spacing.md,
}

const $tapButton: ViewStyle = {
  marginTop: spacing.xs,
}

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
}
