import { observer } from "mobx-react-lite"
import { navigate, goBack} from "../../navigators"
import React, {useEffect, useRef, useState, useMemo} from "react"
import { translate } from "../../i18n"
import { TextInput, View } from "react-native"
import {
  ImagePickerWall,
  LoadingActivity,
  Header,
  Button,
  Icon,
  Screen,
  Text,
  TextField,
  SelectField,
  Toggle,
} from "../../components"
import { useStores } from "../../models"
import { AppStackScreenProps } from "../../navigators"
import { colors, spacing } from "../../theme"
import { styles } from "./styles/SignUpScreen.styles"

interface SignUpScreenProps extends AppStackScreenProps<"SignUp"> {}

export const SignUpScreen: FC<SignUpScreenProps> = observer(function SignUpScreen(_props) {
  const authPasswordInput = useRef<TextInput>(null)
  const [signUpError, setSignUpError] = useState<string | null>(null)
  const { userStore, authenticationStore } = useStores()
   const [isLoading, setIsLoading] = useState(false); // Add state for loading
  // Safeguard against null userStore in useEffect cleanup
  useEffect(() => {
    return () => userStore?.reset()
  }, [userStore])

  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [attemptsCount, setAttemptsCount] = useState(0)

  // Adjusted to use optional chaining and nullish coalescing
  const [selectedState, setSelectedState] = useState<string[]>(
    userStore?.neighborhood?.state ? [userStore.neighborhood.state] : [],
  )
  const [selectedTeam, setSelectedTeam] = useState<string[]>(
    userStore?.neighborhood?.city ? [userStore.neighborhood.city] : [],
  )

  useEffect(() => {
    if (userStore?.neighborhood?.city) {
      setSelectedTeam([userStore.neighborhood.city])
    }
  }, [userStore?.neighborhood?.city])

  const tx = "Genders.gender"
  const i18nText = tx && translate(tx)
  const error = ""

  const handleImagesUpdate = (images: ImageData[]) => {
    userStore?.setImageSet(images)
  }
  const login = () => {
    setIsLoading(true)
    authenticationStore
      .signUp()
      .then((result) => {
        setIsLoading(false)
        navigate("VerificationSignUp")
      })
      .catch((error: any) => {
        setIsLoading(false)
        if (error && error.code === "UserNotConfirmedException") {
          navigate("VerificationSignUp")
        }
        if (error && error.code === "UsernameExistsException") {
          setSignUpError(error.message || "An unknown error occurred during the sign-up process.")
        }
      })
  }
  const setGender = (gender: string) => {
    userStore?.setGender(gender)
  }
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
   if (isLoading) {
     return <LoadingActivity />
   }
  return (
    <Screen
      preset="auto"
      contentContainerStyle={styles.screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <Header leftIcon={"back"} onLeftPress={() => goBack()} />
      <Text testID="login-heading" tx="signUpScreen.signIn" preset="heading" style={styles.signIn} />
      <Text tx="signUpScreen.enterDetails" preset="subheading" style={styles.enterDetails} />
      {attemptsCount > 2 && <Text tx="signUpScreen.hint" size="sm" weight="light" style={styles.hint} />}

      <Text tx="signUpScreen.ImagePickerLabel" preset="formLabel" style={styles.enterDetails} />
      <ImagePickerWall onImagesUpdate={handleImagesUpdate} />

      <TextField
        value={userStore?.displayPhoneNumber ?? undefined}
        onChangeText={text => userStore.setPhoneNumber(text)}
        containerStyle={styles.textField}
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
        value={userStore?.email ?? undefined}
        onChangeText={userStore.setEmail}
        containerStyle={styles.textField}
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
        value={userStore?.firstName ?? undefined}
        onChangeText={userStore.setFirstName}
        containerStyle={styles.textField}
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
        value={userStore?.lastName ?? undefined}
        onChangeText={userStore.setLastName}
        containerStyle={styles.textField}
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
         value={userStore?.sport?.gameLevel ? userStore.sport.gameLevel.toString() : undefined}
        onChangeText={userStore.setSport}
        containerStyle={styles.textField}
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
        value={userStore?.authPassword ?? undefined}
        onChangeText={userStore.setAuthPassword}
        containerStyle={styles.textField}
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
        label="Where do you squash?(State)"
        placeholder="e.g. Boston"
        value={selectedState}
        onSelect={(result) => {
          setSelectedState(result)
        }}
        tx={"neighborhoods.states"}
        multiple={false}
        containerStyle={{ marginBottom: spacing.lg }}
      />
      <SelectField
        label="Where do you squash?"
        placeholder="e.g. Boston"
        value={selectedTeam}
        onSelect={(result) => {
          setSelectedTeam(result)
          userStore.setNeighborhood({ city: result[0], state: selectedState[0], country: "US" })
        }}
        tx={`neighborhoods.cities.${selectedState}`}
        multiple={false}
        containerStyle={{ marginBottom: spacing.lg }}
      />
      <View style={styles.inputWrapperStyle}>
        {i18nText.map(({ key, text }) => (
          <Toggle
            {..._props}
            key={key}
            helperTx={`genderField.gender${text}FieldLabel`}
            variant="radio"
            value={userStore?.gender === key}
            onPress={() => setGender(key)}
          />
        ))}
      </View>
      <TextField
        value={userStore?.description ?? undefined}
        onChangeText={userStore.setDescription}
        containerStyle={styles.textField}
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
        style={styles.tapButton}
        preset="reversed"
        onPress={login}
      />
    </Screen>
  )
})

