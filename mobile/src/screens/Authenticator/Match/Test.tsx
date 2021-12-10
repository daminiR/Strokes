import React, { createContext, useEffect, useContext, useState } from 'react'
import {Text, View } from 'react-native';
import {UserContext} from '../../../UserContext'
import {FAB} from 'react-native-elements'
import Swiper from 'react-native-deck-swiper'
import { City } from '../../../components/City/City';
import { MatchCard } from '../../../components/';
import { Filters } from '../../../components/Filters/Filters';
import styles from '../../../assets/styles/'
import {READ_SQUASH} from '../../../graphql/queries/profile'
import {MatchesProfileContext} from './Match'
import {renderMatches, swipeRightLiked, swipeLeftDisliked} from '../../../utils/matching/swipeFuntions'
import { useLazyQuery, useMutation} from '@apollo/client'
import {UPDATE_MATCHES, UPDATE_DISLIKES, UPDATE_LIKES} from '../../../graphql/mutations/profile'
import {W}  from '../../../constants'

export const FilterContext = createContext(null)
const Test = () => {
  const {matches} = useContext(MatchesProfileContext);
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
      if (matches.length == 0) {
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
      <MatchCard matched={matched} setMatched={setMatched}/>
            <View style={styles.top}>
              <City />
              <Filters/>
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
                match
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
            stackSize={3}>
          </Swiper>
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
            icon={{
              type: 'material-community',
              name: 'heart',
              color: 'grey',
              size: 50,
              containerStyle: {marginHorizontal: -15, marginVertical: -15},
            }}
            color="white"
            disabled={matches.length == 0}
            onPress={() => this.swiper.swipeRight()}
          />
          <FAB
            icon={{
              type: 'material-community',
              name: 'close-circle-outline',
              color: 'grey',
              size: 50,
              containerStyle: {marginHorizontal: -15, marginVertical: -15},
            }}
            color="white"
            disabled={matches.length == 0}
            onPress={() => this.swiper.swipeLeft()}
          />
        </View>
      </View>
    </>
  );
};

export {Test};
