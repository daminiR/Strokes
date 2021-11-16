import { StyleSheet, Dimensions } from "react-native";

export const PRIMARY_COLOR = "#7444C0";
const SECONDARY_COLOR = "#5636B8";
const WHITE = "#FFFFFF";
const GRAY = "#757E90";
const DARK_GRAY = "#363636";
const BLACK = "#000000";

const ONLINE_STATUS = "#46A575";
const OFFLINE_STATUS = "#D04949";

const STAR_ACTIONS = "#FFA200";
const LIKE_ACTIONS = "#B644B2";
const DISLIKE_ACTIONS = "#363636";
const FLASH_ACTIONS = "#5028D7";

//const ICON_FONT = "tinderclone";
//const ICON_FONT = "tinderclone";

export const DIMENSION_WIDTH = Dimensions.get("window").width;
const DIMENSION_HEIGHT = Dimensions.get("window").height;


export default StyleSheet.create({
  // FILTER OVERLAY STYLES
  filterOverlay: {
    paddingHorizontal: 10,
    width: DIMENSION_WIDTH * 0.8,
    height: DIMENSION_HEIGHT * 0.8,
  },


  // IMAGE PLACEHOLDER COMPONENET
  imagecontainer: {
    flex: 1,
    padding: 0,
    margin: 0,

  },
  horizontalImageplaceholder: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
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

  //SIGNUP SLIDES

  phoneNumberContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  emailContainer: {
    flex: 1,
    alignItems: 'center',
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontWeight: "normal"
  },
  ChipButtonSelected: {
    borderColor: 'grey',
    backgroundColor: '#d3d3d3',
    fontSize: 200,
    borderWidth: 1,
    padding: 4
  },
  ChipButton: {
    borderColor: 'grey',
    fontSize: 200,
    backgroundColor: '#fff',
    borderWidth: 1,
    padding: 4

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
    flexWrap: "wrap",
    justifyContent: 'center',
    color: 'grey',
    fontSize: 20,
    fontFamily: 'OpenSans-Regular',
    flexDirection: "row"
  },

  // COMPONENT - CARD ITEM

  edit_pencil: {
    alignSelf: 'flex-end',
    margin: 4,
  },
  CardStyle: {
    padding: 5,
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
    margin: 10,
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
    padding: 10
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
  nameStyle: { paddingTop: 15,
      paddingBottom: 7,
      color: '#363636',
      fontSize: 30,
      textAlign: 'center'},
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
    paddingTop: 35,
    marginHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spaceLikeDislike: {
      flexDirection: 'row-reverse',
        justifyContent: 'space-between',
  },
  bottom: {
    marginHorizontal: 25,
    marginVertical: 10,
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

  // CONTAINER - HOME
  containerHome: {flex: 1, marginHorizontal: 10},

  // CONTAINER - MATCHES
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
