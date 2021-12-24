import React  from 'react'
import {View} from 'react-native';
import {_onPressSignOut} from '../../../utils/Upload'
import { EmailInput, PhoneInput, AccountDetails, NeighborhoodSearch, NameInput, SportsInput, DescriptionInput, BirthdayInput, GenderInput} from '../../../components'

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

const EditAccountInput = ({inputType= null, signOut}) => {
  const renderInput = () => {
    switch (inputType) {
      case 'Account Input':
        return <AccountDetails signOut={signOut}/>;
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

const EditInput = ({inputType= null, signOut = null, isSignUp}) => {
  const renderInput = () => {
    switch (inputType) {
      case 'Name Input':
        return <NameInput />;
        break;
      case 'Birthday Input':
        return <BirthdayInput />;
        break;
      case 'Gender Input':
        return <GenderInput />;
        break;
      case 'Neighborhood Input':
        return <NeighborhoodSearch isSignUp={false}/>;
        break;
      case 'Sports Input':
        return <SportsInput isSignUp={false}/>;
        break;
      case 'Description Input':
        return <DescriptionInput />;
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
export { EditAccountDetailsInput, EditAccountInput, EditInput }
