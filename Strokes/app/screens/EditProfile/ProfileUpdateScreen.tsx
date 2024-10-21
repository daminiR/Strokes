import {observer} from "mobx-react-lite"
import {navigate, goBack, resetToInitialState} from "../../navigators"
import React, {FC, useState, useEffect} from "react"
import {useRoute} from '@react-navigation/native';
import {
  LoadingActivity,
  ListView,
  ImagePickerWall,
  ListItem,
  Header,
  Screen,
  Text,
} from "../../components"
import {useStores} from "../../models"
import {styles} from "./styles/ProfileUpdateScreen.styles";
import {ProfileStackScreenProps} from "../../navigators"

interface ProfileUpdateProps extends ProfileStackScreenProps<"ProfileUpdate"> {}

export const ProfileUpdateScreen: FC<ProfileUpdateProps> = observer(function ProfileUpdateScreen(_props) {
  const route = useRoute()
  const shouldHydrate = route.params?.shouldHydrate;
  const {mongoDBStore, userStore, tempUserStore, authenticationStore} = useStores()
  const [attemptsCount, setAttemptsCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false); // Add state for loading
  useEffect(() => {
    // Check if tempUserStore is hydrated, or if data is missing
    if (!tempUserStore.firstName || !tempUserStore.lastName) {
      // Redirect to ProfileHomeScreen if the tempUserStore is missing data after refresh
      goBack()
    }
  }, [tempUserStore]);

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
  const profileDetails = [
    {
      label: "Squash Level",
      value: tempUserStore?.sport?.gameLevel,
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
      value: tempUserStore?.neighborhood?.city,
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
      contentContainerStyle={styles.screenContentContainer}
      safeAreaEdges={["bottom"]}
    >
      <Header
        onLeftPress={() => goBack()}
        rightText="Save" leftText="Cancel"
        onRightPress={() => updateUserChanges()} />
      <Text testID="login-heading" tx="UpdateProfile.title" preset="heading" style={styles.signIn} />
      {attemptsCount > 2 && <Text tx="UpdateProfile.hint" size="sm" weight="light" style={styles.hint} />}
      <Text tx="UpdateProfile.details" preset="formLabel" style={styles.enterDetails} />
      <ImagePickerWall onImagesUpdate={handleImagesUpdate} isEditing={true} />
      <ListView
        contentContainerStyle={styles.listContentContainer}
        data={profileDetails}
        estimatedItemSize={55}
        renderItem={({item}) => (
          <ListItem
            title={item.label}
            detailText={item.value}
            //topSeparator={index !== 0}
            style={styles.listItem}
            topSeparator={true}
            rightIcon={"caretRight"}
            onPress={() =>
              navigate("SingleUpdate", {
                field: `${item.case}`,
                shouldHydrate: shouldHydrate
              })
            }
          />
        )}
      />
    </Screen>
  )
})

