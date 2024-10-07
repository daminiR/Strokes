import { observer } from "mobx-react-lite"
import { navigate} from "../../navigators"
import React, { FC, useState, useEffect} from "react"
import { autorun } from 'mobx';
import { Image, TouchableOpacity, View } from "react-native"
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useStores } from "../../models"
import { ProfileStackScreenProps} from "../../navigators"
import { colors } from "../../theme"
import { styles } from "./styles/ProfileHomeScreen.styles";
import { useHeader } from "../../utils/useHeader"
import {
  Screen,
} from "../../components"

interface ProfileWelcomeScreen extends ProfileStackScreenProps<"ProfileWelcome"> {}

export const ProfileWelcomeScreen: FC<ProfileWelcomeScreen> = observer(function ProfileWelcomeScreen(_props) {
  const { navigation } = _props
  const {
    tempUserStore,
    userStore,
    authenticationStore: { logout },
  } = useStores()
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);

  useEffect(() => {
    const disposer = autorun(() => {
      const imageFile = userStore.imageSet.find((file) => file.img_idx === 0)
      console.log("imageFile", imageFile)
      setImageUri(imageFile ? (imageFile.uri ?? imageFile.imageURL) : undefined);
    })
    // Cleanup function to dispose of the autorun when the component unmounts
    return () => disposer()
  }, [userStore]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      tempUserStore.hydrateFromUserStore();
    });
    // Return the cleanup function
    return unsubscribe;
  }, [navigation]);

  useHeader(
    {
      rightIcon: "settings",
      onRightPress: () => navigate("Settings"),
    },
    [logout],
  )

  return (
    <Screen
      preset="auto"
      contentContainerStyle={styles.screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <View style={styles.container}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: imageUri }}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editIconContainer}>
            <Icon
              name="edit"
              size={24}
              color={colors.text}
              onPress={() =>
                navigate("ProfileTopTabNavigator", {
                  screen: "ProfileUpdate",
                  params: { shouldHydrate: true },
                })
              }
            />
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  )
})

