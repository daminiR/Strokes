import React from 'react';
import styles from '../../assets/styles';
import {TouchableWithoutFeedback, ImageBackground, ScrollView, View, Image, Dimensions} from 'react-native';
import {Text} from 'react-native-elements'
import {SportChips} from '../SportsChips'


const CardItem = ({
  isProfileView=null,
  profileImage = null,
  image_set = null,
  profileTitle = null,
  sportsList = null,
  description= null,
  variant=null,
  location=null,
  onPressLeft= null,
  onPressRight=null,
}) => {
  const fullWidth = Dimensions.get('window').width;
  const imageStyle = [
    {
      borderRadius: 8,
      width: variant ? fullWidth / 2 - 30 : fullWidth - 80,
      height: variant ? 170 : 350,
      margin: variant ? 0 : 20
    }
  ];

  const nameStyle =
    {
      paddingTop: variant ? 10 : 15,
      paddingBottom: variant ? 5 : 7,
      color: '#363636',
      fontSize: variant ? 15 : 30,
      textAlign: 'center'
    }

  return (
    <>
      <ScrollView>
        <TouchableWithoutFeedback>
        <View style={styles.containerCardItem}>
          {/* IMAGE */}
          {profileImage &&   <Image source={{uri: profileImage.imageURL}} style={variant ? styles.profileLikesContainer : styles.profileContainer}/>}
          {/* NAME */}
          {profileTitle && (<Text style={variant? styles.nameStyleLikes :styles.nameStyle }>{profileTitle}</Text>)}
          {/* DESCRIPTION */}
          {description && (
            <Text style={styles.descriptionCardItem}>{description}</Text>
          )}
          {/* SPORTS List */}
          { sportsList && <View style={{marginVertical: 10}}>
            <View style={styles.sportChipSet}>
              {sportsList.map((sport, i) => (
                  <SportChips key={i} sport={sport.sport} gameLevel={sport.game_level.toString()} isDisplay={true} />
                ))}
            </View>
          </View>}
          {location && (
            <Text style={styles.descriptionCardItem}>{location}</Text>
          )}
          {image_set && image_set.map((imgObj, index) => renderImages(imgObj, index, image_set.length, isProfileView)
          )}
        </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </>
  )
}

const renderImages = (imgObj, index, numImages, isProfileView) => {
            var imageStyle = styles.imageContainer as any
            if (index == numImages - 1) {
              if (isProfileView){
              imageStyle = styles.lastImageContainerProfileView;
              }
              else{
              imageStyle = styles.lastImageContainer;
              }
            }
            else {
              imageStyle = styles.imageContainer;
              //imageStyle = styles.lastImageContainer;
            }
            return (
            <Image key={index} source={{uri: imgObj.imageURL}} style={imageStyle}/>)}
export {CardItem};
