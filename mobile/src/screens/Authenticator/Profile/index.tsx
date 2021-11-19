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
import { useLazyQuery, useQuery, useMutation} from '@apollo/client'
import {GET_INPUT_TYPE, READ_SQUASH} from '../../../graphql/queries/profile'
import {UPDATE_USER_PROFILE} from '../../../graphql/mutations/profile'
import {UPDATE_USER_SPORTS, UPLOAD_FILE} from '../../../graphql/mutations/profile'
import { useFocusEffect } from '@react-navigation/native'
import {sportsItemsVar} from '../../../cache'
import {ProfileView} from './ProfileView'
import {PictureWall} from './picturesWall'
import { EditFields, ProfileFields} from '../../../localModels/UserSportsList'
import {ProfileSettings} from './profileSettings'
import {_onPressSignOut} from '../../../utils/Upload'
import { EditInput } from './EditInputs'
import { EditInputVar} from '../../../cache'
import {convertImagesToFormat } from '../../../utils/User'
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

const EditProfile = ({}) => {
  const [inputType, setInputType] = useState();
  const {setTouched, setFieldValue, values: formikValues, touched, submitForm, handleReset, handleChange, handleSubmit } = useFormikContext<EditFields>();
  const {currentUser, data: new_data , userData, setData, userLoading} = useContext(UserContext)
  const { loading: loadingInputType, error: InputErro, data:InputTypeData } = useQuery(GET_INPUT_TYPE);
  const [
    updateUserProfile,
    {loading: loadingUserUpdate, error: errorUserUpdatel, data: dataUserUpdate},
  ] = useMutation(UPDATE_USER_PROFILE, {
    refetchQueries: [{query: READ_SQUASH, variables: {id: currentUser.uid}}],
    awaitRefetchQueries: true,
    onCompleted: (data) => {
        console.log("//////////// formik has data in mutation !!!!!1 //////////////", data)
      //TODO: if data doesnt exists input is incorrect => add checks
      getSquashProfile({variables: {id: currentUser.uid}});
    },
  });
  const [tabState, setTabState] = useState(0)
  const [displayInput, setDisplayInput] = useState(false);
  const [formikChanged, setFormikChanged] = useState(false);
  const [ getSquashProfile, {data: newUserData, loading: newUserLaodingData}] = useLazyQuery(READ_SQUASH, {
    variables: {id: currentUser.uid},
    //fetchPolicy:"cache-and-network",
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      //TODO: if data doesnt exists input is incorrect => add checks
      if (data) {
        setData(data)
        console.log("//////////// formik has fdata in query!!!!!1 //////////////", data)
        //handleReset()
      }
    }
  })

  const didMountRef = useRef(false)
  useEffect(() => {
    if( InputTypeData.inputItems.displayInput == true){
    setInputType(InputTypeData.inputItems.inputType)
    setDisplayInput(InputTypeData.inputItems.displayInput)
    }
    }, [InputTypeData])
  useEffect(() => {
    if (didMountRef.current){
      setFormikChanged(true)
    }
    else {
      didMountRef.current = true
    }
    }, [formikValues])
  const [isVisible, setIsVisible] = useState(false);
const _onPressDoneProfile = () => {
  // add anything that needs to be modified -> TODO: remove all database updates and add them here! => this is super important for optimizing and scaling! you have to many updates to mutations data!
    if (formikChanged) {
      console.log("//////////// formik has changed!!!!!1 //////////////", formikValues)
      const RNLocalFiles = convertImagesToFormat(formikValues.add_local_images, currentUser.uid)
      //const RNFiles = formikValues.image_set
      //console.log("RNFIles///////////////////////////////////////////", RNFiles)
      console.log("loaction///////////////////////////////////////////", location)
      updateUserProfile({
        variables: {
          _id: currentUser.uid,
          first_name: formikValues.first_name,
          last_name: formikValues.last_name,
          gender: formikValues.gender,
          age: Number(formikValues.age),
          sports: formikValues.sports,
          original_uploaded_image_set: formikValues.original_uploaded_image_set,
          add_local_images: RNLocalFiles,
          remove_uploaded_images: formikValues.remove_uploaded_images,
          description: formikValues.description,
        },
      });
      //// as soon as done new data needs to be grabbed and replaced
    }
    setIsVisible(false);
    setFormikChanged(false)
}
const _onPressCancelProfile = () => {
    console.log("//////////// formik has values in Cancel/////////////!!!!!1 //////////////", formikValues)
    handleReset()
    setFormikChanged(false)
    setIsVisible(false);
}
const _onPressDoneInput = () => {
  // add anything that needs to be modified -> TODO: remove all database updates and add them here! => this is super important for optimizing and scaling! you have to many updates to mutations data!/
    console.log("///////// formik values o flist inputs", formikValues)
    EditInputVar({inputType:'', displayInput: false})
    setDisplayInput(false);
}
const _onPressCancelInput = () => {
    EditInputVar({inputType: '', displayInput: false})
    setDisplayInput(false);
}

const _editDisplay2 = (display) => {
    setIsVisible(display)
    //handleReset()
}
    return (
      <>
        <ProfileSettings
          _editUserInfo={_editDisplay2}
          signOut={_onPressSignOut}
        />
        <Modal
          animationType="slide"
          transparent={false}
          visible={isVisible}
          onRequestClose={() => {
            setIsVisible(!isVisible);
          }}>
            <View style={{flex: 1, paddingTop: 50}}>
            <View style={styles.top}>
              <Cancel _onPressCancel={_onPressCancelProfile} />
              <Done _onPressDone={_onPressDoneProfile} />
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
            }}>
            <View style={{flex: 1}}>
              <View style={styles.top}>
                <Cancel _onPressCancel={_onPressCancelInput} />
                <Done _onPressDone={_onPressDoneInput} />
              </View>
              <EditInput inputType={inputType} />
            </View>
          </Modal>
        </Modal>
      </>
    );


}
const createInitialValuesFormik = (userData) => {
    if (userData){
      const formik_images = userData.squash.image_set.map((imageObj) => ({
      img_idx: imageObj.img_idx,
      imageURL: imageObj.imageURL,
      filePath: imageObj.filePath,
    }));
      const formik_sports = userData.squash.sports.map((sportObj) => ({
        sport: sportObj.sport,
        game_level: sportObj.game_level,
      }));
      return {
        first_name: userData.squash.first_name,
        last_name: userData.squash.last_name,
        age: userData.squash.age,
        gender: userData.squash.gender,
        image_set: formik_images,
        sports: formik_sports,
        description: userData.squash.description,
        remove_uploaded_images: [],
        add_local_images: [],
        original_uploaded_image_set: formik_images
      }
    }
}
const Profile = ({ navigation, route }: ProfileT ): ReactElement => {
  // TODO: very hacky way to stop useEffect from firt render => need more elegant sol
  const didMountRef = useRef(false)
  const [loadingFormikValues, setLoadingFormikValues] = useState(true)
  const {aloading, currentUser, data, userData, userLoading} = useContext(UserContext)
  const [initialValuesFormik, setInitialValuesFormik] = useState(null);
  useEffect(() => {
    console.log("///////////////////////////////////////////// how many times does this run //////////////////////////////////////, data", data)
    setLoadingFormikValues(true)
    const initialValues = createInitialValuesFormik(data)
    setInitialValuesFormik(initialValues)
    setLoadingFormikValues(false)
    }, [data])
  return (
    <>
      {!userLoading && !loadingFormikValues && (
        <Formik
          enableReinitialize={true}
          initialValues={initialValuesFormik}
          onSubmit={(values) => console.log(values)}>
          <View>
            <EditProfile/>
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
