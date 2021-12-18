import {Theme, Text, Chip, Card, Input, Button,withBadge, ListItem, Icon, Avatar, Badge } from 'react-native-elements'
import React, { useRef, useEffect, useContext, useState, ReactElement } from 'react'
import {View, ScrollView, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import styles from '../../assets/styles'
import LinearGradient from 'react-native-linear-gradient'
import {GameLevelChoose} from '../ChooseSportChips/'

const intermediate = {
                 colors: ['#ff7f02', 'white', 'white', 'white'],
                 start: {x: 0.75, y: 0},
                 end: {x: 0.95, y: 0},
}
const beginners = {
                 colors: ['#ff7f02', 'white', 'white', 'white'],
                 start: {x: 0.35, y: 0},
                 end: {x: 0.65, y: 0},
}
const advanced = {
                 colors: ['#ff7f02', '#ff7f02'],
                 // the start and end dont matter
                 start: {x: 0.35, y: 0},
                 end: {x: 0.65, y: 0},
}

 const SportChips = ({sport, isUndo= false, gameLevel = null, isSelected = false, isDisplay, getData=null}) => {
   const [dynamicStyle, setDynamicStyle] = useState(styles.ChipButton);
   const [loadingGameStyle, setLoadingGameStyle] = useState(true);
   const [gameLevelStyle, setGameLevelStyle] = useState(null);
   const [selected, setSelected] = useState(isSelected);
   const [isCancelled, setIsCancelled] = useState(false);
   const [gameLevelVisible, setGameLevelVisible] = useState(false)
   const [trial, setTrial] = useState('0')
   const [gameLevelInput, setGameLevelInput] = useState(gameLevel)
   const [isDisplayInput, setIsDisplayInput] = useState(isDisplay)

   useEffect(() => {
     //if (isDisplayInput) {
    setLoadingGameStyle(true);
    if (gameLevelInput) {
      switch (gameLevelInput) {
        //beginners
        case '0':
          setGameLevelStyle(beginners);
          setLoadingGameStyle(false);
          break;
        // intermediate
        case '1':
          setGameLevelStyle(intermediate);
          setLoadingGameStyle(false);
          break;
        // advanced
        case '2':
          setGameLevelStyle(advanced);
          setLoadingGameStyle(false);
          break;
      }
    }
     //}
   }, [gameLevelInput]);

   const _selected = (selected) => {
    setGameLevelVisible(true)
     if (selected) {
       selected = false;
       setSelected(selected);
     } else {
       selected = true;
       setSelected(selected);
     }
     getData(sport, selected);
   };
   const renderColored = () => {
     return (
       <>
         {!loadingGameStyle ? (
           <>
             <Chip
               ViewComponent={LinearGradient}
               linearGradientProps={gameLevelStyle}
               title={sport}
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
               disabled={isDisplayInput}
               disabledTitleStyle={styles.chipText}
               disabledStyle={styles.ChipButton}
             />
           </>
         ) : (
           renderNormal()
         )}
       </>
     );
   };

   const renderNormal = () => {
     return (
       <>
         <Chip
           title={sport}
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
           disabled={isDisplayInput}
           disabledTitleStyle={styles.chipText}
           disabledStyle={gameLevelStyle}
         />
         <GameLevelChoose
           setDynamicStyle={setDynamicStyle}
           isVisible={gameLevelVisible}
           setIsVisible={setGameLevelVisible}
           setGameLevelInput={setGameLevelInput}
           setIsDisplayInput={setIsDisplayInput}
         />
       </>
     );
   };
   return <>{gameLevelInput ? renderColored() : renderNormal()}</>;
 };

export { SportChips }
