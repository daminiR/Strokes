import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, ScrollView, ImageStyle, TextStyle, ViewStyle } from "react-native"
import { PlayerDetails, Header, Card, AutoImage } from "../components"
import { observer } from 'mobx-react-lite';
import { colors, spacing } from '../theme';
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
            <Header title={match.firstName}/>
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
            />
            <AutoImage
              style={$autoImage}
              source={{
                uri: match.imageSet[1].imageURL,
              }}
            />
            <Card heading="Description" content={match.description} />
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

const $profileImageContainer: ViewStyle = {
  position: "relative",
}


const $autoImage: ImageStyle = {
    width: '100%', // Make the image full width considering the padding of the screen
    height: 400, // Adjust the height as necessary
    resizeMode: 'cover',
    borderRadius: 8, // Optional: if you want rounded corners to match the PlayerDetails card
    marginBottom: 16, // Space between the image and the next component
  }
const $scrollViewContainer: ViewStyle = {
  backgroundColor: colors.background,
  margin: 6
}
const $container: ViewStyle = {
  paddingHorizontal: spacing.lg,
}

