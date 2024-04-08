import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { Header, Card, Button, ListItem, AutoImage, Screen, Text } from "../components"
import { colors, spacing } from "../theme"
import Icon from 'react-native-vector-icons/FontAwesome5'
import { useStores } from "../models"
import { observer } from 'mobx-react-lite';

interface PlayerDetails {
  age: string;
  gender: string;
  neighborhood: string;
}
interface PlayerDetailsProps {
  heading: string;
}

// TODO: this needs serious tlc :)
export const PlayerDetails: FC<PlayerDetailsProps & { isEditing: boolean, playerDetails: PlayerDetails}> = observer(({ heading, isEditing, playerDetails}) => {
  const { userStore, tempUserStore } = useStores();
  const store = isEditing ? tempUserStore : userStore;
  return (
    <View style={styles.card}>
      <View style={styles.iconRow}>
        {/* Like Icon */}
        <View style={styles.iconContainer}>
          <Icon size={24} name={"birthday-cake"} />
          <Text style={$iconTileLabel}>{store.age}</Text>
        </View>
        <View style={styles.divider} />
        {/* Comment Icon */}
        <View style={styles.iconContainer}>
          <Icon size={24} name="venus-mars" />
          <Text style={$iconTileLabel}>{store.gender}</Text>
        </View>
        <View style={styles.divider} />
        {/* Share Icon */}
        <View style={styles.iconContainer}>
          <Icon size={24} name={"map-marker-alt"} />
          <Text style={$iconTileLabel}>{store.neighborhood.city}</Text>
        </View>
      </View>
    </View>
  )
})

const $iconTileLabel: TextStyle = {
  marginTop: spacing.xxs,
  color: colors.textDim,
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    marginBottom: 8,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Distribute space evenly between the icon containers
    alignItems: 'center', // Align items in the center vertically
  },
  iconContainer: {
    flex: 1, // Allow each icon container to grow equally
    alignItems: 'center', // Center-align the icon and text vertically
  },
  iconText: {
    fontSize: 12,
    marginTop: 4,
  },
  footer: {
    fontSize: 12,
    color: '#757575',
  },
  divider: {
    height: '60%', // Adjust the height as per your design
    width: 1,
    backgroundColor: '#E0E0E0', // Divider color
  },
});

