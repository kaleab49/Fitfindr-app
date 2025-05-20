import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function UploadScreen() {
  const { isDarkMode, theme, colors } = useTheme();
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      // TODO: Add image analysis logic here
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      // TODO: Add image analysis logic here
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    gradient: {
      flex: 1,
    },
    content: {
      padding: 20,
      flex: 1,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 20,
      color: isDarkMode ? colors.textLight : colors.textDark,
    },
    button: {
      backgroundColor: colors.primary,
      padding: 16,
      borderRadius: 8,
      width: '100%',
      marginBottom: 16,
    },
    buttonText: {
      color: isDarkMode ? colors.textLight : colors.textDark,
      textAlign: 'center',
      fontSize: 16,
      fontWeight: 'bold',
    },
    imageContainer: {
      flex: 1,
      marginVertical: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
      width: '100%',
      height: 300,
      borderRadius: 10,
    },
    placeholderText: {
      fontSize: 16,
      color: isDarkMode ? colors.textLight : colors.textDark,
      textAlign: 'center',
      marginBottom: 20,
    },
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[
          theme.surface,
          theme.background,
        ]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Upload Photo</Text>
          
          <View style={styles.imageContainer}>
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <Text style={styles.placeholderText}>
                Take a photo or upload an image to find your size
              </Text>
            )}
          </View>

          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <Text style={styles.buttonText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>Upload from Gallery</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
} 