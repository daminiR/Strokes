import React, { useEffect, useContext, useRef, useState } from 'react'
import {styles} from '@styles';
import _ from 'lodash'
import {
  View,
  Text,
  FlatList,
  AppState
} from 'react-native';
import {READ_SQUASH} from '@graphQL2'
import { useLazyQuery} from '@apollo/client'
import {UserContext} from '@UserContext'
import {renderMatchCard, calculateOfflineMatches} from '@utils'
import {LikesOverLay} from '@components';

const Matches = ({navigation}) => {
  const [like, setLike] = useState(false)
  const [indexVal, setIndex] = useState(0)
  const [totalLikesFromUsers, setTotalLikesFromUsers] = useState(null)
  const {currentUser, data: currentUserData} = useContext(UserContext)
  const [loading, setLoading] = useState(true)
  const [getSquashProfile] = useLazyQuery(READ_SQUASH, {
    fetchPolicy: "network-only",
    onCompleted: () => {
    setLoading(true)
    // setting likes from query results of people who like current user
    const user = currentUserData.squash
      // TODO: more calucaltiion here -> when liked and not matched should show -> and rerender with very match
    const likesByUsers = user?.likedByUSers
    const dislikeIDs = user?.dislikes
    const totalMatches = calculateOfflineMatches(user)
    const final = _.filter(likesByUsers, likeObj => !_.includes(dislikeIDs, likeObj._id ))
    const totalLikes = _.differenceBy(final, totalMatches, '_id')
    console.log("total likes", totalLikes)
    setTotalLikesFromUsers(totalLikes)
    setLoading(false)
    }
  })
  const appState = useRef(AppState.currentState)
  useEffect(() => {
    console.log("/////////////////////////// trigier")
      getSquashProfile({variables: {id: currentUser.uid}});
  }, [currentUserData.squash.matches, currentUserData.squash.dislikes])

  //useEffect(() => {
    //setLoading(true)
    //const user = currentUserData.squash
    //setTitle(title)
    //// set total likes to be local and database likes
    //setMatches(user.matches)
    //setLoading(false)
  //}, [currentUserData.squash.matches])
  //useEffect(() => {
    //}, [currentUserData.squash.matches, currentUserData.squash.likedByUSers])
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
      }
      appState.current = nextAppState;
      getSquashProfile({variables: {id: currentUser.uid}});
      console.log('AppState', appState.current);
    });
    return () => {
    }
    }, [])
  return (
    <View style={styles.containerMatches}>
      {totalLikesFromUsers && (
        <LikesOverLay
          like={like}
          setLike={setLike}
          likeProfile={totalLikesFromUsers && totalLikesFromUsers[indexVal]}
        />
      )}
      <View style={styles.top}>
        <Text style={styles.title}>Likes</Text>
      </View>
      <View>
        {!loading && (
          <FlatList
            numColumns={2}
            columnWrapperStyle={styles.LikesFlatListSyle}
            data={totalLikesFromUsers}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) =>
              renderMatchCard(item, setLike, setIndex, index)
            }
          />
        )}
      </View>
    </View>
  );
};
export {Matches}
