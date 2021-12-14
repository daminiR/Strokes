import React, {useRef, useEffect, useState } from 'react'
import {Input, Button} from 'react-native-elements'
import { useFormikContext} from 'formik';
import { View} from 'react-native'
import styles from '../../assets/styles/'
import { ProfileFields} from '../../localModels/UserSportsList'

const ConfirmationCode = ({isLastSlide, _confirmSignInGC}) => {
  const {values, handleChange} = useFormikContext<ProfileFields>();
  const didMountRef = useRef(false)
  const [delayed, setDelayed] = useState(false);
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
    <>
    <View style={styles.confirmationContainer}>
    <View style={styles.emailInput}>
      <Input
        placeholder="ConfirmationCode"
        label="Confirmation Code"
        leftIcon={{type: 'font-awesome', name: 'chevron-left'}}
        onChangeText={handleChange('confirmationCode')}
        value={values.confirmationCode}
      />
    </View>
      {delayed && <Button title="Resend" buttonStyle={styles.buttonStyle} titleStyle={styles.buttonText}/>}
       <Button buttonStyle={styles.buttonStyle} titleStyle={styles.buttonText} onPress={() => _confirmSignInGC(values.confirmationCode)} title="Confirm" />
    </View>
    </>
  );
}
export { ConfirmationCode }
