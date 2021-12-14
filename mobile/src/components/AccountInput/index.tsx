import React, { useContext, useState, useCallback, useEffect } from 'react'
import {View, Modal} from 'react-native';
import styles from '../../assets/styles/'
import {GET_ACCOUNT_DETAIL_INPUT_TYPE} from '../../graphql/queries/profile'
import {Cancel, Done} from '../'
import {Button, ListItem} from 'react-native-elements';
import { EditAccounDetailInputVar} from '../../cache'
import {AccountList} from '../../constants'
import { useFormikContext} from 'formik';
import { EditFields} from '../../localModels/UserSportsList'
import {UserContext} from '../../UserContext'
import { EditAccountDetailsInput} from '../../screens/Authenticator/Profile/EditInputs'
import { useQuery } from '@apollo/client'

const AccountDetails = ({signOut}) => {
  const [inputType, setInputType] = useState();
  const {userData, userLoading} = useContext(UserContext)
  const [phoneNumber, setPhoneNumber] = useState(null)
  const [loading, setLoading] = useState(true)
  const [displayInput, setDisplayInput] = useState(false)
  const [email, setEmail] = useState(null)
  const {handleReset, setValues, values: formikValues } = useFormikContext<EditFields>();
  const {data:InputTypeData } = useQuery(GET_ACCOUNT_DETAIL_INPUT_TYPE);
  // phone email display
  // privacy policy
  //
  // add signout here
  // add delete account here
  useEffect(() => {
    console.log("inmore details")
    if( InputTypeData.inputAccountDetailItems.displayInput == true){
    setInputType(InputTypeData.inputAccountDetailItems.inputType)
    setDisplayInput(InputTypeData.inputAccountDetailItems.displayInput)
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
  const getData = (data, inputType) =>{
    switch (inputType) {
      case 'Phone Input':
        setPhoneNumber(data)
        break
      case 'Email Input':
        console.log("in email", data)
        setEmail(data)
        break
    }
  }

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
          </View>
            <EditAccountDetailsInput inputType={inputType} getData={getData}/>
        </Modal>
    </View>
  );
}

export {AccountDetails}
