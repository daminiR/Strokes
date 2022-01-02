import React, { useEffect, useContext, useState } from 'react'
import { Text,Card, Input, Button, Icon, CheckBox} from 'react-native-elements'
import { View, TouchableWithoutFeedback, Keyboard} from 'react-native'
import _ from 'lodash'


const DismissKeyboard = ({ children}) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
)

export {DismissKeyboard}
