import React  from 'react'
import {View, KeyboardAvoidingView, Platform} from 'react-native';
import {_onPressSignOut} from '@utils'
import {NeighborhoodSearch, NameInput, SportsInput, DescriptionInput, BirthdayInput, GenderInput} from '@components'

const EditInput = ({inputType= null, signOut = null, isSignUp}) => {
  const renderInput = () => {
    switch (inputType) {
      case 'Name Input':
        return (
          <>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{flex: 1}}>
              <NameInput isSignUp={isSignUp} />
            </KeyboardAvoidingView>
          </>
        );
        break
      case 'Birthday Input':
        return (
          <>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{flex: 1}}>
              <BirthdayInput isSignUp={isSignUp} />
            </KeyboardAvoidingView>
          </>
        );
        break
      case 'Gender Input':
        return (
          <>
              <GenderInput isSignUp={isSignUp} />
          </>
        );
        break
      case 'Neighborhood Input':
        return (
          <>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{flex: 1}}>
              <NeighborhoodSearch isSignUp={isSignUp} />
            </KeyboardAvoidingView>
          </>
        );
        break
      case 'Sports Input':
        return (
          <>
            <SportsInput isSignUp={true} />
          </>
        );
        break
      case 'Description Input':
        return (
          <>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{flex: 1}}>
              <DescriptionInput isSignUp={isSignUp} />
            </KeyboardAvoidingView>
          </>
        );
        break
    }
  }
  return (
    <>
        <View style={{flex:1}}>
          {renderInput()}
        </View>
    </>
  );
};
export { EditInput }
