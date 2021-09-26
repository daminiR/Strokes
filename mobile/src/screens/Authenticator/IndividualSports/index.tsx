import {Theme, Text, Chip, Card, Input, Button,withBadge, ListItem, Icon, Avatar, Badge } from 'react-native-elements'
import React, { useEffect, useContext, useState, ReactElement } from 'react'
import {View, ScrollView, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import { onScreen, goBack } from '../../../constants'
import {ProfileContext} from './index'
import {sportsList} from './../../../constants';
import  DatePicker  from 'react-native-date-picker'
import { RootStackParamList } from '../../../AppNavigator'
import { ProfileScreenNavigationProp} from './index'
import {SportChips} from '../Profile/profileSettingInput'

type IndividualSportsT = {
  navigation: ProfileScreenNavigationProp
}
const IndividualSports = ({ navigation }: IndividualSportsT): ReactElement => {
  return (
    <>
      <ChooseSportsChips/>
    </>
  )
}

const ChooseSportsChips = ({useSportsList}) => {
  return (
    <>
      <Card containerStyle={styles.CardStyle}>
        <Card.Title> List of Acitivities</Card.Title>
        <Card.Divider />
        <View style={styles.sportChipSet}>
          {sportsList.map((sport, i) => (
              <SportChips key={i} sport={sport} isDisplay={false} isSelected={true}/>
            ))}
        </View>
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
        containerStyle = {styles.profileButtons}
        titleStyle={styles.textSettingFont}
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

const styles = StyleSheet.create({
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
  chipText: {
    color: '#242424',
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    fontWeight: "normal"
  },
  ChipButton: {
    borderColor: 'grey',
    borderWidth: 1,
    padding: 4

  },
  CardStyle: {
    padding: 5,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  singleChip: {
    padding: 3,
  },
  sportChipSet: {
    flexWrap: "wrap",
    justifyContent: 'center',
    color: 'grey',
    fontSize: 20,
    fontFamily: 'OpenSans-Regular',
    flexDirection: "row"
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
export { IndividualSports }
