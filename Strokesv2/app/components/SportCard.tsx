import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, ScrollView, ImageStyle, TextStyle, ViewStyle } from "react-native"
import { PlayerDetails, Text, Card, AutoImage } from "../components"
import { observer } from 'mobx-react-lite';
import { colors, spacing, typography } from '../theme';
import { ErrorDetails } from 'app/screens/ErrorScreen/ErrorDetails'

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
  imageSet: [
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
  const [error, setError] = useState<Error | null>(null);
   useEffect(() => {
    if (!match || !match.firstName || !match.age || !match.gender || !match.description ||
        !match.sport || !match.neighborhood || !match.imageSet.length) {
          setError(new Error("Missing required match details"))
        }
  }, [match]);
  if (error) {
    return <ErrorDetails error={error} errorInfo={null} onReset={() => setError(null)} />;
  }
    return (
    <ScrollView style={$scrollViewContainer}>
      <TouchableOpacity activeOpacity={1}>
        <View style={$container}>
          <Text text={match.firstName} preset={"subheading"} style={$headerStyle}/>
          <View style={$profileImageContainer}>
            <AutoImage
              style={$autoImage}
              source={{
                uri: match.imageSet[0].imageURL,
              }}
            />
          </View>

          <PlayerDetails
            heading={"Player Details"}
            isEditing={true}
            playerDetails={{
              age: String(match.age),
              gender: match.gender,
              neighborhood: match.neighborhood,
              sport: match.sport
            }}
            style={$playerDetails}
          />

          <AutoImage
            style={$autoImage}
            source={{
              uri: match.imageSet[1].imageURL,
            }}
          />

          <Card heading="Description" content={match.description} style={$cardStyle} />

          <AutoImage
            style={$autoImage}
            source={{
              uri: match.imageSet[2].imageURL,
            }}
          />
        </View>
      </TouchableOpacity>
    </ScrollView>
    )
  })

const $headerStyle: TextStyle = {
  textAlign: 'center',   // Center the text
  marginTop: 8,      // Add margin below the header
  marginBottom: 16,      // Add margin below the header
};


const $autoImage: ImageStyle = {
  width: '100%',
  height: 400,
  resizeMode: 'cover',
  borderRadius: 8,
}
const $profileImageContainer: ViewStyle = {
  position: "relative",
}
const $scrollViewContainer: ViewStyle = {
  backgroundColor: colors.background,
  margin: 8,  // Slightly increased the margin for better container separation
}

const $container: ViewStyle = {
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.md,  // Added padding to separate elements vertically
}

const $playerDetails: ViewStyle = {
  marginBottom: 24,  // Consistent spacing below player details
}

const $cardStyle: ViewStyle = {
  marginVertical: 8,  // Consistent spacing between the card and other components
}
