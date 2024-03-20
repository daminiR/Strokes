import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, typography} from '../theme'; // Adjust import path as necessary
import {
  ListView,
  ImagePickerWall,
  ListItem,
  Header,
  Button,
  Icon,
  Screen,
  Text,
  TextField,
  SelectField,
  Toggle,
} from "../components"

// Define the props interface if using TypeScript
interface UpdateProfileCardProps {
  item: {
    label: string;
    value: string;
    iconName: string;
  };
  onPress?: () => void; // Optional onPress handler
}

export const UpdateProfileCard: React.FC<UpdateProfileCardProps> = ({ item, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.cardContainer}>
      <Icon icon={item.iconName} size={24} color={colors.primary} />
      <View style={styles.textContainer}>
        <Text style={styles.label}>{item.label}</Text>
        <Text style={styles.value}>{item.value}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: spacing.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    shadowColor: colors.palette.neutral900,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: spacing.md,
  },
  label: {
    fontSize: 16,
    color: colors.text,
    fontFamily: typography.primary.semiBold,
  },
  value: {
    fontSize: 16,
    //color: colors.primary,
    fontFamily: typography.primary.normal,
  },
});
