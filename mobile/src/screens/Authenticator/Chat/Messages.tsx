import React, { useEffect, useContext, useState } from 'react'
import styles from '../../../assets/styles';
import {UserContext} from '../../../UserContext'
import {
  Text,
  TouchableOpacity,
  ImageBackground,
  View,
  FlatList
} from 'react-native';
import {Message} from '../../../components/Message/Message';
import {Icon} from '../../../components/Icon/Icon';
import {useNavigation} from '@react-navigation/native';

const renderMessage = (item, navigation, currentUserID) => {
    const profileImage = item.image_set.find(imgObj => imgObj.img_idx == 0)
    const title = item.first_name;
    const _onPressActiveChat = () => {
      navigation.navigate('ACTIVE_CHAT', {currentUserID: currentUserID, matchID: item._id, matchedUserProfileImage: profileImage, matchedUserName: item.first_name});
  };
  return (
        <TouchableOpacity onPress={()=>_onPressActiveChat()}>
                <Message
                  image={profileImage}
                  name={title}
                  lastMessage={"display last messgae here"}
                />
        </TouchableOpacity>
  )
}

const Messages = () => {
  const {currentUser, data: currentUserData} = useContext(UserContext)
  const [loading, setLoading] = useState(true)
  const [matches, setMatches] = useState(null)
  const [title, setTitle] = useState(null)
  const navigation = useNavigation()
  useEffect(() => {
    setLoading(true)
    const user = currentUserData.squash
    setTitle(title)
    // set total likes to be local and database likes
    setMatches(user.matches)
    setLoading(false)
  }, [currentUserData.squash.matches])

  return (
    <ImageBackground
      source={require('../../../assets/images/bg.png')}
      style={styles.bg}
    >
      <View style={styles.containerMessages}>
          <View style={styles.top}>
            <Text style={styles.title}>Messages</Text>
            <TouchableOpacity>
              <Text style={styles.icon}>
                <Icon name="optionsV" />
              </Text>
            </TouchableOpacity>
          </View>
        { !loading && <FlatList
            data={matches}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => renderMessage(item, navigation, currentUser.uid)}
          />}
      </View>
    </ImageBackground>
  );
};
export {Messages};
