import { observer } from "mobx-react-lite"
import { navigate, goBack} from "../navigators"
import React, { FC, useEffect} from "react"
import { Image, TouchableOpacity, ImageStyle, TextStyle, View, ViewStyle } from "react-native"
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
  Header,
  Button,
  Screen,
  Text,
  TextField,
  SelectField,
  Toggle,
} from "../components"

const welcomeLogo = require("../../assets/images/logo.png")
const welcomeFace = require("../../assets/images/welcome-face.png")

interface ProfileWelcomeScreen extends ProfileStackScreenProps<"ProfileWelcome"> {}

export const ProfileWelcomeScreen: FC<ProfileWelcomeScreen> = observer(function ProfileWelcomeScreen(_props) {
  const { navigation } = _props
  const {
    tempUserStore,
    authenticationStore: { logout },
  } = useStores()

  //function goNext() {
    //navigation.navigate("Demo", { screen: "DemoShowroom", params: {} })
  //}
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Your hydration logic here
      //userStore.setImageFiles([
        //{
          //imageURL: "https://sport-aws-images.s3.amazonaws.com/all_images/0c951930-a533-4430-a582-5ce7ec6c61bc/20240304085248-30203d2574996d496b73-0c951930-a533-4430-a582-5ce7ec6c61bc-pic-0.jpg.jpeg",
          //filePath: "all_images/0c951930-a533-4430-a582-5ce7ec6c61bc/20240304085248-30203d2574996d496b73-0c951930-a533-4430-a582-5ce7ec6c61bc-pic-0.jpg.jpeg",
          //img_idx: 0,
        //},
        //{
          //imageURL: "https://sport-aws-images.s3.amazonaws.com/all_images/0c951930-a533-4430-a582-5ce7ec6c61bc/20240304085248-e17ffbbd29ce6c01cb28-0c951930-a533-4430-a582-5ce7ec6c61bc-pic-1.jpg.jpeg",
          //filePath: "ll_images/0c951930-a533-4430-a582-5ce7ec6c61bc/20240304085248-e17ffbbd29ce6c01cb28-0c951930-a533-4430-a582-5ce7ec6c61bc-pic-1.jpg.jpeg",
          //img_idx: 1,
        //},
        //{
          //imageURL: "https://sport-aws-images.s3.amazonaws.com/all_images/0c951930-a533-4430-a582-5ce7ec6c61bc/20240304085248-72f2288ae034de867efe-0c951930-a533-4430-a582-5ce7ec6c61bc-pic-2.jpg.jpeg",
          //filePath: "all_images/0c951930-a533-4430-a582-5ce7ec6c61bc/20240304085248-72f2288ae034de867efe-0c951930-a533-4430-a582-5ce7ec6c61bc-pic-2.jpg.jpeg",
          //img_idx: 2,
        //},
      //])
      tempUserStore.hydrateFromUserStore();
    });

    // Return the cleanup function
    return unsubscribe;
  }, [navigation, tempUserStore]);

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
            source={{ uri: "https://pbs.twimg.com/media/FjU2lkcWYAgNG6d.jpg" }}
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
