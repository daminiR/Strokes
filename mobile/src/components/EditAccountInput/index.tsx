import React  from 'react'
import {View} from 'react-native';
import {_onPressSignOut} from '@utils'
import { AccountDetails} from '@components'
import {RootRefreshContext} from '../../index.js'


const EditAccountInput = ({inputType= null, signOut, deleteAccount}) => {
  const renderInput = () => {
    switch (inputType) {
      case 'Account Input':
        return <AccountDetails signOut={signOut} deleteAccount={deleteAccount}/>;
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

export {EditAccountInput }
