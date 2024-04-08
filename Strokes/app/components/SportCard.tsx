import React from 'react';
import { View, TouchableOpacity, ScrollView, ImageStyle, TextStyle, ViewStyle } from 'react-native';
import { CircularPlayerRatingBar, PlayerDetails, Header, Card, AutoImage } from "../components"
import { observer } from 'mobx-react-lite';
import { colors, spacing } from '../theme';

interface Match {
  _id: string
  firstName: string
  age: number
  gender: string
  description: string
  sport: { sportName: string; gameLevel: number }
  neighborhood: {
    city: string
    state: string
    country: string
  }
  image_set: [
    {
      imageURL: string
      img_idx: number
    },
  ]
}

// Update your SportCard props to include a match of type Match
interface SportCardProps {
  match: Match
}

export const SportCard: React.FC<SportCardProps> = observer(({ match }) => {
  console.log("matchdatae", match.image_set[0].imageURL)
    return (
      <ScrollView style={$scrollViewContainer}>
        <TouchableOpacity activeOpacity={1}>
          <View style={$container}>
            <Header title="Damini" leftIcon="menu" rightIcon="settings" />
            <View style={$profileImageContainer}>
              <AutoImage
                style={$autoImage}
                source={{
                  uri: match.image_set[0].imageURL,
                }}
              />
              <View style={$ratingBar}>
                <CircularPlayerRatingBar
                  rating={Number(match.sport.gameLevel)}
                  maxRating={7}
                  size={100}
                  strokeWidth={10}
                />
              </View>
            </View>
            <PlayerDetails
              heading={"Player Details"}
              isEditing={true}
              playerDetails={{
                age: String(match.age),
                gender: match.gender,
                neighborhood: match.neighborhood,
              }}
            />
            <AutoImage
              style={$autoImage}
              source={{
                uri: match.image_set[1].imageURL,
              }}
            />
            <Card heading="Description" content={match.description} />
            <AutoImage
              style={$autoImage}
              source={{
                uri: match.image_set[2].imageURL,
              }}
            />
          </View>
        </TouchableOpacity>
      </ScrollView>
    )
  })

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

const $scrollViewContainer: ViewStyle = {
  //backgroundColor: "rgba(0,0,0,1)",
  backgroundColor: colors.background,
}
const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
}
const $container: ViewStyle = {
  paddingTop: spacing.lg + spacing.xl,
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

