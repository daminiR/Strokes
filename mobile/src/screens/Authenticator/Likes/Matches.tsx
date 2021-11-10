import React, { useEffect, useContext,createContext, useRef, useState, ReactElement } from 'react'
import styles from '../../../assets/styles';
import _ from 'lodash'
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  AppState
} from 'react-native';
import {CardItem} from '../../../components/CardItem/CardItem'
import {GET_INPUT_TYPE, READ_SQUASH} from '../../../graphql/queries/profile'
import {Icon} from '../../../components/Icon/Icon'
import { useLazyQuery, useQuery, useMutation} from '@apollo/client'
import {UserContext} from '../../../UserContext'
import Demo from '../../../assets/data/demo.js'
import {likesVar} from '../../../cache'

const renderMatchCard = (card) => {
      const profileImage = card.image_set.find(imgObj => imgObj.img_idx == 0)
      const title = card.first_name +', ' + card.age
      return (
              <TouchableOpacity>
                <CardItem
                  profileImage={profileImage}
                  profileTitle={title}
                  variant
                />
              </TouchableOpacity>

      )
}
const Matches = () => {
  const [totalLikesFromUsers, setTotalLikesFromUsers] = useState(null)
  const {currentUser, data: currentUserData, setData, userLoading} = useContext(UserContext)
  const [loading, setLoading] = useState(true)
  const [getSquashProfile, {data: userData, error}] = useLazyQuery(READ_SQUASH, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
    setLoading(true)
    // setting likes from query results of people who like current user
    const user = currentUserData.squash
    const totalLikes = _.concat(user?.likedByUSers)
    setTotalLikesFromUsers(totalLikes)
    setLoading(false)
    }
  })
  const appState = useRef(AppState.currentState)
  useEffect(() => {
      getSquashProfile({variables: {id: currentUser.uid}});
  }, [])
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
      //subscription.remove();
    }
    }, [])
  return (
    <View style={styles.containerMatches}>
      <View style={styles.top}>
        <Text style={styles.title}>Matches</Text>
        <TouchableOpacity>
          <Text style={styles.icon}>
            <Icon name="optionsV" />
          </Text>
        </TouchableOpacity>
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
const stylesSwipe = StyleSheet.create({
  tempStyle : {
}
})
export {Matches}
