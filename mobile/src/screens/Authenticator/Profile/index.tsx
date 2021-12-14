import React, { useRef, createContext, useEffect, useContext, useState, ReactElement } from 'react'
import {StackNavigationProp } from '@react-navigation/stack'
import auth from '@react-native-firebase/auth'
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
import {ProfileView} from './ProfileView'
import {PictureWall} from './picturesWall'
import { EditFields} from '../../../localModels/UserSportsList'
import {ProfileSettings} from './profileSettings'
import {_onPressSignOut} from '../../../utils/Upload'
import { EditInput } from './EditInputs'
import { cityVar, EditInputVar} from '../../../cache'
import {convertImagesToFormat } from '../../../utils/User'
import {createInitialValuesFormik } from '../../../utils/formik'
import {Done, Cancel} from '../../../components'


export const ProfileContext = createContext(null)

export type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PROFILE'>
export type ProfileScreenRouteProp = RouteProp<RootStackSignInParamList, 'PROFILE'>;

type ProfileT = {
  navigation: ProfileScreenNavigationProp
  route: ProfileScreenRouteProp
}

const EditProfile = ({}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [inputType, setInputType] = useState();
  const {values: formikValues,handleReset} = useFormikContext<EditFields>();
  const {currentUser, setData} = useContext(UserContext)
  const {data:InputTypeData } = useQuery(GET_INPUT_TYPE);
  const [updateUserProfile] = useMutation(UPDATE_USER_PROFILE, {
    refetchQueries: [{query: READ_SQUASH, variables: {id: currentUser.uid}}],
    awaitRefetchQueries: true,
    onCompleted: (data) => {
      //TODO: if data doesnt exists input is incorrect => add checks
      getSquashProfile({variables: {id: currentUser.uid}});
    },
  });
  const [displayInput, setDisplayInput] = useState(false);
  const [formikChanged, setFormikChanged] = useState(false);
  const [ getSquashProfile] = useLazyQuery(READ_SQUASH, {
    variables: {id: currentUser.uid},
    //fetchPolicy:"cache-and-network",
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      //TODO: if data doesnt exists input is incorrect => add checks
      if (data) {
        setData(data)
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

const _onPressDoneProfile = () => {
  // add anything that needs to be modified -> TODO: remove all database updates and add them here! => this is super important for optimizing and scaling! you have to many updates to mutations data!
    if (formikChanged) {
      const RNLocalFiles = convertImagesToFormat(formikValues.add_local_images, currentUser.uid)
      updateUserProfile({
        variables: {
          _id: currentUser.uid,
          first_name: formikValues.first_name,
          last_name: formikValues.last_name,
          gender: formikValues.gender,
          age: Number(formikValues.age),
          sports: formikValues.sports,
          location: formikValues.location,
          original_uploaded_image_set: formikValues.original_uploaded_image_set,
          add_local_images: RNLocalFiles,
          remove_uploaded_images: formikValues.remove_uploaded_images,
          description: formikValues.description,
        },
      });
      // update firebase auth
      cityVar(formikValues.location.city)
      //// as soon as done new data needs to be grabbed and replaced
    }
    setIsVisible(false);
    setFormikChanged(false)
}
const _onPressCancelProfile = () => {
    handleReset()
    setFormikChanged(false)
    setIsVisible(false);
}
const _onPressDoneInput = () => {
  // add anything that needs to be modified -> TODO: remove all database updates and add them here! => this is super important for optimizing and scaling! you have to many updates to mutations data!/
    EditInputVar({inputType:'', displayInput: false})
    setDisplayInput(false);
}
const _onPressCancelInput = () => {
    EditInputVar({inputType: '', displayInput: false})
    setDisplayInput(false);
}
const _editDisplay2 = (display) => {
    setIsVisible(display)
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
            <View style={styles.top}>
              <Cancel _onPressCancel={_onPressCancelProfile} />
              <Done _onPressDone={_onPressDoneProfile} />
            </View>
            <ScrollableTabView
              style={styles.topTabStyle}
              tabBarTextStyle={styles.topTabText}
              tabBarUnderlineStyle={styles.topTabUnderLineStyle}
            >
              <PictureWall tabLabel="Edit Profile" />
              <ProfileView tabLabel="View Profile" />
            </ScrollableTabView>
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
const Profile = (): ReactElement => {
  // TODO: very hacky way to stop useEffect from firt render => need more elegant sol
  const [loadingFormikValues, setLoadingFormikValues] = useState(true)
  const {data, userLoading} = useContext(UserContext)
  const [initialValuesFormik, setInitialValuesFormik] = useState(null);
  useEffect(() => {
    setLoadingFormikValues(true)
    const userDetails = auth().currentUser
    if (userDetails) {
    const initialValues = createInitialValuesFormik(data, userDetails.phoneNumber, userDetails.email)
    setInitialValuesFormik(initialValues)
    setLoadingFormikValues(false)
    }
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
export { Profile }
