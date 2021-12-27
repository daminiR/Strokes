import React, { createContext, useEffect, useContext, useState } from 'react'
import {Text, View } from 'react-native';
import {UserContext} from '../../../UserContext'
import {FAB} from 'react-native-elements'
import Swiper from 'react-native-deck-swiper'
import { City } from '../../../components/City/City';
import { MatchCard, Filters} from '../../../components/';
import styles from '../../../assets/styles/'
import {READ_SQUASH} from '../../../graphql/queries/profile'
import {renderMatches, swipeRightLiked, swipeLeftDisliked} from '../../../utils/matching/swipeFuntions'
import { useLazyQuery, useMutation} from '@apollo/client'
import {UPDATE_MATCHES, UPDATE_DISLIKES, UPDATE_LIKES} from '../../../graphql/mutations/profile'
import {W, tabBarSize}  from '../../../constants'
const likeIconStyle= {
    type: 'material-community',
    name: 'heart',
    color: '#ff7f02',
    size: 60,
    style:{margin:0, padding: 0,
    shadowOpacity:0,
    elevation:0
    },
    containerStyle: {padding:0,
    },
  }
const dislikeIconStyle= {
    type: 'material-community',
    name: 'close-circle-outline',
    color: '#ff7f02',
    style:{margin:0, padding: 0,
    shadowOpacity:0,
    elevation:0
    },
    containerStyle: {padding:0,
    },
    size: 60,
  }

export const FilterContext = createContext(null)
const Test = ({matches}) => {
  const [updateLikes] = useMutation(UPDATE_LIKES);
  const [updateDislikes] = useMutation(UPDATE_DISLIKES);
  const [endingText, setEndingText] = useState(null)
  const {currentUser , userData, setData} = useContext(UserContext)
  const [matched, setMatched] = useState(false)
  const [updateMatches] = useMutation(UPDATE_MATCHES, {
    refetchQueries: [{query: READ_SQUASH, variables: {id: currentUser.uid}}],
    awaitRefetchQueries: true,
    onCompleted: () => {
      getSquashProfile({variables: {id: currentUser.uid}});
    },
  })
  useEffect(() => {
      if (matches?.length == 0) {
        setEndingText('No more matches left!');
      } else {
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
  return (
    <>
      <MatchCard matched={matched} setMatched={setMatched} />
      <View style={styles.top}>
        <City />
        <Filters />
      </View>
        <View style={styles.swipeContainer}>
          {matches.length != 0 && (
            <Swiper
              cards={matches}
              ref={(swiper) => {
                this.swiper = swiper;
              }}
              renderCard={(card, index) => renderMatches(card, index)}
              onSwiped={(cardIndex) => {
                console.log(cardIndex);
              }}
              onSwipedLeft={(index) => {
                swipeLeftDisliked(
                  currentUser.uid,
                  matches[index],
                  updateDislikes,
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
                );
              }}
              //hacky solution to add note at the last deck
              onSwipedAll={() => setEndingText('No more matches left!')}
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
            disabled={matches.length == 0}
            onPress={() => this.swiper.swipeRight()}
            buttonStyle={styles.likeDislikeFAB}
            containerStyle={{width: 60, height: 60}}
          />
          <FAB
            icon={dislikeIconStyle}
            style={{margin: 0, padding: 0}}
            color="transparent"
            disabled={matches.length == 0}
            onPress={() => this.swiper.swipeLeft()}
            buttonStyle={styles.likeDislikeFAB}
            containerStyle={{width: 60, height: 60}}
          />
        </View>
      </View>
    </>
  );
};

export {Test};
