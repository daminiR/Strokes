import React, { createContext, useEffect, useContext, useState } from 'react'
import {FilterFields} from '@localModels'
import {Text, View } from 'react-native';
import {createInitialFilterFormik, byGameLevel} from '@utils'
import _ from 'lodash'
import {UserContext} from '@UserContext'
import { useFormikContext} from 'formik'
import {FAB} from 'react-native-elements'
import Swiper from 'react-native-deck-swiper'
import { City, MatchCard, Filters} from '@components';
import {styles }from '@styles'
import {renderMatches, swipeRightLiked, swipeLeftDisliked} from '@utils'
import { useLazyQuery, useMutation} from '@apollo/client'
import { READ_SQUASH, UPDATE_MATCHES, UPDATE_DISLIKES, UPDATE_LIKES} from '@graphQL2'
import {W, tabBarSize, SWIPIES_PER_DAY_LIMIT, likeIconStyle, dislikeIconStyle}  from '@constants'
import { isCityChangedVar, filterSportChangedVar} from '@cache'

//export const FilterContext = createContext(null)
const MatchList = ({matches}) => {
  const [updateLikes] = useMutation(UPDATE_LIKES, {
    onCompleted: () => {
      /// enable disabled like/ dislike after complete
      setDisableLikes(false)
    },
  });
  const [updateDislikes] = useMutation(UPDATE_DISLIKES, {
    onCompleted: () => {
      /// enable disabled like/ dislike after complete
      setDisableDislikes(false)
    },
  });
  const {setValues, setFieldValue, values: filterValues } = useFormikContext<FilterFields>();
  const [endingText, setEndingText] = useState(null)
  const {currentUser, queryProssibleMatches , data, userData, setData, userLoading, sendbird} = useContext(UserContext)
  console.log("user data vals here userData", userData)
  const [loadingFilters, setLoadingFilters] = useState(true)
  const [disableLikes, setDisableLikes] = useState(false)
  const [disableDisLikes, setDisableDislikes] = useState(false)
  const [disableMatches, setDisableMatches] = useState(false)
  const [matched, setMatched] = useState(false)
  const [lastMatch, setLastMatch] = useState(matches.length == 0)
  const [updateMatches] = useMutation(UPDATE_MATCHES, {
    refetchQueries: [{query: READ_SQUASH, variables: {id: currentUser.uid}}],
    awaitRefetchQueries: true,
    onCompleted: (data) => {
      getSquashProfile({variables: {id: currentUser.uid}});
      setDisableMatches(false)
      // if matched update matches and create a new group channel for two users from sb
      //if (data.updateMatches) {
        //var userIds = [currentUser.uid, data.updateMatches._id];
        //sendbird.GroupChannel.createChannelWithUserIds(
          //userIds,
          //true,
          //function (groupChannel, error) {
            //if (error) {
              //// Handle error.
              //console.log('SB_ERROR', error);
            //}
            //console.log('SB OPEN', groupChannel);
          //},
        //);
      //}

    },
  })
  useEffect(() => {
    setLoadingFilters(true);
    userData?.squash &&
      createInitialFilterFormik(userData.squash.sports).then(
        (initialValues) => {
          if (filterSportChangedVar() || isCityChangedVar()) {
            const vals = initialValues ? initialValues: filterValues
            initialValues && setValues(initialValues);
            const dislikes = userData.squash.dislikes
              ? userData.squash.dislikes.length
              : 0;
            const likes = userData.squash.likes
              ? userData.squash.likes.length
              : 0;
            const limit = dislikes + likes + SWIPIES_PER_DAY_LIMIT;
            // run matches query
            const sport = _.find(vals.sportFilters, (sportObj) => {
              return sportObj.filterSelected == true;
            }).sport;
            queryProssibleMatches({
              variables: {
                _id: currentUser.uid,
                offset: 0,
                limit: limit,
                location: _.omit(userData.squash.location, ['__typename']),
                sport: sport,
                game_levels: byGameLevel(vals.gameLevels),
                ageRange: vals.ageRange,
              },
            });
            filterSportChangedVar(false);
            isCityChangedVar(false);
          }
        },
      );
    setLoadingFilters(false);
  }, [userData?.squash.sports, isCityChangedVar()]);

  useEffect(() => {
    console.log("swipes per day", userData.squash.swipesPerDay)
      if (matches?.length == 0 && userData.squash.swipesPerDay != 0) {
        setEndingText('no more matches left!');
      }
      else if (matches?.length == 0 && userData.squash.swipesPerDay == 0) {
        setEndingText('you have reach swipe limit for the day!');
      }

      else {
        setEndingText(null);
      }
  }, [matches])
  const [ getSquashProfile] = useLazyQuery(READ_SQUASH, {
    variables: {id: currentUser.uid},
    //fetchPolicy:"cache-and-network",
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      //TODO: if data doesnt exists input is incorrect => add checks
      if (data) {
        setData(data)
      }
    }
  })

  const match = (matchVal) => {
    setMatched(matchVal)
  }
  const renderMoreMatches = () => {
    return (
      <>
        {matches.length != 0 && (
          <Swiper
            cards={matches}
            key={matches.length}
            ref={(swiper) => {
              this.swiper = swiper;
            }}
            renderCard={(card, index) => renderMatches(card, index)}
            onSwiped={(cardIndex) => {
              console.log(cardIndex);
            }}
            ///time being solution to remove swiping drag
            //horizontalSwipe={false}
            onSwipedLeft={(index) => {
              swipeLeftDisliked(
                currentUser.uid,
                matches[index],
                updateDislikes,
                false
              );
            }}
            onSwipedRight={(index) => {
              swipeRightLiked(
                userData.squash,
                currentUser.uid,
                matches[index],
                updateLikes,
                updateMatches,
                match,
                false
              );
            }}
            //hacky solution to add note at the last deck
            onSwipedAll={() => {
              setLastMatch(true);
              setEndingText('No more matches left!');
            }}
            disableBottomSwipe={true}
            disableTopSwipe={true}
            verticalSwipe={false}
            verticalThreshold={0}
            horizontalThreshold={W / 2}
            cardIndex={0}
            stackAnimationFriction={500}
            useViewOverflow={true}
            backgroundColor={'#FFFFFF'}
            cardVerticalMargin={0}
            cardHorizontalMargin={20}
            marginBottom={tabBarSize + 20}
            cardStyle={styles.swiperCardStyle}
            containerStyle={styles.swiperContainerCardStyle}
            stackSize={3}></Swiper>
        )}
      </>
    );
  };
  return (
    <>
      <MatchCard matched={matched} setMatched={setMatched} />
      <View style={styles.top}>
        <City />
        {!loadingFilters && <Filters />}
      </View>
      <View style={styles.swipeContainer}>
        {matches && renderMoreMatches()}
        {endingText && (
          <View style={styles.center}>
            <Text style={styles.nameStyle}>{endingText}</Text>
          </View>
        )}
      </View>
      <View style={styles.bottom}>
        <View style={styles.spaceLikeDislike}>
          <FAB
            icon={likeIconStyle}
            color="transparent"
            disabled={
              lastMatch ||
              disableLikes ||
              disableDisLikes ||
              disableMatches
            }
            onPress={() => {
              setDisableLikes(true);
              this.swiper.swipeRight();
            }}
            buttonStyle={styles.likeDislikeFAB}
            containerStyle={{width: 60, height: 60}}
          />
          <FAB
            icon={dislikeIconStyle}
            style={{margin: 0, padding: 0}}
            color="transparent"
            disabled={
              lastMatch ||
              disableDisLikes ||
              disableLikes ||
              disableMatches
            }
            onPress={() => {
              setDisableDislikes(true);
              this.swiper.swipeLeft();
            }}
            buttonStyle={styles.likeDislikeFAB}
            containerStyle={{width: 60, height: 60}}
          />
        </View>
      </View>
    </>
  );
};

export {MatchList};
