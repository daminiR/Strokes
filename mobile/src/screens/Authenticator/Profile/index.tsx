import React, { useRef, createContext, useEffect, useContext, useState, ReactElement } from 'react'
import {StackNavigationProp } from '@react-navigation/stack'
import {
  TouchableOpacity,
  View,
  Modal,
  StyleSheet,
  Text,
} from 'react-native';
import styles from '../../../assets/styles/'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import { RootStackParamList } from '../../../AppNavigator'
import {UserContext} from '../../../UserContext'
import { useFormikContext, Formik} from 'formik';
import { useQuery, useMutation} from '@apollo/client'
import {GET_INPUT_TYPE, GET_PROFILE_STATUS} from '../../../graphql/queries/profile'
import {UPDATE_USER_SPORTS, UPLOAD_FILE} from '../../../graphql/mutations/profile'
import { useFocusEffect } from '@react-navigation/native'
import {sportsItemsVar} from '../../../cache'
import {ProfileView} from './ProfileView'
import {PictureWall} from './picturesWall'
import {ProfileSettings} from './profileSettings'
import {_onPressSignOut} from '../../../utils/Upload'
import { EditInput } from './EditInputs'
import { EditInputVar} from '../../../cache'
export const ProfileContext = createContext()
export type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PROFILE'>
export type ProfileScreenRouteProp = RouteProp<RootStackSignInParamList, 'PR'>;
type ProfileT = {
  navigation: ProfileScreenNavigationProp
  route: ProfileScreenRouteProp
}
const Done = ({_onPressDone}) => {
  return (
    <TouchableOpacity onPress={()=> _onPressDone()} style={styles.city}>
      <Text style={styles.cityText}>
        Done
      </Text>
    </TouchableOpacity>
  );
};
const Cancel = ({_onPressCancel}) => {
  return (
    <TouchableOpacity onPress={() => _onPressCancel()} style={styles.city}>
      <Text style={styles.cityText}>
       Cancel
      </Text>
    </TouchableOpacity>
  );
};
const Profile = ({ navigation, route }: ProfileT ): ReactElement => {
  // TODO: very hacky way to stop useEffect from firt render => need more elegant sol
  const didMountRef = useRef(false)
  const [loadingSportsData, setLoadingSportsData] = useState(true)
  const [index, setIndex] = useState(0)
  const [profile, setProfile] = useState(true)
  const [tabState, setTabState] = useState(0)
  const {currentUser, userData, userLoading} = useContext(UserContext)
  const [loadingSignOut, setLoadingSignOut] = useState(true)
  const {confirmResult, setConfirmResult} = useContext(UserContext)
  const {data} = useQuery(GET_PROFILE_STATUS);
  const [updateUserSports] = useMutation(UPDATE_USER_SPORTS);
  const [images, setImage] = useState(null);
  const [initialValuesFormik, setInitialValuesFormik] = useState(null);
  const [inputType, setInputType] = useState();
  const [displayInput, setDisplayInput] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [uploadFile] = useMutation(UPLOAD_FILE);
  const { loading: loadingInputType, error: InputErro, data:InputTypeData } = useQuery(GET_INPUT_TYPE);
  console.log(InputErro)
  useEffect(() => {
    console.log("in inputtt")
    console.log(InputTypeData.inputItems.display)
    if( InputTypeData.inputItems.displayInput == true){
    setInputType(InputTypeData.inputItems.inputType)
    setDisplayInput(InputTypeData.inputItems.displayInput)
    }
    }, [InputTypeData])
  useEffect(() => {
    if (userData){
      setUserInfo(userData);
      const formik_images = userData.squash.image_set.map((imageObj) => ({
      img_idx: imageObj.img_idx,
      imageURL: imageObj.imageURL,
      filePath: imageObj.filePath,
    }));
      const formik_sports = userData.squash.sports.map((sportObj) => ({
        sport: sportObj.sport,
        game_level: sportObj.game_level,
      }));
      setInitialValuesFormik({
        first_name: userData.first_name,
        last_name: userData.last_name,
        age: userData.age,
        gender: userData.gender,
        image_set: formik_images,
        sports: formik_sports,
        description: userData.description,
      });
        const tempsp = [];
        userData.squash.sports.map((sport_obj) => {
          tempsp.push({game_level: 0, sport: sport_obj.sport});
        });
        console.log(sportsItemsVar());
    }
    }, [userLoading])
  const _editDisplay = (display) => {
    setIsVisible(display)
  }
  const [isVisible, setIsVisible] = useState(false);
const _onPressDoneProfile = () => {
  // add anything that needs to be modified -> TODO: remove all database updates and add them here! => this is super important for optimizing and scaling! you have to many updates to mutations data!
    setIsVisible(false);
}
const _onPressCancelProfile = () => {
    setIsVisible(false);
}
const _onPressDoneInput = () => {
  // add anything that needs to be modified -> TODO: remove all database updates and add them here! => this is super important for optimizing and scaling! you have to many updates to mutations data!
  // so
    EditInputVar({inputType: '', displayInput: false})
    setDisplayInput(false);
}
const _onPressCancelInput = () => {
    EditInputVar({inputType: '', displayInput: false})
    setDisplayInput(false);
}
const renderProfileEdit = () => {
    //if (profile && !displayInput)
      //{
    return (
      <>
        <Modal
          animationType="slide"
          transparent={false}
          visible={isVisible}
          onRequestClose={() => {
            setIsVisible(!isVisible);
          }}>
          <View style={{flex: 1}}>
            <View style={styles.top}>
              <Cancel _onPressCancel={_onPressCancelProfile}/>
              <Done _onPressDone={_onPressDoneProfile}/>
            </View>
            <ScrollableTabView
              onChangeTab={({i, ref}) => setTabState(i)}
              style={{flex: 1}}>
              <PictureWall tabLabel="Edit Profile" />
              <ProfileView tabLabel="View Profile" />
            </ScrollableTabView>
          </View>
          <Modal
            animationType="slide"
            transparent={false}
            visible={displayInput}
            onRequestClose={() => {
            setIsVisible(!displayInput);
            }}
          >
            <View style={{flex: 1}}>
            <View style={styles.top}>
              <Cancel _onPressCancel={_onPressCancelInput}/>
              <Done _onPressDone={_onPressDoneInput}/>
            </View>
              <EditInput
                inputType={inputType}
              />
            </View>
          </Modal>
        </Modal>
      </>
    );
}


  return (
    <>
      {!userLoading && (
        <Formik
          initialValues={userData.squash}
          onSubmit={(values) => console.log(values)}>
          <View>
            <ProfileSettings
              _editUserInfo={_editDisplay}
              signOut={_onPressSignOut}
            />
            {renderProfileEdit()}
          </View>
        </Formik>
      )}
    </>
  );
}
const styles2 = StyleSheet.create({
  scrollview: {
    backgroundColor: 'pink',
    marginHorizontal: 20,
  },
  text: {
    fontSize: 42,
  },
});
export { Profile }
