import {Theme, Text, Chip, Card, Input, Button,withBadge, ListItem, Icon, Avatar, Badge } from 'react-native-elements'
import React, { useContext, useState, ReactElement } from 'react'
import {View, ScrollView, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import { onScreen, goBack } from '../../../constants'
import {sportsList} from './../../../constants';
import  DatePicker  from 'react-native-date-picker'
import { RootStackParamList } from '../../../AppNavigator'
import { ProfileScreenNavigationProp} from './index'

type ProfileT = {
  navigation: ProfileScreenNavigationProp
}
const SportChips = ({sport}) => {
  return (
    <>
      <Chip
        title= {sport}
        titleStyle={styles.chipText}
        icon={{
          name: 'bluetooth',
          type: 'font-awesome',
          size: 20,
          color: 'black',
        }}
        buttonStyle={styles.ChipButton}
        type="outline"
        containerStyle={styles.singleChip}
      />
    </>
  );
};
const _first_name = (navigation) => {
      onScreen('FIRST_NAME', navigation)()
};
const _age = (navigation) => {
      onScreen('AGE', navigation)()
};
const _gender = (navigation) => {
      onScreen('GENDER', navigation)()
};
const _last_name = (navigation) => {
      onScreen('LAST_NAME', navigation)()
};
const list = [
  {title: 'first name', icon: 'av-timer', subtitle: 'Damini', buttonPress: _first_name},
  {title: 'last name', icon: 'flight-takeoff', subtitle: 'Rijhwani', buttonPress: _last_name},
  {title: 'age', icon: 'flight-takeoff', subtitle: '27',buttonPress: _age},
  {title: 'gender', icon: 'flight-takeoff', subtitle: 'Female',buttonPress: _gender},
]

const ProfileSettingsInput = (props) => {
  //<Icon name={item.icon} />
  const navigation = useNavigation()
  return (
    <>
      <Card containerStyle={styles.CardStyle}>
        <Card.Title>CARD WITH DIVIDER</Card.Title>
        <Card.Divider />
        <View style={styles.sportChipSet}>
          {sportsList.map((sport, i) => (
          <SportChips key={i} sport={sport}/>
          ))}
        </View>
      </Card>
      {list.map((item, i) => (
        <ListItem onPress={() => item.buttonPress(navigation)} key={i} bottomDivider>
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
    fontFamily: 'sans-serif',
    alignSelf: 'stretch'

  },
  textSettingFont: {
    color: 'grey',
    fontSize: 20,
    fontFamily: 'sans-serif',
    alignSelf: 'stretch'

  },
  chipText: {
    color: '#242424',
    fontFamily:'sans-serif',
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
    fontFamily: 'sans-serif',
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

export { ProfileSettingsInput }
