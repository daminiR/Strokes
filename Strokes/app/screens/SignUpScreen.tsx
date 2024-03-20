import { observer } from "mobx-react-lite"
import Config from 'react-native-config';
import { navigate, goBack} from "../navigators"
import React, {useEffect, useRef, useState, useMemo} from "react"
import { isRTL, translate, TxKeyPath } from "../i18n"
import { TextInput, TextStyle, ViewStyle, View } from "react-native"
import { ImagePickerWall, ImageUploadComponent, Header, Button, Icon, Screen, Text, TextField, SelectField, Toggle } from "../components"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"

interface SignUpScreenProps extends AppStackScreenProps<"SignUp"> {}

export const SignUpScreen: FC<SignUpScreenProps> = observer(function SignUpScreen(_props) {
  const authPasswordInput = useRef<TextInput>(null)
  const [signUpError, setSignUpError] = useState<string | null>(null)
  const { userStore, authenticationStore } = useStores()
  useEffect(() => {
    // Pre-fill logic if necessary
    return () => userStore.reset()
  }, [userStore])
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [attemptsCount, setAttemptsCount] = useState(0)
  const [selectedTeam, setSelectedTeam] = useState<string[]>([])
  useEffect(() => {
    // Assuming neighborhoods is an array of strings
    if (userStore.neighborhood) {
      setSelectedTeam([userStore.neighborhood["city"]])
    }
  }, [userStore.neighborhood["city"]]) // Dependency array ensures this runs when tempUserStore.neighborhoods changes
  const tx = "Genders.gender"
  const i18nText = tx && translate(tx)
  const error =  ""
  useEffect(() => {
    // Here is where you could fetch credentials from keychain or storage
    // and pre-fill the form fields.
    //setAuthEmail("ignite@infinite.red")
    //setAuthPassword("ign1teIsAwes0m3")
    // Return a "cleanup" function that React will run when the component unmounts
    return () => {
      //setAuthPassword("")
      //setAuthEmail("")
    }
  }, [])

const handleImagesUpdate = (images: ImageData[]) => {
    userStore.setImageFiles(images); // Assuming your store has a method to update image files
  }

  const test = () => {
  authenticationStore.setIsAuthenticated(true)

};
  const login = () => {
  authenticationStore.signUp().then((result) => {
    // If signUp is successful, navigate to the WelcomeScreen
      navigate("VerificationSignUp")
  }).catch((error: any) => {
    // Check for UsernameExistsException or UserNotConfirmedException
    if (error && error.code === "UserNotConfirmedException") {
      navigate("VerificationSignUp")
    }
    if (error && error.code === "UsernameExistsException") {
      setSignUpError(error.message || "An unknown error occurred during the sign-up process.")
    }
  });
};


  const setGender = (gender) => {
    userStore.setGender(gender);
  };

  const PasswordRightAccessory: ComponentType<TextFieldAccessoryProps> = useMemo(
    () =>
      function PasswordRightAccessory(props: TextFieldAccessoryProps) {
        return (
          <Icon
            icon={isAuthPasswordHidden ? "view" : "hidden"}
            color={colors.palette.neutral800}
            containerStyle={props.style}
            size={20}
            onPress={() => setIsAuthPasswordHidden(!isAuthPasswordHidden)}
          />
        )
      },
    [isAuthPasswordHidden],
  )

  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <Header leftIcon={"back"} onLeftPress={() => goBack()} />
      <Text testID="login-heading" tx="signUpScreen.signIn" preset="heading" style={$signIn} />
      <Text tx="signUpScreen.enterDetails" preset="subheading" style={$enterDetails} />
      {attemptsCount > 2 && <Text tx="signUpScreen.hint" size="sm" weight="light" style={$hint} />}

      <Text tx="signUpScreen.ImagePickerLabel" preset="formLabel" style={$enterDetails} />
      <ImagePickerWall onImagesUpdate={handleImagesUpdate} />

      <TextField
        value={userStore.phoneNumber ?? undefined}
        onChangeText={userStore.setPhoneNumber}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="tel-device"
        autoCorrect={false}
        keyboardType="number-pad"
        labelTx="signUpScreen.phoneFieldLabel"
        placeholderTx="signUpScreen.phoneFieldLabel"
        helper={error}
        status={error ? "error" : undefined}
        onSubmitEditing={() => authPasswordInput.current?.focus()}
      />

      <TextField
        value={userStore.email ?? undefined}
        onChangeText={userStore.setEmail}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="default"
        autoCorrect={false}
        labelTx="signUpScreen.emailFieldLabel"
        placeholderTx="signUpScreen.emailFieldPlaceholder"
        helper={error}
        status={error ? "error" : undefined}
        onSubmitEditing={() => authPasswordInput.current?.focus()}
      />
      <TextField
        value={userStore.firstName ?? undefined}
        onChangeText={userStore.setFirstName}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="name"
        autoCorrect={false}
        keyboardType="default"
        labelTx="signUpScreen.firstNameFieldLabel"
        placeholderTx="signUpScreen.firstNameFieldLabel"
        helper={error}
        status={error ? "error" : undefined}
        //onSubmitEditing={() => authPasswordInput.current?.focus()}
      />

      <TextField
        value={userStore.lastName ?? undefined}
        onChangeText={userStore.setLastName}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="name"
        autoCorrect={false}
        keyboardType="default"
        labelTx="signUpScreen.lastNameFieldLabel"
        placeholderTx="signUpScreen.lastNameFieldLabel"
        helper={error}
        status={error ? "error" : undefined}
        //onSubmitEditing={() => authPasswordInput.current?.focus()}
      />
      <TextField
        value={userStore.sport[0].game_level ?? undefined}
        onChangeText={userStore.setSport}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="name"
        autoCorrect={false}
        keyboardType="decimal-pad"
        labelTx="signUpScreen.sportFieldLabel"
        placeholderTx="signUpScreen.sportFieldLabel"
        helper={error}
        status={error ? "error" : undefined}
        //onSubmitEditing={() => authPasswordInput.current?.focus()}
      />
      <TextField
        ref={authPasswordInput}
        value={userStore.authPassword ?? undefined}
        onChangeText={userStore.setAuthPassword}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="password"
        autoCorrect={false}
        secureTextEntry={isAuthPasswordHidden}
        labelTx="signUpScreen.passwordFieldLabel"
        placeholderTx="signUpScreen.passwordFieldPlaceholder"
        onSubmitEditing={login}
        RightAccessory={PasswordRightAccessory}
      />
      <SelectField
        label="Where do you squash?"
        placeholder="e.g. Boston"
        value={selectedTeam}
        onSelect={(result) => {
          setSelectedTeam(result)
          userStore.setNeighborhood({ city: result[0], state: "MA", country: "US" })
        }}
        tx={"neighborhoods.cities"}
        multiple={false}
        containerStyle={{ marginBottom: spacing.lg }}
      />
      <View style={$inputWrapperStyle}>
        {i18nText.map(({ key, text }) => (
          <Toggle
            {..._props}
            key={key}
            helperTx={`genderField.gender${text}FieldLabel`}
            variant="radio"
            value={userStore.gender === key}
            onPress={() => setGender(key)}
          />
        ))}
      </View>
      <TextField
        value={userStore.description ?? undefined}
        onChangeText={userStore.setDescription}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="name"
        autoCorrect={false}
        keyboardType="default"
        multiline={true}
        labelTx="signUpScreen.descriptionFieldLabel"
        placeholderTx="signUpScreen.descriptionFieldLabel"
        helper={signUpError}
      />
      <Button
        testID="login-button"
        tx="signUpScreen.tapToSignIn"
        style={$tapButton}
        preset="reversed"
        onPress={test}

      />
    </Screen>
  )
})

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
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

const $textField: ViewStyle = {
  marginBottom: spacing.lg,
}

const $tapButton: ViewStyle = {
  marginTop: spacing.xs,
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
