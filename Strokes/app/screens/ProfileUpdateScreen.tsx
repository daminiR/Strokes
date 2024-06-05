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
  const { mongoDBStore, userStore, tempUserStore, authenticationStore } = useStores()
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [attemptsCount, setAttemptsCount] = useState(0)
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string[]>([])
  const tx = "Genders.gender"
  const i18nText = tx && translate(tx)
  const error = ""
  const handleImagesUpdate = (images: ImageData[]) => {
  tempUserStore.setImageSet(images) // Assuming your store has a method to update image files
}
const updateUserChanges = async () => {
  await mongoDBStore.updateUserInMongoDB()
  navigate("ProfileWelcome")
}
  const test = () => {
    authenticationStore.setIsAuthenticated(true)
  }
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
    label: "Squash Level",
    value: tempUserStore.sport.gameLevel,
    iconName: "squash_level",
    case: "squash_level",
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
      safeAreaEdges={[ "bottom"]}
    >
      <Header
      onLeftPress={() => goBack()}
      rightText="Save" leftText="Cancel"
      onRightPress={() => updateUserChanges()}/>
      <Text testID="login-heading" tx="UpdateProfile.title" preset="heading" style={$signIn} />
      {attemptsCount > 2 && <Text tx="UpdateProfile.hint" size="sm" weight="light" style={$hint} />}
      <Text tx="UpdateProfile.details" preset="formLabel" style={$enterDetails} />
      <ImagePickerWall onImagesUpdate={handleImagesUpdate} isEditing={true} />
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

            onPress={() =>
              navigate("SingleUpdate", {
            field: `${item.case}`,
            shouldHydrate: shouldHydrate })
            }
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
  //paddingVertical: spacing.xxl,
  marginTop: 0,
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
