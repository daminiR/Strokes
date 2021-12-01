import React, { useRef, createContext, useEffect, useContext, useState, ReactElement } from 'react'
import {StackNavigationProp } from '@react-navigation/stack'
import {
  TouchableOpacity,
  View,
  Modal,
  StyleSheet,
  Text,
} from 'react-native';
import styles from '../../assets/styles/'

const Cancel = ({_onPressCancel=null}) => {
  return (
    <TouchableOpacity onPress={() => _onPressCancel()} style={styles.city}>
      <Text style={styles.cityText}>
       Cancel
      </Text>
    </TouchableOpacity>
  );
};

export {Cancel}
