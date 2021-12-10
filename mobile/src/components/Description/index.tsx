import {Card, Text, Icon} from 'react-native-elements'
import React from 'react'
import {View} from 'react-native';
import styles from '../../assets/styles'
import { EditFields} from '../../localModels/UserSportsList'
import { useFormikContext} from 'formik';
import {_editDescription} from '../../utils/navigation'

const Description = () => {
  const {values: formikValues} = useFormikContext<EditFields>();
  return (
    <>
      <Card containerStyle={styles.CardStyle}>
        <Icon size={28} onPress={_editDescription} name="pencil" type='material-community' style={styles.edit_pencil} />
        <Card.Title> Description </Card.Title>
        <Card.Divider/>
        <View style={styles.sportChipSet}>
          <Text> {formikValues.description}</Text>
        </View>
      </Card>
    </>
  );
};
export {Description}
