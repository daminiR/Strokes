import {Button,withBadge, Icon, Avatar, Badge } from 'react-native-elements'
import React from 'react'
import { ProfileSettingsInput } from "./profileSettingInput"
import {View, ScrollView, StyleSheet } from 'react-native'



const PictureWall = (props) => {
  return (
    <>
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.top}>
          <View style={styles.verticalImageplaceholder}>
            <View style={styles.horizontalImageplaceholder}>
              <SingleImagePlaceholder />
              <SingleImagePlaceholder />
              <SingleImagePlaceholder />
            </View>
            <View style={styles.horizontalImageplaceholder}>
              <SingleImagePlaceholder />
              <SingleImagePlaceholder />
              <SingleImagePlaceholder />
            </View>
          </View>
        </View>
        <View style={styles.middle}>
          <ProfileSettingsInput/>
        </View>
      </View>
    </ScrollView>
    </>
  );
}

const SingleImagePlaceholder = (props) => {
    const cancelProps = {
        name:"close-circle-outline",
            type:"material-community",
            size: 30}
    return (
      <>
            <Avatar
              size={130}
              icon={{name: 'camera-plus-outline', type: 'material-community'}}
              overlayContainerStyle={{
                backgroundColor: '#D3D3D3',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
              }}
              onPress={() => console.log('Works!')}
              activeOpacity={0.7}
              containerStyle={{
                padding: 0,
                marginLeft: 0,
                marginTop: 0,
              }}>
              <Avatar.Accessory {...cancelProps} />
            </Avatar>
      </>
    );
}

const styles = StyleSheet.create({
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
  horizontalImageplaceholder: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  verticalImageplaceholder: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
});


export  { PictureWall }
