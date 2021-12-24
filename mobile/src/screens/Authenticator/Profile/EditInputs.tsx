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
        return <NameInput isSignUp={isSignUp}/>;
        break;
      case 'Birthday Input':
        return <BirthdayInput isSignUp={isSignUp}/>;
        break;
      case 'Gender Input':
        return <GenderInput isSignUp={isSignUp}/>;
        break;
      case 'Neighborhood Input':
        return <NeighborhoodSearch isSignUp={isSignUp}/>;
        break;
      case 'Sports Input':
        return <SportsInput isSignUp={isSignUp}/>;
        break;
      case 'Description Input':
        return <DescriptionInput isSignUp={isSignUp}/>;
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
