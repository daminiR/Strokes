import { StyleSheet, Dimensions } from "react-native";
import {StatusBar} from 'react-native';

export const PRIMARY_COLOR = "#7444C0";
export const PRIMARY_THEME = "#ff7f02";
export const SECONDARY_COLOR = "#5636B8";
export const SECONDARY_THEME = "#2b1d08";
export const CHAT_TEXT_COLOR_USER = "#804000";
export const CHAT_TEXT_COLOR_MACTHED_USER= "#ffa64d";
const WHITE = "#FFFFFF";
export const GRAY = "#757E90";
export const LIGHT_GRAY = "#d9d9d9";
const DARK_GRAY = "#363636";
const BLACK = "#000000";

const ONLINE_STATUS = "#46A575";
const OFFLINE_STATUS = "#D04949";

const STAR_ACTIONS = "#FFA200";
const LIKE_ACTIONS = "#B644B2";
const DISLIKE_ACTIONS = "#363636";
const FLASH_ACTIONS = "#5028D7";

const IOS_TOP_BAR = 40

const FONT_TEXT_FAM = 'OpenSans-Regular'
//const ICON_FONT = "tinderclone";
//const ICON_FONT = "tinderclone";

export const DIMENSION_WIDTH = Dimensions.get("window").width;
export const DIMENSION_HEIGHT = Dimensions.get("window").height;


export const styles =  StyleSheet.create({
  // NOTIFICATION MSG STYLES
  notificationText: {
    color: LIGHT_GRAY,
    fontSize: 15,
    fontFamily: 'OpenSans-Regular',
    alignSelf: 'center',
  },
  notificationStyle: {
    backgroundColor: SECONDARY_THEME,
  },
  //CHAT styles
  ChatUserContainer: {
    flex: 1,
    alignSelf: 'center'
  },
  // email signing style


  confirmationCodeContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  authEmailOverlay: {
    flex: 1,
    width: DIMENSION_WIDTH * .8,
    height: DIMENSION_HEIGHT * 0.5
  },

  // Auth email overlay

  authEmailOverlay: {
    flex: 1,
    width: DIMENSION_WIDTH * .8,
    height: DIMENSION_HEIGHT * 0.5
  },
  // BUTTON STYLE
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'OpenSans-Regular',
    alignSelf: 'stretch',
  },
  buttonIndStyle: {
    padding: 20,
    paddingHorizontal: 10,
  },
  helloContainer: {
    backgroundColor: SECONDARY_THEME,
    flex: 1,
    justifyContent: 'center'
  },
  helloButtons: {
    padding: 10,
    paddingHorizontal: 10,
  },
  // Cancel Button
  cancel: {
    ...Platform.select({
      ios: {
    padding: 10,
    paddingTop: IOS_TOP_BAR,
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start'
      },
      android: {
    padding: 10,
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start'
      },
    }),
  },
  cancelText: {
    color: DARK_GRAY,
    fontSize: 15,
    fontFamily: 'OpenSans-Regular',
    alignSelf: 'center',
  },

  // FILTER OVERLAY STYLES
  filterOverlay: {
    paddingHorizontal: 10,
    width: DIMENSION_WIDTH * 0.8,
    height: DIMENSION_HEIGHT * 0.8,
  },

  // IMAGE PLACEHOLDER COMPONENET
  imagecontainer: {
    //flex: 1,
    padding: 0,
    margin: 0,
  },
  horizontalImageplaceholder: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignSelf: 'center'
  },
  verticalImageplaceholder: {
    //flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  imageIndividualContainer: {
    backgroundColor: '#D3D3D3',
    margin: 2,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  // PICTURES WALL
  picturesContainer: {
    flex: 1,
    padding: 2,
    margin: 10,
  },
  profileSettings: {
    flex: 1.1,
    backgroundColor: 'white',
  },
  // SWIPE STYLES
  swipeContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  swipeMatched: {
    width: 80,
    height: 350,
  },
  swipeText: {
    textAlign: 'center',
    fontSize: 50,
    backgroundColor: 'transparent',
  },

  // pencil edit icon
  pencilEdit: {
    alignSelf: 'flex-end',
    margin: 4,
  },

  headerBackgroundImage: {
    paddingBottom: 20,
    paddingTop: 45,
  },
  headerColumn: {
    backgroundColor: 'transparent',
    ...Platform.select({
      ios: {
        alignItems: 'center',
        elevation: 1,
        marginTop: -1,
      },
      android: {
        alignItems: 'center',
      },
    }),
  },
  scroll: {
    backgroundColor: '#FFF',
  },
  nameStyle: {
    paddingTop: 15,
    paddingBottom: 7,
    color: '#363636',
    fontSize: 20,
  },

  cardContainer: {
    backgroundColor: '#FFF',
    borderWidth: 0,
    flex: 1,
    margin: 0,
    padding: 0,
  },
  telContainer: {
    backgroundColor: '#FFF',
    flex: 1,
    paddingTop: 30,
  },
  userImage: {
    borderColor: '#FFF',
    borderRadius: 85,
    borderWidth: 3,
    height: 170,
    marginBottom: 15,
    width: 170,
  },
  //SIGNUP SLIDES

  phoneNumberContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  emailContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  nameContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  ageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  genderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  sportsContainer: {
    flex: 1,
    //alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  profileContainer: {
    borderRadius: 8,
    width: DIMENSION_WIDTH,
    height: 350,
    margin: 0,
  },
  profileLikesContainer: {
      borderRadius: 8,
      width: DIMENSION_WIDTH / 2 - 30 ,
      height: 170,
      margin: 0
  },
  imageContainer: {
    flex: 1,
    borderRadius: 8,
    marginTop: 20,
    width: DIMENSION_WIDTH * 0.9,
    marginVertical: 10,
    height: 350,
    padding: 10
  },
  lastImageContainer: {
    flex: 1,
    borderRadius: 8,
    width: DIMENSION_WIDTH * 0.9,
    height: 350,
    marginVertical: 0,
    marginTop: 20,
    marginBottom: 60,
  },
  lastImageContainerProfileView: {
    borderRadius: 8,
    width: DIMENSION_WIDTH * 0.9,
    height: 350,
    marginTop: 0,
    marginVertical: 20
  },
  swiperCardStyle: {
    flex: 1,
    marginTop: 10,
  },
  swiperContainerCardStyle: {
    flex: 1,
  },
  // TEXT SETTING FONT
  textSettingFont: {
    color: 'grey',
    fontSize: 20,
    fontFamily: 'OpenSans-Regular',
    alignSelf: 'stretch',
  },
  // PROFILE BUTTON
  profileButtons: {
    flex: 1,
    margin: 2,
    backgroundColor: 'white',
    borderWidth: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  //SPROTS CHIPS
  sportChipSet: {
    flexWrap: 'wrap',
    justifyContent: 'center',
    color: 'grey',
    fontSize: 20,
    fontFamily: 'OpenSans-Regular',
    flexDirection: 'row',
  },
  chipText: {
    color: '#242424',
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    fontWeight: 'normal',
  },
  ChipButtonSelected: {
    borderColor: 'grey',
    backgroundColor: '#d3d3d3',
    fontSize: 20,
    borderWidth: 1,
    padding: 4,
  },
  ChipButtonGameLevel0: {
    borderColor: 'grey',
    backgroundColor: '#ffab33',
    fontSize: 20,
    borderWidth: 1,
    padding: 4,
  },
  ChipButtonGameLevel1: {
    borderColor: 'grey',
    backgroundColor: '#ffab33',
    fontSize: 20,
    borderWidth: 1,
    padding: 4,
  },
  ChipButtonGameLevel2: {
    borderColor: 'grey',
    backgroundColor: '#ffab33',
    fontSize: 20,
    borderWidth: 1,
    padding: 4,
  },
  ChipButton: {
    borderColor: 'grey',
    fontSize: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    padding: 4,
  },
  CardStyle: {
    padding: 5,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  singleChip: {
    padding: 3,
  },
  sportChipSet: {
    flexWrap: 'wrap',
    justifyContent: 'center',
    color: 'grey',
    fontSize: 20,
    fontFamily: 'OpenSans-Regular',
    flexDirection: 'row',
  },

  // COMPONENT - CARD ITEM

  edit_pencil: {
    alignSelf: 'flex-end',
    margin: 4,
  },
  CardStyle: {
    padding: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  containerCardItem: {
    //flex:1,
    //flexGrow: 1,
    backgroundColor: WHITE,
    borderRadius: 8,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowColor: BLACK,
    shadowOffset: {height: 0, width: 0},
  },
  matchesCardItem: {
    marginTop: -35,
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 7,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  matchesTextCardItem: {
    //fontFamily: ICON_FONT,
    color: WHITE,
  },
  firstImageText: {
    fontWeight: 'bold',
    textShadowColor: 'grey',
    textShadowRadius: 8,
    fontSize: 20,
    //fontFamily: ICON_FONT,
    color: WHITE,
  },
  descriptionFontStyle: {
    fontSize: 15,
    padding: 10,
    textAlign: 'center',
  },
  descriptionCardItem: {
    color: DARK_GRAY,
    textAlign: 'center',
    fontSize: 17,
    padding: 10,
  },
  status: {
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    color: GRAY,
    fontSize: 12,
  },
  online: {
    width: 6,
    height: 6,
    backgroundColor: ONLINE_STATUS,
    borderRadius: 3,
    marginRight: 4,
  },
  offline: {
    width: 6,
    height: 6,
    backgroundColor: OFFLINE_STATUS,
    borderRadius: 3,
    marginRight: 4,
  },
  actionsCardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 30,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: WHITE,
    marginHorizontal: 7,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowColor: DARK_GRAY,
    shadowOffset: {height: 10, width: 0},
  },
  miniButton: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: WHITE,
    marginHorizontal: 7,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowColor: DARK_GRAY,
    shadowOffset: {height: 10, width: 0},
  },
  star: {
    //fontFamily: ICON_FONT,
    color: STAR_ACTIONS,
  },
  like: {
    fontSize: 25,
    //fontFamily: ICON_FONT,
    color: LIKE_ACTIONS,
  },
  dislike: {
    fontSize: 25,
    //fontFamily: ICON_FONT,
    color: DISLIKE_ACTIONS,
  },
  flash: {
    //fontFamily: ICON_FONT,
    color: FLASH_ACTIONS,
  },

  // COMPONENT - CITY
  city: {
    backgroundColor: WHITE,
    padding: 10,
    borderRadius: 20,
    width: 90,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowColor: BLACK,
    shadowOffset: {height: 0, width: 0},
  },
  cityText: {
    //fontFamily: ICON_FONT,
    paddingBottom: 10,
    color: DARK_GRAY,
    fontSize: 13,
  },

  // COMPONENT - FILTERS
  filters: {
    backgroundColor: WHITE,
    padding: 10,
    borderRadius: 20,
    width: 70,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowColor: BLACK,
    shadowOffset: {height: 0, width: 0},
  },
  filtersText: {
    //fontFamily: ICON_FONT,
    color: DARK_GRAY,
    fontSize: 13,
  },

  //COMPONENT - REJECT

  reject: {
    backgroundColor: WHITE,
    //padding: 10,
    //borderRadius: 20,
    //width: 70,
    //shadowOpacity: 0.05,
    //shadowRadius: 10,
    //shadowColor: BLACK,
    //shadowOffset: { height: 0, width: 0 }
  },
  // COMPONENT OVERLAYS
  overlays: {
    paddingHorizontal: 10,
    width: DIMENSION_WIDTH * 0.8,
    height: DIMENSION_HEIGHT * 0.8,
  },
  //COMPONENT - CARD ITEM TEXT

  // COMPONENT - ERROR MESSAGE
  containerErrorMessage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  nameStyleLikes: {
    paddingTop: 15,
    paddingBottom: 7,
    color: '#363636',
    fontSize: 15,
    textAlign: 'center',
  },
  nameStyle: {
    paddingTop: 15,
    paddingBottom: 7,
    color: '#363636',
    fontSize: 30,
    textAlign: 'center',
  },
  // COMPONENT - MESSAGE
  containerMessage: {
    flex: 1,
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    paddingTop: 10,
    width: DIMENSION_WIDTH - 100,
  },
  avatar: {
    borderRadius: 30,
    width: 60,
    height: 60,
    marginRight: 20,
    marginVertical: 15,
  },
  message: {
    color: GRAY,
    fontSize: 12,
    paddingTop: 5,
  },

  // COMPONENT - PROFILE ITEM
  containerProfileItem: {
    backgroundColor: WHITE,
    paddingHorizontal: 10,
    paddingBottom: 25,
    margin: 20,
    borderRadius: 8,
    marginTop: -65,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowColor: BLACK,
    shadowOffset: {height: 0, width: 0},
  },
  matchesProfileItem: {
    width: 131,
    marginTop: -15,
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 7,
    paddingHorizontal: 20,
    borderRadius: 20,
    textAlign: 'center',
    alignSelf: 'center',
  },
  matchesTextProfileItem: {
    //fontFamily: ICON_FONT,
    color: WHITE,
  },
  name: {
    paddingTop: 25,
    paddingBottom: 5,
    color: DARK_GRAY,
    fontSize: 15,
    textAlign: 'center',
  },
  descriptionProfileItem: {
    color: GRAY,
    textAlign: 'center',
    paddingBottom: 20,
    fontSize: 13,
  },
  info: {
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconProfile: {
    //fontFamily: ICON_FONT,
    fontSize: 12,
    color: DARK_GRAY,
    paddingHorizontal: 10,
  },
  infoContent: {
    color: GRAY,
    fontSize: 13,
  },

  // CONTAINER - GENERAL
  bg: {
    flex: 1,
    resizeMode: 'cover',
    width: DIMENSION_WIDTH,
    height: DIMENSION_HEIGHT,
  },
  top: {
    ...Platform.select({
      ios: {
        paddingTop: DIMENSION_HEIGHT * 0.05,
        marginHorizontal: DIMENSION_HEIGHT * 0.02,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      android: {
        paddingTop: DIMENSION_HEIGHT * 0.01,
        marginHorizontal: DIMENSION_HEIGHT * 0.02,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
    }),
  },
  spaceLikeDislike: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  },
  bottom: {
    flexDirection: 'column',
  },
  center: {
    flex: 1,
    marginHorizontal: 25,
    marginVertical: 10,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {paddingBottom: 10, fontSize: 22, color: DARK_GRAY},
  icon: {
    //fontFamily: ICON_FONT,
    fontSize: 20,
    color: DARK_GRAY,
    paddingRight: 10,
  },

  //FAB
  likeDislikeFAB: {
    padding:0,
    margin:0,
    shadowOpacity:0,
  },
  // CONTAINER - HOME
  containerHome: {flex: 1, marginHorizontal: 10},
  // TOPTAB
  topTabUnderLineStyle: {
    backgroundColor:PRIMARY_THEME
  },

  topTabStyle: {
    flex:1,
    height: DIMENSION_HEIGHT * 0.05,
  },
  topTabText: {
    fontSize: 15,
    fontFamily: FONT_TEXT_FAM,
    color: DARK_GRAY
  },


  // Button Styles
  buttonStyle: {
    backgroundColor: PRIMARY_THEME,
    borderRadius: 8,
    borderColor: '#2b1d08',
    height: DIMENSION_HEIGHT * 0.08,
    borderWidth: 2,
  },

  // CONTAINER - MATCHES
  tiralNeighbor: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 80,
  },
  containerMatches: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },

  // CONTAINER - MESSAGES
  containerMessages: {
    justifyContent: 'space-between',
    flex: 1,
    paddingHorizontal: 10,
  },

  // CONTAINER - PROFILE
  containerProfile: {marginHorizontal: 0},
  photo: {
    width: DIMENSION_WIDTH,
    height: 450,
  },
  topIconLeft: {
    //fontFamily: ICON_FONT,
    fontSize: 20,
    color: WHITE,
    paddingLeft: 20,
    marginTop: -20,
    transform: [{rotate: '90deg'}],
  },
  topIconRight: {
    //fontFamily: ICON_FONT,
    fontSize: 20,
    color: WHITE,
    paddingRight: 20,
  },
  actionsProfile: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  //iconButton: {fontFamily: ICON_FONT, fontSize: 20, color: WHITE},
  iconButton: {fontSize: 20, color: WHITE},
  textButton: {
    //fontFamily: ICON_FONT,
    fontSize: 15,
    color: WHITE,
    paddingLeft: 5,
  },
  circledButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  roundedButton: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    height: 50,
    borderRadius: 25,
    backgroundColor: SECONDARY_COLOR,
    paddingHorizontal: 20,
  },

  // MENU
  tabButton: {
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabButtonText: {
    textTransform: 'uppercase',
  },
  iconMenu: {
    //fontFamily: ICON_FONT,
    height: 20,
    paddingBottom: 7,
  },
});
