import React, { useEffect, useContext,createContext, useState, ReactElement } from 'react'
import styles from '../../../assets/styles';
import {UserContext} from '../../../UserContext'
import {
  ScrollView,
  Text,
  TouchableOpacity,
  ImageBackground,
  View,
  FlatList
} from 'react-native';
import {Message} from '../../../components/Message/Message';
import {Icon} from '../../../components/Icon/Icon';
import Demo from '../../../assets/data/demo.js';
import {useNavigation} from '@react-navigation/native';

const renderMessage = (item, navigation) => {
      const profileImage = item.image_set.find(imgObj => imgObj.img_idx == 0)
      const title = item.first_name;
  const _onPressActiveChat = () => {
    navigation.navigate('ACTIVE_CHAT');
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
  const {aloading, currentUser, data: currentUserData, userLoading} = useContext(UserContext)
  const [loading, setLoading] = useState(true)
  const [matches, setMatches] = useState(null)
  const [profileImage, setProfileImage] = useState(null)
  const [title, setTitle] = useState(null)
  const navigation = useNavigation()
  useEffect(() => {
    setLoading(true)
    const user = currentUserData.squash
    const profileImage = user.image_set.find(imgObj => imgObj.img_idx == 0)
    const title = user.first_name
    console.log("in messgae", user)
    setTitle(title)
    setProfileImage(profileImage)
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
            renderItem={({ item }) => renderMessage(item, navigation)}
          />}
      </View>
    </ImageBackground>
  );
};
export {Messages};
