import React, { useRef, createContext, useEffect, useContext, useState, ReactElement } from 'react'
import {
  TouchableOpacity,
  View,
  Modal,
  StyleSheet,
  Text,
} from 'react-native';
import styles from '../../assets/styles/'

const Done = ({_onPressDone=null}) => {
  return (
    <TouchableOpacity onPress={()=> _onPressDone()} style={styles.city}>
      <Text style={styles.cityText}>
        Done
      </Text>
    </TouchableOpacity>
  );
};

export {Done}
