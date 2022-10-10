import * as Keychain from 'react-native-keychain';

const setNewKeychain = (phoneNumber, password) =>{
    var settings =  { service: 'org.reactjs.native.example.sports-app-keychain-password' };
    Keychain.setGenericPassword(phoneNumber, password, {
      service: 'org.reactjs.native.example.sports-app-keychain-password',
      accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE,
                          accessible: Keychain.ACCESSIBLE.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
      authenticationType: Keychain.AUTHENTICATION_TYPE.DEVICE_PASSCODE_OR_BIOMETRICS,
    }).then((data) => {
      console.log('data',data)
                        }).catch((error) => {
                          console.log(error)
                        })
}
const getPassword = async (setCredentials, setFieldValue, setIsFaceID) =>{
  return await new Promise((resolve, reject) => {
    try {
      const settings = {service: 'org.reactjs.native.example.sports-app-keychain-password'}
        Keychain.getGenericPassword(settings).then((credentials) => {
        console.log(credentials)
           if (credentials) {
            setCredentials(credentials)
            setFieldValue( 'phoneNumber', credentials.username)
            setFieldValue( 'password', credentials.password)
            setIsFaceID(true)
           }
         resolve()

         }
                                                  )
                                                  .catch(() => {
                                                    reject()
         })

  } catch (error) {
    reject()
    console.log("Keychain couldn't be accessed!", error);
  }
  })



}
export {setNewKeychain, getPassword}
