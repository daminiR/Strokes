import {Button, Image, withBadge, Icon, Avatar, Badge } from 'react-native-elements'
import { ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useState, ReactElement } from 'react'
import CardStack, { Card } from 'react-native-card-stack-swiper';
import {UserContext} from '../../../UserContext'
import {ProfileContext} from './index'
import {UPLOAD_FILE, DELETE_IMAGE} from '../../../graphql/mutations/profile'
import {READ_SQUASH} from '../../../graphql/queries/profile'
import { ProfileSettingsInput } from "./profileSettingInput"
import { CardItem } from '../../../components/CardItem/CardItem';
import {ImageBackground,View, ScrollView, StyleSheet } from 'react-native'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import styles from '../../../assets/styles';
import { generateRNFile } from '../../../utils/Upload'
import { _check_single } from '../../../utils/Upload'
import { useQuery, useMutation, useLazyQuery} from '@apollo/client'
import Demo from '../../../assets/data/demo.js';

const ProfileView = (props) => {
  const [loading, setLoading] = React.useState(null)
  const {currentUser} = useContext(UserContext);
  const {squashData, newSportList} = useContext(ProfileContext);
  const [displayImage, setDisplayImage] = React.useState([])
  useEffect(() => {
    // TODO: not important sort image by order
    if (squashData?.squash?.image_set != undefined) {
      const img_set = squashData?.squash?.image_set
      const imageURL = img_set.map(imgObj => imgObj.imageURL)
      setDisplayImage(imageURL)
    }
  }, [squashData?.squash?.image_set])
  return (
      //<View style={styles.container}>
          //<View style={styles.profileViewImageDisplay}>
              //{displayImage.map((image, index) => (
                  //<Image
                      //key={index}
                      //source={{uri: image}}
                      //style={{width: 200, height: 200}}
                      //PlaceholderContent={<ActivityIndicator />}
                  ///>
              //))}
      //</View>
      //</View>
    <>
    <ImageBackground
      source={require('../../../assets/images/bg.png')}
      style={styles.bg}
    >
      <View style={styles.containerHome}>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
            <Card >
              <CardItem
                image={Demo[2].image}
                name={"dsalfj"}
                description={"sadfkjalsdfj"}
                matches={"33"}
                actions
                onPressLeft={() => this.swiper.swipeLeft()}
                onPressRight={() => this.swiper.swipeRight()}
              />
            </Card>
      </ScrollView>
      </View>
    </ImageBackground>
    </>
  );
}
//<View style={ProfileStyles.container}>
    //<CardStack
        //loop={true}
        //verticalSwipe={false}
        //renderNoMoreCards={() => null}
    //>
        //<CardItem
            //image={Demo[0].image}
            //name={"Sara"}
            //description={"sdflkjsaldfj lasfjdlfjalsdf"}
            //matches={"56"}
            //actions
            //onPressLeft={() => this.swiper.swipeLeft()}
            //onPressRight={() => this.swiper.swipeRight()}
        ///>
    //</CardStack>
//</View>

const ProfileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 2,
    margin: 0,
  },
  top: {
    flex: 0.9,
    margin: 1,
    backgroundColor: 'white',
    borderWidth: 5,
  },
  middle: {
    flex: 1.1,
    backgroundColor: 'white',
    borderWidth: 5,
  },
  profileViewImageDisplay: {
    flex:1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  verticalImageplaceholder: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
});

export  { ProfileView }
