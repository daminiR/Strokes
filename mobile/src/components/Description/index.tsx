import {Card, Text, Icon} from 'react-native-elements'
import React, { useContext, useEffect, useState, ReactElement } from 'react'
import {View} from 'react-native';
import {sportsList} from '../../constants';
import styles from '../../assets/styles'
import {SportChips} from '../SportsChips'
import { EditFields} from '../../localModels/UserSportsList'
import { useFormikContext} from 'formik';
import { EditInputVar} from '../../../cache'

const Description = () => {
  const _editDescription = (props) => {
      EditInputVar({inputType: 'Description Input', displayInput: true})
      console.log(EditInputVar())
}
  const {setFieldValue, values: formikValues, submitForm, handleChange, handleSubmit } = useFormikContext<EditFields>();
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
