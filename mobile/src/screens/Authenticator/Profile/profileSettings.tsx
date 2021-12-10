import React, {useContext, useEffect} from 'react'
import { Button, Card, Icon, ListItem} from 'react-native-elements'
import {UserContext} from '../../../UserContext'
import styles from '../../../assets/styles'
import { EditFields} from '../../../localModels/UserSportsList'
import {Image, ScrollView, Text, View} from 'react-native';
import { useFormikContext} from 'formik';

const ProfileSettings = ({_editUserInfo, signOut}) => {
  const [displayImage, setDisplayImage] = React.useState(null)
  const [displayName, setDisplayName] = React.useState('')
  const {loadingUser} = useContext(UserContext)
  const {values: formikValues} = useFormikContext<EditFields>();
    const settingsList = [
  {title: 'Account', icon: 'av-timer', subtitle: displayName, buttonPress: ()=> {console.log("account")}},
]
  useEffect(() => {
      const user = formikValues
      const image_set_copy = user.image_set
      const min_idx_obj = image_set_copy.reduce((res, obj) => {
      return obj.img_idx < res.img_idx ? obj : res;
      });
      setDisplayImage(min_idx_obj.imageURL);
      setDisplayName(user.first_name + ' ' + user.last_name)
  }, [formikValues])
  const renderHeader = () => {
  return (
    <View>
      <View style={styles.headerBackgroundImage}>
        {!loadingUser && (
          <View style={styles.headerColumn}>
            <Image style={styles.userImage} source={{uri: displayImage}} />
            <Icon size={28}  onPress={() => _editUserInfo(true)} name="pencil" type='material-community' style={styles.pencilEdit} />
            <Text style={styles.nameStyle}>{displayName}</Text>
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
   return (
     <ScrollView style={styles.scroll}>
       <View style={{flex:1}}>
         <Card containerStyle={styles.cardContainer}>
           {renderHeader()}
           {renderList()}
         </Card>
       </View>
     </ScrollView>
   );
};

export  { ProfileSettings }
