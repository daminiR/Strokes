import { observer } from "mobx-react-lite"
import { type ContentStyle } from "@shopify/flash-list"
import Config from 'react-native-config';
import { navigate, goBack} from "../navigators"
import React, {FC, useEffect, useRef, useState, useMemo} from "react"
import { isRTL, translate, TxKeyPath } from "../i18n"
import { useRoute, useNavigation} from '@react-navigation/native';
import { TextInput, TextStyle, ViewStyle, ScrollView, View} from "react-native"
import { UpdateProfileCard, ListView, ImagePickerWall, ListItem, ImageUploadComponent, Header, Button, Icon, Screen, Text, TextField, SelectField, Toggle } from "../components"
import { useStores } from "../models"

import { AppStackScreenProps, ProfileStackScreenProps} from "../navigators"
import { colors, spacing } from "../theme"

interface ProfileUpdateProps extends ProfileStackScreenProps<"ProfileUpdate"> {}

  export const ProfileUpdateScreen: FC<ProfileUpdateProps> = observer(function ProfileUpdateScreen(_props) {
  const authPasswordInput = useRef<TextInput>(null)
  const [signUpError, setSignUpError] = useState<string | null>(null)
  const route = useRoute()
  const shouldHydrate = route.params?.shouldHydrate;
  const { userStore, tempUserStore, authenticationStore } = useStores()
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [attemptsCount, setAttemptsCount] = useState(0)
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string[]>([])
  const tx = "Genders.gender"
  const i18nText = tx && translate(tx)
  const error = ""
  //useEffect(() => {
    //if (shouldHydrate) {
      //// Only hydrate from userStore if coming from Profile Welcome screen
      ////userStore.setImageFiles([
        ////{
          ////imageURL: "https://sport-aws-images.s3.amazonaws.com/all_images/0c951930-a533-4430-a582-5ce7ec6c61bc/20240304085248-30203d2574996d496b73-0c951930-a533-4430-a582-5ce7ec6c61bc-pic-0.jpg.jpeg",
          ////filePath: "all_images/0c951930-a533-4430-a582-5ce7ec6c61bc/20240304085248-30203d2574996d496b73-0c951930-a533-4430-a582-5ce7ec6c61bc-pic-0.jpg.jpeg",
          ////img_idx: 0,
        ////},
        ////{
          ////imageURL: "https://sport-aws-images.s3.amazonaws.com/all_images/0c951930-a533-4430-a582-5ce7ec6c61bc/20240304085248-e17ffbbd29ce6c01cb28-0c951930-a533-4430-a582-5ce7ec6c61bc-pic-1.jpg.jpeg",
          ////filePath: "ll_images/0c951930-a533-4430-a582-5ce7ec6c61bc/20240304085248-e17ffbbd29ce6c01cb28-0c951930-a533-4430-a582-5ce7ec6c61bc-pic-1.jpg.jpeg",
          ////img_idx: 1,
        ////},
        ////{
          ////imageURL: "https://sport-aws-images.s3.amazonaws.com/all_images/0c951930-a533-4430-a582-5ce7ec6c61bc/20240304085248-72f2288ae034de867efe-0c951930-a533-4430-a582-5ce7ec6c61bc-pic-2.jpg.jpeg",
          ////filePath: "all_images/0c951930-a533-4430-a582-5ce7ec6c61bc/20240304085248-72f2288ae034de867efe-0c951930-a533-4430-a582-5ce7ec6c61bc-pic-2.jpg.jpeg",
          ////img_idx: 2,
        ////},
      ////])
      //tempUserStore.hydrateFromUserStore();
      //setIsHydrated(true); // Set isHydrated to true once hydration is complete
    //}
    //// Cleanup or other logic remains unchangedJ
    //return () => {};
  //}, [shouldHydrate]);

const handleImagesUpdate = (images: ImageData[]) => {
    tempUserStore.setImageFiles(images); // Assuming your store has a method to update image files
  }

  const test = () => {
    authenticationStore.setIsAuthenticated(true)
  }
  console.log("Profile Update Temp", tempUserStore)
  const login = () => {
  authenticationStore.signUp().then((result) => {
    // If signUp is successful, navigate to the WelcomeScreen
      navigate("VerificationSignUp")
  }).catch((error: any) => {
    // Check for UsernameExistsException or UserNotConfirmedException
    if (error && error.code === "UserNotConfirmedException") {
      navigate("VerificationSignUp")
    }
    if (error && error.code === "UsernameExistsException") {
      setSignUpError(error.message || "An unknown error occurred during the sign-up process.")
    }
  });
};



  const profileDetails =[
  {
    label: "Phone Number",
    value: tempUserStore.phoneNumber,
    iconName: "phone",
    case: "phoneNumber",
  },
  {
    label: "Squash Level",
    value: tempUserStore.sport[0].game_level,
    iconName: "squash_level",
    case: "squash_level",
  },
  {
    label: "Email",
    value: tempUserStore.email,
    iconName: "email",
    case: "email",
  },
  {
    label: "First Name",
    value: tempUserStore.firstName,
    iconName: "account-circle",
    case: "firstName",
  },
  {
    label: "Last Name",
    value: tempUserStore.lastName,
    iconName: "account-circle",
    case: "lastName",
  },
  {
    label: "Description",
    value: tempUserStore.description,
    iconName: "description",
    case: "description",
  },
  {
    label: "Neighborhood",
    value: tempUserStore.neighborhood.city,
    iconName: "place",
    case: "neighborhoods",
  },
  {
    label: "Gender",
    value: tempUserStore.gender,
    iconName: "person",
    case: "gender",
  },
  {
    label: "Age",
    value: tempUserStore.age,
    iconName: "person",
    case: "age",
  }]


  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <Header leftIcon={"back"} onLeftPress={() => goBack()} />
      <Text testID="login-heading" tx="UpdateProfile.title" preset="heading" style={$signIn} />
      {attemptsCount > 2 && <Text tx="UpdateProfile.hint" size="sm" weight="light" style={$hint} />}
      <Text tx="UpdateProfile.details" preset="formLabel" style={$enterDetails} />
      <ImagePickerWall onImagesUpdate={handleImagesUpdate} isEditing={true}/>
      <ListView
        contentContainerStyle={$listContentContainer}
        data={profileDetails}
        estimatedItemSize={55}
        renderItem={({ item }) => (
          <ListItem
            title={item.label}
            detailText={item.value}
            //topSeparator={index !== 0}
            style={$listItem}
            topSeparator={true}
            rightIcon={"caretRight"}
            onPress={() => navigate("SingleUpdate", { field: `${item.case}`, isHydrated })}
          />
        )}
      />
    </Screen>
  )
})

const $listContentContainer: ContentStyle = {
  paddingHorizontal: spacing.md, // Adjust if necessary to align with the card's horizontal margin
  paddingTop: spacing.lg + spacing.xl,
  paddingBottom: spacing.lg,
}

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
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
