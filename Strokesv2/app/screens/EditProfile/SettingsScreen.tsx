import { observer } from "mobx-react-lite"
import { goBack} from "../../navigators"
import { translate } from "../../i18n"
import React, { FC, useState } from "react"
import {
  Linking,
} from "react-native"
import { useStores } from "../../models"
import { ProfileStackScreenProps } from "../../navigators"
import { styles } from "./styles/SettingsScreen.styles"
import { useHeader } from "../../utils/useHeader"
import {
  ListItem,
  ListView,
  Button,
  Screen,
  LoadingActivity,
} from "../../components"


interface SettingsScreen extends ProfileStackScreenProps<"Settings"> {}

export const SettingsScreen: FC<SettingsScreen> = observer(function SettingsScreen(_props) {
  const { authenticationStore } = useStores()
const [isLoading, setIsLoading] = useState(false);
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
const handleLogout = () => {
  setIsLoading(true) // Start loading
  authenticationStore
    .signOut()
    .then(() => {
      setIsLoading(false) // Stop loading after successful sign out
      // Handle any additional logic after sign out, if needed
      //navigate("Hello")
    })
    .catch((error: any) => {
      setIsLoading(false) // Stop loading before handling the error
      console.error("Logout failed:", error.message || error)
      // Handle the error state here to display the error message in your component, if needed
    })
}
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
      contentContainerStyle={styles.screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      {isLoading ? (
        <LoadingActivity />
      ) : (
        <>
      <ListView
        contentContainerStyle={styles.listContentContainer}
        data={settingsMethods}
        estimatedItemSize={55}
        renderItem={({ item }) => (
            <ListItem
              text={item.label}
              style={styles.listItem}
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
        style={styles.tapButton}
        preset="reversed"
        onPress={handleLogout}
      />
        </>
      )}
    </Screen>
  )
})
