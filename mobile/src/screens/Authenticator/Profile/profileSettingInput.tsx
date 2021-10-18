import {Theme, Text, Chip, Card, Input, Button,withBadge, ListItem, Icon, Avatar, Badge } from 'react-native-elements'
import React, { useRef, useEffect, useContext, useState, ReactElement } from 'react'
import {View, StyleSheet} from 'react-native';
import {sportsItemsVar, DescriptionVar} from '../../../cache'
import {useNavigation} from '@react-navigation/native';
import { onScreen, goBack } from '../../../constants'
import {ProfileContext} from './index'
import { SportChips} from '../../../components'
import { ProfileScreenNavigationProp} from './index'
import {UserContext} from '../../../UserContext'
import {ProfileAttirbutes} from "./ProfileAttributes"
import styles from '../../../assets/styles'
import { useFormikContext} from 'formik';
import { EditFields} from '../../../localModels/UserSportsList'
import { EditInputVar} from '../../../cache'
type ProfileT = {
  navigation: ProfileScreenNavigationProp
}
const ProfileSettingsInput = (props) => {
  const didMountRef = useRef(false)
  const navigation = useNavigation()
  const [sportsList, setSportsList] = React.useState([{sport:"Tennis", game_level: 0}])
  const {values: formikValues, submitForm, handleChange, handleSubmit } = useFormikContext<EditFields>();
  const [description, setDescription] = React.useState('Description')
  const {currentUser, userData, userLoading} = useContext(UserContext)
  const [loadingSports, setLoadingSports] = React.useState(false)
  const [loadingDescription, setLoadingDescription] = React.useState(false)
  const _editSports = (props) => {
      EditInputVar({inputType: 'Sports Input', displayInput: true})
      console.log(EditInputVar())
}
  const _editDescription = (props) => {
      EditInputVar({inputType: 'Description Input', displayInput: true})
      console.log(EditInputVar())
}
  useEffect(() => {
        const user = formikValues
        setLoadingSports(true);
        setLoadingDescription(true);
        setSportsList(formikValues.sports);
          setLoadingSports(false);
           //TODO: add this to sigup
         //TODO: description change here
          const descriptionValue = user.description;
          setDescription(descriptionValue);
          setLoadingDescription(false);
        //}
  }, [formikValues]);
  return (
    <>
      <Card containerStyle={styles.CardStyle}>
        <Icon size={28} onPress={_editSports} name="pencil" type='material-community' style={style_edit_icon.container} />
        <Card.Title>CARD WITH DIVIDER</Card.Title>
        <Card.Divider />
        <View style={styles.sportChipSet}>
          {!loadingSports &&
            sportsList.map((sport, i) => (
              <SportChips key={i} sport={sport.sport} isDisplay={true}/>
            ))}
        </View>
      </Card>
      <Card containerStyle={styles.CardStyle}>
        <Icon size={28} onPress={_editDescription} name="pencil" type='material-community' style={style_edit_icon.container} />
        <View style={styles.sportChipSet}>
        <View style={styles.sportChipSet}>
          {!loadingDescription && <Text style={styles.descriptionFontStyle}> {description} </Text>}
        </View>
        </View>
      </Card>
      <Card containerStyle={styles.CardStyle}>
        <ProfileAttirbutes/>
      </Card>
    </>
  );
}

const listProfileTitles = [" sports", "age", "gender", "first name", "last name"]
const SettingsButton = (props) => {
  const { titleName } = props
  return (
    <>
      <Button
        title={titleName}
        type='outline'
        containerStyle = {SportChipsstyles.profileButtons}
        titleStyle={SportChipsstyles.textSettingFont}
        buttonStyle={{ justifyContent: 'flex-start' }}
      />
    </>
  );
}

const SportsList = (props) => {
  return (
    <>
      <Button
        icon={{name: 'fitness-center', type:'material', size: 15, color: 'white'}}
        title="Button with icon object"
      />
    </>
  );
}
 const SportChipsstyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 2,
    margin: 0,
  },
  user: {
    color: 'grey',
    fontSize: 20,
    fontFamily: 'OpenSans-Regular',
    alignSelf: 'stretch'

  },
  textSettingFont: {
    color: 'grey',
    fontSize: 20,
    fontFamily: 'OpenSans-Regular',
    alignSelf: 'stretch'

  },
  profileButtons: {
    flex: 1,
    margin: 2,
    backgroundColor: 'white',
    borderWidth: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  middle: {
    flex: 1.1,
    height: 0,
    backgroundColor: 'white',
    borderWidth: 5,
  },
  horizontalImageplaceholder: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  verticalImageplaceholder: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
});

 const style_edit_icon = StyleSheet.create({
  container: {
    alignSelf: 'flex-end',
    margin: 4,
  }
});
export {style_edit_icon, SportChipsstyles, ProfileSettingsInput }
