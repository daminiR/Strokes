import {Card, Text, Icon} from 'react-native-elements'
import React from 'react'
import {View} from 'react-native';
import {styles} from '@styles'
import { EditFields} from '@localModels'
import { useFormikContext} from 'formik';
import {_editDescription} from '../../InputsVar'
import {EditPencil} from '@components'

const Description = () => {
  const {values: formikValues} = useFormikContext<EditFields>();
  return (
    <>
      <Card containerStyle={styles.CardStyle}>
        <EditPencil _edit={_editDescription}/>
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
