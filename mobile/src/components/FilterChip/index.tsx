import {Chip} from 'react-native-elements'
import React, { useEffect, useContext } from 'react'
import styles from '../../assets/styles'
import {FilterSportContext} from '../../Contexts'
import _ from 'lodash'
import {_storeSportFilter} from '../../utils/AsyncStorage/storeData'

const FilterChip = (props) => {
  const sport = props.sport;
  const {allUserSportsFilter, setAllUserSportsFilter} = useContext(
    FilterSportContext
  );
  const [dynamicStyle, setDynamicStyle] = React.useState(styles.ChipButton);
  useEffect(() => {
    const filterSelected = _.find(
      allUserSportsFilter,
      (filterSportObj) => {
        return filterSportObj.sport == sport;
      },
    ).filterSelected;
    if (filterSelected) {
      setDynamicStyle(styles.ChipButtonSelected);
    } else {
      setDynamicStyle(styles.ChipButton);
    }
  }, [allUserSportsFilter]);

  const _selected = () => {
    const trial = _.map(allUserSportsFilter, (obj) => {
      if (obj.sport == sport) {
        return {sport: obj.sport, filterSelected: true};
      } else {
        return {sport: obj.sport, filterSelected: false};
      }
    });
    setAllUserSportsFilter(trial);
    //setValues({...filterValues, sportFilters: trial});
  };
  return (
    <>
      <Chip
        title={sport}
        titleStyle={styles.chipText}
        icon={{
          name: 'bluetooth',
          type: 'font-awesome',
          size: 20,
          color: 'black',
        }}
        buttonStyle={dynamicStyle}
        containerStyle={styles.singleChip}
        onPress={() => _selected()}
        disabled={false}
        disabledTitleStyle={styles.chipText}
        disabledStyle={styles.ChipButton}
      />
    </>
  );
};

export  {FilterChip}
