import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { Image, ImageStyle, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import {
  CircularPlayerRatingBar,
  PlayerDetails,
  PlayerRatingBar,
  Header,
  Card,
  Button,
  ListItem,
  AutoImage,
  Screen,
  Text,
} from "../components"
import { AppStackScreenProps, ProfileStackScreenProps} from "../navigators"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import { spacing } from "../theme"
import { useStores } from "../models"
import Icon from 'react-native-vector-icons/MaterialIcons';

interface ProfilePreviewScreen extends ProfileStackScreenProps<"ProfilePreview"> {}

export const ProfilePreviewScreen: FC<ProfilePreviewScreen> = observer(
  function ProfilePreviewScreen(_props) {
    const { tempUserStore, authenticationStore } = useStores()
    // Utility function to get the correct image URI
    const getImageUri = (imageObj) => {
      return imageObj?.imageURL || imageObj?.uri
    }
      // Function to render image or default icon
  const renderImageOrIcon = (image, index) => {
    const uri = getImageUri(image);
    return uri ? (
      <Image key={index} source={{ uri }} style={$autoImage} />
    ) : (
      <View style={$iconContainer}>
        <Icon name="camera-alt" size={300} color="#000" style={$cameraIcon} />
      </View>
    )
  };

    return (
      <View style={$containerWithFAB}>
        <Screen preset="auto" contentContainerStyle={$container} safeAreaEdges={["top", "bottom"]}>
          <Header
            title={tempUserStore.firstName}
            safeAreaEdges={[]}
          />
          {/* Ensure you have a valid index check for tempUserStore.imageSet */}
          {tempUserStore.imageSet[0] && (
            <View style={$profileImageContainer}>
              {tempUserStore.imageSet[0]
                ? renderImageOrIcon(tempUserStore.imageSet[0], 0)
                : renderImageOrIcon(undefined, 0)}
            </View>
          )}
          <PlayerDetails
            heading={"Player Details"}
            isEditing={true}
            playerDetails={{
              age: tempUserStore.age,
              gender: tempUserStore.gender,
              neighborhood: tempUserStore.neighborhood,
              sport: tempUserStore.sport,
            }}
          />
          {/* Ensure you have a valid index check for tempUserStore.imageSet */}
          {tempUserStore.imageSet[1] && (
            <View style={$profileImageContainer}>
              {tempUserStore.imageSet[1]
                ? renderImageOrIcon(tempUserStore.imageSet[1], 1)
                : renderImageOrIcon(undefined, 1)}
              {/* Rating bar and other components */}
            </View>
          )}
          {/* Other components */}
          <Card heading="Description" content={tempUserStore.description} />
          {tempUserStore.imageSet[2] && (
            <View style={$profileImageContainer}>
              {tempUserStore.imageSet[2]
                ? renderImageOrIcon(tempUserStore.imageSet[2], 2)
                : renderImageOrIcon(undefined, 2)}
              {/* Rating bar and other components */}
            </View>
          )}
        </Screen>
        {/* FAB buttons */}
      </View>
    )
  },
)

const $profileImageContainer: ViewStyle = {
  position: "relative",
}

const $ratingBar: ViewStyle = {
  position: "absolute",
  bottom: 55, // Adjust distance from bottom as needed
  left: "50%", // Start from the middle of the parent
  width: 150, // Set a fixed width for the rating bar or adjust as needed
  height: 20, // Adjust height as needed
  backgroundColor: "transparent", // Make background transparent
  transform: [{ translateX: -75 }], // Shift left by half the width of the rating bar
}


const $containerWithFAB : ViewStyle = {
  flex: 1,
}
const $cameraIcon = {
  opacity: 0.5,
}
const $iconContainer: ViewStyle = {
  width: '100%', // Match the width of $autoImage
  height: 400, // Match the height of $autoImage
  justifyContent: 'center', // Center content vertically
  alignItems: 'center', // Center content horizontally
  borderRadius: 8, // Match the borderRadius of $autoImage
  marginBottom: 16, // Match the marginBottom of $autoImage
  backgroundColor: '#f0f0f0', // Optional: background color for the container
};
const $autoImage: ImageStyle = {
    width: '100%', // Make the image full width considering the padding of the screen
    height: 400, // Adjust the height as necessary
    resizeMode: 'cover',
    borderRadius: 8, // Optional: if you want rounded corners to match the PlayerDetails card
    marginBottom: 16, // Space between the image and the next component
  }
  const $iconStyle: ViewStyle = {
  marginTop: 10, // Adjust this value to lower the icon by the desired amount
};
const $rightFAB: ViewStyle = {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 2,
  }
const $leftFAB: ViewStyle = {
    position: 'absolute',
    margin: 16,
    left: 0,
    bottom: 0,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 2,
  }

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
}
const $container: ViewStyle = {
  paddingHorizontal: spacing.lg,
}

const $title: TextStyle = {
  marginBottom: spacing.sm,
}

const $tagline: TextStyle = {
  marginBottom: spacing.xxl,
}

const $description: TextStyle = {
  marginBottom: spacing.lg,
}

const $sectionTitle: TextStyle = {
  marginTop: spacing.xxl,
}

const $logoContainer: ViewStyle = {
  marginEnd: spacing.md,
  flexDirection: "row",
  flexWrap: "wrap",
  alignContent: "center",
}

const $logo: ImageStyle = {
  height: 38,
  width: 38,
}
