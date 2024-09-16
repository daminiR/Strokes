import React, { FC } from "react"
import {observer} from "mobx-react-lite"
import { Image,  View } from "react-native"
import { styles } from "./styles/ProfileSummaryScreen.styles"
import {
  PlayerDetails,
  Header,
  Card,
  Screen,
} from "../../components"
import {ProfileStackScreenProps} from "../../navigators"
import { useStores } from "../../models"
import Icon from 'react-native-vector-icons/MaterialIcons';

interface ProfilePreviewScreen extends ProfileStackScreenProps<"ProfilePreview"> {}

export const ProfilePreviewScreen: FC<ProfilePreviewScreen> = observer(
  function ProfilePreviewScreen(_props) {
    const {tempUserStore} = useStores()
    const getImageUri = (imageObj) => {
      return imageObj?.imageURL || imageObj?.uri
    }
    const renderImageOrIcon = (image, index) => {
      const uri = getImageUri(image);
      return uri ? (
        <Image key={index} source={{uri}} style={styles.autoImage} />
      ) : (
        <View style={styles.iconContainer}>
          <Icon name="camera-alt" size={300} color="#000" style={$cameraIcon} />
        </View>
      )
    };
    return (
      <View style={styles.containerWithFAB}>
        <Screen preset="auto" contentContainerStyle={styles.container} safeAreaEdges={["top", "bottom"]}>
          <Header
            title={tempUserStore.firstName}
            safeAreaEdges={[]}
          />
          {tempUserStore.imageSet[0] && (
            <View style={styles.profileImageContainer}>
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
          {tempUserStore.imageSet[1] && (
            <View style={styles.profileImageContainer}>
              {tempUserStore.imageSet[1]
                ? renderImageOrIcon(tempUserStore.imageSet[1], 1)
                : renderImageOrIcon(undefined, 1)}
              {/* Rating bar and other components */}
            </View>
          )}
          <Card heading="Description" content={tempUserStore.description} />
          {tempUserStore.imageSet[2] && (
            <View style={styles.profileImageContainer}>
              {tempUserStore.imageSet[2]
                ? renderImageOrIcon(tempUserStore.imageSet[2], 2)
                : renderImageOrIcon(undefined, 2)}
            </View>
          )}
        </Screen>
      </View>
    )
  },
)
