import React, { useState } from 'react';
import { isRTL, translate, TxKeyPath } from "../i18n"
import { TextStyle, ViewStyle, View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { observer } from "mobx-react-lite"
import { Screen, Header, Toggle, Text, TextField, SelectField, Button } from "../components" // Make sure to import correctly based on your structure
import { useStores } from '../models';
import { colors, spacing, typography } from '../theme';
import { navigate, goBack} from "../navigators"
import { ProfileStackScreenProps} from "../navigators"
import { useHeader } from "../utils/useHeader"
import { useRoute, RouteProp } from '@react-navigation/native';

interface SingleUpdateProps extends ProfileStackScreenProps<"SingleUpdate"> {}
type RootStackParamList = {
  SingleUpdateScreen: {
    field?: string; // Marking 'field' as optional
  };
};

const fieldConfigs = {
  phoneNumber: {
    method: "setPhoneNumber",
    keyboardType: "number-pad",
    labelTx: "UpdateProfile.phoneFieldLabel",
    placeholderTx: "phoneNumber",
  },
  email: {
    method: "setEmail",
    keyboardType: "email-address",
    labelTx: "UpdateProfile.emailFieldLabel",
    placeholderTx: "UpdateProfile.emailFieldPlaceholder",
  },
  firstName: {
    method: "setFirstName",
    keyboardType: "default",
    labelTx: "UpdateProfile.firstNameFieldLabel",
    placeholderTx: "UpdateProfile.firstNameFieldLabel",
  },
  lastName: {
    method: "setLastName",
    keyboardType: "default",
    labelTx: "UpdateProfile.lastNameFieldLabel",
    placeholderTx: "UpdateProfile.lastNameFieldLabel",
  },
  description: {
    method: "setDescription",
    keyboardType: "default",
    labelTx: "UpdateProfile.descriptionFieldLabel",
    placeholderTx: "UpdateProfile.descriptionFieldLabel",
  },
  neighborhoods: {
    method: "setNeighborhood",
    keyboardType: "default",
    labelTx: "UpdateProfile.descriptionFieldLabel",
    placeholderTx: "UpdateProfile.descriptionFieldLabel",
  },
  gender: {
    method: "setGender",
    keyboardType: "default",
    labelTx: "UpdateProfile.descriptionFieldLabel",
    placeholderTx: "UpdateProfile.descriptionFieldLabel",
  },
  age: {
    method: "setAge",
    keyboardType: "default",
    labelTx: "UpdateProfile.ageFieldLabel",
    placeholderTx: "UpdateProfile.ageFieldLabel",
  },
  // Add other fields as needed...
};

type SingleUpdateScreenRouteProp = RouteProp<RootStackParamList, 'SingleUpdateScreen'>;
export const SingleUpdateScreen: FC<SingleUpdateProps> = observer(function ProfileUpdateScreen(_props) {
  const { navigation } = _props;
  const route = useRoute<SingleUpdateScreenRouteProp>();
   const { fieldToUpdate, isHydrated } = route.params;
   console.log(fieldToUpdate)
  const [selectedTeam, setSelectedTeam] = useState<string[]>([])
  const { tempUserStore, userStore} = useStores();
  const tx = "Genders.gender"
  const i18nText = tx && translate(tx)

  const setGender = (gender) => {
    tempUserStore.setGender(gender)
  }
   if (!isHydrated) {
    // Optionally, render a loading indicator or return null
    return <Text>Loading...</Text>;
  }

  // Helper function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
  useHeader(
    {
      titleTx:fieldConfigs[fieldToUpdate].labelTx,
      titleMode:"center",
      leftIcon: "back",
      onLeftPress: goBack,
    },
    [goBack],
  )
  const renderField = () => {
    const config = fieldConfigs[fieldToUpdate]

    if (!config) {
      // Handle unknown field or default case
      // add error page
      return null
    }

    if (fieldToUpdate === "gender") {
      // Gender field has unique rendering needs
      return (
        <View style={$inputWrapperStyle}>
          {i18nText.map(({ key, text }) => (
            <Toggle
              key={key}
              helperTx={`genderField.gender${text}FieldLabel`}
              variant="radio"
              value={tempUserStore.gender === key}
              onPress={() => tempUserStore[`set${capitalizeFirstLetter(fieldToUpdate)}`](key)}
            />
          ))}
        </View>
      )
    } else if (fieldToUpdate === "neighborhoods") {
      // Neighborhoods field has unique rendering needs
      return (
        <SelectField
          label="Where do you squash?"
          placeholder="e.g. Boston"
          value={selectedTeam}
          onSelect={(result) => {
            setSelectedTeam(result)
            tempUserStore.setNeighborhood(result[0])
          }}
          tx={"neighborhoods.cities"}
          multiple={false}
          containerStyle={{ marginBottom: spacing.lg }}
        />
      )
    } else {
      // General case for fields that use TextField component
      return (
        <TextField
          value={tempUserStore[config.method] ?? undefined}
          onChangeText={tempUserStore[config.method]}
          containerStyle={$textField}
          autoCapitalize="none"
          autoComplete={fieldToUpdate}
          autoCorrect={false}
          keyboardType={config.keyboardType}
          //placeholderTx={config.placeholderTx}
          placeholder={tempUserStore.email}
        />
      )
    }
  }

  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >

      <View style={$centeredContent}>
         {renderField()}
        <Button
          testID="login-button"
          tx="UpdateProfile.tapToUpdate"
          style={$tapButton}
          preset="reversed"
          //onPress={test}
        />
      </View>
    </Screen>
  )
});

const $centeredContent: ViewStyle = {
  flex: 1,
  justifyContent: 'center', // Centers children vertically in the container
  paddingHorizontal: spacing.lg, // Add horizontal padding
};
const $screenContentContainer: ViewStyle = {
  paddingHorizontal: spacing.lg,
}

const $tapButton: ViewStyle = {
  width: '100%',
  marginTop: spacing.xs,
}

const $textField: ViewStyle = {
  width: '100%',
  marginBottom: spacing.lg,
}

const $signIn: TextStyle = {
  marginBottom: spacing.sm,
}

const $enterDetails: TextStyle = {
  marginBottom: spacing.lg,
}

const $hint: TextStyle = {
  color: colors.tint,
  marginBottom: spacing.md,
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

