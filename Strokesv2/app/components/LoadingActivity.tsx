import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Text } from "."; // Assuming this is the correct import path for your Text component
import { typography, colors } from "../theme";

interface LoadingActivityProps {
  color?: string; // Customize the color of the spinner
  message?: string; // Custom message
  messageStyle?: object; // Styling for the text message
}

export const LoadingActivity: React.FC<LoadingActivityProps> = ({
  color = colors.tint,
  message = "Loading...",
  messageStyle = {},
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={color} />
      <Text style={[styles.message, messageStyle]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20, // Provides some padding around the spinner and text
  },
  message: {
    marginTop: 10, // Space between the spinner and text
    fontFamily: typography.primary.normal,
    color: colors.text, // Default text color
    fontSize: 16, // Reasonable default size for loading text
  },
});


