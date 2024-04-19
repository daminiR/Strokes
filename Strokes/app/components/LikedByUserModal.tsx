import React, { useState } from "react"
import { Modal, View, ViewStyle, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from "../theme" // Import your theme settings
import { Button, Text, SportCard } from "../components" // Assuming you have a custom Button component
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useStores } from "../models"

const screenWidth = Dimensions.get('window').width; // Import Dimensions from 'react-native'
 const cardMargin = spacing.md;
 const cardWidth = (screenWidth - (3 * cardMargin)) / 2; // For two columns, considering margin as spacing
export const LikedByUserModal = ({ profile, showSportCard, handleClose }) => {
  const { likedUserStore, mongoDBStore, userStore, authenticationStore, matchStore } = useStores()
  const [isSwiping, setIsSwiping] = useState(false)
  const handleSwipeAction = async (actionType) => {
    if (!isSwiping) {
      setIsSwiping(true)
      // Perform the swipe action first for better user experience
      try {
        // Await the asynchronous action after the swipe
        await (actionType === "like"
          ? matchStore.likeAction(profile.matchUserId)
          : matchStore.dislikeAction(profile.matchUserId))
      } catch (error) {
        console.error("Failed to update match store:", error)
      } finally {
        // Reset swiping status after the action completes or fails
        handleClose()
        setTimeout(() => {
          setIsSwiping(false)
        }, 25) // Adjust based on your swipe animation duration
      }
    }
  }
  const handleSwipeRight = () => handleSwipeAction("like")
  const handleSwipeLeft = () => handleSwipeAction("dislike")
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showSportCard}
      onRequestClose={handleClose} // Added handleClose function
    >
      <View style={modalStyle}>
        <View style={modalContainerStyle2}>
          <TouchableOpacity onPress={handleClose} style={$closeStyle} activeOpacity={0.7}>
            <Icon name={"times-circle"} size={56}/>
          </TouchableOpacity>

          <SportCard match={profile} />
        </View>
      </View>
      <View>
        <Button disabled={isSwiping} onPress={handleSwipeRight} style={$rightFAB}>
          <View style={$iconStyle}>
            <Icon size={34} name={"thumbs-up"} />
          </View>
        </Button>
        <Button disabled={isSwiping} onPress={handleSwipeLeft} style={$leftFAB}>
          <View style={$iconStyle}>
            <Icon size={34} name={"thumbs-down"} />
          </View>
        </Button>
      </View>
    </Modal>
  )
}
const modalContainerStyle2: ViewStyle = {
  position: 'relative',
  width: '90%',
  height: '90%',
  backgroundColor: "white",  // Sets a clean background color
  borderRadius: 20,          // Rounds the corners of the modal
  elevation: 10,             // Adds shadow for Android (optional)
  shadowColor: '#000',       // Sets shadow color (optional for iOS)
  shadowOffset: { width: 0, height: 2 }, // Determines the shadow position
  shadowRadius: 6,           // Sets the blur radius of the shadow
  shadowOpacity: 0.3,        // Determines the transparency of the shadow
  alignSelf: 'center',       // Ensures the modal is centered in the view
  justifyContent: 'center',  // Centers the content inside the modal
  //backgroundColor: colors.background,
};
const modalStyle: ViewStyle = {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(0,0,0,0.5)",
}

const $closeStyle = {
  position: "absolute",
  zIndex: 999,
  flex: 1,
  right: -20,
  top: -23,
  borderRadius: 56,
  justifyContent: "center",
  alignItems: "center",
  elevation: 8, // Shadow for Android
  shadowColor: "#000", // Shadow for iOS
  shadowOpacity: 0.2,
  shadowOffset: { width: 2, height: 2 },
  shadowRadius: 2,
  backgroundColor: "white", // Ensure the background is transparent
}
const $iconStyle: ViewStyle = {
  marginTop: 20, // Adjust this value to lower the icon by the desired amount
};
const $rightFAB: ViewStyle = {
    position: 'absolute',
    marginRight: 10,
    marginBottom: 10,
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
    marginLeft: 10,
    marginBottom: 10,
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

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
  },
  modalContent: {
    //backgroundColor: colors.background,
    padding: spacing.lg,
    borderRadius: spacing.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  closeButton: {
    marginTop: spacing.md,
    backgroundColor: colors.background,
    padding: spacing.sm,
    borderRadius: spacing.sm,
  },
  closeButtonText: {
    color: 'white',
    fontFamily: typography.primary.normal,
  }
});

