import React, {useRef, useEffect, useState } from 'react'
import {Input, Button, Text} from 'react-native-elements'
import { useFormikContext} from 'formik';
import { View} from 'react-native'
import {styles} from '@styles'
import { ProfileFields} from '@localModels'
import { DismissKeyboard} from '@components'
import { registerOnFirebase} from '@utils'
import { formatCode} from '@validation'

const ConfirmationCode = ({isLastSlide, _confirmSignInGC}) => {
  const {values, setFieldValue, errors, touched, handleBlur, handleChange} = useFormikContext<ProfileFields>();
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
  const [inputValue, setDisplayInputValue] = useState("")
  const handleInput = (text) => {
      const tempText = text
    // this is where we'll call our future formatPhoneNumber function that we haven't written yet.
    const formattedPhoneNumber = formatCode(tempText);
    // we'll set the input value using our setInputValue
    setDisplayInputValue(formattedPhoneNumber);
  }
  const _onDoneEditing = () => {
   setFieldValue( 'confirmationCode', inputValue)
  }
  return (
    <>
      <DismissKeyboard>
      <View style={styles.confirmationCodeContainer}>
        <View style={styles.emailInput}>
          <Input
            placeholder="Confirmation Code"
            label="Confirmation Code"
            leftIcon={{type: 'font-awesome', name: 'chevron-left'}}
            //onChangeText={handleChange('confirmationCode')}
            onEndEditing={() => _onDoneEditing()}
            onChangeText={(text) => {
              handleInput(text);
            }}
            //value={values.confirmationCode}
            value={inputValue}
            onBlur={handleBlur('confirmationCode')}
            keyboardType={'phone-pad'}
          />
        </View>
        {errors.confirmationCode && touched.confirmationCode ? (
          <Text style={{alignSelf: 'center'}}>{errors.confirmationCode}</Text>
        ) : null}
      <View style={styles.helloButtons}>
        <Button
          buttonStyle={styles.buttonStyle}
          titleStyle={styles.buttonText}
          onPress={() => _confirmSignInGC(values.confirmationCode)}
          title="Confirm"
        />
      </View>
      </View>
      </DismissKeyboard>
    </>
  );
}
      //{delayed && <Button title="Resend" buttonStyle={styles.buttonStyle} titleStyle={styles.buttonText}/>}
export { ConfirmationCode }
