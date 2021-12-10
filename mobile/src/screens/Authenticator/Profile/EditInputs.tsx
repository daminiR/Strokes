import React  from 'react'
import {View} from 'react-native';
import {_onPressSignOut} from '../../../utils/Upload'
import { NeighborhoodSearch, NameInput, SportsInput, DescriptionInput, BirthdayInput, GenderInput} from '../../../components'

const EditInput = ({inputType= null}) => {
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
        return <NeighborhoodSearch />;
        break;
      case 'Sports Input':
        return <SportsInput />;
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
export { EditInput }
