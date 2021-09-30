import React from 'react';
import styles from '../../assets/styles';
import React, { useRef, useEffect, useContext, useState, ReactElement } from 'react'
import {Text, View, Image, Dimensions, TouchableOpacity} from 'react-native';
import {Icon} from '../Icon/Icon';

const CardItem = ({
  actions,
  description,
  image,
  matches,
  name,
  onPressLeft,
  onPressRight,
  status,
  variant,
  ImageContext
}) => {
  //logic
  //
  const {squashData, newSportList} = useContext(ImageContext);
  const [loadingSportsList, setLoadingSportsList] = React.useState(false)
  const [sportsList, setSportsList] = React.useState([{sport:"Tennis", game_level: 0}])
  useEffect(() => {
  setLoadingSportsList(true);
  if (
    squashData?.squash?.sports != undefined &&
    squashData?.squash?.sports.length != 0
  ) {
    const sportsArray = squashData!.squash!.sports;
    console.log(sportsArray);
    setSportsList(sportsArray);
    setLoadingSportsList(false);
  }
  // for first name

  }, [squashData?.squash?.sports])
  // Custom styling
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

  return (
    <View style={styles.containerCardItem}>
      {/* IMAGE */}
      <Image source={image} style={imageStyle} />

      {/* LiST OF SPORTS */}
        <View style={styles.sportChipSet}>
          {!loading &&
            sportsList.map((sport, i) => (
              <SportChips key={i} sport={sport.sport} isDisplay={true}/>
            ))}
        </View>
      {/* NAME */}
      <Text style={nameStyle}>{name}</Text>

      {/* DESCRIPTION */}
      {description && (
        <Text style={styles.descriptionCardItem}>{description}</Text>
      )}

      {/* STATUS */}
      {status && (
        <View style={styles.status}>
          <View style={status === 'Online' ? styles.online : styles.offline} />
          <Text style={styles.statusText}>{status}</Text>
        </View>
      )}

      {/* ACTIONS */}
      {actions && (
        <View style={styles.actionsCardItem}>
          <TouchableOpacity style={styles.miniButton}>
            <Text style={styles.star}>
              <Icon name="star"/>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => onPressLeft()}>
            <Text style={styles.like}>
              <Icon name="like" />
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => onPressRight()}
          >
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
    </View>
  );
};

export {CardItem};
