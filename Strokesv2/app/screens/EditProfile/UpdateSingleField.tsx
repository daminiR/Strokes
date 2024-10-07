import React, {useEffect, useState} from 'react';
import {translate} from "../../i18n"
import {View} from 'react-native';
import {observer} from "mobx-react-lite"
import {Screen, Toggle, Text, TextField, SelectField, Button} from "../../components" // Make sure to import correctly based on your structure
import fieldConfigs from 'app/config/profileFieldConfigs';
import {useStores} from '../../models';
import {spacing} from '../../theme';
import {goBack} from "../../navigators"
import {ProfileStackScreenProps} from "../../navigators"
import {useHeader} from "../../utils/useHeader"
import {useRoute, RouteProp} from '@react-navigation/native';
import {styles} from './styles/UpdateSingleField.styles';

interface SingleUpdateProps extends ProfileStackScreenProps<"SingleUpdate"> {}
type RootStackParamList = {
  SingleUpdateScreen: {
    field?: string; // Marking 'field' as optional
    shouldHydrate: boolean
  };
};

type SingleUpdateScreenRouteProp = RouteProp<RootStackParamList, "SingleUpdateScreen">
export const SingleUpdateScreen: FC<SingleUpdateProps> = observer(function ProfileUpdateScreen(
  _props,
) {
  const {navigation} = _props
  const route = useRoute<SingleUpdateScreenRouteProp>()
  const {field: fieldToUpdate, shouldHydrate: shouldHydrate} = route.params
  const {tempUserStore, userStore} = useStores()
  const [selectedTeam, setSelectedTeam] = useState<string[]>([])
  const [selectedState, setSelectedState] = useState<string[]>(tempUserStore.neighborhood.state ? [tempUserStore.neighborhood.state] : [])
  const [selectedCity, setSelectedCity] = useState<string[]>(tempUserStore.neighborhood.city ? [tempUserStore.neighborhood.city] : [])

  useEffect(() => {
    if (tempUserStore.neighborhood.city) {
      setSelectedCity([tempUserStore.neighborhood.city])
    }
  }, [tempUserStore.neighborhood.city])

  const handleStateSelect = (result: string[]) => {
    setSelectedState(result)
    //setSelectedCity([]) // Reset city when the state changes
  }

  const handleCitySelect = (result: string[]) => {
    setSelectedCity(result)
    tempUserStore.setNeighborhood({city: result[0], state: selectedState[0], country: "US"})
  }
  const [tempGender, setTempGender] = useState(tempUserStore.gender);
  useEffect(() => {
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
  if (!shouldHydrate) {
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
    } else if (fieldToUpdate === "neighborhoods") {
      tempUserStore.setNeighborhood({
        city: selectedCity[0],
        state: selectedState[0],
        country: "US",
      })
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
      onLeftPress: () => {
        resetValue()
        goBack()
      },
    },
    [goBack],
  )
  const resetValue = () => {
    if (fieldToUpdate === "neighborhoods") {
      tempUserStore.setNeighborhood({
        city: userStore.neighborhood.city,
        state: userStore.neighborhood.state,
        country: userStore.neighborhood.country,
      });
    } else {
      // Add other fields reset logic if needed
    }
  }
  const renderField = () => {
    const config = fieldConfigs[fieldToUpdate]

    if (!config) {
      // Handle unknown field or default case
      // add error page
      return null
    }

    if (!shouldHydrate) {
      // Display a text message instead of an activity indicator
      return (
        <View>
          <Text>Loading, please wait...</Text>
        </View>
      )
    }

    if (fieldToUpdate === "gender") {
      return (
        <View style={styles.inputWrapperStyle}>
          {i18nText.map(({key, text}) => (
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
        <>
          <SelectField
            label="Select your State"
            placeholder="e.g. Boston"
            value={selectedState}
            onSelect={handleStateSelect}
            tx={"neighborhoods.states"}
            multiple={false}
            containerStyle={{marginBottom: spacing.lg}}
          />
          <SelectField
            label="Where do you squash?"
            placeholder="e.g. Boston"
            value={selectedCity}
            onSelect={handleCitySelect}
            tx={`neighborhoods.cities.${selectedState[0]}`}
            multiple={false}
            containerStyle={{marginBottom: spacing.lg}}
          />
        </>
      )
    } else {
      return (
        <TextField
          value={`${textFieldValue}`}
          onChangeText={setTextFieldValue}
          containerStyle={styles.textField}
          autoCapitalize="none"
          autoComplete={fieldToUpdate}
          multiline={fieldToUpdate === 'description'}
          numberOfLines={fieldToUpdate === 'description' ? 4 : 1}
          maxLength={fieldToUpdate === 'description' ? 500 : undefined}
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
      contentContainerStyle={styles.screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <View style={styles.centeredContent}>
        {renderField()}
        <Button
          testID="login-button"
          tx="UpdateProfile.tapToUpdate"
          style={styles.tapButton}
          preset="reversed"
          onPress={updateStore}
        />
      </View>
    </Screen>
  )
})

