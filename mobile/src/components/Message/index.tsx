import React from 'react';
import {styles} from '@styles'
import { Divider } from 'react-native-elements';

import { Text, View, Image } from 'react-native';

const Message = ({ image, lastMessage=null, name }) => {
  return (
        //TODO: add last msg
    <>
    <View style={styles.containerMessage}>
      <Image source={{uri: image.imageURL}} style={styles.avatar} />
      <View style={styles.ChatUserContainer}>
        <Text>{name}</Text>
      </View>
    </View>
    <Divider orientation="horizontal"/>
    </>
  );
};
        //<Text style={styles.message}>{lastMessage}</Text>

export  {Message}
