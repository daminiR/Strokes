import React, { useRef, useEffect, useContext, useState, ReactElement } from 'react'
import { useFormikContext} from 'formik';
import { Text,Card, Input, Button, Icon, CheckBox} from 'react-native-elements'
import { View} from 'react-native'
import { EditFields, ProfileFields} from '@localModels'
import {styles } from '@styles'
import _ from 'lodash'

const CityInput = ({isSignUp}) => {
  const { setValues, setFieldTouched, errors, touched, values, handleChange, handleSubmit } = useFormikContext<ProfileFields>();
  //const [radioButtons, setRadioButtons] = useState(_.map(genderRadioObject, (radioObj) => refreshGenderObj(radioObj)))
  const [loadRadioButtons, setLoadRadioButtons] = useState(true)
  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(false);
  const [check3, setCheck3] = useState(false);
  const [check4, setCheck4] = useState(false);
  const [check5, setCheck5] = useState(false);
  const [check6, setCheck6] = useState(false);
  const [check7, setCheck7] = useState(false);
  const [check8, setCheck8] = useState(false);
  const [check9, setCheck9] = useState(false);
  const [check10, setCheck10] = useState(false);
  const [check11, setCheck11] = useState(false);
  const [check12, setCheck12] = useState(false);
  const cities = [
    {title: "Boston", checkFunc: setCheck1, checked: check1},
    {title: "Cambridge", checkFunc: setCheck2, checked: check2},
    {title: "Somerville", checkFunc: setCheck3, checked: check3},
    {title: "New York City", checkFunc: setCheck4, checked: check4},
    {title: "Chicago2", checkFunc: setCheck5, checked: check5},
    {title: "Charleston22", checkFunc: setCheck6, checked: check6},
    {title: "Las Vegas", checkFunc: setCheck7, checked: check7},
    {title: "Seattle", checkFunc: setCheck8, checked: check8},
    {title: "San Francisco", checkFunc: setCheck9, checked: check9},
    {title: "Washington", checkFunc: setCheck10, checked: check10},
    {title: "Los Angeles", checkFunc: setCheck11, checked: check11},
    {title: "Austin", checkFunc: setCheck12, checked: check12}
  ]
  useEffect(() => {
      setLoadRadioButtons(true)
      const city = values.location.city
        city && _.find(cities, cityObj => cityObj.title == city).checkFunc(true)
      setLoadRadioButtons(false)
    }, [])
   const onPressRadioButton = (city, cityFunc) => {
      setFieldTouched('location')
     _.map(cities, cityObj => cityObj.checkFunc(false))
     cityFunc(true);
    const tempLocation = {
      city: city,
      country: 'USA',
      state: 'MA',
    };
    console.log("location error", tempLocation)
    console.log("location error", errors.location)
        setValues({... values, 'location': tempLocation})
    }
    return (
      <View style={styles.ageContainer}>
        <Text>City</Text>
        {cities.map(({title, checkFunc, checked}, i) => (
        <CheckBox
          key={i}
          title={title}
          center
          checkedIcon={
            <Icon
              name="radio-button-checked"
              type="material"
              color="green"
              size={25}
              iconStyle={{marginRight: 10}}
            />
          }
          uncheckedIcon={
            <Icon
              name="radio-button-unchecked"
              type="material"
              color="grey"
              size={25}
              iconStyle={{marginRight: 10}}
            />
          }
          checked={checked}
          onPress={() => onPressRadioButton(title, checkFunc)}
        />
        )
        )}
        {errors.location ? (
          <Text style={{alignSelf: 'center'}}>{errors.description}</Text>
        ) : null}
      </View>
    )}
export {CityInput};
