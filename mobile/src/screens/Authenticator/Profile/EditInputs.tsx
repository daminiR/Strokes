import React, { useRef, createContext, useEffect, useContext, useState, ReactElement } from 'react'
import {StackNavigationProp } from '@react-navigation/stack'
import {
  TouchableOpacity,
  View,
  Modal,
  StyleSheet,
  Text,
} from 'react-native';
import {GET_SPORTS_LIST} from '../../../graphql/queries/profile'
import styles from '../../../assets/styles/'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import { RootStackParamList } from '../../../AppNavigator'
import {UserContext} from '../../../UserContext'
import { useFormikContext, Formik} from 'formik';
import { useQuery, useMutation} from '@apollo/client'
import {GET_FIRST_NAME, GET_PROFILE_STATUS} from '../../../graphql/queries/profile'
import {UPDATE_USER_SPORTS, UPLOAD_FILE} from '../../../graphql/mutations/profile'
import { useFocusEffect } from '@react-navigation/native'
import {sportsItemsVar} from '../../../cache'
import {ProfileView} from './ProfileView'
import {PictureWall} from './picturesWall'
import {ProfileSettings} from './profileSettings'
import {_onPressSignOut} from '../../../utils/Upload'
import { NameInput, BirthdayInput, GenderInput} from '../../../components'
import {GET_INPUT_TYPE} from '../../../graphql/queries/profile'

const EditInput = ({inputType= null}) => {
  const renderInput = () => {
    switch (inputType) {
      case 'Name Input':
        return <NameInput />;
        break;
      case 'Birthday Input':
        return <BirthdayInput />;
        break;
      case 'Gender Input':
        return <GenderInput />;
        break;
    }
  }

  return (
    <>
        <View style={{flex:1}}>
          {renderInput()}
        </View>
    </>
  );
};
export { EditInput}
