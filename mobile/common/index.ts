import * as yup from 'yup'

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
const signInSchema = yup.object().shape({
    phoneNumber: yup
    .string()
    .matches(phoneRegExp, 'Phone number is not valid'),
    email: yup
    .string(),
    confirmationCode: yup
    .string()
})


export {signInSchema}

