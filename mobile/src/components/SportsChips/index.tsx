import {Theme, Text, Chip, Card, Input, Button,withBadge, ListItem, Icon, Avatar, Badge } from 'react-native-elements'
import React, { useRef, useEffect, useContext, useState, ReactElement } from 'react'
import {View, ScrollView, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import styles from '../../assets/styles'
import LinearGradient from 'react-native-linear-gradient'
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

 const SportChips = ({sport, gameLevel = null, isSelected = false, isDisplay, getData=null}) => {
   const [dynamicStyle, setDynamicStyle] = useState(styles.ChipButtonGameLevel2);
   const [loadingGameStyle, setLoadingGameStyle] = useState(true);
   const [gameLevelStyle, setGameLevelStyle] = useState(null);
   const [selected, setSelected] = React.useState(isSelected);
   useEffect(() => {
     if (!isDisplay) {
       if (selected) {
         setDynamicStyle(styles.ChipButtonSelected);
       } else {
         setDynamicStyle(styles.ChipButton);
       }
     }
   }, [selected]);
   useEffect(() => {
     if (isDisplay) {
         if (gameLevel){
         switch (gameLevel) {
            //beginners
           case '0':
             setGameLevelStyle(beginners);
             break;

           // intermediate
           case '1':
             setGameLevelStyle(intermediate);
             break;

           // advanced
           case '2':
             setGameLevelStyle(advanced);
             break;
         }
         }
     }
     setLoadingGameStyle(false)
   }, []);

   const _selected = (selected) => {
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
         {!loadingGameStyle && (
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
               disabled={isDisplay}
               disabledTitleStyle={styles.chipText}
               disabledStyle={styles.ChipButton}
             />
           </>
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
           disabled={isDisplay}
           disabledTitleStyle={styles.chipText}
           disabledStyle={gameLevelStyle}
         />
       </>
     );
   };

   return <>{gameLevel ? renderColored() : renderNormal()}</>;
 };

export { SportChips }
