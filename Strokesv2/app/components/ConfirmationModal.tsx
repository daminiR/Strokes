import React, { useState } from 'react';
import { View, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '../theme'; // Import your theme settings
import { Button, Text} from '../components'; // Assuming you have a custom Button component

export const ConfirmationModal = ({ isVisible, onClose, quickMessage, onDone}) => {
  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.messageContainer}>
            <Text preset="subheading">
              {quickMessage}
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <Button
              text="Done"
              onPress={() => onDone()}
              style={styles.applyButton}
              preset="reversed"
            />
          </View>
        </View>
      </View>
    </Modal>
  )
};

const styles = StyleSheet.create({
  ageRangeContainer: {
    alignItems: "center",
    marginBottom: spacing.xs, // Adjust according to your spacing theme
  },
  messageContainer: {
    marginBottom: 15
  },
  messageText: {
    fontSize: 16,
    textAlign: 'center',
    color: colors.text
  },
  closeIconContainer: {
    position: "absolute",
    right: -10,
    top: -10,
    backgroundColor: colors.background,
    borderRadius: 20, // Make the border rounded, half of width and height if they are equal
    borderColor: colors.palette.neutral700, // Assuming you want to set the border color, use borderColor
    borderWidth: 2, // Set the border width
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  ageRangeText: {
    color: colors.text,
    fontFamily: "spaceGroteskRegular", // Adjust based on your typography theme
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: spacing.lg,
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
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    color: colors.text,
    fontFamily: typography.primary.normal,
    fontSize: 20,
  },
  label: {
    fontFamily: typography.primary.normal,
    color: colors.text,
    marginVertical: spacing.sm,
  },
  marker: {
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: colors.palette.neutral700,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.md,
  },
  applyButton: {
    //backgroundColor: colors.palette.neutral100,
  },
  closeButton: {
    //backgroundColor: colors.background,
  },
})

