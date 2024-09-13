import { observer } from "mobx-react-lite"
import { type ContentStyle } from "@shopify/flash-list"
import { navigate, goBack} from "../../navigators"
import React, {FC, useRef, useState} from "react"
import { translate } from "../../i18n"
import { useRoute} from '@react-navigation/native';
import { TextInput, TextStyle, ViewStyle } from "react-native"
import {
  LoadingActivity,
  ListView,
  ImagePickerWall,
  ListItem,
  Header,
  Screen,
  Text,
} from "../../components"
import { useStores } from "../../models"

import { ProfileStackScreenProps} from "../../navigators"
import { colors, spacing } from "../../theme"

interface ProfileUpdateProps extends ProfileStackScreenProps<"ProfileUpdate"> {}

export const ProfileUpdateScreen: FC<ProfileUpdateProps> = observer(function ProfileUpdateScreen(_props) {
  const [signUpError, setSignUpError] = useState<string | null>(null)
  const route = useRoute()
  const shouldHydrate = route.params?.shouldHydrate;
  const { mongoDBStore, userStore, tempUserStore, authenticationStore } = useStores()
  const [attemptsCount, setAttemptsCount] = useState(0)
   const [isLoading, setIsLoading] = useState(false); // Add state for loading
  const handleImagesUpdate = (images: ImageData[]) => {
  tempUserStore.setImageSet(images) // Assuming your store has a method to update image files
}
const updateUserChanges = async () => {
  setIsLoading(true) // Start loading
  try {
    await mongoDBStore.updateUserInMongoDB()
    navigate("ProfileWelcome")
  } finally {
    setIsLoading(false) // Stop loading
  }
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
   if (isLoading) {
     return <LoadingActivity />
   }

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
