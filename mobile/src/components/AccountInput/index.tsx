import React, { useContext, useState, useEffect} from 'react'
import {View, Modal} from 'react-native';
import auth from '@react-native-firebase/auth'
import {styles} from '@styles'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {READ_SQUASH, GET_ACCOUNT_DETAIL_INPUT_TYPE,SOFT_DELETE_PROFILE, DELETE_PROFILE} from '@graphQL2'
import {Cancel, Done, ConfirmationCode, EditAccountDetailsInput} from '@components'
import {Button, ListItem, Overlay} from 'react-native-elements';
import { EditAccounDetailInputVar} from '@cache'
import {AccountList} from '@constants'
import {_confirmationCode} from '../../InputsVar'
import { useFormikContext} from 'formik';
import { EditFields} from '@localModels'
import {EditAccountInputVar} from '@cache'
import {UserContext} from '@UserContext'
import { useApolloClient, useQuery, useMutation} from '@apollo/client'
import { _onPressSignOut, registerOnFirebase} from '@utils'
import _  from 'lodash'

const AccountDetails = ({signOut}) => {
  const client = useApolloClient();
  const [inputType, setInputType] = useState();
  const {currentUser, currentUserData, userData, userLoading, refetchUserData} = useContext(UserContext)
  const [phoneNumber, setPhoneNumber] = useState(null)
  const [loading, setLoading] = useState(true)
  const [confirmationFunc, setConfirmationFunc] = useState(null)
  const [displayInput, setDisplayInput] = useState(false)
  const [email, setEmail] = useState(null)
  const {handleReset, setValues, values: formikValues } = useFormikContext<EditFields>();
  const [deleteSquash] = useMutation(DELETE_PROFILE);
  const [softDeleteUser] = useMutation(SOFT_DELETE_PROFILE,{
    //refetchQueries: [{query: READ_SQUASH, variables: {id: currentUser.uid}}],
    onCompleted: () => {
      _onPressSignOut(setDisplayInput, client)
      console.log('Succesful signout, and soft delete');
    },
  });
  const {data:InputTypeData } = useQuery(GET_ACCOUNT_DETAIL_INPUT_TYPE);
  // phone email display
  // privacy policy
  //
  // add signout here
  // add delete account here
  useEffect(() => {
    if( InputTypeData.inputAccountDetailItems.displayInput == true){
    setInputType(InputTypeData.inputAccountDetailItems.inputType);
    setDisplayInput(InputTypeData.inputAccountDetailItems.displayInput);
    }
    }, [InputTypeData])
  useEffect(() => {
      const phone_idx = AccountList.findIndex(
        (listAttribute) => listAttribute.title == 'Phone Number',
      );
      AccountList[phone_idx].subtitle = formikValues.phoneNumber;
      // email
      const email_idx = AccountList.findIndex(
        (listAttribute) => listAttribute.title == 'Email',
      );
      AccountList[email_idx].subtitle = formikValues.email;
      setLoading(false)
  }, [formikValues]);
  const _onPressCancelInput = () => {
    EditAccounDetailInputVar({inputType: '', displayInput: false})
    setDisplayInput(false);
  }
  const _onPressDoneInput = () => {
    setValues({... formikValues, 'phoneNumber': phoneNumber ? phoneNumber : formikValues.phoneNumber, 'email': email ? email : formikValues.email })
    EditAccounDetailInputVar({inputType: '', displayInput: false})
    setDisplayInput(false);
  }
  const getData = (data, inputType) => {
    switch (inputType) {
      case 'Phone Input':
        setPhoneNumber(data);
        break;
      case 'Email Input':
        console.log('in email', data);
        setEmail(data);
        break;
    }
  };
  const deleteStart = async () => {
    registerOnFirebase(auth().currentUser.phoneNumber).then((confirmation) => {
      setConfirmationFunc(confirmation);
      _confirmationCode();
    });
  };
const softDelete = async() => {
  softDeleteUser({variables: {_id: userData.squash._id}})
}

const confirmDelete = async() => {
  //const image_set_new = _.map(userData.squash.image_set, obj => {
    //return _.omit(obj, ['__typename'])
  //})
  console.log("code", formikValues.confirmationCode)
  console.log("phone", formikValues.phoneNumber)
  console.log("ficn", confirmationFunc)
    confirmationFunc && confirmationFunc
      .confirm(formikValues.confirmationCode)
      .then((userCredential) => {
         auth()
           .currentUser.delete()
           .then(() => {
             // delete from mongodb
             // soft delete fornow
              softDeleteUser({variables: {_id: userData.squash._id}})
             //deleteSquash({
               //variables: {_id: userData.squash._id, image_set: image_set_new},
             //});
             AsyncStorage.clear();
             console.log('user has been deleted');
             EditAccountInputVar({inputType: '', displayInput: false});
             setDisplayInput(false);
           })
           .catch((error) => {
             console.log(error);
           });
      })
      .catch(async (err) => {
        console.log(err);
      });
  };
  return (
    // either put done/cancel here or in parent modal
    <View style={{flex: 1}}>
      {AccountList.map((item, i) => (
        <ListItem disabled={item.buttonPress ? false : true }onPress={() => item.buttonPress && item.buttonPress()} key={i} bottomDivider>
          <ListItem.Content>
            <ListItem.Title>{item.title}</ListItem.Title>
            <ListItem.Subtitle>{item.subtitle}</ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron/>
        </ListItem>
      ))}
      <Button
        title="Sign Out"
        buttonStyle={styles.buttonStyle}
        onPress={() => {
          signOut(setDisplayInput, client)
        }}
      />
      <Button
        title="Delete Account"
        buttonStyle={styles.buttonStyle}
        onPress={() => softDelete()}
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
          </View>
            <EditAccountDetailsInput inputType={inputType} getData={getData} confirmDelete={confirmDelete}/>
        </Modal>
    </View>
  );
}
export {AccountDetails}
