import React from 'react';
import {Dimensions, Image,Text, Button, View, ImageBackground } from 'react-native';
import CardStack, { Card } from 'react-native-card-stack-swiper';
import {Icon, FAB} from 'react-native-elements'
import Swiper from 'react-native-deck-swiper'
import {ScrollView, StyleSheet } from 'react-native'
import { City } from '../../../components/City/City';
import { Filters } from '../../../components/Filters/Filters';
import { CardItem } from '../../../components/CardItem/CardItem';
import Demo from '../../../assets/data/demo.js';
import styles from '../../../assets/styles/'
import {PRIMARY_COLOR} from '../../../assets/styles/'

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const Test = () => {
  const image = require('../../../assets/images/01.jpg');
  return (
    <>
      <View style={stylesSwipe.container}>
        <Swiper
          cards={Demo}
          ref={(swiper) => {
            this.swiper = swiper;
          }}
          renderCard={(card, index) => {
            return (
              <View style={stylesSwipe.card}>
                <Card key={index}>
                  <CardItem
                    image={card.image}
                    name={card.name}
                    description={card.description}
                    matches={card.match}
                    actions
                    onPressLeft={() => this.swiper.swipeLeft()}
                    onPressRight={() => this.swiper.swipeRight()}
                  />
                </Card>
              </View>
            );
          }}
          onSwiped={(cardIndex) => {
            console.log(cardIndex);
          }}
          onSwipedRight={() => {
            console.log('onSwipedAll');
          }}
          disableBottomSwipe={true}
          disableTopSwipe={true}
          verticalSwipe={false}
          verticalThreshold={0}
          horizontalThreshold={width / 2}
          cardIndex={0}
          stackAnimationFriction={500}
          backgroundColor={'#FFFFFF'}
          stackSize={3}>
          <View style={styles.top}>
            <City />
            <Filters />
          </View>
        </Swiper>
        <View style={styles.bottom}>
          <FAB
            icon={{ type: 'material-community', name: 'heart', color: 'grey', size:50, containerStyle:{marginHorizontal: -15, marginVertical: -15}}}
            color="white"
            onPress={()=> this.swiper.swipeRight()}
          />
          <FAB
            icon={{ type: 'material-community', name: 'close-circle-outline', color: 'grey', size:50, containerStyle:{marginHorizontal: -15, marginVertical: -15}}}
          color="white"
            onPress={()=> this.swiper.swipeLeft()}
        />
        </View>
      </View>
    </>
  );
};

const stylesSwipe = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "red"
  },
  card: {
    flex: 1,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#E8E8E8",
    justifyContent: "center",
    backgroundColor: "white"
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
