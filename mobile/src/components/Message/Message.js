import React from 'react';
import styles from '../../assets/styles';
import { Divider } from 'react-native-elements';

import { Text, View, Image } from 'react-native';

const Message = ({ image, lastMessage, name }) => {
  return (
    <>
    <View style={styles.containerMessage}>
      <Image source={{uri: image.imageURL}} style={styles.avatar} />
      <View style={styles.content}>
        <Text>{name}</Text>
        <Text style={styles.message}>{lastMessage}</Text>
      </View>
    </View>
    <Divider orientation="horizontal"/>
    </>
  );
};

export  {Message}
