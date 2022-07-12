import React, {createContext, useEffect, useContext, useState, ReactElement } from 'react'
import {StackNavigationProp, RouteProp} from '@react-navigation/stack'
import {View, Modal} from 'react-native';
import {styles} from '@styles'
import { RootStackSignInParamList, ProfileInputEdits} from '@NavStack'
import {UserContext} from '@UserContext'
import {Overlay, Text} from 'react-native-elements'
import { useFormikContext, Formik, useField} from 'formik';
import {useQuery, useMutation} from '@apollo/client'
import {GET_INPUT_TYPE, READ_SQUASH, UPDATE_USER_PROFILE} from '@graphQL2'
import {ProfileSettings, EditInput, Done, Cancel, AppContainer} from '@components'
import { EditFields} from '@localModels'
import { isCityChangedVar, cityVar, EditInputVar} from '@cache'
import {convertImagesToFormat, createInitialValuesFormik, _onPressSignOut, deleteUser, compareQueryFormik, switchInputOnCancel, switchInputOnDone} from '@utils'
import {DoneCancelContext} from '@Contexts'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import  { profileEditSchema} from '@validation'
import _ from 'lodash'


export type ProfileScreenNavigationProp = StackNavigationProp<RootStackSignInParamList, 'PROFILE'>
export type ProfileScreenRouteProp = RouteProp<RootStackSignInParamList, 'PROFILE'>;

type ProfileT = {
  navigation: ProfileScreenNavigationProp
  route: ProfileScreenRouteProp
}
const EditProfile = () => {
  const [loadingUserUpload, setLoadingUserUpload] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [inputType, setInputType] = useState();
  const {setFieldValue, touched, initialValues: formikInitialValues, setValues, values: formikValues,resetForm, handleReset, errors: validationErrors, handleSubmit} = useFormikContext<EditFields>();
  const [tempInputValues, setTempInputValues] = useState(null);
  const {currentUser,userData, imageErrorVisible, setImageErrorVisible, changeSport, setChangeSport} = useContext(UserContext)
  const {data:InputTypeData } = useQuery(GET_INPUT_TYPE);
  const [updateUserProfile] = useMutation(UPDATE_USER_PROFILE, {
    //////// refetching is necessary because without this the update happens on cancel/done"
    refetchQueries: [{query: READ_SQUASH, variables: {id: currentUser.sub}}],
    awaitRefetchQueries: true,
    //////// refetching is necessary because without this the update happens on cancel/done"
    onCompleted: (data) => {
      if (cityVar() != formikValues.location.city){
        cityVar(formikValues.location.city)
        isCityChangedVar(true)
      }
      // wow this was the missing peace, reset needed to be here for cancel and done to work properly with reintialization
      if (data?.updateUserProfile){
        const new_image_set =_.map(data.updateUserProfile.image_set, (imgObj) => {
          return _.omit(imgObj, '__typename')}
                                  )
        setFieldValue('image_set', new_image_set);
      }
      setLoadingUserUpload(false)
      handleSubmit();
      handleReset()
      setIsVisible(false);
    },
    onError: (err) => {
      setLoadingUserUpload(false)
      console.log("onErroe", err)
    }
  });
  const [displayInput, setDisplayInput] = useState(false);
  useEffect(() => {
    if( InputTypeData.inputItems.displayInput == true){
    setInputType(InputTypeData.inputItems.inputType)
    setDisplayInput(InputTypeData.inputItems.displayInput)
    }
    }, [InputTypeData])

const _onPressDoneProfile = () => {
  // add anything that needs to be modified -> TODO: remove all database updates and add them here! => this is super important for optimizing and scaling! you have to many updates to mutations data!
    const val = compareQueryFormik(userData.squash, formikValues)
    if (!val) {
      const RNLocalFiles = convertImagesToFormat(formikValues.add_local_images, currentUser.sub)
      ///// debug images
      console.log("formik remove", formikValues.remove_uploaded_images)
      console.log("formik add", formikValues.add_local_images)
      setLoadingUserUpload(true)
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
    }
    else{
      setLoadingUserUpload(false)
    }
}
const _onPressCancelProfile = () => {
    handleReset()
    const initialValues2 = createInitialValuesFormik(
      userData,
      userData.squash.phoneNumber,
    );
    handleReset()
    resetForm({values: {...initialValues2}})
    setIsVisible(false);
}
  const [temptSports2, setTempSports2] = useState(formikValues.sports)
  const _onPressDoneInput = async () => {
    switchInputOnDone(touched, formikValues, inputType, validationErrors, setFieldValue, setDisplayInput)
  }
const _onPressCancelInput = () => {
  switchInputOnCancel(formikInitialValues, setFieldValue, inputType, setDisplayInput)
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
      <AppContainer loading={ loadingUserUpload }>
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
      </AppContainer>
      </>
    );
}
const Profile = () => {
  const {data, userData, userLoading, currentUser} = useContext(UserContext)
  const [initialValuesFormik, setInitialValuesFormik] = useState(null);
  const [loadingFormikValues, setLoadingFormikValues] = useState(true)
  useEffect(() => {
    if (!userLoading){
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
    }
  }, [userData]);
  const renderFormikProfile = () => {
    return (
      <>
        <AppContainer loading={userLoading || loadingFormikValues}>
          {!userLoading && !loadingFormikValues && (
            <Formik
              enableReinitialize={true}
              validationSchema={profileEditSchema}
              initialValues={loadingFormikValues ? initialValuesFormik : initialValuesFormik}
              onSubmit={(values, {resetForm}) => {
                // do not remove this code this helps update when press done
                const userDetails = userData.squash.phoneNumber;
                const initialValues2 = createInitialValuesFormik(
                  userData,
                  userDetails,
                );
                setInitialValuesFormik(initialValues2);
                resetForm({values: {...initialValues2}});
              }}>
              <View>
                {!loadingFormikValues && initialValuesFormik?.location && (
                  <EditProfile />
                )}
              </View>
            </Formik>
          )}
        </AppContainer>
      </>
    );
  };
  return (
    <>
      {renderFormikProfile()}
    </>
  );

}
export { Profile }
