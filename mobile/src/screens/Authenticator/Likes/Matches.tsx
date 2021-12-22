import React, { useEffect, useContext, useRef, useState } from 'react'
import styles from '../../../assets/styles';
import _ from 'lodash'
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  AppState
} from 'react-native';
import {READ_SQUASH} from '../../../graphql/queries/profile'
import {Icon} from '../../../components/Icon/Icon'
import { useLazyQuery} from '@apollo/client'
import {UserContext} from '../../../UserContext'
import {renderMatchCard} from '../../../utils/matching/swipeFuntions'

const Matches = ({navigation}) => {
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
    const likes =  user.likes
    const likedByUSers =  user.likedByUSers
    const totalMatches = _.intersectionBy(likes, likedByUSers, '_id')
    //const matches = user?.matches
    const totalLikes = _.differenceBy(likesByUsers, totalMatches, '_id')
    setTotalLikesFromUsers(totalLikes)
    setLoading(false)
    }
  })
  const appState = useRef(AppState.currentState)
  useEffect(() => {
      getSquashProfile({variables: {id: currentUser.uid}});
  }, [currentUserData.squash.matches])

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
      <View style={styles.top}>
        <Text style={styles.title}>Likes</Text>
      </View>
      <View>
        {!loading && (
          <FlatList
            numColumns={3}
            data={totalLikesFromUsers}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => renderMatchCard(item)}
          />
        )}
      </View>
    </View>
  );
};
export {Matches}
