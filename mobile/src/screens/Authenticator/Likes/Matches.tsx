import React, { useEffect, useContext,createContext, useState, ReactElement } from 'react'
import styles from '../../../assets/styles';
import _ from 'lodash'
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  FlatList
} from 'react-native';
import {CardItem} from '../../../components/CardItem/CardItem'
import {Icon} from '../../../components/Icon/Icon'
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
  const {aloading, currentUser, data: currentUserData, userLoading} = useContext(UserContext)
  const [totalLikes, setTotalLikes] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setLoading(true)
    const user = currentUserData.squash
    // set total likes to be local and database likes
    const totalLikes = _.concat(user.likes)
    console.log("///////// totalLikes", totalLikes)
    setTotalLikes(totalLikes)
    setLoading(false)
  }, [userLoading])
  return (
    <ScrollView>
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
            { !loading && <FlatList
            numColumns={3}
            data={totalLikes}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => renderMatchCard(item)}
          />}
          </View>
        </View>
    </ScrollView>
  );
};
const stylesSwipe = StyleSheet.create({
  tempStyle : {
}
})
export {Matches}
