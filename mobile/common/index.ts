import * as yup from 'yup'
import {CODE_LENGTH } from '../src/constants'

const phoneRegExp = /^[0-9]+$/
const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const signInSchema = yup.object().shape({
    phoneNumber: yup
    .string()
    //.matches(phoneRegExp, 'Phone number is not valid use format (xxx) xxx-xxxx')
    .length(12, "Phone Number must be 10 digits long"),
    email: yup
    .string()
    .matches(emailRegExp, "please provide valid a email address"),
    confirmationCode: yup
    .string()
    .matches(/^\d+$/, "only digits")
    .length(6, "code must be 6 digits long")
})

const sanitizePhone = (text) => {

  return '+1' + text.replace(/[^\d]/g, '')

}
 const formatCode = (value) => {
  // if input value is falsy eg if the user deletes the input, then just return
  if (!value) return value;

  // clean the input for any non-digit values.
  const phoneNumber = value.replace(/[^\d]/g, "");
  // phoneNumberLength is used to know when to apply our formatting for the phone number
  return `${phoneNumber.slice(0, CODE_LENGTH)}`;
}

 const formatPhoneNumber = (value) => {
  // if input value is falsy eg if the user deletes the input, then just return
  if (!value) return value;

  // clean the input for any non-digit values.
  const phoneNumber = value.replace(/[^\d]/g, "");

  // phoneNumberLength is used to know when to apply our formatting for the phone number
  const phoneNumberLength = phoneNumber.length;

  // we need to return the value with no formatting if its less then four digits
  // this is to avoid weird behavior that occurs if you  format the area code to early

  if (phoneNumberLength < 4) return phoneNumber;

  // if phoneNumberLength is greater than 4 and less the 7 we start to return
  // the formatted number
  if (phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  }

  // finally, if the phoneNumberLength is greater then seven, we add the last
  // bit of formatting and return it.
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
    3,
    6
  )}-${phoneNumber.slice(6, 10)}`;
}
export {sanitizePhone, signInSchema, formatPhoneNumber, formatCode}


