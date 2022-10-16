import {Chip } from 'react-native-elements'
import _ from 'lodash'
import {Image, TouchableOpacity } from 'react-native-elements'
import { useFormikContext} from 'formik';
import { sportIconMap, customIcons, customIconMap} from '@constants';
import React, {useEffect,useState} from 'react'
import {styles} from '@styles'
import LinearGradient from 'react-native-linear-gradient'
import {GameLevelChoose} from '@components'
import { EditFields, ProfileFields} from '@localModels'
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
const icoMoonConfig = require('./../../selection.json')
const Icon = createIconSetFromIcoMoon(icoMoonConfig);

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
   console.log(sport)
   const [dynamicStyle, setDynamicStyle] = useState(styles.ChipButton);
   const [loadingGameStyle, setLoadingGameStyle] = useState(true);
   const [gameLevelStyle, setGameLevelStyle] = useState(null);
   const [gameLevelVisible, setGameLevelVisible] = useState(false)
   const [sportIcon, setSportIcon] = useState(sportIconMap[sport])
   const [gameLevelInput, setGameLevelInput] = useState(gameLevel)
   const [isDisplayInput, setIsDisplayInput] = useState(isDisplay)
   const {setFieldTouched, touched} = useFormikContext<ProfileFields | EditFields>();
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

   const renderIcon = () => {
     const customIcon = customIconMap[sport]
     console.log("sport log", customIcon)
     return (
       <>
          <Icon name={customIcon} size={25}/>
       </>
     );
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
               icon={_.has(customIconMap, sport) ? renderIcon : sportIcon}
               buttonStyle={dynamicStyle}
               containerStyle={styles.singleChip}
               onPress={() => {
                 if (!touched.sports) {
                   setFieldTouched('sports');
                 }
                 setGameLevelVisible(true);
               }}
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
           icon={_.has(customIconMap, sport) ? renderIcon : sportIcon}
           buttonStyle={dynamicStyle}
           containerStyle={styles.singleChip}
           onPress={() => {
             if (!touched.sports) {
               setFieldTouched('sports');
             }
             setGameLevelVisible(true);
           }}
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
