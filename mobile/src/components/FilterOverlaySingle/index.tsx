import {styles} from '@styles'
import {UserContext} from '@UserContext'
import React, {useEffect, useState, useContext} from 'react'
import { View, Text } from 'react-native';
import {Overlay, CheckBox, Card} from 'react-native-elements'
import { Cancel, FilterChip, Done} from '@components'
import _ from 'lodash'
import {FilterFields} from '@localModels'
import {_retriveGameLevel, _retriveAgeRangeFilter, _retriveSportFilter, _storeAgeRangeFilter, _storeGameLevelFilter, _storeSportFilter} from '@localStore'
import {defaultAgeRange, SWIPIES_PER_DAY_LIMIT} from '@constants'
import { useFormikContext} from 'formik'
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import {FilterSportContext} from '@Contexts'
import {byGameLevel} from '@utils'

  //// TODO : this needs to update every time user changes list of activities
const FilterOverlaySingle = ({filter, setFilter}) => {
  console.log("filter ber .....................")
  const {setValues, values: filterValues } = useFormikContext<FilterFields>();
  console.log("filterValues",)
  const [multiSliderValue, setMultiSliderValue] = useState(defaultAgeRange);

  const [allUserSportsFilter, setAllUserSportsFilter] = useState(filterValues.sportFilters);

  const [gameLevel1, setGameLevel1] = useState(false);
  const [gameLevel2, setGameLevel2] = useState(false);
  const [gameLevel0, setGameLevel0] = useState(false);
  const {userData, queryProssibleMatches, potentialMatches, currentUser, data: currentUserData, userLoading, setPotentialMatches} = useContext(UserContext)

  const value = {
    allUserSportsFilter: allUserSportsFilter,
    setAllUserSportsFilter: setAllUserSportsFilter,
  };
  useEffect(() => {
    setGameLevel0(filterValues.gameLevels.gameLevel0);
    setGameLevel1(filterValues.gameLevels.gameLevel1);
    setGameLevel2(filterValues.gameLevels.gameLevel2);
    // age changes if any
    setMultiSliderValue(filterValues.ageRange)
    /// sport filter
    setAllUserSportsFilter(filterValues.sportFilters)
  }, [filter]);

  const _onCancel = () => {
    console.log("is this working")
    //handleReset()
    setFilter(false)
  };
  const _onDone = () => {
    const gameLevelObj = {
      gameLevel0: gameLevel0,
      gameLevel1: gameLevel1,
      gameLevel2: gameLevel2,
    };
    setValues({... filterValues, 'ageRange': multiSliderValue, 'gameLevels': gameLevelObj, 'sportFilters': allUserSportsFilter});
    _storeAgeRangeFilter(multiSliderValue)
    const sportFilter = _.find(allUserSportsFilter, ['filterSelected', true])
    _storeSportFilter(sportFilter)
    _storeGameLevelFilter(gameLevelObj);
    console.log("new sotrage sports", sportFilter, gameLevelObj, multiSliderValue)
        const dislikes = userData.squash.dislikes ? userData.squash.dislikes.length : 0;
        const likes = userData.squash.likes ? userData.squash.likes.length : 0;
        console.log(likes)
        const limit = dislikes + likes + SWIPIES_PER_DAY_LIMIT;
        queryProssibleMatches({
          variables: {
            _id: currentUser.uid,
            offset: 0,
            limit: limit,
            location: _.omit(userData.squash.location, ['__typename']),
            sport: sportFilter.sport,
            game_levels: byGameLevel(gameLevelObj),
            ageRange: multiSliderValue
          },
        });
    setFilter(false)
  };

  const _onPressGameLevel = (gameLevel) => {
    switch (gameLevel) {
      case 0:
        setGameLevel0(!gameLevel0);
        break;
      case 1:
        setGameLevel1(!gameLevel1);
        break;
      case 2:
        setGameLevel2(!gameLevel2);
        break;
    }
  };
  const renderFilter = () => {
  return (
    // TODO:set the sports car filters, age, and game level thats all for now
    <Overlay isVisible={filter}>
      <View>
        <View style={styles.top}>
          <Cancel _onPressCancel={_onCancel} />
          <Done _onPressDone={_onDone} />
        </View>
        <View style={styles.filterOverlay}>
          <View>
            <Text>
              Age between {multiSliderValue.minAge} and{' '}
              {multiSliderValue.maxAge}
            </Text>
            <MultiSlider
              values={[multiSliderValue.minAge, multiSliderValue.maxAge]}
              onValuesChange={(values) =>
                setMultiSliderValue({minAge: values[0], maxAge: values[1]})
              }
              min={defaultAgeRange.minAge}
              max={defaultAgeRange.maxAge}
              step={1}
              allowOverlap
              snapped
            />
            <View style={styles.sportChipSet}>
                <FilterSportContext.Provider value={value}>
                  <Card containerStyle={styles.CardStyle}>
                    <Card.Title> List of Acitivities</Card.Title>
                    <Card.Divider />
                    <View style={styles.sportChipSet}>
                      {allUserSportsFilter.map((sportObj, i) => (
                        <FilterChip key={i} sport={sportObj.sport} />
                      ))}
                    </View>
                  </Card>
                </FilterSportContext.Provider>
            </View>
          </View>
          <View style={{marginTop: 20}}>
            <Text style={styles.filtersText}>Filter level for:</Text>
            <CheckBox
              title="Beginner"
              checked={gameLevel0}
              onPress={() => _onPressGameLevel(0)}
            />
            <CheckBox
              title="Intermediate"
              checked={gameLevel1}
              onPress={() => _onPressGameLevel(1)}
            />
            <CheckBox
              title="Advanced"
              checked={gameLevel2}
              onPress={() => _onPressGameLevel(2)}
            />
          </View>
        </View>
      </View>
    </Overlay>
  );
  }
  return (
      renderFilter()
  );
};

export {FilterOverlaySingle}
