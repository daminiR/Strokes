import {Theme, Text, Chip, Card, Input, Button,withBadge, ListItem, Icon, Avatar, Badge } from 'react-native-elements'
import React, { useRef, useContext, useEffect, useState, ReactElement } from 'react'
import {
  TouchableOpacity,
  Modal,
} from 'react-native';
import styles from '../../../assets/styles'
import {UserContext} from '../../../UserContext'
import { useFormikContext} from 'formik';
import { ProfileFields, SignIn, EditFields} from '../../../localModels/UserSportsList'
import {READ_SQUASH} from '../../../graphql/queries/profile'
import { ProfileSettingsInput } from "./profileSettingInput"
import {View, ScrollView, StyleSheet } from 'react-native'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { _check_single } from '../../../utils/Upload'
import {useNavigation} from '@react-navigation/native';
import { onScreen, goBack } from '../../../constants'
import { EditInputVar} from '../../../cache'
const _first_name = (navigation) => {
      EditInputVar({inputType: 'Name Input', displayInput: true})
      console.log(EditInputVar())
      //onScreen('FIRST_NAME', navigation)()

};
const _age = (navigation) => {
      EditInputVar({inputType: 'Birthday Input', displayInput: true})
      console.log(EditInputVar())
      //onScreen('AGE', navigation)()
};
const _gender = (navigation) => {
  EditInputVar({inputType: 'Gender Input', displayInput: true});
  console.log(EditInputVar());
  //onScreen('GENDER', navigation)()
};
const list = [
  {title: 'Name', icon: 'av-timer', subtitle: 'Damini', buttonPress: _first_name},
  {title: 'Age', icon: 'flight-takeoff', subtitle: '27',buttonPress: _age},
  {title: 'gender', icon: 'flight-takeoff', subtitle: 'Female',buttonPress: _gender},
]
const ProfileAttirbutes = () => {
  const [loading, setLoading] = React.useState(null)
  const didMountRef = useRef(false)
  const {currentUser, userData, userLoading} = useContext(UserContext)
  const {values: formikValues, submitForm, handleChange, handleSubmit } = useFormikContext<EditFields>();
  const navigation = useNavigation()
  // update first name on profile screen
  useEffect(() => {
    if (!userLoading) {
      const user = userData.squash;
      setLoading(true);
      // first name
      const first_name_ind_to_update = list.findIndex(
        (listAttribute) => listAttribute.title == 'Name',
      );
      list[first_name_ind_to_update].subtitle =
        formikValues.first_name + ' ' + formikValues.last_name;
      // age
      const age_ind_to_update = list.findIndex(
        (listAttribute) => listAttribute.title == 'Age',
      );
      list[age_ind_to_update].subtitle = formikValues.age;
      // age
      const ind_to_update = list.findIndex(
        (listAttribute) => listAttribute.title == 'gender',
      );
      list[ind_to_update].subtitle = formikValues.gender;
      setLoading(false);
    }
  }, [formikValues]);
const _onPressDone = () => {
  console.log('done');
};
const _onPressCancel = () => {
  console.log('done');
};
const renderDone = () => {
  return (
    <TouchableOpacity onPress={()=> _onPressDone()} style={styles.city}>
      <Text style={styles.cityText}>
        Done
      </Text>
    </TouchableOpacity>
  );
};
const renderCancel = () => {
  return (
    <TouchableOpacity onPress={()=> _onPressCancel()} style={styles.city}>
      <Text style={styles.cityText}>
       Cancel
      </Text>
    </TouchableOpacity>
  );
};

  return (
    <>
      {list.map((item, i) => (
        <ListItem
          onPress={() => item.buttonPress(navigation)}
          key={i}
          bottomDivider>
          <ListItem.Content>
            <ListItem.Title>{item.title}</ListItem.Title>
            <ListItem.Subtitle>{item.subtitle}</ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      ))}
    </>
  );
}
export  { ProfileAttirbutes }
