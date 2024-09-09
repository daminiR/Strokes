import { observer } from "mobx-react-lite"
import React, { useCallback, ComponentType, FC, useEffect, useMemo, useRef, useState } from "react"
import {TouchableOpacity,  TextInput, TextStyle, ViewStyle, View, Platform} from "react-native"
import {
  Header,
  LoadingActivity,
  Button,
  Icon,
  Screen,
  Text,
  TextField,
  TextFieldAccessoryProps,
} from "../components"
import { navigate, goBack} from "../navigators"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
import storage from "app/utils/storage/mmkvStorage"
const ROOT_STATE_STORAGE_KEY = "root-v1";
import {SFSymbol} from 'react-native-sfsymbols'
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics'
import * as Keychain from 'react-native-keychain';


interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen(_props) {
  const authPasswordInput = useRef<TextInput>(null);
  const [authPassword, setAuthPassword] = useState("");
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [attemptsCount, setAttemptsCount] = useState(0);
  const { userStore, authenticationStore } = useStores();
  const [isLoading, setIsLoading] = useState(false); // Add state for loading
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFaceIDRunning, setIsFaceIDRunning] = useState(false);


  const login = async () => {
    setIsLoading(true); // Start loading
    try {
      await authenticationStore.signIn();
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const logCurrentState = async () => {
    const currentState = storage.getString(ROOT_STATE_STORAGE_KEY);
    console.log("Current State:", currentState);
  };

  useEffect(() => {
    const fetchData = async () => {
      await logCurrentState(); // Assuming logCurrentState is an async function
    };

    fetchData();
  }, []);
const handleFaceIDLogin = useCallback(async () => {
  if (isFaceIDRunning) return;

  setIsFaceIDRunning(true);

  try {
    console.log("Running Face ID login through Keychain");

    // Directly access the password via Keychain, which will trigger Face ID automatically
    const credentials = await Keychain.getGenericPassword({
      authenticationPrompt: {
        title: 'Authenticate to retrieve password',
        cancelButton: 'Cancel',
      },
    });
    if (credentials) {
      console.log('Password retrieved via Face ID:', credentials.password);
      userStore.setAuthPassword(credentials.password);
      userStore.setPhoneNumber(credentials.username);
    } else {
      console.error('No credentials stored.');
    }
  } catch (error) {
    console.error('Error during Face ID login via Keychain:', error);
    setErrorMessage('An unexpected error occurred during Face ID authentication.');
  } finally {
    setIsFaceIDRunning(false);
  }
}, [isFaceIDRunning, userStore, setErrorMessage]);

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
        );
      },
    [isAuthPasswordHidden],
  );

  if (isLoading) {
    return <LoadingActivity />;
  }

  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <Header leftIcon={"back"} onLeftPress={() => goBack()} />
      <Text testID="login-heading" tx="loginScreen.signIn" preset="heading" style={$signIn} />
      <Text tx="loginScreen.enterDetails" preset="subheading" style={$enterDetails} />
      {attemptsCount > 2 && <Text tx="loginScreen.hint" size="sm" weight="light" style={$hint} />}

      <TextField
        value={userStore.displayPhoneNumber ?? undefined}
        onChangeText={(text) => userStore.setPhoneNumber(text)}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="tel-device"
        autoCorrect={false}
        labelTx="signUpScreen.phoneFieldLabel"
        placeholderTx="signUpScreen.phoneFieldLabel"
      />
       <View style={$passwordContainer}>

      <TextField
        ref={authPasswordInput}
        value={userStore.authPassword ?? undefined}
        onChangeText={userStore.setAuthPassword}
        containerStyle={$textFieldPassword}
        autoCapitalize="none"
        autoComplete="password"
        autoCorrect={false}
        secureTextEntry={isAuthPasswordHidden}
        labelTx="signUpScreen.passwordFieldLabel"
        placeholderTx="signUpScreen.passwordFieldPlaceholder"
        RightAccessory={PasswordRightAccessory}
      />
      {Platform.OS === "ios" && (
          <TouchableOpacity onPress={handleFaceIDLogin} style={$faceIDIcon}>
            {Platform.OS === 'ios' ? (
              <View>
                 <SFSymbol
      name="faceid"
      weight="regular"
      scale="large"
      color={colors.palette.neutral600}
      size={30}
      resizeMode="center"
      multicolor={false}
      style={{ width: 32, height: 32 }}
    />
              </View>
            ) : (
                <MaterialCommunityIcons name="face-recognition" color={colors.tint} size={30} />
              )}

          </TouchableOpacity>
        )}
       </View>
      <Button
        testID="login-button"
        tx="loginScreen.tapToSignIn"
        style={$tapButton}
        preset="reversed"
        onPress={login}
      />
    </Screen>
  );
});
 const $passwordContainer = {
    flexDirection: "row",
    alignItems: "center",
  }
  const $faceIDIcon = {
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  }

const $textFieldPassword: ViewStyle = {
  flex: 1,
  marginBottom: spacing.lg,
}
const $textField: ViewStyle = {
  marginBottom: spacing.lg,
}
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


const $tapButton: ViewStyle = {
  marginTop: spacing.xs,
}
