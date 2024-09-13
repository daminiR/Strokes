import { observer } from "mobx-react-lite"
import { navigate} from "../../navigators"
import React, { FC, useState, useEffect} from "react"
import { autorun } from 'mobx';
import { Image, TouchableOpacity, ImageStyle, View, ViewStyle } from "react-native"
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useStores } from "../../models"
import { ProfileStackScreenProps} from "../../navigators"
import { colors, spacing } from "../../theme"
import { useHeader } from "../../utils/useHeader"
import { useSafeAreaInsetsStyle } from "../../utils/useSafeAreaInsetsStyle"
import {
  Screen,
} from "../../components"

interface ProfileWelcomeScreen extends ProfileStackScreenProps<"ProfileWelcome"> {}

export const ProfileWelcomeScreen: FC<ProfileWelcomeScreen> = observer(function ProfileWelcomeScreen(_props) {
  const { navigation } = _props
  const {
    tempUserStore,
    userStore,
    authenticationStore: { logout },
  } = useStores()
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);

  useEffect(() => {
    const disposer = autorun(() => {
      const imageFile = userStore.imageSet.find((file) => file.img_idx === 0)
      console.log("imageFile", imageFile)
      setImageUri(imageFile ? (imageFile.uri ?? imageFile.imageURL) : undefined);
    })
    // Cleanup function to dispose of the autorun when the component unmounts
    return () => disposer()
  }, [userStore]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      tempUserStore.hydrateFromUserStore();
    });
    // Return the cleanup function
    return unsubscribe;
  }, [navigation]);

  useHeader(
    {
      rightIcon: "settings",
      onRightPress: () => navigate("Settings"),
    },
    [logout],
  )

  const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])

  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <View style={$container}>
        {/* Profile Image Container */}
        <View style={$profileImageContainer}>
          <Image
            source={{ uri: imageUri }}
            style={$profileImage}
          />
          <TouchableOpacity style={$editIconContainer}>
            <Icon
              name="edit"
              size={24}
              color={colors.text}
              onPress={() =>
                navigate("ProfileTopTabNavigator", {
                  screen: "ProfileUpdate",
                  params: { shouldHydrate: true },
                })
              }
            />
          </TouchableOpacity>
        </View>
        {/* Other components */}
      </View>
    </Screen>
  )
})

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

