import React, { useState } from 'react';
import { View, Modal, StyleSheet, Text, TouchableOpacity } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { colors, spacing, typography } from '../theme'; // Import your theme settings
import { Button } from '../components'; // Assuming you have a custom Button component
import Icon from 'react-native-vector-icons/MaterialIcons';

export const FilterModal = ({ isVisible, onClose, onApplyFilters, filters}) => {
 const [age, setAge] = useState([
    filters?.age?.min ?? 18,
    filters?.age?.max ?? 60
  ]);
  const [gameLevel, setGameLevel] = useState([
    filters?.gameLevel?.min ?? 1,
    filters?.gameLevel?.max ?? 7
  ]);

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.closeIconContainer} onPress={onClose}>
            <Icon name="close" size={35} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.ageRangeContainer}>
            <Text style={styles.ageRangeText}>
              Age Range: {age[0]} - {age[1]}
            </Text>
          </View>
          <MultiSlider
            values={[age[0], age[1]]}
            sliderLength={280}
            onValuesChange={setAge}
            min={18}
            max={60}
            step={1}
            allowOverlap={false}
            snapped={true}
            selectedStyle={{ backgroundColor: colors.palette.neutral600 }}
            unselectedStyle={{ backgroundColor: colors.palette.neutral300 }}
            containerStyle={{ marginVertical: spacing.sm }}
            markerStyle={styles.marker}
          />
          <View style={styles.ageRangeContainer}>
            <Text style={styles.ageRangeText}>
              Game Level Range: {gameLevel[0]} - {gameLevel[1]}
            </Text>
          </View>
          <MultiSlider
            values={[gameLevel[0], gameLevel[1]]}
            sliderLength={280}
            onValuesChange={setGameLevel}
            min={1}
            max={7}
            step={1}
            allowOverlap={false}
            snapped={true}
            selectedStyle={{ backgroundColor: colors.palette.neutral600 }}
            unselectedStyle={{ backgroundColor: colors.palette.neutral300 }}
            containerStyle={{ marginVertical: spacing.sm }}
            markerStyle={styles.marker}
          />
          <View style={styles.buttonContainer}>
            <Button
              text="Apply"
              onPress={() => onApplyFilters(age, gameLevel)}
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

