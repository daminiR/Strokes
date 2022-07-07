import React, { useRef, createContext, useEffect, useContext, useState, ReactElement } from 'react'
import {StackNavigationProp, RouteProp} from '@react-navigation/stack'
import {View, Modal} from 'react-native';
import {styles} from '@styles'
import {SWIPIES_PER_DAY_LIMIT} from '@constants'
import { RootStackSignInParamList, ProfileInputEdits} from '@NavStack'
import {UserContext} from '@UserContext'
import {Overlay, Text} from 'react-native-elements'
import { useFormikContext, Formik, useField} from 'formik';
import { useLazyQuery, useQuery, useMutation} from '@apollo/client'
import {GET_INPUT_TYPE, READ_SQUASH, UPDATE_USER_PROFILE} from '@graphQL2'
import {ProfileSettings, EditInput, Done, Cancel, AppContainer} from '@components'
import { EditFields, FilterFields, ImageSetT} from '@localModels'
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
const EditProfile = ({setLoadingUserUpload, setInitialValuesFormik, initialValuesFormik}) => {
  const [isVisible, setIsVisible] = useState(false);
  const {
    setValues: setFilterVals,
    values: filterValues,
    //setFieldValue,
  } = useFormikContext<FilterFields>();
  const [inputType, setInputType] = useState();
  const {setFieldValue, touched, initialValues: formikInitialValues, setValues, values: formikValues,resetForm, handleReset, errors: validationErrors, handleSubmit} = useFormikContext<EditFields>();
  const [tempInputValues, setTempInputValues] = useState(null);
  const [cityChanged, setCityChanged] = useState(false);
  const {queryProssibleMatches, currentUser, setData, refetchUserData, userData, imageErrorVisible, setImageErrorVisible, changeSport, setChangeSport} = useContext(UserContext)
  const {data:InputTypeData } = useQuery(GET_INPUT_TYPE);
  const [updateUserProfile] = useMutation(UPDATE_USER_PROFILE, {
    refetchQueries: [{query: READ_SQUASH, variables: {id: currentUser.sub}}],
    awaitRefetchQueries: true,
    onCompleted: (data) => {
      // wow this was the missing peace, reset needed to be here for cancel and done to work properly with reintialization
      //setLoadingUserUpload(false)
      if (data?.updateUserProfile){
        const new_image_set =_.map(data.updateUserProfile.image_set, (imgObj) => {
          return _.omit(imgObj, '__typename')}
                                  )
        setFieldValue('image_set', new_image_set);
      }
      //handleSubmit();
      setIsVisible(false);
      setFormikChanged(false)
    },
    onError: (err) => {
      setLoadingUserUpload(false)
      console.log("onErroe", err)
    }
  });
  const [displayInput, setDisplayInput] = useState(false);
  const [formikChanged, setFormikChanged] = useState(false);
  const compareQueryFormik = (a, b) =>
    {
  const keys = [
  'email',
  'phoneNumber',
  'first_name',
  'last_name',
  'age',
  'gender',
  'location',
  'sports',
  'description'
    ]
    console.log("compare quer", a.image_set)
    console.log("compare residual", b.add_local_images)
    console.log("compare add local", b.add_local_images)
    console.log("compare residual", b.remove_uploaded_images)
const noChange =  _.isMatch( // check deep equality
  a, // get properties from a
  _.pick(b, keys), // get properties from b
)


return noChange && _.isEmpty(b.add_local_images) &&_.isEmpty(b.remove_uploaded_images)

  }

  //const compareQueryFormik = (queryData, formikData) => {
    //console.log("query compare Data", queryData)
    //console.log("formik compare Data", formikData)
  //}
  useEffect(() => {
    if( InputTypeData.inputItems.displayInput == true){
    setInputType(InputTypeData.inputItems.inputType)
    setDisplayInput(InputTypeData.inputItems.displayInput)
    }
    }, [InputTypeData])
  //useEffect(() => {
    //const val = compareQueryFormik(userData.squash, initialValuesFormik)
    //if (val){
      //setFormikChanged(false)
    //}
    //else {
      //setFormikChanged(true)
    //}
    //}, [formikValues])

const _onPressDoneProfile = () => {
  // add anything that needs to be modified -> TODO: remove all database updates and add them here! => this is super important for optimizing and scaling! you have to many updates to mutations data!
    console.log("make sure formik not chnaged", formikChanged)
    console.log("compare vale")
    const val = compareQueryFormik(userData.squash, formikValues)
    console.log("compare vale", val)
    if (!val) {
      const RNLocalFiles = convertImagesToFormat(formikValues.add_local_images, currentUser.sub)
      ///// debug images
      console.log("formik remove", formikValues.remove_uploaded_images)
      console.log("formik add", formikValues.add_local_images)
      //setLoadingUserUpload(true)
      updateUserProfile({
        variables: {
          _id: currentUser.sub,
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
      //setLoadingUserUpload(false)
      if (cityVar() != formikValues.location.city){
        cityVar(formikValues.location.city)
        isCityChangedVar(true)
      }
      //// as soon as done new data needs to be grabbed and replaced
      //setFieldValue('remove_uploaded_images', []);
      //setFieldValue('add_local_images', []);
            //const userDetails = userData.squash.phoneNumber;
            //const initialValues2 = createInitialValuesFormik(
              //userData,
              //userDetails.phoneNumber,
            //);
            //setInitialValuesFormik(initialValues2);
            //resetForm({values: {...initialValues2}})

    }
    //setIsVisible(false);
    setFormikChanged(false)
}
const _onPressCancelProfile = () => {
    //handleReset()
    setFormikChanged(false)
    const initialValues2 = createInitialValuesFormik(
      userData,
      userData.squash.phoneNumber,
    );
    console.log("check initial values to make sure images are not set!", initialValues2)
    handleReset()
    resetForm({values: {...initialValues2}})
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
    setIsVisible(true)
}

const doneCancelValues = {
  setDisplayInput: setDisplayInput,
  tempInputValues: tempInputValues,
  setTempInputValues: setTempInputValues,
  setTempSports2: setTempSports2
};
  useEffect(() => {
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
          <Overlay
            overlayStyle={styles.imageErrorOverlay}
            isVisible={!changeSport}
            onBackdropPress={() => setChangeSport(!changeSport)}>
            <View>
              <Text style={styles.imageErrorText}>cannot changes sports too often</Text>
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
  const [loadingFormikValues, setLoadingFormikValues] = useState(true)
  const {data, userData, userLoading, currentUser} = useContext(UserContext)
  const [loadingUserUpload, setLoadingUserUpload] = useState(false);
  const [initialValuesFormik, setInitialValuesFormik] = useState(null);
  useEffect(() => {
    setLoadingFormikValues(true);
    const userDetails = userData.squash.phoneNumber
    if (userDetails) {
      const initialValues = createInitialValuesFormik(
        data,
        userDetails,
      );
      setInitialValuesFormik(initialValues);
      setLoadingFormikValues(false);
    }
  }, [userData]);
  return (
    <>
      <AppContainer loading={loadingUserUpload}>
      {!userLoading && !loadingFormikValues && (
        <Formik
          //enableReinitialize={true}
          validationSchema={profileEditSchema}
          initialValues={initialValuesFormik}
          onSubmit={(values, {resetForm}) => {
            const userDetails = userData.squash.phoneNumber;
            const initialValues2 = createInitialValuesFormik(
              userData,
              userDetails.phoneNumber,
            );
            setInitialValuesFormik(initialValues2);
            resetForm({values: {...initialValues2}})
          }}>
          <View>{!loadingFormikValues && <EditProfile setLoadingUserUpload={setLoadingUserUpload} setInitialValuesFormik={setInitialValuesFormik} initialValuesFormik={initialValuesFormik}/>}</View>
        </Formik>
      )}
      </AppContainer>
    </>
  );
}
export { Profile }
