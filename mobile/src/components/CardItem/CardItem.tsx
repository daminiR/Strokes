import React from 'react';
import styles from '../../assets/styles';
import {TouchableWithoutFeedback, ImageBackground, ScrollView, View, Image, Dimensions} from 'react-native';
import {Text} from 'react-native-elements'
import {SportChips} from '../SportsChips'


const CardItem = ({
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

  return (
    <>
      <ScrollView>
        <TouchableWithoutFeedback>
        <View style={styles.containerCardItem}>
          {/* IMAGE */}
          {profileImage &&   <Image source={{uri: profileImage.imageURL}} style={styles.profileContainer}/>}
          {/* NAME */}
          {profileTitle && (<Text style={description? styles.nameStyle: styles.nameStyleLikes}>{profileTitle}</Text>)}
          {/* DESCRIPTION */}
          {description && (
            <Text style={styles.descriptionCardItem}>{description}</Text>
          )}
          {/* SPORTS List */}
          { sportsList && <View style={{marginVertical: 10}}>
            <View style={styles.sportChipSet}>
              {sportsList.map((sport, i) => (
                  <SportChips key={i} sport={sport.sport} gameLevel={sport.game_level} isDisplay={true} />
                ))}
            </View>
          </View>}
          {location && (
            <Text style={styles.descriptionCardItem}>{location}</Text>
          )}
          {image_set && image_set.map((imgObj, index) => renderImages(imgObj, index, image_set.length)
          )}
        </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </>
  )
}

const renderImages = (imgObj, index, numImages) => {
            let imageStyle = styles.imageContainer
            if (index == numImages - 1) {
              imageStyle = styles.lastImageContainer;
            } else {
              imageStyle = styles.imageContainer;
            }
            return (
            <Image key={index} source={{uri: imgObj.imageURL}} style={imageStyle}/>)}
export {CardItem};
