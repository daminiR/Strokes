import React, { Component, useContext, useEffect, useState, ReactElement } from 'react'
import { Button, Card, Icon, ListItem, BottomSheet, Tab, TabView} from 'react-native-elements'
import {UserContext} from '../../../UserContext'
import {ProfileContext} from './index'
import {style_edit_icon} from './profileSettingInput'
import { EditFields, SignIn} from '../../../localModels/UserSportsList'
import {
  FlatList,
  Image,
  ImageBackground,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useFormikContext} from 'formik';


const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFF',
    borderWidth: 0,
    flex: 1,
    margin: 0,
    padding: 0,
  },
  container: {
    flex: 1,
  },
  emailContainer: {
    backgroundColor: '#FFF',
    flex: 1,
    paddingTop: 30,
  },
  headerBackgroundImage: {
    paddingBottom: 20,
    paddingTop: 45,
  },
  headerContainer: {},
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
  placeIcon: {
    color: 'white',
    fontSize: 26,
  },
  scroll: {
    backgroundColor: '#FFF',
  },
  telContainer: {
    backgroundColor: '#FFF',
    flex: 1,
    paddingTop: 30,
  },
  userAddressRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  userCityRow: {
    backgroundColor: 'transparent',
  },
  userCityText: {
    color: '#A5A5A5',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  userImage: {
    borderColor: '#FFF',
    borderRadius: 85,
    borderWidth: 3,
    height: 170,
    marginBottom: 15,
    width: 170,
  },
  userNameText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    paddingBottom: 8,
    textAlign: 'center',
  },
})


const settingsList = [
  {title: 'Account', icon: 'av-timer', subtitle: 'Damini', buttonPress: ()=> {console.log("account")}},
]

const ProfileSettings = ({_editUserInfo, signOut}) => {
  const nameStyle = [
    {
      paddingTop: 15,
      paddingBottom: 7,
      color: '#363636',
      fontSize: 20,
    },
  ];
  const [displayImage, setDisplayImage] = React.useState(null)
  const [displayName, setDisplayName] = React.useState('')
  const {currentUser, userData, loadingUser} = useContext(UserContext)
  const {values: formikValues, submitForm, handleChange, handleSubmit } = useFormikContext<EditFields>();
  //TODO: this is run too many times with description everytime one char is removed -> thats why it is slow when typeing -> imperative set description after done
  //console.log("in settings", formikValues)

  useEffect(() => {
    // TODO: add !loading if condtion everywhere to laoding state changes in useeffect
    if (!loadingUser){
      const user = userData.squash
      const image_set_copy = user.image_set
      const min_idx_obj = image_set_copy.reduce((res, obj) => {
      return obj.img_idx < res.img_idx ? obj : res;
      });
      setDisplayImage(min_idx_obj.imageURL);
      setDisplayName(user.first_name + ' ' + user.last_name)
    }
  }, [loadingUser])

  const renderHeader = () => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerBackgroundImage}>
        {!loadingUser && (
          <View style={styles.headerColumn}>
            <Image style={styles.userImage} source={{uri: displayImage}} />
            <Icon size={28}  onPress={() => _editUserInfo(true)} name="pencil" type='material-community' style={style_edit_icon.container} />
            <Text style={nameStyle}>{displayName}</Text>
          </View>
        )}
      </View>
    </View>
  );
  }
  const renderList = () => {
  return (
    <View style={styles.telContainer}>
      {settingsList.map((item, i) => (
        <ListItem onPress={() => console.log('here')} key={i} bottomDivider>
          <ListItem.Content>
            <ListItem.Title>{item.title}</ListItem.Title>
            <ListItem.Subtitle>{item.subtitle}</ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      ))}
      <Button  title="Sign Out" onPress={()=> signOut()}/>
    </View>
  );
  }

  const [isVisible, setIsVisible] = useState(false);
  const [index, setIndex] = useState(0)
  const list = [
    {title: 'List Item 1'},
    {title: 'List Item 2'},
    {
      title: 'Cancel',
      containerStyle: {backgroundColor: 'red'},
      titleStyle: {color: 'white'},
      onPress: () => setIsVisible(false),
    },
  ];
   return (
     <ScrollView style={styles.scroll}>
       <View style={styles.container}>
         <Card containerStyle={styles.cardContainer}>
           {renderHeader()}
           {renderList()}
         </Card>
       </View>
     </ScrollView>
   );

};
export  { ProfileSettings }
