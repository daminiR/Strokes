import {Theme, Text, Chip, Card, Input, Button,withBadge, ListItem, Icon, Avatar, Badge } from 'react-native-elements'
import React, { useRef, useEffect, useContext, useState, ReactElement } from 'react'
import {View, ScrollView, StyleSheet} from 'react-native';
import {sportsItemsVar} from '../../../cache'
import {useNavigation} from '@react-navigation/native';
import { onScreen, goBack } from '../../../constants'
import {ProfileContext} from './index'
import { useQuery, useMutation, useLazyQuery, HTTPFetchNetworkInterface} from '@apollo/client'
//import {sportsList} from './../../../constants';
import  DatePicker  from 'react-native-date-picker'
import { RootStackParamList } from '../../../AppNavigator'
import { ProfileScreenNavigationProp} from './index'
import { SportContext } from '../IndividualSports/index'
import {GET_SPORTS_LIST} from '../../../graphql/queries/profile'
import {ProfileAttirbutes} from "./ProfileAttributes"
type ProfileT = {
  navigation: ProfileScreenNavigationProp
}
export const SportChips = ({sport, isSelected = false, isDisplay, getData=null}) => {
  const [dynamicStyle, setDynamicStyle] = React.useState(SportChipsstyles.ChipButton)
  const [selected, setSelected] = React.useState(isSelected)
  useEffect(() => {
    if (selected){
      setDynamicStyle(SportChipsstyles.ChipButtonSelected)
    }
    else {
      setDynamicStyle(SportChipsstyles.ChipButton);
    }
  }, [selected])

  const _selected = (selected) => {
    if (selected) {
      selected = false;
      setSelected(selected)
    } else {
      selected = true;
      setSelected(selected)
    }
      getData(sport, selected)
  }
  return (
    <>
      <Chip
        title= {sport}
        titleStyle={SportChipsstyles.chipText}
        icon={{
          name: 'bluetooth',
          type: 'font-awesome',
          size: 20,
          color: 'black',
        }}
        buttonStyle={dynamicStyle}
        containerStyle={SportChipsstyles.singleChip}
        onPress={() => _selected(selected)}
        disabled={isDisplay}
        disabledTitleStyle={SportChipsstyles.chipText}
        disabledStyle={SportChipsstyles.ChipButton}
      />
    </>
  );
};

const ProfileSettingsInput = (props) => {
  const didMountRef = useRef(false)
  const {squashData, newSportList} = useContext(ProfileContext);
  const navigation = useNavigation()
  const [sportsList, setSportsList] = React.useState([{sport:"Tennis", game_level: 0}])
  const [loading, setLoading] = React.useState(false)
  const _editSports = (props) => {
  sportsItemsVar(squashData.squash.sports)
  onScreen('EDIT_SPORTS', navigation)()
}
  useEffect(() => {
    if (didMountRef.current){
  setLoading(true);
  if (
    squashData?.squash?.sports != undefined &&
    squashData?.squash?.sports.length != 0
  ) {
    const sportsArray = squashData!.squash!.sports;
    setSportsList(sportsArray);
    setLoading(false);
  }
  // for first name
}
    else {
      didMountRef.current = true
    }

  }, [squashData?.squash?.sports])

  return (
    <>
      <Card containerStyle={SportChipsstyles.CardStyle}>
        <Icon size={28} onPress={_editSports} name="pencil" type='material-community' style={style_edit_icon.container} />
        <Card.Title>CARD WITH DIVIDER</Card.Title>
        <Card.Divider />
        <View style={SportChipsstyles.sportChipSet}>
          {!loading &&
            sportsList.map((sport, i) => (
              <SportChips key={i} sport={sport.sport} isDisplay={true}/>
            ))}
        </View>
      </Card>
     <ProfileAttirbutes/>
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
export { SportChipsstyles, ProfileSettingsInput }
