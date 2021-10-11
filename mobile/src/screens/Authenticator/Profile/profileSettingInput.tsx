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
import { ProfileFields, SignIn} from '../../../localModels/UserSportsList'
type ProfileT = {
  navigation: ProfileScreenNavigationProp
}
const ProfileSettingsInput = (props) => {
  const didMountRef = useRef(false)
  const navigation = useNavigation()
  const [sportsList, setSportsList] = React.useState([{sport:"Tennis", game_level: 0}])
  const {values: formikValues, submitForm, handleChange, handleSubmit } = useFormikContext<ProfileFields>();
  const [description, setDescription] = React.useState('Description')
  const {currentUser, userData, userLoading} = useContext(UserContext)
  const [loadingSports, setLoadingSports] = React.useState(false)
  const [loadingDescription, setLoadingDescription] = React.useState(false)
  const _editSports = (props) => {
  sportsItemsVar(userData.squash.sports)
  onScreen('EDIT_SPORTS', navigation)()
}
  const _editDescription = (props) => {
  DescriptionVar(userData.squash.description)
  onScreen('EDIT_DESCRIPTION', navigation)()
}
  useEffect(() => {
    if (!userLoading) {
      const user = userData.squash;
        setLoadingSports(true);
        setLoadingDescription(true);
        if (user.sports != undefined && user.sports.length != 0) {
          const sportsArray = userData!.squash!.sports;
          setSportsList(formikValues.sports);
          setLoadingSports(false);
        }
        if (user.description != undefined && user.description.length != 0) {
          // TODO: add this to sigup
          const descriptionValue = user.description;
          setDescription(descriptionValue);
          setLoadingDescription(false);
        }
    }
  }, [userLoading]);
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
          {!loadingDescription && <Text> {description} </Text>}
        </View>
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
    //...StyleSheet.absoluteFillObject,
    alignSelf: 'flex-end',
    margin: 4,
  }
});
export {style_edit_icon, SportChipsstyles, ProfileSettingsInput }
