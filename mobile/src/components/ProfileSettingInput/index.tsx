import {Text, Card, Button, Icon } from 'react-native-elements'
import React, { useRef, useEffect, useContext } from 'react'
import {View} from 'react-native';
import { SportChips, EditPencil, ProfileAttirbutes} from '@components'
import { ProfileScreenNavigationProp} from '../../screens/Authenticator/Profile/index'
import {UserContext} from '@UserContext'
import {styles} from '@styles'
import { useFormikContext} from 'formik';
import { EditFields} from '@localModels'
import {_editSports, _editDescription} from '../../InputsVar'
import {EditInputVar} from '@cache'

type ProfileT = {
  navigation: ProfileScreenNavigationProp
}
const ProfileSettingsInput = () => {
  const [sportsList, setSportsList] = React.useState(null)
  const {values: formikValues, initialStatus} = useFormikContext<EditFields>();
  const [description, setDescription] = React.useState('Description')
  const [loadingSports, setLoadingSports] = React.useState(true)
  const [loadingDescription, setLoadingDescription] = React.useState(false)
  const {dataGlobal, setChangeSport, userLoading} = useContext(UserContext)
  const [numChangesLeft, setNumChangesLeft] = React.useState(dataGlobal.sportChangesPerDay)
  useEffect(() => {
        const user = formikValues
        setLoadingSports(true);
        setLoadingDescription(true);
        setSportsList(formikValues.sports);
        setLoadingSports(false);
           //TODO: add this to sigup
         //TODO: description change here
          const descriptionValue = user.description;
          setDescription(descriptionValue);
          console.log("///check in sport",formikValues.sports)
          setLoadingDescription(false);
  }, [formikValues, initialStatus]);
const _editSports2 = () => {
  console.log("numchanges", numChangesLeft)
  if (numChangesLeft <= 0){
    // no more sport chnages should be possible
    setChangeSport(false)
  }
  else{
    setChangeSport(true)
    EditInputVar({inputType: 'Sports Input', displayInput: true});
  }
}
  return (
    <>
      <Card containerStyle={styles.CardStyle}>
        <EditPencil _edit={_editSports2}/>
        <Card.Title>CARD WITH DIVIDER</Card.Title>
        <Card.Divider />
        <View style={styles.sportChipSet}>
          {!loadingSports &&
            sportsList.map((sport, i) => {
              return (
                <SportChips
                  isSignUp={false}
                  key={i}
                  sport={sport.sport}
                  gameLevel={sport.game_level.toString()}
                  isDisplay={true}
                />
              );
            })}
        </View>
      </Card>
      <Card containerStyle={styles.CardStyle}>
        <Icon size={28} onPress={_editDescription} name="pencil" type='material-community' style={styles.pencilEdit} />
        <View style={styles.sportChipSet}>
        <View style={styles.sportChipSet}>
          {!loadingDescription && <Text style={styles.descriptionFontStyle}> {description} </Text>}
        </View>
        </View>
      </Card>
      <Card containerStyle={styles.CardStyle}>
        <ProfileAttirbutes/>
      </Card>
    </>
  );
}

export {ProfileSettingsInput }
