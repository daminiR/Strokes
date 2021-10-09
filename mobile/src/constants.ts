import { Dimensions, Platform } from 'react-native'
import RadioGroup, { RadioButtonProps } from 'react-native-radio-buttons-group'

export const primary = '#50E3C2'
export const secondary = '#ff06f4'
export const red = 'red'
export const gray = '#949494'
export const white = '#ffffff'
export const black = '#17191A'
export const dimGray = '#707070'
export const lightGray = '#D1CDCD'

//export const KLMN = Platform.OS === 'ios' ? 'KLMN-Flash-Pix' : 'KLMN_Flash_Pix'
export const Dolbak = Platform.OS === 'ios' ? 'The Dolbak' : 'TheDolbak-Brush'
//export const Etna = Platform.OS === 'ios' ? 'Etna' : 'etna-free-font'
//export const Narrow = '3270Narrow'

// sports type and level information
export const sportsList = ["Squash", "Tennis", "Soccer", "badminton", "Hockey", "Volleyball", "Basketball", "Cricket", "Table Tennis", "Baseball", "Golf", "American Football"]
export const sportLevelList = ["beginners", "intermediate", "advanced"]
export const profileSettingsLabels = ["first name", "last name", "age", "gender"]
export const win = Dimensions.get('window')
export const W = win.width
export const H = win.height

export const Device = {
  // eslint-disable-next-line
  select(variants: any) {
    if (W >= 300 && W <= 314) return variants.mobile300 || {}
    if (W >= 315 && W <= 341) return variants.mobile315 || {}
    if (W >= 342 && W <= 359) return variants.mobile342 || {}
    if (W >= 360 && W <= 374) return variants.mobile360 || {}
    if (W >= 375 && W <= 399) return variants.mobile375 || {}
    if (W >= 400 && W <= 409) return variants.mobile400 || {}
    if (W >= 410 && W <= 414) return variants.mobile410 || {}
    if (W >= 415 && W <= 480) return variants.mobile415 || {}
    if (W >= 481) return variants.mobile481 || {}
  }
}

export const genderRadioObject :  RadioButtonProps[] = [
  { id: '0', label: 'Woman', value: 'Female' },
  { id: '1', label: 'Man', value: 'Male' },
];
export const goBack = (navigation: any) => () => navigation.goBack()

export const onScreen = (screen: string, navigation: any, obj?: unknown) => () => {
  navigation.navigate(screen, obj)
}

export const goHome = (navigation: any) => () => navigation.popToTop()()

// Sign Up Slide Labels

// initialValuesFormik
 export const intitialFormikSignUp = {
   email: '',
   phoneNumber: '+12025550173',
   first_name: '',
   last_name: '',
   age: '',
   gender: '',
   sports:[],
   images:[],
   confirmationCode: '000000'
 }
export const signUpSlides = [
  {
    key: '0',
    type: 'Phone Input',
    title: 'Phone Number',
    inputLabel: 'Phone Number',
    backgroundColor: '#59b2ab',
  },
  {
    key: '1',
    type: 'Email Input',
    title: 'Email',
    InputLabel: 'Email',
    backgroundColor: '#59b2ab',
  },
  {
    key: '2',
    type: 'Name Input',
    title: 'Name',
    InputLabel: 'Name',
    backgroundColor: '#22bcb5',
  },
  {
    key: '3',
    type: 'Birthday Input',
    title: 'Birthday',
    InputLabel: 'Birthday',
    backgroundColor: '#59b2ab',
  },
  {
    key: '4',
    type: 'Gender Input',
    title: 'Gender',
    InputLabel: 'Gender',
    backgroundColor: '#59b2ab',
  },
  {
    key: '5',
    type: 'Sports Input',
    title: 'Sports',
    InputLabel: 'Sports',
    backgroundColor: '#59b2ab',
  },
  {
    key: '6',
    type: 'Image Input',
    title: 'Image',
    InputLabel: 'Image',
    backgroundColor: '#59b2ab',
  },
  {
    key: '7',
    type: 'Confirmation Code',
    title: 'Confirmation Code',
    inputLabel: 'Confirmation Code',
    backgroundColor: '#59b2ab',
  },
];

