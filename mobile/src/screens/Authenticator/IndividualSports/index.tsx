import {Theme, Text, Chip, Card, Input, Button,withBadge, ListItem, Icon, Avatar, Badge } from 'react-native-elements'
import React, { useLayoutEffect, createContext, useEffect, useContext, useState, ReactElement } from 'react'
import {View, ScrollView, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import { onScreen, goBack } from '../../../constants'
import {ProfileContext} from './index'
import {sportsList} from './../../../constants';
import styles from '../../../assets/styles/'
import { ProfileScreenNavigationProp} from './index'
import {SportChips} from '../../../components'
import { HeaderBackButton, StackHeaderLeftButtonProps } from '@react-navigation/stack';
import { useQuery, useMutation, useLazyQuery} from '@apollo/client'
import {GET_SPORTS_LIST} from '../../../graphql/queries/profile'
import {sportsItemsVar} from '../../../cache'
import {ChooseSportsChips} from '../../../components'
import { useReactiveVar } from "@apollo/client"
export const SportContext = createContext()
type IndividualSportsT = {
  navigation: ProfileScreenNavigationProp
}
const IndividualSports = ({navigation}: IndividualSportsT): ReactElement => {
  const [newSportList, setNewSportList] = useState(null);
  const sportItems = useReactiveVar(sportsItemsVar)
  return (
    <>
      <ChooseSportsChips userSportsList={sportItems}/>
    </>
  );
};
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

const style_edit_icon = StyleSheet.create({
  container: {
    //...StyleSheet.absoluteFillObject,
    alignSelf: 'flex-end',
    margin: 4,

  }
});
export { IndividualSports }
