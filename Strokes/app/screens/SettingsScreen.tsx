import { observer } from "mobx-react-lite"
import { type ContentStyle } from "@shopify/flash-list"
import { navigate, goBack} from "../navigators"
import { translate } from "../i18n"
import React, { FC } from "react"
import { Image, Linking, TouchableOpacity, ImageStyle, TextStyle, View, ViewStyle } from "react-native"
import Icon from 'react-native-vector-icons/MaterialIcons';
import { isRTL } from "../i18n"
import { useStores } from "../models"
import { AppStackScreenProps, ProfileStackScreenProps} from "../navigators"
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
} from "../components"


interface SettingsScreen extends ProfileStackScreenProps<"Settings"> {}

export const SettingsScreen: FC<SettingsScreen> = observer(function SettingsScreen(_props) {
  const { userStore, authenticationStore } = useStores()
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
        onPress={authenticationStore.signOut}
      />
    </Screen>
  )
})

const $listContentContainer: ContentStyle = {
  paddingHorizontal: spacing.md, // Adjust if necessary to align with the card's horizontal margin
  paddingTop: spacing.lg + spacing.xl,
  paddingBottom: spacing.lg,
}


const $signIn: TextStyle = {
  marginBottom: spacing.sm,
}

const $listItem: ViewStyle = {
  paddingHorizontal: spacing.lg,
};
const $enterDetails: TextStyle = {
  marginBottom: spacing.lg,
}

const $hint: TextStyle = {
  color: colors.tint,
  marginBottom: spacing.md,
}

const $textField: ViewStyle = {
  marginBottom: spacing.lg,
}

const $tapButton: ViewStyle = {
  marginTop: spacing.xs,
}
const $inputWrapperStyle: ViewStyle = {
  marginBottom: spacing.lg,
  flexDirection: "row", // Aligns children side by side
  justifyContent: "space-around", // Distributes children evenly with space around them
  alignItems: "center", // Centers children vertically in the container
  flexWrap: "wrap", // Allows items to wrap to the next line if the container is too narrow
  backgroundColor: colors.palette.neutral200,
  overflow: "hidden",
}

const $profileImageContainer: ViewStyle = {
  position: 'relative',
};

const $profileImage: ImageStyle = {
  height: 120, // Adjust size as needed
  width: 120, // Adjust size as needed
  borderRadius: 60, // Make it circular
};

const $editIconContainer: ViewStyle = {
  position: 'absolute',
  top: -10, // Adjust if necessary to ensure it's positioned correctly at the top
  right: -10, // Adjust if necessary to move it to the right side
  backgroundColor: '#FFFFFF', // White background for the icon
  borderColor: '#000000', // Black border color
  borderWidth: 2, // Border width
  borderRadius: 20, // Ensure this is half of the height/width to make it circular
  padding: 5, // Padding inside the icon background
  alignItems: 'center', // Center the icon horizontally
  justifyContent: 'center', // Center the icon vertically
  width: 40, // Width of the icon container; adjust as needed
  height: 40, // Height of the icon container; adjust as needed
};

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
}
const $container: ViewStyle = {
  flex: 1,
  justifyContent: 'center', // Center content vertically
  alignItems: 'center', // Center content horizontally
  backgroundColor: colors.background,
};
const $topContainer: ViewStyle = {
  flexShrink: 1,
  flexGrow: 1,
  flexBasis: "57%",
  justifyContent: "center",
  paddingHorizontal: spacing.lg,
}

const $bottomContainer: ViewStyle = {
  flexShrink: 1,
  flexGrow: 0,
  flexBasis: "43%",
  backgroundColor: colors.palette.neutral100,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  paddingHorizontal: spacing.lg,
  justifyContent: "space-around",
}
const $welcomeLogo: ImageStyle = {
  height: 88,
  width: "100%",
  marginBottom: spacing.xxl,
}

const $welcomeFace: ImageStyle = {
  height: 169,
  width: 269,
  position: "absolute",
  bottom: -47,
  right: -80,
  transform: [{ scaleX: isRTL ? -1 : 1 }],
}

const $welcomeHeading: TextStyle = {
  marginBottom: spacing.md,
}
