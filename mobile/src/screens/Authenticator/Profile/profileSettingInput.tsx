import {Theme, Text, Chip, Card, Input, Button,withBadge, ListItem, Icon, Avatar, Badge } from 'react-native-elements'
import React, { useEffect, useContext, useState, ReactElement } from 'react'
import {View, ScrollView, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import { onScreen, goBack } from '../../../constants'
import {ProfileContext} from './index'
//import {sportsList} from './../../../constants';
import  DatePicker  from 'react-native-date-picker'
import { RootStackParamList } from '../../../AppNavigator'
import { ProfileScreenNavigationProp} from './index'

type ProfileT = {
  navigation: ProfileScreenNavigationProp
}
export const SportChips = ({sport, isSelected = false, isDisplay}) => {
  const [dynamicStyle, setDynamicStyle] = React.useState(styles.ChipButton)
  const [selected, setSelected] = React.useState(isSelected)
  useEffect(() => {
    if (selected){
      console.log("selected")
      setDynamicStyle(styles.ChipButtonSelected)
    }
    else {
      setDynamicStyle(styles.ChipButton);
    }
  }, [selected])

  const _selected = (selected) => {
    console.log("toggle")
    setSelected(!selected)
  }
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
        buttonStyle={dynamicStyle}
        //type="outline"
        containerStyle={styles.singleChip}
        onPress={() => _selected(selected)}
        disabled={isDisplay}
        disabledTitleStyle={styles.chipText}
        disabledStyle={styles.ChipButton}
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
  const {squashData} = useContext(ProfileContext);
  const navigation = useNavigation()
  const [sportsList, setSportsList] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const _editSports = (props) => {
  onScreen('EDIT_SPORTS', navigation)()
  console.log("editing")
}
  useEffect(() => {
    setLoading(true)
    //if (squashData != undefined || squashData?.squash?.sports.length != 0){
    if (squashData?.squash?.sports != undefined && squashData?.squash?.sports.length != 0){
       const sportsArray = squashData!.squash!.sports
       console.log("sprotsArray")
       console.log(sportsArray)
       setSportsList(sportsArray)
       setLoading(false)
    }
  }, [squashData])

  return (
    <>
      <Card containerStyle={styles.CardStyle}>
        <Icon size={28} onPress={_editSports} name="pencil" type='material-community' style={style_edit_icon.container} />
        <Card.Title>CARD WITH DIVIDER</Card.Title>
        <Card.Divider />
        <View style={styles.sportChipSet}>
          {!loading &&
            sportsList.map((sport, i) => (
              <SportChips key={i} sport={sport.sport} isDisplay={true}/>
            ))}
        </View>
      </Card>
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
  ChipButtonSelected: {
    borderColor: 'grey',
    backgroundColor: '#d3d3d3',
    fontSize: 200,
    borderWidth: 1,
    padding: 4
  },
  ChipButton: {
    borderColor: 'grey',
    fontSize: 200,
    backgroundColor: '#fff',
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
export { ProfileSettingsInput }
