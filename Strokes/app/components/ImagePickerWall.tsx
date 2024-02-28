import React, { useState } from 'react';
import { colors, spacing } from "../theme"
import { View, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getRootStore } from '../models/helpers/getRootStore';

interface ImageData {
  imageURL: string | null;
  img_idx: number;
  filePath: string | null;
}

export const ImagePickerWall: React.FC<ImagePickerWallProps> = ({ onImagesUpdate }) => {
    const [images, setImages] = useState<ImageData[]>([
      { imageURL: null, img_idx: 0, filePath: null },
      { imageURL: null, img_idx: 1, filePath: null },
      { imageURL: null, img_idx: 2, filePath: null },
    ])

    const handleChoosePhoto = async (index: number) => {
      const options = { noData: true }
      try {
        const response = await launchImageLibrary(options)
        if (response.assets && response.assets[0].uri) {
          const newImage: ImageData = {
            imageURL: response.assets[0].uri,
            img_idx: index,
            filePath: response.assets[0].uri, // Assuming uri is the filePath for demonstration
          }
          const updatedImages = images.map((img, imgIndex) => (imgIndex === index ? newImage : img))
          setImages(updatedImages)
          onImagesUpdate(updatedImages)
        }
      } catch (error) {
        console.log("Error picking image: ", error)
      }
    }

    const handleDeletePhoto = (indexToDelete: number) => {
      const updatedImages = images.map((img, imgIndex) =>
        imgIndex === indexToDelete ? { ...img, imageURL: null, filePath: null } : img,
      )
      setImages(updatedImages)
      onImagesUpdate(updatedImages)
    }

    return (
      <View style={styles.container}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
          <View style={styles.imageRow}>
            {images.map((img, index) => (
              <TouchableOpacity
                key={index}
                style={styles.imageContainer}
                onPress={() => (img.imageURL ? handleDeletePhoto(index) : handleChoosePhoto(index))}
              >
                {img.imageURL ? (
                  <Image source={{ uri: img.imageURL }} style={styles.image} />
                ) : (
                  <Icon name="camera-alt" size={30} color="#000" style={styles.cameraIcon} />
                )}
                {img.imageURL && (
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeletePhoto(index)}
                  >
                    <Icon name="close" size={20} color="white" />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    )
  }

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    marginTop: 10,
  },
  imageRow: {
    flexDirection: "row",
  },
  imageContainer: {
    width: 100,
    height: 100,
    marginRight: 10,
    marginBottom: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e1e4e8",
    borderRadius: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  cameraIcon: {
    opacity: 0.5,
  },
  deleteButton: {
    position: "absolute",
    right: 5,
    top: 5,
    backgroundColor: "red",
    borderRadius: 15,
    width: 25,
    height: 25,
    justifyContent: "center",
    alignItems: "center",
  },
})


