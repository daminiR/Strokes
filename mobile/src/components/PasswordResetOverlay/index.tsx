import React, { useEffect, useContext, useState, ReactElement } from 'react'
import {styles} from '@styles'
import {Text, View, Modal} from 'react-native';
import { Cancel, Done, PasswordResetInput} from '@components';
import { useFormikContext} from 'formik';
import { PasswordResetFields, ProfileFields} from '@localModels'
const PasswordResetOverlay = ({passwordReset, setPasswordReset, phoneNumber}) => {
  const {resetForm} = useFormikContext<PasswordResetFields>();
  const _onPressCancelPassword = () => {
    setPasswordReset(false)
    resetForm()
  }
  return (
        <Modal
          animationType="slide"
          transparent={false}
          visible={passwordReset}
        >
          <View style={{flex: 1}}>
            <View style={styles.top}>
              <Cancel _onPressCancel={_onPressCancelPassword} />
            </View>
            <PasswordResetInput passwordReset={passwordReset} setPasswordReset={setPasswordReset} phoneNumber={phoneNumber}/>
          </View>
        </Modal>
  );
};

export {PasswordResetOverlay}
