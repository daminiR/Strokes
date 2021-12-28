import * as yup from 'yup'
import {sportsList, CODE_LENGTH } from '../src/constants'

const GENDER = ["Female", "Male"]
const phoneRegExp = /^[0-9]+$/
const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const imageURLRegex = /https?:\/\//

const FilterSchema = yup.object().shape({
   ageRange: yup.object().shape({
     minAge: yup.number().required(),
     maxAge: yup.number().required(),
   }),
   sportFilter: yup.array(
     yup.object({
       sport: yup.string().required(),
       filterSelected: yup.boolean().required(),
     }).required(),
   ),
   gameLevels: yup.object().shape({
     gameLevel0: yup.boolean().required(),
     gameLevel1: yup.boolean().required(),
     gameLevel2: yup.boolean().required(),
   })
   .test('at-least-one-required', 'you check atleast one', value => !!(value.gameLevel0 || value.gameLevel1 || value.gameLevel2)),
 });


const signInSchema = yup.object().shape({
    phoneNumber: yup
    .string()
    //.matches(phoneRegExp, 'Phone number is not valid use format (xxx) xxx-xxxx')
    .length(12, "Phone Number must be 10 digits long")
    .required('phone number is required'),
    confirmationCode: yup
    .string()
    .length(6, "code must be 6 digits long")
    .required('code is required')
    .matches(/^\d+$/, "only digits")
})
const signUpSchema = yup.object().shape({
  phoneNumber: yup
    .string()
    //.matches(phoneRegExp, 'Phone number is not valid use format (xxx) xxx-xxxx')
    .length(12, 'Phone Number must be 10 digits long')
    .required('phone number is required'),
  first_name: yup
    .string()
    .matches(/^[A-Za-z ]*$/, 'Please enter valid name')
    .min(2, 'first name cannot be less than 2 character long')
    .max(40, 'first name cannot be more than 40 character long')
    .required(),
  last_name: yup
    .string()
    .matches(/^[A-Za-z ]*$/, 'Please enter valid name')
    .min(2, 'last name cannot be less than 2 character long')
    .max(40, 'last name cannot be more than 40 character long')
    .required(),
  email: yup
    .string()
    .matches(emailRegExp, 'please provide valid a email address'),
  age: yup
    .number()
    .required('Is required')
    .positive()
    .integer()
    .min(18, 'Min is 18')
    .max(118, 'max is 118'),
  gender: yup.string().oneOf(GENDER),
  sports: yup
    .array()
    .of(
      yup.object({
        sport: yup
        .string()
        .required()
        .oneOf(sportsList),
        game_level: yup
        .string()
        .required()
        .oneOf(['0', '1', '2']),
      }),
    )
    .min(1, 'you must have atleast 1 sport')
    .nullable(false)
    .required(),
  image_set: yup
    .array()
    .of(
      yup.object({
        img_idx: yup.number().required().oneOf([0, 1, 2, 3, 4, 5]),
        imageURL: yup.string().required(),
        //.matches(imageURLRegex),
        filePath: yup.string().required(),
      }),
    )
    .min(1, 'you must have atleast 1 image')
    .nullable(false)
    .required(),
  description: yup
    .string()
    //.matches(phoneRegExp, 'Phone number is not valid use format (xxx) xxx-xxxx')
    .min(10, 'description cannot be less than 10 character long')
    .max(300, 'last name cannot be more than 300 character long')
    .required('description is required'),
  location: yup
  .object().shape({
        city: yup
        .string()
        .required(),
        state: yup
        .string()
        .required(),
        //TODO: add enum for states and country
        //.oneOf(['0', '1', '2']),
        country: yup
        .string()
        .required(),
        //.oneOf(['0', '1', '2']),
      })
      .required(),
});

const sanitizePhone = (text) => {
  return '+1' + text.replace(/[^\d]/g, '');
};
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
export {FilterSchema, signUpSchema, sanitizePhone, signInSchema, formatPhoneNumber, formatCode}


