import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { calculateSize, type ClothingCategory, type UserMeasurements } from '../../lib/sizeCalculator';
import { supabase } from '../../lib/supabase';
import { useTheme } from '../context/ThemeContext';

// TODO: Replace with actual Google Try-It-On API endpoint when available
const TRY_IT_ON_API_ENDPOINT = '/api/try-it-on-placeholder';

type TryItOnResponse = {
  success: boolean;
  detectedItems?: Array<{
    category: string;
    brand?: string;
    confidence: number;
    boundingBox?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }>;
  bodyMeasurements?: {
    height?: number;
    chest?: number;
    waist?: number;
    hip?: number;
    inseam?: number;
  };
  error?: string;
};

export default function UploadScreen() {
  const { isDarkMode, theme, colors } = useTheme();
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isApiCalling, setIsApiCalling] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ClothingCategory>('shirts');
  const [apiResponse, setApiResponse] = useState<TryItOnResponse | null>(null);

  const categories: { key: ClothingCategory; label: string; icon: string }[] = [
    { key: 'shirts', label: 'Shirts', icon: 'shirt' },
    { key: 'pants', label: 'Pants', icon: 'body' },
    { key: 'dresses', label: 'Dresses', icon: 'woman' },
    { key: 'jackets', label: 'Jackets', icon: 'shirt' },
    { key: 'shoes', label: 'Shoes', icon: 'footsteps' },
    { key: 'sports', label: 'Sports', icon: 'fitness' },
  ];

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setApiResponse(null); // Clear previous API response
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera permissions to take photos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setApiResponse(null); // Clear previous API response
    }
  };

  // TODO: Replace with actual Google Try-It-On API call when available
  const callTryItOnAPI = async (imageUri: string): Promise<TryItOnResponse> => {
    try {
      console.log('🔄 Calling Try-It-On API with image:', imageUri);
      
      // Convert image to blob for API call
      const response = await fetch(imageUri);
      const imageBlob = await response.blob();
      
      // TODO: Replace with actual API endpoint when Google's Try-It-On is live
      // For now, simulate API call with mock response
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
      
      // Mock response - replace with actual API call
      const mockResponse: TryItOnResponse = {
        success: true,
        detectedItems: [
          {
            category: selectedCategory,
            brand: 'Generic Brand',
            confidence: 0.85,
            boundingBox: { x: 100, y: 150, width: 200, height: 300 }
          }
        ],
        bodyMeasurements: {
          height: 175,
          chest: 95,
          waist: 80,
          hip: 95,
          inseam: 80
        }
      };
      
      console.log('✅ Try-It-On API Response:', mockResponse);
      return mockResponse;
      
      // TODO: Uncomment when Google's API is available:
      /*
      const formData = new FormData();
      formData.append('image', imageBlob, 'user-photo.jpg');
      formData.append('category', selectedCategory);
      
      const apiResponse = await fetch(TRY_IT_ON_API_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (!apiResponse.ok) {
        throw new Error(`API call failed: ${apiResponse.status}`);
      }
      
      const result = await apiResponse.json();
      console.log('✅ Try-It-On API Response:', result);
      return result;
      */
      
    } catch (error) {
      console.error('❌ Try-It-On API Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  };

  const analyzeImage = async () => {
    if (!image) {
      Alert.alert('No Image', 'Please select or take a photo first');
      return;
    }

    try {
      setIsAnalyzing(true);
      setIsApiCalling(true);

      // Step 1: Call Try-It-On API for image analysis
      console.log('🚀 Starting Try-It-On analysis...');
      const tryItOnResult = await callTryItOnAPI(image);
      setApiResponse(tryItOnResult);
      
      if (!tryItOnResult.success) {
        Alert.alert('Analysis Failed', tryItOnResult.error || 'Failed to analyze image');
        return;
      }

      // Step 2: Get user measurements for size calculation
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Error', 'Please log in to analyze images');
        return;
      }

      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!profileData) {
        Alert.alert('Profile Required', 'Please complete your profile with measurements first');
        router.push('/(tabs)/profile');
        return;
      }

      // Step 3: Use API results to enhance size calculation
      const measurements: UserMeasurements = {
        height: profileData.height,
        weight: profileData.weight,
        age: profileData.age,
        gender: profileData.gender as 'male' | 'female' | 'other',
        chest: profileData.chest,
        shoulder: profileData.shoulder,
        sleeve: profileData.sleeve,
        neck: profileData.neck,
        waist: profileData.waist,
        hip: profileData.hip,
        inseam: profileData.inseam,
        thigh: profileData.thigh,
        shoeSize: profileData.shoe_size,
        preferredFit: profileData.preferred_fit as 'slim' | 'regular' | 'loose',
      };

      // TODO: Use API-detected measurements if available and more accurate
      if (tryItOnResult.bodyMeasurements) {
        console.log('📏 Using API-detected measurements:', tryItOnResult.bodyMeasurements);
        // Enhance measurements with API data if available
      }

      // Step 4: Determine category and brand from API response
      const detectedItem = tryItOnResult.detectedItems?.[0];
      const detectedCategory = detectedItem?.category as ClothingCategory || selectedCategory;
      const detectedBrand = detectedItem?.brand || 'Generic Brand';
      const detectedItemName = `${detectedCategory.charAt(0).toUpperCase() + detectedCategory.slice(1)} Item`;

      // Step 5: Calculate size recommendation
      const sizeRecommendation = calculateSize(measurements, detectedCategory, detectedBrand);

      // Step 6: Prepare result data for navigation
      const resultData = {
        size: sizeRecommendation.size,
        confidence: Math.min(sizeRecommendation.confidence, (detectedItem?.confidence || 0) * 100),
        recommendations: sizeRecommendation.recommendations,
        resultImage: image, // TODO: Replace with processed result image from API
        originalImage: image,
        itemName: detectedItemName,
        category: detectedCategory,
        brand: detectedBrand,
      };

      console.log('🎯 Final size recommendation:', resultData);

      // Step 7: Navigate to result screen
      router.push({
        pathname: '/screens/ResultScreen',
        params: {
          resultData: JSON.stringify(resultData),
        },
      });

    } catch (error) {
      console.error('Error analyzing image:', error);
      Alert.alert('Error', 'Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
      setIsApiCalling(false);
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
      fontFamily: 'playsans',
    },
    categorySection: {
      marginBottom: 20,
    },
    categoryTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 15,
      color: isDarkMode ? colors.textLight : colors.textDark,
      fontFamily: 'playsans',
    },
    categoryGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: 10,
    },
    categoryButton: {
      backgroundColor: isDarkMode ? colors.dark.surface : colors.light.surface,
      borderRadius: 12,
      padding: 15,
      width: '48%',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
    },
    selectedCategoryButton: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + '20',
    },
    categoryButtonText: {
      fontSize: 14,
      fontWeight: '500',
      color: isDarkMode ? colors.textLight : colors.textDark,
      fontFamily: 'playsans',
      marginTop: 8,
    },
    selectedCategoryButtonText: {
      color: colors.primary,
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
      fontFamily: 'playsans',
    },
    button: {
      backgroundColor: colors.primary,
      padding: 16,
      borderRadius: 8,
      width: '100%',
      marginBottom: 16,
      alignItems: 'center',
    },
    buttonText: {
      color: '#FFFFFF',
      textAlign: 'center',
      fontSize: 16,
      fontWeight: 'bold',
      fontFamily: 'playsans',
    },
    analyzeButton: {
      backgroundColor: colors.accent1,
      padding: 16,
      borderRadius: 8,
      width: '100%',
      marginBottom: 16,
      alignItems: 'center',
    },
    analyzeButtonText: {
      color: '#FFFFFF',
      textAlign: 'center',
      fontSize: 16,
      fontWeight: 'bold',
      fontFamily: 'playsans',
    },
    disabledButton: {
      backgroundColor: colors.accent3,
      opacity: 0.6,
    },
    disabledButtonText: {
      color: isDarkMode ? colors.textLight : colors.textDark,
    },
    apiStatusContainer: {
      backgroundColor: isDarkMode ? colors.dark.surface : colors.light.surface,
      borderRadius: 12,
      padding: 15,
      marginBottom: 16,
    },
    apiStatusText: {
      fontSize: 14,
      color: isDarkMode ? colors.textLight : colors.textDark,
      fontFamily: 'Sora-Regular',
      textAlign: 'center',
    },
    apiStatusSuccess: {
      color: '#4CAF50',
    },
    apiStatusError: {
      color: '#F44336',
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
          
          {/* Category Selection */}
          <View style={styles.categorySection}>
            <Text style={styles.categoryTitle}>Select Item Type</Text>
            <View style={styles.categoryGrid}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.key}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category.key && styles.selectedCategoryButton,
                  ]}
                  onPress={() => setSelectedCategory(category.key)}
                >
                  <Text style={[
                    styles.categoryButtonText,
                    selectedCategory === category.key && styles.selectedCategoryButtonText,
                  ]}>
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.imageContainer}>
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <Text style={styles.placeholderText}>
                Take a photo or upload an image to find your size
              </Text>
            )}
          </View>

          {/* API Status Display */}
          {isApiCalling && (
            <View style={styles.apiStatusContainer}>
              <Text style={styles.apiStatusText}>
                🔄 Calling Try-It-On API...
              </Text>
            </View>
          )}

          {apiResponse && (
            <View style={styles.apiStatusContainer}>
              <Text style={[
                styles.apiStatusText,
                apiResponse.success ? styles.apiStatusSuccess : styles.apiStatusError
              ]}>
                {apiResponse.success ? '✅ API Analysis Complete' : '❌ API Analysis Failed'}
              </Text>
              {apiResponse.success && apiResponse.detectedItems && (
                <Text style={styles.apiStatusText}>
                  Detected: {apiResponse.detectedItems[0]?.category} 
                  (Confidence: {Math.round((apiResponse.detectedItems[0]?.confidence || 0) * 100)}%)
                </Text>
              )}
            </View>
          )}

          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <Text style={styles.buttonText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>Upload from Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.analyzeButton,
              (!image || isAnalyzing) && styles.disabledButton,
            ]}
            onPress={analyzeImage}
            disabled={!image || isAnalyzing}
          >
            <Text style={[
              styles.analyzeButtonText,
              (!image || isAnalyzing) && styles.disabledButtonText,
            ]}>
              {isAnalyzing ? 'Analyzing with AI...' : 'Analyze & Get Size'}
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
} 