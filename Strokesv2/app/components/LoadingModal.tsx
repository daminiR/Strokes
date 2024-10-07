import React from 'react';
import { View, Modal, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, spacing, typography } from '../theme'; // Import your theme settings
import { Text } from '../components'; // Assuming you have a custom Text component

interface LoadingModalProps {
  isVisible: boolean;
  message?: string;
  color?: string;
  messageStyle?: object;
}

export const LoadingModal: React.FC<LoadingModalProps> = ({
  isVisible,
  message = "Loading...",
  color = colors.tint,
  messageStyle = {},
}) => {
  return (
    <Modal visible={isVisible} animationType="fade" transparent={true}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <ActivityIndicator size="large" color={color} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: colors.background,
    borderRadius: 30,
    padding: spacing.sm,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  message: {
    marginTop: 10,
    fontFamily: typography.primary.normal,
    color: colors.text,
    fontSize: 16,
  },
});
