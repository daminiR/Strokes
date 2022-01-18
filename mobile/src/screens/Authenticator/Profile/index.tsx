import React, { useRef, createContext, useEffect, useContext, useState, ReactElement } from 'react'
import {StackNavigationProp, RouteProp} from '@react-navigation/stack'
import auth from '@react-native-firebase/auth'
import {View, Modal} from 'react-native';
import {styles} from '@styles'
import {SWIPIES_PER_DAY_LIMIT} from '@constants'
import { RootStackSignInParamList, ProfileInputEdits} from '@NavStack'
import {UserContext} from '@UserContext'
import {Overlay, Text} from 'react-native-elements'
import { useFormikContext, Formik, useField} from 'formik';
import { useLazyQuery, useQuery, useMutation} from '@apollo/client'
import {GET_INPUT_TYPE, READ_SQUASH, UPDATE_USER_PROFILE} from '@graphQL2'
import {ProfileSettings, EditInput, Done, Cancel} from '@components'
import { EditFields, FilterFields} from '@localModels'
import { isCityChangedVar, cityVar, EditInputVar} from '@cache'
import {convertImagesToFormat, createInitialValuesFormik, _onPressSignOut, deleteUser} from '@utils'
import {DoneCancelContext} from '@Contexts'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import  { profileEditSchema} from '@validation'
import _ from 'lodash'

const Tab  = createBottomTabNavigator()

export type ProfileScreenNavigationProp = StackNavigationProp<RootStackSignInParamList, 'PROFILE'>
export type ProfileScreenRouteProp = RouteProp<RootStackSignInParamList, 'PROFILE'>;

type ProfileT = {
  navigation: ProfileScreenNavigationProp
  route: ProfileScreenRouteProp
}
const EditProfile = () => {
  const [isVisible, setIsVisible] = useState(false);
  const {
    setValues: setFilterVals,
    values: filterValues,
    setFieldValue,
  } = useFormikContext<FilterFields>();
  const [inputType, setInputType] = useState();
  const {touched, initialValues: formikInitialValues, setValues, values: formikValues,handleReset, errors: validationErrorsm, handleSubmit} = useFormikContext<EditFields>();
  const [tempInputValues, setTempInputValues] = useState(null);
  const [cityChanged, setCityChanged] = useState(false);
  const {queryProssibleMatches, currentUser, setData, refetchUserData, data:userData, imageErrorVisible, setImageErrorVisible} = useContext(UserContext)
  const {data:InputTypeData } = useQuery(GET_INPUT_TYPE);
  const [updateUserProfile] = useMutation(UPDATE_USER_PROFILE, {
    refetchQueries: [{query: READ_SQUASH, variables: {id: currentUser.uid}}],
    awaitRefetchQueries: true,
    onCompleted: () => {
      // wow this was the missing peace, reset needed to be here for cancel and done to work properly with reintialization
      handleSubmit();
    },
  });
  console.log("did we new formik values", formikValues)
  const [displayInput, setDisplayInput] = useState(false);
  const [formikChanged, setFormikChanged] = useState(false);
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
      console.log("formik remove", formikValues.remove_uploaded_images)
      console.log("formik add", formikValues.add_local_images)
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
      // remove and add locals need to be reset TODO: very hacky way to reset, est flow would be too reset entire form


      // update firebase auth
      if (cityVar() != formikValues.location.city){
        cityVar(formikValues.location.city)
        isCityChangedVar(true)
      }
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
  const [field, meta, helpers] = useField('age');
  const [temptSports2, setTempSports2] = useState(formikValues.sports)
  const _onPressDoneInput = async () => {
    switch (inputType) {
      case 'Name Input':
        if (_.isEmpty(validationErrors.first_name) && _.isEmpty(validationErrors.last_name)) {
          setFieldValue('first_name', formikValues.first_name);
          setFieldValue('last_name', formikValues.last_name);
          EditInputVar({inputType: '', displayInput: false}) &&
          setDisplayInput(false);
        }
        break;
      case 'Birthday Input':
        if (_.isEmpty(validationErrors.age)) {
          setFieldValue('age', formikValues.age);
          EditInputVar({inputType: '', displayInput: false}) &&
          setDisplayInput(false);
        }
        break;
      case 'Neighborhood Input':
        if (_.isEmpty(validationErrors.age) && touched.location) {
          console.log("fromik values locatio", formikValues.location)
          setFieldValue('location', formikValues.location);
          EditInputVar({inputType: '', displayInput: false}) &&
          setDisplayInput(false);
        }
        break;
      case 'Gender Input':
        if (_.isEmpty(validationErrors.age)) {
          setFieldValue('gender', formikValues.gender);
          EditInputVar({inputType: '', displayInput: false}) &&
          setDisplayInput(false);
        }
        break;
      case 'Description Input':
        if (_.isEmpty(validationErrors.description)) {
          setFieldValue('description', formikValues.description);
          EditInputVar({inputType: '', displayInput: false}) &&
          setDisplayInput(false);
        }
        break;
      case 'Sports Input':
        if (_.isEmpty(validationErrors.sports)) {
          setFieldValue('sports', formikValues.sports);
          EditInputVar({inputType: '', displayInput: false}) &&
          setDisplayInput(false);
        }
        break;
    }
  }
const _onPressCancelInput = () => {
    switch (inputType) {
      case 'Name Input':
        setFieldValue('first_name', formikInitialValues.first_name)
        setFieldValue('last_name', formikInitialValues.last_name)
        break;
      case 'Birthday Input':
        setFieldValue('age', formikInitialValues.age)
        break;
      case 'Neighborhood Input':
        setFieldValue('location', formikInitialValues.location)
        break;
      case 'Gender Input':
        setFieldValue('gender', formikInitialValues.gender)
        break;
      case 'Description Input':
        setFieldValue('description', formikInitialValues.description)
        break;
      case 'Sports Input':
        setFieldValue('sports', formikInitialValues.sports)
        break;
    }
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
          <Overlay
            overlayStyle={styles.imageErrorOverlay}
            isVisible={imageErrorVisible}
            onBackdropPress={() => setImageErrorVisible(false)}>
            <View>
              <Text style={styles.imageErrorText}>must have atlease one image</Text>
            </View>
          </Overlay>
          <View style={styles.top}>
            <Cancel _onPressCancel={_onPressCancelProfile} />
            <Done _onPressDone={_onPressDoneProfile} />
          </View>
          <ProfileInputEdits />
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
  const {data, userData, userLoading} = useContext(UserContext)
  const [initialValuesFormik, setInitialValuesFormik] = useState(null);
  useEffect(() => {
    console.log("did we reinittailiz", userData)
    setLoadingFormikValues(true)
    const userDetails = auth().currentUser
    if (userDetails) {
    const initialValues = createInitialValuesFormik(data, userDetails.phoneNumber)
    setInitialValuesFormik(initialValues)
    console.log("did we change initial values ////", initialValues)
    setLoadingFormikValues(false)
    }
    //}, [data])
    }, [userData])
    //}, [userLoading])
  return (
    <>
      {!userLoading && !loadingFormikValues && (
        <Formik
          //enableReinitialize={true}
          validationSchema={profileEditSchema}
          initialValues={initialValuesFormik}
          onSubmit={(values, {resetForm}) => {
            const userDetails = auth().currentUser;
            const initialValues2 = createInitialValuesFormik(
              userData,
              userDetails.phoneNumber,
            );
            setInitialValuesFormik(initialValues2);
            resetForm({values: {...initialValues2}})
          }}>
          <View>{!loadingFormikValues && <EditProfile />}</View>
        </Formik>
      )}
    </>
  );
}
export { Profile }
