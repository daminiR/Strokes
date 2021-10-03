import React from 'react';
import styles from '../../assets/styles';
import {ProfileContext} from '../../screens/Authenticator/Profile/index'
import { useRef, useEffect, useContext, useState, ReactElement } from 'react'
import {ImageBackground, ScrollView, Text, View, Image, Dimensions, TouchableOpacity} from 'react-native';
import {Card, FAB } from 'react-native-elements'
import {Icon} from '../Icon/Icon';
import {SportChips, SportChipsstyles} from '../../screens/Authenticator/Profile/profileSettingInput'


const CardItem = ({
  actions,
  description,
  image,
  matches,
  name,
  onPressLeft= null,
  onPressRight=null,
  status=null,
  variant=null,
  ImageContext=null
}) => {
  //logic
  //
  const {squashData, newSportList} = useContext(ProfileContext);
  const [loadingSportsData, setLoadingSportsData] = React.useState(false)
  const [Name, setName] = React.useState('')
  const [imageSet, setImageSet] = React.useState([])
  const [profileImage, setProfileImage] = React.useState(null)
  const [loadingImages, setLoadingImages] = React.useState(false)
  const [ProfileTitle, setPRofileTitle] = useState('')
  const [Gender, setGender] = React.useState('')
  const [Age, setAge] = React.useState('')
  const [sportsList, setSportsList] = React.useState([{sport:"Tennis", game_level: 0}])
  useEffect(() => {
    setLoadingImages(true);
    setLoadingSportsData(true);
  if (
    squashData?.squash != undefined
  ) {
    const userData = squashData?.squash
    if (userData?.sports.length != 0){
        setSportsList(userData.sports);
    }
    if (userData?.age != 0) {
      setAge(userData.age.toString());
    }
    if (userData?.gender != undefined) {
      setGender(userData.gender);
    }
    if (userData?.image_set != undefined) {
      const image_set= userData?.image_set.slice(1).map(imgObj => imgObj.imageURL)
      setImageSet(image_set);
      setProfileImage(userData.image_set[0].imageURL)
      setLoadingImages(false)
      console.log("are we here")
    }
    if (userData?.first_name != undefined && userData?.last_name != undefined) {
      setName(userData.first_name);
    }
    setPRofileTitle(Name + ' ,' + Age)
    setLoadingSportsData(false);
  }
  }, [squashData?.squash?.image_set])
//   Custom styling
  const fullWidth = Dimensions.get('window').width;
  const imageStyle = [
    {
      borderRadius: 8,
      width: variant ? fullWidth / 2 - 30 : fullWidth - 80,
      height: variant ? 170 : 350,
      margin: variant ? 0 : 20
    }
  ];

  const nameStyle = [
    {
      paddingTop: variant ? 10 : 15,
      paddingBottom: variant ? 5 : 7,
      color: '#363636',
      fontSize: variant ? 15 : 30
    }
  ];

    //[> LiST OF SPORTS <]
        //<View style={styles.sportChipSet}>
        //{!loading &&
            //sportsList.map((sport, i) => (
                //<SportChips key={i} sport={sport.sport} isDisplay={true}/>
            //))}
        //</View>
  return (
    <>
      <ScrollView>
        {!loadingSportsData && <View style={styles.containerCardItem}>
          {/* IMAGE */}
          <ImageBackground source={{uri:profileImage}} style={imageStyle}>
          <View
            style={{
              position: 'absolute',
              marginBottom: 10,
              marginLeft:10,
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: 'flex-end',
              alignItems: 'flex-start',
            }}>
            {!loadingSportsData && <Text style={styles.firstImageText}>{ProfileTitle}</Text>}
          </View>
          </ImageBackground>
          {/* SPORTS List */}
          <View style={{marginVertical: 10}}>
            <View style={SportChipsstyles.sportChipSet}>
              {!loadingSportsData &&
                sportsList.map((sport, i) => (
                  <SportChips key={i} sport={sport.sport} isDisplay={true} />
                ))}
            </View>
          </View>
          {!loadingImages && imageSet.map((imgObj, index) => (
            <Image key={index} source={{uri: imgObj}} style={imageStyle}/>)
          )}

          {/* NAME */}
          <Text style={nameStyle}>{name}</Text>

          {/* DESCRIPTION */}
          {description && (
            <Text style={styles.descriptionCardItem}>{description}</Text>
          )}

          {/* ACTIONS */}
          {actions && (
            <View style={styles.actionsCardItem}>
              <TouchableOpacity style={styles.miniButton}>
                <Text style={styles.star}>
                  <Icon name="star" />
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
                onPress={() => onPressLeft()}>
                <Text style={styles.like}>
                  <Icon name="like" />
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
                onPress={() => onPressRight()}>
                <Text style={styles.dislike}>
                  <Icon name="dislike" />
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.miniButton}>
                <Text style={styles.flash}>
                  <Icon name="flash" />
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>}
      </ScrollView>
    </>
  );
};

export {CardItem};
