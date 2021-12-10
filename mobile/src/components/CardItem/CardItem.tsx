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
  onPressLeft= null,
  onPressRight=null,
}) => {
  console.log("is this title", profileTitle)
  const fullWidth = Dimensions.get('window').width;
  const imageStyle = [
    {
      borderRadius: 8,
      width: variant ? fullWidth / 2 - 30 : fullWidth - 80,
      height: variant ? 170 : 350,
      margin: variant ? 0 : 20
    }
  ];

  return (
    <>
      <ScrollView>
        <TouchableWithoutFeedback>
        <View style={styles.containerCardItem}>
          {/* IMAGE */}
          {profileImage && <ImageBackground source={{uri:profileImage.imageURL}} style={imageStyle}>
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
              //<Text style={styles.firstImageText}>{profileTitle}</Text>
            }}>
          </View>
          </ImageBackground>}
          {/* NAME */}
          {profileTitle && (<Text style={styles.nameStyle}>{profileTitle}</Text>)}
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
          {image_set && image_set.map((imgObj, index) => (
            <Image key={index} source={{uri: imgObj.imageURL}} style={imageStyle}/>)
          )}
        </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </>
  )
}

export {CardItem};
