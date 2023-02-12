import {Validator} from 'validator'
import {
  GENDERS,
  LOCATIONS,
  CITIES,
  STATES,
  COUNTRY,
  LEVELS,
  SPORTS,
  MAX_SPORTS_LIMIT
} from "../constants/";

export const imageArrayMaxLimit = val => {
  return (Array.isArray(val) && val.length <= 6)
}
export const sportsArrayMaxLimit = val => {
  return (Array.isArray(val) && val.length <= MAX_SPORTS_LIMIT)
}

export const imageArrayMinLimit = val => {
  return (Array.isArray(val) && val.length >= 1)
}

export var validateEmail = (email) => {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};
export const _idValidator = _id => {
 return (_id === typeof(String))
}

export const validator = (body, rules, customMessages, callback) => {
    const validation = new Validator(body, rules, customMessages);
    validation.passes(() => callback(null, true));
    validation.fails(() => callback(validation.errors, false));
};

