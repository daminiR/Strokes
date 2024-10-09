import React, { FC } from "react"
import {observer} from "mobx-react-lite"
import {View } from "react-native"
import {styles} from "./styles/ProfileSummaryScreen.styles"
import {
  SportCard,
} from "../../components"
import {ProfileStackScreenProps} from "../../navigators"
import { useStores } from "../../models"

interface ProfilePreviewScreen extends ProfileStackScreenProps<"ProfilePreview"> {}
export const ProfilePreviewScreen: FC<ProfilePreviewScreen> = observer(
  function ProfilePreviewScreen(_props) {
    const { tempUserStore } = useStores();

    // Function to map tempUserStore to the structure SportCard expects
    const createPotentialMatchCard = () => {
      return {
        matchUserId: tempUserStore._id || null, // Mapping the _id field to matchUserId
        firstName: tempUserStore.firstName || null,
        age: tempUserStore.age || null,
        interacted: false, // Assuming this is set based on interaction
        gender: tempUserStore.gender || null,
        sport: tempUserStore.sport ? { ...tempUserStore.sport } : null,
        description: tempUserStore.description || null,
        imageSet: tempUserStore.imageSet ? [...tempUserStore.imageSet] : [],
        neighborhood: tempUserStore.neighborhood ? { ...tempUserStore.neighborhood } : null,
      };
    };

    const card = createPotentialMatchCard();

    return (
      <View style={styles.containerWithFAB}>
        <SportCard match={card} />
      </View>
    );
  }
);


