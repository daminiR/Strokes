import React, { useState, useEffect, useCallback} from 'react';
import { colors, spacing } from "../theme"
import { View, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useStores } from "../models"


interface ImageData {
  uri: string | null;
  img_idx: number;
}

interface ImagePickerWallProps {
  onImagesUpdate: (images: ImageData[]) => void;
}

export const ImagePickerWall: React.FC<ImagePickerWallProps> = ({ onImagesUpdate, isEditing }) => {
  const { userStore, tempUserStore } = useStores()
  const initializeImagesFromStore = useCallback(() => {
  const store = isEditing ? tempUserStore : userStore // Choose the store based on isEditing

    if (store.imageFiles.length > 0) {
      return store.imageFiles.map((image) => ({
        uri: image.imageURL, // Use imageURL for the uri
        img_idx: image.img_idx,
      }))
    }
    // Return default placeholders if no images are in the chosen store
    return [
      { uri: null, img_idx: 0 },
      { uri: null, img_idx: 1 },
      { uri: null, img_idx: 2 },
    ]
  }, [isEditing, userStore.imageFiles, tempUserStore.imageFiles])
  const [images, setImages] = useState<ImageData[]>(initializeImagesFromStore)
  useEffect(() => {
    setImages(initializeImagesFromStore())
  }, [initializeImagesFromStore]) // Dependency is the memoized function itself

  const handleChoosePhoto = async (index: number) => {
    const options = { noData: true, includeBase64: true }
    try {
      const response = await launchImageLibrary()
      if (response.assets && response.assets[0].uri) {
        const updatedImages = images.map((img, imgIndex) =>
          imgIndex === index ? { ...img, uri: response.assets[0].uri } : img,
        )
        setImages(updatedImages)
        onImagesUpdate(updatedImages)
      }
    } catch (error) {
      console.log("Error picking image: ", error)
    }
  }
  const handleDeletePhoto = (indexToDelete: number) => {
    const updatedImages = images.map((img, imgIndex) =>
      imgIndex === indexToDelete ? { ...img, uri: null } : img,
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
              onPress={() => (img.uri ? handleDeletePhoto(index) : handleChoosePhoto(index))}
            >
              {img.uri ? (
                <Image source={{ uri: img.uri }} style={styles.image} />
              ) : (
                <Icon name="camera-alt" size={30} color="#000" style={styles.cameraIcon} />
              )}
              {img.uri && (
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

// styles remain unchanged

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


