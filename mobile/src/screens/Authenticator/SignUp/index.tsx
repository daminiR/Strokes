import React, { useContext, useState, ReactElement } from 'react'
import {useMutation} from '@apollo/client'
import { useFormikContext, Formik} from 'formik';
import { StackNavigationProp } from '@react-navigation/stack'
import {signUpSlides, intitialFormikSignUp} from '../../../constants'
import {  RootStackSignOutParamList } from '../../../navigation/SignOutStack'
import AppIntroSlider from 'react-native-app-intro-slider'
import { ADD_PROFILE2 } from '../../../graphql/mutations/profile'
import { ProfileFields} from '../../../localModels/UserSportsList'
import {ConfirmationCode, PhoneInput, GenderInput, EmailInput, BirthdayInput, NameInput, DescriptionInput, ImageInput, SportsInput} from '../../../components'
import { registerOnFirebase, registerOnMongoDb} from '../../../utils/User'
import { UserContext} from '../../../UserContext'

type SignUpScreenNavigationProp = StackNavigationProp<RootStackSignOutParamList, 'SIGNUP'>
type SignUpT = {
  navigation: SignUpScreenNavigationProp
}
const SignUp = ({ navigation }: SignUpT): ReactElement => {
  const [loading, setLoading] = useState(false)
  const [error2, setError] = useState('');
  const [confirmationCode, setConfirmationCode] = useState(0)
  return (
    <Formik
      initialValues={intitialFormikSignUp}
      onSubmit={(values) => console.log(values)}>
      <Slider/>
    </Formik>
  );
}
const Slider =  () => {
  const {values} = useFormikContext<ProfileFields>();
  const {setIsUseOnMongoDb} = useContext(UserContext)
  const [lastSlide, setLastSlide] = useState(false)
  const [confirmationFunc, setConfirmationFunc] = useState(null)
  const [index, setIndex] = useState(0)
  const [showNextButton, setShowNextButton] = useState(true)
  const [createSquash2, {client, data}] = useMutation(ADD_PROFILE2, {
    ignoreResults: false,
    onCompleted: (data) => {
    },
  });
  const _onSlideChange = (index, last_index) => {
    setIndex(index)
    if (index == 8){
      setLastSlide(true)
      setShowNextButton(false)
    }
    else if (index == 7){
      setShowNextButton(false)
    }
    else {
      setShowNextButton(true)
    }
  }
  const _submit = ( value ) => {
    registerOnFirebase(values.phoneNumber, values.email)
      .then((confirmation: any) => {
        this.slider.goToSlide(8);
        setConfirmationFunc(confirmation)
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const _confirmSignInGC = () => {
    // promise in parralell
      confirmationFunc
        .confirm(values.confirmationCode)
        .then((userCredential) => {
            console.log("values before submit",values)
            console.log(userCredential.additionalUserInfo)
            registerOnMongoDb(values, userCredential.user.uid, createSquash2).then(() => {
            console.log('logged in');
            setIsUseOnMongoDb(true)
        })
        .catch(async (err) => {
            // else delete user as if not created
            //await auth().currentUser.delete()
          console.log(err);
        });
        });

  }
  const renderInputForm = ({item}) => {
          switch (item.type) {
            case 'Phone Input':
              return <PhoneInput />;
              break;
            case 'Email Input':
              return <EmailInput />;
              break;
            case 'Name Input':
              return <NameInput />;
              break;
            case 'Birthday Input':
              return <BirthdayInput />;
              break;
            case 'Gender Input':
              return <GenderInput />;
              break;
            case 'Sports Input':
              return <SportsInput />;
              break;
            case 'Image Input':
              return <ImageInput _submit={_submit}/>;
              break;
            case 'Description Input':
              return <DescriptionInput/>;
              break;
            case 'Confirmation Code':
              return <ConfirmationCode isLastSlide={lastSlide} _confirmSignInGC={_confirmSignInGC}/>;
              break;
          }
  };

  return (
      <AppIntroSlider
        renderItem={renderInputForm}
        data={signUpSlides}
        scrollEnabled={false}
        showPrevButton={true}
        onSlideChange={(index, lastIndex) => _onSlideChange(index, lastIndex)}
        onDone={() => {_confirmSignInGC()}}
        showNextButton={showNextButton}
        ref={(ref) => (this.slider = ref!)}
      />
  )
}
export { SignUp }
