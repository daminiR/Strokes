import React  from 'react'
import {View} from 'react-native';
import {_onPressSignOut} from '@utils'
import { EmailInput, PhoneInput, PrivacyInput, ConfirmationCode, DeleteAccountInput} from '@components'

const EditAccountDetailsInput = ({inputType= null, signOut = null, getData=null, confirmDelete=null, softDelete=null}) => {
  const renderInput = () => {
    switch (inputType) {
      case "Email Input":
        return <EmailInput isSignUp={false} getData={getData} />;
        break;
      case "Phone Input":
        return <PhoneInput />;
        break;
      case "Privacy Input":
        return <PrivacyInput />;
        break;
      case "Delete Account Input":
        return <DeleteAccountInput softDelete={softDelete}/>;
        break;
      case "Confirmation Code Input":
        //return <PhoneInput/>;
        return (
          <ConfirmationCode
            isLastSlide={true}
            _confirmSignInGC={confirmDelete}
          />
        );
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
