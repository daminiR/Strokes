import React, { useEffect, useState } from 'react';
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
    placeholder: "phoneNumber",
  },
  squash_level: {
    method: "setSport",
    keyboardType: "default",
    labelTx: "UpdateProfile.sportFieldLabel",
    placeholderTx: "UpdateProfile.sportFieldLabel",
    placeholder: "sport[0].game_level",
  },
  email: {
    method: "setEmail",
    keyboardType: "email-address",
    labelTx: "UpdateProfile.emailFieldLabel",
    placeholderTx: "UpdateProfile.emailFieldPlaceholder",
    placeholder: "email",
  },
  firstName: {
    method: "setFirstName",
    keyboardType: "default",
    labelTx: "UpdateProfile.firstNameFieldLabel",
    placeholderTx: "UpdateProfile.firstNameFieldLabel",
    placeholder: "firstName",
  },
  lastName: {
    method: "setLastName",
    keyboardType: "default",
    labelTx: "UpdateProfile.lastNameFieldLabel",
    placeholderTx: "UpdateProfile.lastNameFieldLabel",
    placeholder: "lastName",
  },
  description: {
    method: "setDescription",
    keyboardType: "default",
    labelTx: "UpdateProfile.descriptionFieldLabel",
    placeholderTx: "UpdateProfile.descriptionFieldLabel",
    placeholder: "description",
  },
  neighborhoods: {
    method: "setNeighborhood",
    keyboardType: "default",
    labelTx: "UpdateProfile.descriptionFieldLabel",
    placeholderTx: "UpdateProfile.descriptionFieldLabel",
    placeholder: "neighborhood",
  },
  gender: {
    method: "setGender",
    keyboardType: "default",
    labelTx: "UpdateProfile.descriptionFieldLabel",
    placeholderTx: "UpdateProfile.descriptionFieldLabel",
    placeholder: "gender",
  },
  age: {
    method: "setAge",
    keyboardType: "default",
    labelTx: "UpdateProfile.ageFieldLabel",
    placeholderTx: "UpdateProfile.ageFieldLabel",
    placeholder: "age",
  },
  // Add other fields as needed...
};

type SingleUpdateScreenRouteProp = RouteProp<RootStackParamList, "SingleUpdateScreen">
export const SingleUpdateScreen: FC<SingleUpdateProps> = observer(function ProfileUpdateScreen(
  _props,
) {
  const { navigation } = _props
  const route = useRoute<SingleUpdateScreenRouteProp>()
  const { field: fieldToUpdate, isHydrated } = route.params
  const { tempUserStore, userStore } = useStores()
  const [selectedTeam, setSelectedTeam] = useState<string[]>([])
  const [tempGender, setTempGender] = useState(tempUserStore.gender);
  useEffect(() => {
    // Assuming neighborhoods is an array of strings
    if (tempUserStore.neighborhood) {
      setSelectedTeam([tempUserStore.neighborhood["city"]])
    }
  }, [tempUserStore.neighborhood["city"]]) // Dependency array ensures this runs when tempUserStore.neighborhoods changes
  const tx = "Genders.gender"
  const i18nText = tx && translate(tx)
  const [textFieldValue, setTextFieldValue] = useState(() => {
    const fieldPath = fieldConfigs[fieldToUpdate].placeholder;
    const initialValue = getValueByPath(tempUserStore, fieldPath)
    return initialValue !== undefined ? String(initialValue) : '';
  });


  const setGender = (gender) => {
    tempUserStore.setGender(gender)
  }
  if (!isHydrated) {
    // Optionally, render a loading indicator or return null
    return <Text>Loading...</Text>
  }

  function getValueByPath(obj, path) {
    return path
      .split(/[\.\[\]\'\"]/)
      .filter((p) => p)
      .reduce((acc, key) => {
        return acc && acc[key] !== undefined ? acc[key] : undefined
      }, obj)
  }

  const updateStore = () => {
    if (fieldToUpdate === "gender") {
      tempUserStore.setGender(tempGender)
    } else {
      // For the generic text field case, assuming config.method is a function name like "setName"
      const updateMethod = tempUserStore[fieldConfigs[fieldToUpdate].method]
      if (updateMethod) {
        updateMethod(textFieldValue)
      }
    }
    goBack()
  }
  // Helper function to capitalize the first letter of a string
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }
  useHeader(
    {
      titleTx: fieldConfigs[fieldToUpdate].labelTx,
      titleMode: "center",
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

    if (!isHydrated) {
      // Display a text message instead of an activity indicator
      return (
        <View>
          <Text>Loading, please wait...</Text>
        </View>
      )
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
              value={tempGender === key} // Use tempGender for the Toggle value
              onPress={() => setTempGender(key)} // Update tempGender instead of tempUserStore directly
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
            tempUserStore.setNeighborhood({ city: result[0], state: "MA", country: "US" })
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
          //value={tempUserStore[config.placeholder] ?? undefined}
          //onChangeText={tempUserStore[config.method]}
          value={`${textFieldValue}`}
          onChangeText={setTextFieldValue}
          containerStyle={$textField}
          autoCapitalize="none"
          autoComplete={fieldToUpdate}
          autoCorrect={false}
          keyboardType={config.keyboardType}
          placeholder={`${getValueByPath(tempUserStore, config.placeholderTx || config.placeholder) ?? ''}`}
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
          onPress={updateStore}
        />
      </View>
    </Screen>
  )
})

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
