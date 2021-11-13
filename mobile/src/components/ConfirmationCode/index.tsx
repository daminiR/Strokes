import React, {useRef, useEffect, useContext, useState, ReactElement } from 'react'
import {Input} from 'react-native-elements'
import { useFormikContext} from 'formik';
import { View,  Button} from 'react-native'
import styles from '../../assets/styles/'
import { ProfileFields} from '../../localModels/UserSportsList'

const ConfirmationCode = ({isLastSlide, _confirmSignInGC}) => {
  const {values, handleChange} = useFormikContext<ProfileFields>();
  const didMountRef = useRef(false)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastSlide, setLastSlide] = useState(false);
  const [delayed, setDelayed] = useState(false);
  const _resendCode = () =>{
    // can only resend code 5 times after that show msg cannot  add more code until next day
  }
  useEffect(() => {
    if (didMountRef.current) {
      const timeoutID = setTimeout(() => {
        setDelayed(true);
      }, 3000);
      return () => {
        clearTimeout(timeoutID);
        setDelayed(false);
      };
    } else {
      didMountRef.current = true;
    }
  }, [isLastSlide]);
  return (
    <View style={styles.phoneNumberContainer}>
      <Input
        placeholder="ConfirmationCode"
        label="Confirmation Code"
        leftIcon={{type: 'font-awesome', name: 'chevron-left'}}
        onChangeText={handleChange('confirmationCode')}
        value={values.confirmationCode}
      />
      {delayed && <Button title="Resend" />}
       <Button onPress={() => _confirmSignInGC()} title="Confirm" />
    </View>
  );
}
export { ConfirmationCode }