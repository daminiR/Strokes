import {Button, Avatar, Badge } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'
import React from 'react'
import {View, StyleSheet } from 'react-native'

const PictureWall = (props) => {
    //<Button icon={cancelProps} type="clear"}/>
    const cancelProps = {
        name:"close-circle-outline",
            type:"material-community",
            size: 30}
    return (
        <>
            <View style={styles.container}>
                <View style={styles.top}>
<Avatar
  size={120}
  icon={{name: 'camera-plus-outline', type: 'material-community'}}
  overlayContainerStyle={{backgroundColor: '#D3D3D3'}}
  onPress={() => console.log("Works!")}
  activeOpacity={0.7}
    containerStyle={{marginLeft: 0, marginTop: 0, top: 20, left: 20}}>
</Avatar>

                 </View>
                <View style={styles.middle} />
        <View style={styles.bottom} />
                 </View>
        </>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 10,
    margin: 10,
  },
  top: {
    flex: 0.3,
    backgroundColor: "white",
    borderWidth: 5,
    borderTopLeftRadius: 20,
    borderTopRightRadius:20,
  },
  middle: {
    flex: 0.3,
    backgroundColor: "beige",
    borderWidth: 5,
  },
  bottom: {
    flex: 0.3,
    backgroundColor: "pink",
    borderWidth: 5,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
});


export  { PictureWall }
