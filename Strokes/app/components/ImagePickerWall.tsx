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
    if (store.imageSet.length > 0) {
      return [...store.imageSet].sort((a, b) => a.img_idx - b.img_idx);
    }
    // Return default placeholders if no images are in the chosen store
    return [
      { uri: null, img_idx: 0 },
      { uri: null, img_idx: 1 },
      { uri: null, img_idx: 2 },
    ]
  }, [isEditing, userStore.imageSet, tempUserStore.imageSet])
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
          imgIndex === index ? { img_idx: imgIndex, uri: response.assets[0].uri } : img,
        )
        setImages(updatedImages)
        onImagesUpdate(updatedImages)
      }
    } catch (error) {
      console.log("Error picking image: ", error)
    }
  }
  const handleDeletePhoto = (indexToDelete: number) => {
    const updatedImages = images.map((img, imgIndex) => {
      if (imgIndex === indexToDelete) {
        // If the image has an imageURL, it means it's been uploaded, so we might not want to set uri to null,
        // but rather mark it for deletion differently or handle it in a specific way.
        // This part depends on your application's logic for handling deletions of uploaded images.
        if (img.imageURL) {
          // For uploaded images, you might want to mark them as deleted or handle differently
          return { ...img, imageURL: null } // Example: marking as deleted, adjust based on your needs
        } else if (img.uri) {
          // For local images (not uploaded), setting uri to null to indicate deletion
          return { ...img, uri: null }
        }
      }
      return img // Return the image as is if it's not the one being deleted
    })

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
              onPress={() =>
                img.uri || img.imageURL ? handleDeletePhoto(index) : handleChoosePhoto(index)
              }
            >
              {img.uri || img.imageURL ? (
                // If either img.uri or img.imageURL exists, display the image
                <Image source={{ uri: img.uri || img.imageURL }} style={styles.image} />
              ) : (
                // If both are null, display the camera icon
                <Icon name="camera-alt" size={30} color="#000" style={styles.cameraIcon} />
              )}
              {(img.uri || img.imageURL) && (
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


