import * as Keychain from 'react-native-keychain';

const setNewKeychain = (phoneNumber, password) =>{
    Keychain.setGenericPassword(phoneNumber, password, {
      accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE,
                          accessible: Keychain.ACCESSIBLE.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
      authenticationType: Keychain.AUTHENTICATION_TYPE.DEVICE_PASSCODE_OR_BIOMETRICS,
    }).then(() => {
                        }).catch((error) => {
                          console.log(error)
                        })
}
const getPassword = (setCredentials, setFieldValue, setIsFaceID) =>{
    try {
        Keychain.getGenericPassword().then((credentials) => {
        console.log(credentials)
           if (credentials) {
            setCredentials(credentials)
            setFieldValue( 'phoneNumber', credentials.username)
            setFieldValue( 'password', credentials.password)
            setIsFaceID(true)
           }
         }).catch(() => {
         })

  } catch (error) {
    console.log("Keychain couldn't be accessed!", error);
  }
}
export {setNewKeychain, getPassword}
