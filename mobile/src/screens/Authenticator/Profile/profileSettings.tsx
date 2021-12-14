import React, {useRef, useContext, useEffect, useState} from 'react'
import { Button, Card, Icon, ListItem, Overlay} from 'react-native-elements'
import {GET_ACCOUNT_INPUT_TYPE} from '../../../graphql/queries/profile'
import {UserContext} from '../../../UserContext'
import styles from '../../../assets/styles'
import { EditFields} from '../../../localModels/UserSportsList'
import {Image, Modal, ScrollView, Text, View} from 'react-native';
import { Cancel, Done, EditPencil, ConfirmationCode} from '../../../components/';
import auth from '@react-native-firebase/auth'
import {_editAccount} from '../../../utils/navigation'
import { EditInput, EditAccountInput} from './EditInputs'
import {Slider} from '../SignIn/index'
import { useLazyQuery, useQuery, useMutation} from '@apollo/client'
import { registerOnFirebase} from '../../../utils/User'
import {EditAccountInputVar} from '../../../cache'
import { useFormikContext, Formik} from 'formik';
import {createInitialValuesFormik } from '../../../utils/formik'
import {signInSlides, iniitialSignInForm} from '../../../constants'
import _ from 'lodash'

const ProfileSettings = ({_editUserInfo, signOut}) => {
  const [displayInput, setDisplayInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [displayImage, setDisplayImage] = useState(null)
  const {data:InputTypeData } = useQuery(GET_ACCOUNT_INPUT_TYPE);
  const [displayName, setDisplayName] = useState('')
  const [displayAuth, setDisplayAuth] = useState(false)
  const [formikChanged, setFormikChanged] = useState(false);
  const [inputType, setInputType] = useState();
  const {loadingUser} = useContext(UserContext)
  const didMountRef = useRef(false)
  const {handleReset, values: formikValues} = useFormikContext<EditFields>();
  const [confirmationFunc, setConfirmationFunc] = useState(null)
  const settingsList = [
  {title: 'Account', icon: 'flight-takeoff', subtitle: displayName, buttonPress: _editAccount},
]

const confirmWithCode = async(code) => {
  console.log("we are in codeing confir")
    confirmationFunc
      .confirm(code)
      .then((userCredential) => {
         auth()
           .currentUser.updateEmail(formikValues.email)
           .then(() => {
             console.log('email changed');
             EditAccountInputVar({inputType: '', displayInput: false});
             setDisplayAuth(false)
             setDisplayInput(false);
             setFormikChanged(false);
           })
           .catch((error) => {
             console.log(error);
           });
      })
      .catch(async (err) => {
        //await auth().currentUser.delete()
        console.log(err);
      });
  };
  const _onPressCancelInput = () => {
    handleReset()
    setFormikChanged(false)
    EditAccountInputVar({inputType: '', displayInput: false})
    setDisplayInput(false);
  }
  const confirmSignIn = () => {
    registerOnFirebase(formikValues.phoneNumber, formikValues.email)
      .then((confirmation: any) => {
        setConfirmationFunc(confirmation)
        setDisplayAuth(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const renderAuthenticateOverlay = () => {
    return (
      // TODO:set the sports car filters, age, and game level thats all for now
      <Overlay isVisible={displayAuth}>
        <View style={styles.authEmailOverlay}>
          <ConfirmationCode isLastSlide={true} _confirmSignInGC={confirmWithCode}/>
        </View>
      </Overlay>
    );
    }
  const _onPressDoneInput = async () => {
    if (formikChanged){
      confirmSignIn()
    }
    // change auth values
    //EditAccountInputVar({inputType: '', displayInput: false})
    //setDisplayInput(false);
    //setFormikChanged(false)
  }
  useEffect(() => {
    if (didMountRef.current){
      setFormikChanged(true)
    }
    else {
      didMountRef.current = true
    }
    }, [formikValues.phoneNumber, formikValues.email])

  useEffect(() => {
      const user = formikValues
      const image_set_copy = user.image_set
      const min_idx_obj = image_set_copy.reduce((res, obj) => {
      return obj.img_idx < res.img_idx ? obj : res;
      });
      setDisplayImage(min_idx_obj.imageURL);
      setDisplayName(user.first_name + ' ' + user.last_name)
  }, [formikValues])

  const renderHeader = () => {
  return (
    <View>
      <View style={styles.headerBackgroundImage}>
        {!loadingUser && (
          <View style={styles.headerColumn}>
            <Image style={styles.userImage} source={{uri: displayImage}} />
            <EditPencil _edit={_editUserInfo}/>
            <Text style={styles.nameStyle}>{displayName}</Text>
          </View>
        )}
      </View>
    </View>
  );
  }
  useEffect(() => {
    if (InputTypeData.inputAccountItems.displayInput == true) {
      setInputType(InputTypeData.inputAccountItems.inputType);
      setDisplayInput(InputTypeData.inputAccountItems.displayInput);
    }
  }, [InputTypeData]);
  const renderList = () => {
    return (
      <View style={styles.telContainer}>
        {settingsList.map((item, i) => (
          <ListItem onPress={() => item.buttonPress()} key={i} bottomDivider>
            <ListItem.Content>
              <ListItem.Title>{item.title}</ListItem.Title>
              <ListItem.Subtitle>{item.subtitle}</ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        ))}
        <Button
          title="Sign Out"
          buttonStyle={styles.buttonStyle}
          onPress={() => signOut()}
        />
        <Modal
          animationType="slide"
          transparent={false}
          visible={displayInput}
          //onRequestClose={() => {
          //setDisplayInput(!displayInput);
          //}}
        >
          <View style={{flex: 1}}>
            <View style={styles.top}>
              <Cancel _onPressCancel={_onPressCancelInput} />
              <Done _onPressDone={_onPressDoneInput} />
            </View>
            <EditAccountInput inputType={inputType} signOut={signOut}/>
            {renderAuthenticateOverlay()}
          </View>
        </Modal>
      </View>
    );
  };

   return (
     <ScrollView style={styles.scroll}>
       <View style={{flex:1}}>
         <Card containerStyle={styles.cardContainer}>
           {renderHeader()}
           {!loading && renderList()}
         </Card>
       </View>
     </ScrollView>
   );
};

export  { ProfileSettings }
