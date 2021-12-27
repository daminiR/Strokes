import React, { useRef, useEffect, useContext, useState, ReactElement } from 'react'
import { useFormikContext} from 'formik';
import {Theme, Text, Chip, Card, Input, Button,withBadge, ListItem, Icon, Avatar, Badge } from 'react-native-elements'
import { View} from 'react-native'
import styles from '../../assets/styles'
import { EditFields, ProfileFields, SignIn} from '../../localModels/UserSportsList'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {API_KEY} from './API_KEY'
import {DoneCancelContext} from '../../Contexts'

const GooglePlacesInput = ({isSignUp = false}) => {
  const { handleBlur, errors, setFieldTouched, touched, setValues, values, handleChange, handleSubmit } = useFormikContext<ProfileFields | EditFields>();
  const [locationSelected, setLocationSelected] = useState(false)
  var setDisplayInput = null
  var setTempInputValues = null
  var tempInputValues= null
  if (!isSignUp){
    var {setDisplayInput, setTempInputValues, tempInputValues} = useContext(DoneCancelContext);
  }
  const ref = useRef(null);
  useEffect(() => {
    const GooglePlacesProps = ref.current;
      !isSignUp && GooglePlacesProps?.setAddressText(values?.location?.city);
  }, []);
  const _onPressLocation = (data, details=null) => {
//         'details' is provided when fetchDetails = true
        setFieldTouched('location')
        console.log("location value", values.location)
        console.log("location value", data)
        ref.current?.setAddressText(data.description);
        const tempLocation = {
          city: data.terms[0].value,
          country: data.terms[2].value,
          state: data.terms[1].value,
        };
        if (isSignUp) {
          console.log("do we hit this", isSignUp)
        setValues({... values, 'location': tempLocation})
        }
        else {
        setTempInputValues((prevState) => {return {...prevState, 'location' : tempLocation}})
        }
  }
  //const _onFail = () => {
    //console.log("onFail")
  //}
  //const _onNotFound = () => {
    //console.log("onNotFound")
  //}
  //const _onTimeOut = () => {
    //console.log("onFail")
  //}
  return (
    <>
      <GooglePlacesAutocomplete
        ref={ref}
        //blur={() => handleBlur('location')}
        autoFillOnNotFound={true}
        placeholder="Search"
        enablePoweredByContainer={false}
        minLength={4}
        //onFail={_onFail()}
        //onNotFound={_onNotFound()}
        //onTimeout={_onTimeOut()}
        onPress={(data, details=null) => _onPressLocation(data, details)}
        query={{
          key: API_KEY,
          language: 'en',
          components: 'country:us',
          types: '(cities)',
        }}
      />
        {errors.location && touched.location ? (
          <Text style={{alignSelf: 'center'}}>{errors.description}</Text>
        ) : null}
    </>
  );
};

const NeighborhoodSearch = ({isSignUp}) => {
  const { errors, touched} = useFormikContext<ProfileFields | EditFields>();
  return (
    <View style={{flex:1}}>
      <GooglePlacesInput isSignUp={isSignUp}/>
    </View>
  );
  }
            //{errors.location && touched.location? (
              //<Text style={{alignSelf:'center'}}>{errors.location}</Text>
            //) : null}

export {NeighborhoodSearch};
