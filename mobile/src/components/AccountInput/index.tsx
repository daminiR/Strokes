import React, { useContext, useState, useEffect} from 'react'
import {View, Modal} from 'react-native';
import {RootRefreshContext} from '../../index.js'
import auth from '@react-native-firebase/auth'
import {styles} from '@styles'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {GET_ACCOUNT_DETAIL_INPUT_TYPE,SOFT_DELETE_PROFILE, DELETE_PROFILE} from '@graphQL2'
import {Cancel, Done, EditAccountDetailsInput} from '@components'
import {Button, ListItem} from 'react-native-elements';
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
  const {currentUser, currentUserData, sendbird, userData, userLoading, refetchUserData, setCurrentUser} = useContext(UserContext)
  const [phoneNumber, setPhoneNumber] = useState(null)
  const [loading, setLoading] = useState(true)
  const [confirmationFunc, setConfirmationFunc] = useState(null)
  const [displayInput, setDisplayInput] = useState(false)
  const [email, setEmail] = useState(null)
  const {handleReset, setValues, values: formikValues } = useFormikContext<EditFields>();
  const {setLoadingSignUInRefresh, setClient} = useContext(RootRefreshContext)
  const [deleteSquash] = useMutation(DELETE_PROFILE);
  const [softDeleteUser] = useMutation(SOFT_DELETE_PROFILE,{
    //refetchQueries: [{query: READ_SQUASH, variables: {id: currentUser.uid}}],
    onCompleted: async () => {
        setLoadingSignUInRefresh(true);
        await _onPressSignOut(
          setDisplayInput,
          client,
          sendbird,
          setLoadingSignUInRefresh,
          setCurrentUser,
          setClient,
        );
      console.log('Succesful signout, and soft delete');
          setLoadingSignUInRefresh(false)
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
    confirmationFunc && confirmationFunc
      .confirm(formikValues.confirmationCode)
      .then((userCredential) => {
         auth()
           .currentUser.delete()
           .then(() => {
             // delete from mongodb
             // soft delete for now
            softDeleteUser({variables: {_id: userData.squash._id}})
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
    <View style={{ flex: 1 }}>
      {AccountList.map((item, i) => (
        <ListItem
          disabled={item.buttonPress ? false : true}
          onPress={() => {
            if (item.title === "Delete Account") {
              item.buttonPress && item.buttonPress();
            } else {
              item.buttonPress && item.buttonPress();
            }
          }}
          key={i}
          bottomDivider
        >
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
        onPress={async () => {
          setLoadingSignUInRefresh(true);
          await signOut(
            setDisplayInput,
            client,
            sendbird,
            setLoadingSignUInRefresh,
            setCurrentUser,
            setClient
          );
          setLoadingSignUInRefresh(false);
        }}
      />
      <Button
        title="Delete Account"
        buttonStyle={styles.buttonStyle}
        onPress={() => softDelete()}
      />
      <Modal animationType="slide" transparent={false} visible={displayInput}>
        <View style={{ flex: 1 }}>
          <View style={styles.top}>
            <Cancel _onPressCancel={_onPressCancelInput} />
            <Done _onPressDone={_onPressDoneInput} />
          </View>
        </View>
        <EditAccountDetailsInput
          inputType={inputType}
          getData={getData}
          confirmDelete={confirmDelete}
          softDelete={softDelete}
        />
      </Modal>
    </View>
  );
}
export {AccountDetails}
