import { Dimensions, Platform } from 'react-native'
import {DIMENSION_HEIGHT} from '@styles'
import { _privacyPolicy, _email, _phone_number, _neighborhood, _gender, _age, _first_name} from './InputsVar'

export const primary = '#50E3C2'
export const secondary = '#ff06f4'
export const red = 'red'
export const gray = '#949494'
export const white = '#ffffff'
export const black = '#17191A'
export const dimGray = '#707070'
export const lightGray = '#D1CDCD'
export const SWIPIES_PER_DAY_LIMIT = 10

export const tabBarSize = DIMENSION_HEIGHT * 0.08
export const CODE_LENGTH = 6

//export const KLMN = Platform.OS === 'ios' ? 'KLMN-Flash-Pix' : 'KLMN_Flash_Pix'
export const Dolbak = Platform.OS === 'ios' ? 'The Dolbak' : 'TheDolbak-Brush'
//export const Etna = Platform.OS === 'ios' ? 'Etna' : 'etna-free-font'
//export const Narrow = '3270Narrow'

// age range default
export const defaultAgeRange = { minAge: 18, maxAge: 118 }
export const defaultGameLevel = {gameLevel0: true, gameLevel1: false, gameLevel2: false}
// sports type and level information
export const sportIconMap = {
  Softball: {
    name: 'fencing',
    type: 'material-community',
    size: 20,
    color: 'black',
  },
  Kickball: {
    name: 'fencing',
    type: 'material-community',
    size: 20,
    color: 'black',
  },
  Pickleball: {
    name: 'fencing',
    type: 'material-community',
    size: 20,
    color: 'black',
  },
  Hiking: {
    name: 'hiking',
    type: 'material-community',
    size: 20,
    color: 'black',
  },
  Swimming: {
    name: 'swim',
    type: 'material-community',
    size: 20,
    color: 'black',
  },
  'Kick boxing': {
    name: 'fencing',
    type: 'material-community',
    size: 20,
    color: 'black',
  },
  Bouldering: {
    name: 'fencing',
    type: 'material-community',
    size: 20,
    color: 'black',
  },
  Squash: {
    name: 'fencing',
    type: 'material-community',
    size: 20,
    color: 'black',
  },
  Tennis: {
    name: 'tennisball',
    type: 'ionicon',
    size: 20,
    color: 'black',
  },
  Soccer: {
    name: 'soccer-ball-o',
    type: 'font-awesome',
    size: 20,
    color: 'black',
  },
  Badminton: {
    name: 'badminton',
    type: 'material-community',
    size: 20,
    color: 'black',
  },
  Hockey: {
    name: 'hockey-sticks',
    type: 'material-community',
    size: 20,
    color: 'black',
  },
  Volleyball: {
    name: 'volleyball',
    type: 'material-community',
    size: 20,
    color: 'black',
  },
  Basketball: {
    name: 'basketball',
    type: 'material-community',
    size: 20,
    color: 'black',
  },
  Cricket: {
    name: 'cricket',
    type: 'material-community',
    size: 20,
    color: 'black',
  },
  'Table Tennis': {
    name: 'table-tennis',
    type: 'material-community',
    size: 20,
    color: 'black',
  },
  Baseball: {
    name: 'baseball',
    type: 'material-community',
    size: 20,
    color: 'black',
  },
  Golf: {
    name: 'golf',
    type: 'material-community',
    size: 20,
    color: 'black',
  },
  'American Football': {
    name: 'football',
    type: 'material-community',
    size: 20,
    color: 'black',
  },
  Skating: {
    name: 'skating',
    type: 'material-community',
    size: 20,
    color: 'black',
  },
  Snowbording: {
    name: 'snowboarding',
    type: 'material-community',
    size: 20,
    color: 'black',
  },
  'Ice Skating': {
    name: 'ice-skating',
    type: 'material-community',
    size: 20,
    color: 'black',
  },
  'Ice Hockey': {
    name: 'hockey',
    type: 'material-community',
    size: 20,
    color: 'black',
  },
  'Power Lifting': {
    name: 'lifting',
    type: 'material-community',
    size: 20,
    color: 'black',
  },
  'Body Building': {
    name: 'heart',
    type: 'material-community',
    size: 20,
    color: 'black',
  },
  Surfing: {
    name: 'surfing',
    type: 'material-community',
    size: 20,
    color: 'black',
  },
  Cheerleading: {
    name: 'golf',
    type: 'material-community',
    size: 20,
    color: 'black',
  },
  'Ultimate Frisbee': {
    name: 'frisbee',
    type: 'material-community',
    size: 20,
    color: 'black',
  },
  Cycling: {
    name: 'cycling',
    type: 'material-community',
    size: 20,
    color: 'black',
  },
  Dance: {
    name: 'dance',
    type: 'material-community',
    size: 20,
    color: 'black',
  },
  Dodgeball: {
    name: 'frisbee',
    type: 'material-community',
    size: 20,
    color: 'black',
  },
  Fencing: {
    name: 'fencing',
    type: 'material-community',
    size: 20,
    color: 'black',
  },
  'Figure Skating': {
    name: 'fencing',
    type: 'material-community',
    size: 20,
    color: 'black',
  },
  Wrestling: {
    name: 'fencing',
    type: 'material-community',
    size: 20,
    color: 'black',
  },
  Gymnastics: {
    name: 'fencing',
    type: 'material-community',
    size: 20,
    color: 'black',
  },
  Paddleboarding: {
    name: 'fencing',
    type: 'material-community',
    size: 20,
    color: 'black',
  },
};


export const sportsList = [
  "Softball",
  "Kickball",
  "Pickleball",
  "Hiking",
  "Swimming",
  "Kick boxing",
  "Bouldering",
  "Squash",
  "Tennis",
  "Soccer",
  "Badminton",
  "Hockey",
  "Volleyball",
  "Basketball",
  "Cricket",
  "Table Tennis",
  "Baseball",
  "Golf",
  "American Football",
  "Skating",
  "Snowbording",
  "Ice Skating",
  "Ice Hockey",
  "Power Lifting",
  "Body Building",
  "Surfing",
  "Cheerleading",
  "Ultimate Frisbee",
  "Cricket",
  "Cycling",
  "Dance",
  "Dodgeball",
  "Fencing",
  "Figure Skating",
  "Wrestling",
  "Gymnastics",
  "Paddleboarding"
];
export const sportLevelList = ["beginners", "intermediate", "advanced"]
export const profileSettingsLabels = ["first name", "last name", "age", "gender"]
export const win = Dimensions.get('window')
export const W = win.width
export const H = win.height
// SwIPE DATA CONSTANTS
export const MAX_LIKES = 1
export const MAX_DISLIKES = 3
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
  { id: '0', label: 'Woman', value: 'Female', selected: false},
  { id: '1', label: 'Man', value: 'Male', selected: false},
];
export const goBack = (navigation: any) => () => navigation.goBack()

export const onScreen = (screen: string, navigation: any, obj?: unknown) => () => {
  navigation.navigate(screen, obj)
}

export const goHome = (navigation: any) => () => navigation.popToTop()()
// setting flatlist constants
export const AccountList = [
  {title: 'Phone Number', icon: 'av-timer', subtitle: '', buttonPress: null},
  {title: 'Email', icon: 'flight-takeoff', subtitle: '',buttonPress: _email},
  {title: 'Privacy Policy + Terms & Conditions', icon: 'flight-takeoff', subtitle: '',buttonPress: _privacyPolicy},
]

export const settingsFlatList = [
  {title: 'Name', icon: 'av-timer', subtitle: 'Damini', buttonPress: _first_name},
  {title: 'Age', icon: 'flight-takeoff', subtitle: '27',buttonPress: _age},
  {title: 'gender', icon: 'flight-takeoff', subtitle: 'Female',buttonPress: _gender},
  {title: 'Neighborhood', icon: 'flight-takeoff', subtitle: 'Female',buttonPress: _neighborhood},
]
export const ChatUserSettingsList = [
  {title: 'Unmatch', icon: 'av-timer'},
]

// Sign Up Slide Labels
 export const iniitialSignInForm = {
   phoneNumber: '',
   password: '',
   newPassword: '',
   verificationCode: ''
 }
// formik password reset if any
 export const initialPasswordReset = {
   newPassword: '',
   passwordResetCode: ''
 }

// initialValuesFormik
 export const intitialFormikSignUp = {
   email: '',
   phoneNumber: '',
   first_name: '',
   last_name: '',
   age: '',
   gender: null,
   sports:[],
   image_set:[],
   confirmationCode: '',

   description: 'Hi I like to play soccer',
   location: {}
 }
export const signInSlides = [
  {
    key: '0',
    type: 'Phone Input',
    title: 'Phone Number',
    inputLabel: 'phoneNumber',
    backgroundColor: '#59b2ab',
  },
  {
    key: '1',
    type: 'Send Verification',
    title: 'Send Verification',
    inputLabel: 'confirmationCode',
    backgroundColor: '#59b2ab',
  },
  {
    key: '2',
    type: 'Reset Password',
    title: 'Reset Password',
    inputLabel: 'confirmationCode',
    backgroundColor: '#59b2ab',
  },
];

export const signUpSlides = [
  {
    key: '0',
    type: 'Phone Input',
    title: 'Phone Number',
    inputLabel: 'phoneNumber',
    backgroundColor: '#59b2ab',
  },
  {
    key: '1',
    type: 'Email Input',
    title: 'Email',
    inputLabel: 'email',
    backgroundColor: '#59b2ab',
  },
  {
    key: '2',
    type: 'Name Input',
    title: 'Name',
    inputLabel: 'last_name',
    backgroundColor: '#22bcb5',
  },
  {
    key: '3',
    type: 'Birthday Input',
    title: 'Birthday',
    inputLabel: 'age',
    backgroundColor: '#59b2ab',
  },
  {
    key: '4',
    type: 'Gender Input',
    title: 'Gender',
    inputLabel: 'gender',
    backgroundColor: '#59b2ab',
  },
  {
    key: '5',
    type: 'Sports Input',
    iitle: 'Sports',
    inputLabel: 'sports',
    backgroundColor: '#59b2ab',
  },
  {
    key: '6',
    type: 'Description Input',
    title: 'Description Number',
    inputLabel: 'description',
    backgroundColor: '#59b2ab',
  },
  {
    key: '7',
    type: 'Neighborhood Input',
    title: 'Neighborhood',
    inputLabel: 'location',
    backgroundColor: '#59b2ab',
  },
  {
    key: '8',
    type: 'Image Input',
    iitle: 'Image',
    inputLabel: 'image_set',
    backgroundColor: '#59b2ab',
  },
  {
    key: '9',
    type: 'Password',
    title: 'Confirmation Code',
    inputLabel: 'confirmationCode',
    backgroundColor: '#59b2ab',
  },
  //{
    //key: '10',
    //type: 'Confirmation Code',
    //title: 'Confirmation Code',
    //inputLabel: 'confirmationCode',
    //backgroundColor: '#59b2ab',
  //},
];
export const likeIconStyle= {
    type: 'material-community',
    name: 'heart',
    color: '#ff7f02',
    size: 60,
    style:{margin:0, padding: 0,
    shadowOpacity:0,
    elevation:0,
    backgroundColor: 'transparent'
    },
    containerStyle: {padding:0,
    },
  }
export const dislikeIconStyle= {
    type: 'material-community',
    name: 'close-circle-outline',
    color: '#ff7f02',
    style:{margin:0, padding: 0,
    shadowOpacity:0,
    elevation:0
    },
    containerStyle: {padding:0,
    },
    size: 60,
  }


export const TOTAL_SIGNUP_SLIDES = signUpSlides.length
