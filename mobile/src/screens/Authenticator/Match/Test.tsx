import React, { useEffect, useContext, useState, ReactElement } from 'react'
import {Dimensions, Image,Text, Button, View, ImageBackground } from 'react-native';
import CardStack, { Card } from 'react-native-card-stack-swiper';
import {Icon, FAB} from 'react-native-elements'
import Swiper from 'react-native-deck-swiper'
import {ScrollView, StyleSheet } from 'react-native'
import { City } from '../../../components/City/City';
import { Filters } from '../../../components/Filters/Filters';
import { CardItem } from '../../../components/CardItem/CardItem';
import { EndCard } from '../../../components/EndCard/EndCard';
import Demo from '../../../assets/data/demo.js';
import styles from '../../../assets/styles/'
import {PRIMARY_COLOR} from '../../../assets/styles/'
import {MatchesProfileContext} from './index'
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const renderMatches =  (card, index) => {
      const profileImage = card.image_set.find(imgObj => imgObj.img_idx == 0)
      const image_set_copy = card.image_set
      const min_idx_obj = image_set_copy.reduce((res, obj) => {return (obj.img_idx < res.img_idx)? obj: res})
      const image_set_copy2 = card.image_set.filter(imgObj => imgObj.img_idx != min_idx_obj.img_idx)
      const title = card.first_name +', ' + card.age
            return (

    <Card key={index}>
                <CardItem
                profileImage={min_idx_obj}
                image_set={image_set_copy2}
                description={card.description}
                profileTitle={title}
                sportsList={card.sports}
                onPressLeft={() => this.swiper.swipeLeft()}
                onPressRight={() => this.swiper.swipeRight()}
                  />
                </Card>
            )
}
const Test = () => {
 const image = require('../../../assets/images/01.jpg');
 const {matches, loadingMatches} = useContext(MatchesProfileContext);
  const [endingText, setEndingText] = useState(null)
  useEffect(() => {
      if (matches.length == 0){
          setEndingText("No more matches left!")
      }
  }, [])

  const nameStyle = [
    {
      paddingTop: 15,
      paddingBottom: 7,
      color: '#363636',
      fontSize: 25
    }
  ];
  return (
    <>
        <View style={stylesSwipe.container}>
            { matches.length != 0 &&
           <Swiper
           cards={matches}
            ref={(swiper) => {
              this.swiper = swiper;
            }}
            renderCard={(card, index) => renderMatches(card, index)}
            onSwiped={(cardIndex) => {
              console.log(cardIndex);
            }}
            onSwipedRight={() => {
              console.log('onSwipedRight');
            }}
            //hacky solution to add note at the last deck
            onSwipedAll={() => setEndingText("No more matches left!")}
            disableBottomSwipe={true}
            disableTopSwipe={true}
            verticalSwipe={false}
            verticalThreshold={0}
            horizontalThreshold={width / 2}
            cardIndex={0}
            stackAnimationFriction={500}
            //backgroundColor={'#FFFFFF'}
            useViewOverflow={true}
            backgroundColor={'#FFFFFF'}
            stackSize={3}>
            <View style={styles.top}>
              <City />
              <Filters />
            </View>
          </Swiper> }
            { endingText && <View style={styles.center}>
        <Text style={nameStyle}>{endingText}</Text>
        </View>}
        </View>
          <View style={styles.bottom}>
          <View style={styles.spaceLikeDislike}>
            <FAB
              icon={{
                type: 'material-community',
                name: 'heart',
                color: 'grey',
                size: 50,
                containerStyle: {marginHorizontal: -15, marginVertical: -15},
              }}
              color="white"
                disabled={matches.length == 0}
              onPress={() => this.swiper.swipeRight()}
            />
            <FAB
              icon={{
                type: 'material-community',
                name: 'close-circle-outline',
                color: 'grey',
                size: 50,
                containerStyle: {marginHorizontal: -15, marginVertical: -15},
              }}
              color="white"
             disabled={matches.length == 0}
              onPress={() => this.swiper.swipeLeft()}
            />
        </View>
        </View>
    </>
  );
};

const stylesSwipe = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  text: {
    textAlign: "center",
    fontSize: 50,
    backgroundColor: "transparent"
  }
});
  const imageStyle = [
    {
      borderRadius: 8,
      width:  width - 80,
      height:  350,
      margin:  20
    }
  ];
export {Test};
