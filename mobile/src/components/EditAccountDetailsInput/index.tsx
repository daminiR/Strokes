import React  from 'react'
import {View} from 'react-native';
import {_onPressSignOut} from '@utils'
import { EmailInput, PhoneInput} from '@components'

const EditAccountDetailsInput = ({inputType= null, signOut = null, getData=null}) => {
  const renderInput = () => {
    switch (inputType) {
      case 'Email Input':
        return <EmailInput getData={getData}/>;
        break;
      case 'Phone Input':
        return <PhoneInput/>;
        break;
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

export { EditAccountDetailsInput }
