import {Theme, Text, Chip, Card, Input, Button,withBadge, ListItem, Icon, Avatar, Badge } from 'react-native-elements'
import React, { useRef, useEffect, useContext, useState, ReactElement } from 'react'
import {View, ScrollView, StyleSheet} from 'react-native';
import {sportsItemsVar, DescriptionVar} from '../../../cache'
import {useNavigation} from '@react-navigation/native';
import { onScreen, goBack } from '../../../constants'
import {ProfileContext} from './index'
import { useQuery, useMutation, useLazyQuery, HTTPFetchNetworkInterface} from '@apollo/client'
import styles from '../../assets/styles'

 const SportChips = ({sport, gameLevel = null, isSelected = false, isDisplay, getData=null}) => {
  const [dynamicStyle, setDynamicStyle] = React.useState(styles.ChipButton)
  const [gameLevelStyle, setGameLevelStyle] = React.useState(styles.ChipButton)
  const [selected, setSelected] = React.useState(isSelected)
  useEffect(() => {
    if (!isDisplay){
    if (selected) {
      setDynamicStyle(styles.ChipButtonSelected);
    } else {
      setDynamicStyle(styles.ChipButton);
    }
    }
  }, [selected])
  useEffect(() => {
    if (isDisplay) {
      console.log("gameLevel",gameLevel)
      if (gameLevel){
        switch (gameLevel) {
          // beginners
          case 0: {
            setGameLevelStyle(styles.ChipButtonGameLevel2);
          }
          // intermediate
          case 1: {
            setGameLevelStyle(styles.ChipButtonGameLevel1);
          }
          // advanced
          case 2: {
            setGameLevelStyle(styles.ChipButtonGameLevel2);
          }
        }
    }
      }
  }, [])

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
        titleStyle={styles.chipText}
        type="solid"
        icon={{
          name: 'bluetooth',
          type: 'font-awesome',
          size: 20,
          color: 'black',
        }}
        buttonStyle={dynamicStyle}
        containerStyle={styles.singleChip}
        onPress={() => _selected(selected)}
        disabled={isDisplay}
        disabledTitleStyle={styles.chipText}
        disabledStyle={gameLevelStyle}
      />
    </>
  );
};

export { SportChips }
