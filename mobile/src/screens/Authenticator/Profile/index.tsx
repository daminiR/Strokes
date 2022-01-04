import React, { useRef, createContext, useEffect, useContext, useState, ReactElement } from 'react'
import {StackNavigationProp, RouteProp} from '@react-navigation/stack'
import auth from '@react-native-firebase/auth'
import {View, Modal} from 'react-native';
import {styles} from '@styles'
import { RootStackSignInParamList, ProfileInputEdits} from '@NavStack'
import {UserContext} from '@UserContext'
import { useFormikContext, Formik} from 'formik';
import { useLazyQuery, useQuery, useMutation} from '@apollo/client'
import {GET_INPUT_TYPE, READ_SQUASH, UPDATE_USER_PROFILE} from '@graphQL'
import {ProfileSettings, EditInput, Done, Cancel} from '@components'
import { EditFields} from '@localModels'
import { cityVar, EditInputVar} from '@cache'
import {convertImagesToFormat, createInitialValuesFormik, _onPressSignOut, deleteUser} from '@utils'
import {DoneCancelContext} from '@Contexts'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab  = createBottomTabNavigator()

export type ProfileScreenNavigationProp = StackNavigationProp<RootStackSignInParamList, 'PROFILE'>
export type ProfileScreenRouteProp = RouteProp<RootStackSignInParamList, 'PROFILE'>;

type ProfileT = {
  navigation: ProfileScreenNavigationProp
  route: ProfileScreenRouteProp
}

const EditProfile = ({}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [inputType, setInputType] = useState();
  const {setValues, values: formikValues,handleReset} = useFormikContext<EditFields>();
  const [tempInputValues, setTempInputValues] = useState(null);
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
      ///// debug images
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
  const [temptSports2, setTempSports2] = useState(formikValues.sports)
const _onPressDoneInput = () => {
    setValues({... formikValues,
              'description': tempInputValues.description ? tempInputValues.description : formikValues.description,
              'location': tempInputValues.location ? tempInputValues.location : formikValues.location,
              'gender': tempInputValues.gender ? tempInputValues.gender : formikValues.gender,
              'age': tempInputValues.age ? tempInputValues.age : formikValues.age,
              'first_name': tempInputValues.first_name ? tempInputValues.first_name : formikValues.first_name,
              'last_name': tempInputValues.last_name ? tempInputValues.last_name : formikValues.last_name})
              //'sports': temptSports2 ? temptSports2 : formikValues.sports})
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

const doneCancelValues = {
  setDisplayInput: setDisplayInput,
  tempInputValues: tempInputValues,
  setTempInputValues: setTempInputValues,
  setTempSports2: setTempSports2
};
  useEffect(() => {
    console.log(" input tyep", inputType)
    }, [inputType])
    return (
      <>
        <ProfileSettings
          _editUserInfo={_editDisplay2}
          signOut={_onPressSignOut}
          deleteAccount={deleteUser}
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
            <ProfileInputEdits/>
          <Modal
            animationType="slide"
            transparent={false}
            visible={displayInput}
            onRequestClose={() => {
              setIsVisible(!displayInput);
            }}>
            <View style={{flex: 1}}>
              {inputType != 'Sports Input' ? (
                <View style={styles.top}>
                  <Cancel _onPressCancel={_onPressCancelInput} />
                  <Done _onPressDone={_onPressDoneInput} />
                </View>
              ) : null}
              <DoneCancelContext.Provider value={doneCancelValues}>
                <EditInput inputType={inputType} isSignUp={false} />
              </DoneCancelContext.Provider>
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
