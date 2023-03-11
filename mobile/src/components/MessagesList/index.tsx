import React, { useEffect, useContext, useState } from 'react'
import {styles } from '@styles';
import {UserContext} from '@UserContext'
import {
  Text,
  TouchableOpacity,
  View,
  FlatList
} from 'react-native';
import {Message} from '@components';
import {useNavigation} from '@react-navigation/native';
import _ from 'lodash'
import {calculateOfflineMatches} from '@utils'
import {Avatar, Divider, ListItem, Button} from 'react-native-elements'

const renderMessage = (item, navigation, currentUserID, setLoading) => {
    const profileImage = item.image_set.find(imgObj => imgObj.img_idx == 0).imageURL
    const title = item.first_name;
    const _onPressActiveChat = () => {
      navigation.navigate('ACTIVE_CHAT', {currentUserID: currentUserID, matchID: item._id, matchedUserProfileImage: profileImage, matchedUserName: item.first_name, profileViewData: item});
  };
  return (
    <ListItem
      onPress={() => _onPressActiveChat()}
      bottomDivider
    >
      <Avatar rounded source={{uri: profileImage}} />
      <ListItem.Content>
        <ListItem.Title>{title}</ListItem.Title>
      </ListItem.Content>
    </ListItem>
  );
}

const MessagesList = () => {
  const { setOfflineMatches, currentUser, dataGlobal: currentUserData} = useContext(UserContext)
  const [loading, setLoading] = useState(true)
  const [matches, setMatches] = useState(null)
  const [title, setTitle] = useState(null)
  const navigation = useNavigation()
  useEffect(() => {
    if(currentUserData.matches){
    const user = currentUserData
    setLoading(true)
    const totalMatches = calculateOfflineMatches(user)
    // if in likedBy USe and in likes but not in matches then add to matches else load matches
    setTitle(title)
    // set total likes to ke local and database likes
    setMatches(totalMatches)
    setOfflineMatches(totalMatches)
    setLoading(false)
    }
  }, [currentUserData.matches])

  return (
    <>
      <View style={styles.top}>
        <Text style={styles.title}>Messages</Text>
      </View>
      <View style={styles.containerMessages}>
        {!loading && !_.isEmpty(matches) && (
          <FlatList
            data={matches}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) =>
              renderMessage(item, navigation, currentUser.sub, setLoading)
            }
          />
        )}
      </View>
    </>
  );
};
export {MessagesList};
