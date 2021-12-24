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

 const SportChips = ({sport, removeSport=null, gameLevel = null, isSelected = false, isDisplay, getData=null, isSignUp}) => {
   const [dynamicStyle, setDynamicStyle] = useState(styles.ChipButton);
   const [loadingGameStyle, setLoadingGameStyle] = useState(true);
   const [gameLevelStyle, setGameLevelStyle] = useState(null);
   const [gameLevelVisible, setGameLevelVisible] = useState(false)
   const [gameLevelInput, setGameLevelInput] = useState(gameLevel)
   const [isDisplayInput, setIsDisplayInput] = useState(isDisplay)
   useEffect(() => {
     setGameLevelInput(gameLevel)
   }, [gameLevel]);

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
               onPress={() => setGameLevelVisible(true)}
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
           onPress={() => setGameLevelVisible(true)}
           disabled={isDisplayInput}
           disabledTitleStyle={styles.chipText}
           disabledStyle={gameLevelStyle}
         />

       </>
     );
   };
   return (
     <>
       {!isDisplayInput && (
         <GameLevelChoose
           setDynamicStyle={setDynamicStyle}
           isVisible={gameLevelVisible}
           setIsVisible={setGameLevelVisible}
           setGameLevelInput={setGameLevelInput}
           sport={sport}
           getData={getData}
           removeSport={removeSport}
           isSignUp={isSignUp}
         />
       )}

       {gameLevelInput ? renderColored() : renderNormal()}
     </>
   );
 };

export { SportChips }
