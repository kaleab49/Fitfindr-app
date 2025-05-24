import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useTheme } from '../context/ThemeContext';

type BodyData = {
  height: string;
  weight: string;
  age: string;
  gender: 'male' | 'female' | 'other';
  // Upper body measurements
  chest: string;
  shoulder: string;
  sleeve: string;
  neck: string;
  // Lower body measurements
  waist: string;
  hip: string;
  inseam: string;
  thigh: string;
  // Additional measurements
  shoeSize: string;
  preferredFit: 'slim' | 'regular' | 'loose';
  profileImage?: string;
};

export default function ProfileScreen() {
  const { isDarkMode, colors } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [bodyData, setBodyData] = useState<BodyData>({
    height: '',
    weight: '',
    age: '',
    gender: 'male',
    chest: '',
    shoulder: '',
    sleeve: '',
    neck: '',
    waist: '',
    hip: '',
    inseam: '',
    thigh: '',
    shoeSize: '',
    preferredFit: 'regular',
    profileImage: undefined,
  });

  // Load user profile data
  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setBodyData({
          height: data.height || '',
          weight: data.weight || '',
          age: data.age || '',
          gender: data.gender || 'male',
          chest: data.chest || '',
          shoulder: data.shoulder || '',
          sleeve: data.sleeve || '',
          neck: data.neck || '',
          waist: data.waist || '',
          hip: data.hip || '',
          inseam: data.inseam || '',
          thigh: data.thigh || '',
          shoeSize: data.shoe_size || '',
          preferredFit: data.preferred_fit || 'regular',
          profileImage: data.profile_image || undefined,
        });
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your photos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        setBodyData({ ...bodyData, profileImage: result.assets[0].uri });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your camera');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        setBodyData({ ...bodyData, profileImage: result.assets[0].uri });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const handleSave = async () => {
    // Validate required inputs
    if (!bodyData.height || !bodyData.weight || !bodyData.age) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Upload profile image if it exists and is a new image
      let profileImageUrl = bodyData.profileImage;
      if (bodyData.profileImage && bodyData.profileImage.startsWith('file://')) {
        const response = await fetch(bodyData.profileImage);
        const blob = await response.blob();
        const fileExt = bodyData.profileImage.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('profile-images')
          .upload(fileName, blob);

        if (uploadError) throw uploadError;
        profileImageUrl = uploadData.path;
      }

      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          height: bodyData.height,
          weight: bodyData.weight,
          age: bodyData.age,
          gender: bodyData.gender,
          chest: bodyData.chest,
          shoulder: bodyData.shoulder,
          sleeve: bodyData.sleeve,
          neck: bodyData.neck,
          waist: bodyData.waist,
          hip: bodyData.hip,
          inseam: bodyData.inseam,
          thigh: bodyData.thigh,
          shoe_size: bodyData.shoeSize,
          preferred_fit: bodyData.preferredFit,
          profile_image: profileImageUrl,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'An error occurred while saving your profile');
    } finally {
      setIsLoading(false);
    }
  };

  const renderEditForm = () => (
    <ScrollView style={styles.formContainer}>
      {/* Profile Image Section */}
      <View style={styles.profileImageSection}>
        {bodyData.profileImage ? (
          <Image 
            source={{ uri: bodyData.profileImage }} 
            style={styles.editProfileImage}
          />
        ) : (
          <View style={[styles.editAvatarContainer, { backgroundColor: colors.accent1 }]}>
            <Ionicons 
              name="person" 
              size={60} 
              color={isDarkMode ? colors.textLight : colors.textDark} 
            />
          </View>
        )}
        <View style={styles.imageButtonsContainer}>
          <TouchableOpacity
            style={[styles.imageButton, { backgroundColor: colors.primary }]}
            onPress={takePhoto}
          >
            <Ionicons name="camera" size={20} color={colors.textLight} />
            <Text style={[styles.imageButtonText, { color: colors.textLight }]}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.imageButton, { backgroundColor: colors.primary }]}
            onPress={pickImage}
          >
            <Ionicons name="images" size={20} color={colors.textLight} />
            <Text style={[styles.imageButtonText, { color: colors.textLight }]}>Choose Photo</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Basic Information */}
      <Text style={[styles.sectionTitle, { color: isDarkMode ? colors.textLight : colors.textDark }]}>
        Basic Information
      </Text>
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: isDarkMode ? colors.textLight : colors.textDark }]}>
          Height (cm) *
        </Text>
        <TextInput
          style={[styles.input, { 
            backgroundColor: isDarkMode ? colors.dark.surface : colors.light.surface,
            color: isDarkMode ? colors.textLight : colors.textDark,
          }]}
          value={bodyData.height}
          onChangeText={(text) => setBodyData({ ...bodyData, height: text })}
          keyboardType="numeric"
          placeholder="Enter height in cm"
          placeholderTextColor={isDarkMode ? colors.textLight + '80' : colors.textDark + '80'}
              />
            </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: isDarkMode ? colors.textLight : colors.textDark }]}>
          Weight (kg) *
        </Text>
        <TextInput
          style={[styles.input, { 
            backgroundColor: isDarkMode ? colors.dark.surface : colors.light.surface,
            color: isDarkMode ? colors.textLight : colors.textDark,
          }]}
          value={bodyData.weight}
          onChangeText={(text) => setBodyData({ ...bodyData, weight: text })}
          keyboardType="numeric"
          placeholder="Enter weight in kg"
          placeholderTextColor={isDarkMode ? colors.textLight + '80' : colors.textDark + '80'}
        />
          </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: isDarkMode ? colors.textLight : colors.textDark }]}>
          Age *
          </Text>
        <TextInput
          style={[styles.input, { 
            backgroundColor: isDarkMode ? colors.dark.surface : colors.light.surface,
            color: isDarkMode ? colors.textLight : colors.textDark,
          }]}
          value={bodyData.age}
          onChangeText={(text) => setBodyData({ ...bodyData, age: text })}
          keyboardType="numeric"
          placeholder="Enter age"
          placeholderTextColor={isDarkMode ? colors.textLight + '80' : colors.textDark + '80'}
        />
        </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: isDarkMode ? colors.textLight : colors.textDark }]}>
          Gender
        </Text>
        <View style={styles.radioGroup}>
          {['male', 'female', 'other'].map((gender) => (
            <TouchableOpacity
              key={gender}
              style={[
                styles.radioButton,
                bodyData.gender === gender && styles.radioButtonSelected,
                { 
                  backgroundColor: bodyData.gender === gender 
                    ? colors.primary 
                    : isDarkMode 
                      ? colors.dark.surface 
                      : colors.light.surface,
                  borderColor: colors.primary
                }
              ]}
              onPress={() => setBodyData({ ...bodyData, gender: gender as BodyData['gender'] })}
            >
              <Text style={[
                styles.radioButtonText,
                { 
                  color: bodyData.gender === gender 
                    ? colors.textLight 
                    : isDarkMode 
                      ? colors.textLight 
                      : colors.textDark 
                }
              ]}>
                {gender.charAt(0).toUpperCase() + gender.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Upper Body Measurements */}
      <Text style={[styles.sectionTitle, { color: isDarkMode ? colors.textLight : colors.textDark }]}>
        Upper Body Measurements
      </Text>
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: isDarkMode ? colors.textLight : colors.textDark }]}>
          Chest (cm)
        </Text>
        <TextInput
          style={[styles.input, { 
            backgroundColor: isDarkMode ? colors.dark.surface : colors.light.surface,
            color: isDarkMode ? colors.textLight : colors.textDark,
          }]}
          value={bodyData.chest}
          onChangeText={(text) => setBodyData({ ...bodyData, chest: text })}
          keyboardType="numeric"
          placeholder="Enter chest measurement"
          placeholderTextColor={isDarkMode ? colors.textLight + '80' : colors.textDark + '80'}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: isDarkMode ? colors.textLight : colors.textDark }]}>
          Shoulder Width (cm)
        </Text>
        <TextInput
          style={[styles.input, { 
            backgroundColor: isDarkMode ? colors.dark.surface : colors.light.surface,
            color: isDarkMode ? colors.textLight : colors.textDark,
          }]}
          value={bodyData.shoulder}
          onChangeText={(text) => setBodyData({ ...bodyData, shoulder: text })}
          keyboardType="numeric"
          placeholder="Enter shoulder width"
          placeholderTextColor={isDarkMode ? colors.textLight + '80' : colors.textDark + '80'}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: isDarkMode ? colors.textLight : colors.textDark }]}>
          Sleeve Length (cm)
        </Text>
        <TextInput
          style={[styles.input, { 
            backgroundColor: isDarkMode ? colors.dark.surface : colors.light.surface,
            color: isDarkMode ? colors.textLight : colors.textDark,
          }]}
          value={bodyData.sleeve}
          onChangeText={(text) => setBodyData({ ...bodyData, sleeve: text })}
          keyboardType="numeric"
          placeholder="Enter sleeve length"
          placeholderTextColor={isDarkMode ? colors.textLight + '80' : colors.textDark + '80'}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: isDarkMode ? colors.textLight : colors.textDark }]}>
          Neck (cm)
        </Text>
        <TextInput
          style={[styles.input, { 
            backgroundColor: isDarkMode ? colors.dark.surface : colors.light.surface,
            color: isDarkMode ? colors.textLight : colors.textDark,
          }]}
          value={bodyData.neck}
          onChangeText={(text) => setBodyData({ ...bodyData, neck: text })}
          keyboardType="numeric"
          placeholder="Enter neck measurement"
          placeholderTextColor={isDarkMode ? colors.textLight + '80' : colors.textDark + '80'}
        />
      </View>

      {/* Lower Body Measurements */}
      <Text style={[styles.sectionTitle, { color: isDarkMode ? colors.textLight : colors.textDark }]}>
        Lower Body Measurements
      </Text>
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: isDarkMode ? colors.textLight : colors.textDark }]}>
          Waist (cm)
        </Text>
        <TextInput
          style={[styles.input, { 
            backgroundColor: isDarkMode ? colors.dark.surface : colors.light.surface,
            color: isDarkMode ? colors.textLight : colors.textDark,
          }]}
          value={bodyData.waist}
          onChangeText={(text) => setBodyData({ ...bodyData, waist: text })}
          keyboardType="numeric"
          placeholder="Enter waist measurement"
          placeholderTextColor={isDarkMode ? colors.textLight + '80' : colors.textDark + '80'}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: isDarkMode ? colors.textLight : colors.textDark }]}>
          Hip (cm)
        </Text>
        <TextInput
          style={[styles.input, { 
            backgroundColor: isDarkMode ? colors.dark.surface : colors.light.surface,
            color: isDarkMode ? colors.textLight : colors.textDark,
          }]}
          value={bodyData.hip}
          onChangeText={(text) => setBodyData({ ...bodyData, hip: text })}
          keyboardType="numeric"
          placeholder="Enter hip measurement"
          placeholderTextColor={isDarkMode ? colors.textLight + '80' : colors.textDark + '80'}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: isDarkMode ? colors.textLight : colors.textDark }]}>
          Inseam (cm)
        </Text>
        <TextInput
          style={[styles.input, { 
            backgroundColor: isDarkMode ? colors.dark.surface : colors.light.surface,
            color: isDarkMode ? colors.textLight : colors.textDark,
          }]}
          value={bodyData.inseam}
          onChangeText={(text) => setBodyData({ ...bodyData, inseam: text })}
          keyboardType="numeric"
          placeholder="Enter inseam length"
          placeholderTextColor={isDarkMode ? colors.textLight + '80' : colors.textDark + '80'}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: isDarkMode ? colors.textLight : colors.textDark }]}>
          Thigh (cm)
        </Text>
        <TextInput
          style={[styles.input, { 
            backgroundColor: isDarkMode ? colors.dark.surface : colors.light.surface,
            color: isDarkMode ? colors.textLight : colors.textDark,
          }]}
          value={bodyData.thigh}
          onChangeText={(text) => setBodyData({ ...bodyData, thigh: text })}
          keyboardType="numeric"
          placeholder="Enter thigh measurement"
          placeholderTextColor={isDarkMode ? colors.textLight + '80' : colors.textDark + '80'}
        />
      </View>

      {/* Additional Information */}
      <Text style={[styles.sectionTitle, { color: isDarkMode ? colors.textLight : colors.textDark }]}>
        Additional Information
      </Text>
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: isDarkMode ? colors.textLight : colors.textDark }]}>
          Shoe Size (EU)
        </Text>
        <TextInput
          style={[styles.input, { 
            backgroundColor: isDarkMode ? colors.dark.surface : colors.light.surface,
            color: isDarkMode ? colors.textLight : colors.textDark,
          }]}
          value={bodyData.shoeSize}
          onChangeText={(text) => setBodyData({ ...bodyData, shoeSize: text })}
          keyboardType="numeric"
          placeholder="Enter EU shoe size"
          placeholderTextColor={isDarkMode ? colors.textLight + '80' : colors.textDark + '80'}
        />
        </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: isDarkMode ? colors.textLight : colors.textDark }]}>
          Preferred Fit
        </Text>
        <View style={styles.radioGroup}>
          {[
            { value: 'slim', label: 'Slim' },
            { value: 'regular', label: 'Regular' },
            { value: 'loose', label: 'Loose' }
          ].map(({ value, label }) => (
            <TouchableOpacity
              key={value}
              style={[
                styles.radioButton,
                bodyData.preferredFit === value && styles.radioButtonSelected,
                { 
                  backgroundColor: bodyData.preferredFit === value 
                    ? colors.primary 
                    : isDarkMode 
                      ? colors.dark.surface 
                      : colors.light.surface,
                  borderColor: colors.primary
                }
              ]}
              onPress={() => setBodyData({ ...bodyData, preferredFit: value as BodyData['preferredFit'] })}
            >
              <Text style={[
                styles.radioButtonText,
                { 
                  color: bodyData.preferredFit === value 
                    ? colors.textLight 
                    : isDarkMode 
                      ? colors.textLight 
                      : colors.textDark 
                }
              ]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: colors.primary }]}
        onPress={handleSave}
      >
        <Text style={styles.saveButtonText}>Save Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderProfileView = () => (
    <View style={styles.profileView}>
      <View style={styles.profileImageContainer}>
        {bodyData.profileImage ? (
          <Image 
            source={{ uri: bodyData.profileImage }} 
            style={styles.profileImage}
          />
        ) : (
          <View style={[styles.avatarContainer, { backgroundColor: colors.accent1 }]}>
            <Ionicons 
              name="person" 
              size={60} 
              color={isDarkMode ? colors.textLight : colors.textDark} 
            />
          </View>
        )}
        <TouchableOpacity 
          style={[styles.editButton, { backgroundColor: colors.primary }]}
          onPress={() => setIsEditing(true)}
        >
          <Ionicons name="pencil" size={20} color={colors.textLight} />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: isDarkMode ? colors.textLight : colors.textDark }]}>
            {bodyData.height ? `${bodyData.height} cm` : '-'}
          </Text>
          <Text style={[styles.statLabel, { color: colors.accent3 }]}>Height</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: isDarkMode ? colors.textLight : colors.textDark }]}>
            {bodyData.weight ? `${bodyData.weight} kg` : '-'}
          </Text>
          <Text style={[styles.statLabel, { color: colors.accent3 }]}>Weight</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: isDarkMode ? colors.textLight : colors.textDark }]}>
            {bodyData.age ? `${bodyData.age} years` : '-'}
          </Text>
          <Text style={[styles.statLabel, { color: colors.accent3 }]}>Age</Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={[styles.detailLabel, { color: isDarkMode ? colors.textLight : colors.textDark }]}>
          Gender: {bodyData.gender.charAt(0).toUpperCase() + bodyData.gender.slice(1)}
        </Text>
        {bodyData.chest && (
          <Text style={[styles.detailLabel, { color: isDarkMode ? colors.textLight : colors.textDark }]}>
            Chest: {bodyData.chest} cm
          </Text>
        )}
        {bodyData.shoulder && (
          <Text style={[styles.detailLabel, { color: isDarkMode ? colors.textLight : colors.textDark }]}>
            Shoulder: {bodyData.shoulder} cm
          </Text>
        )}
        {bodyData.sleeve && (
          <Text style={[styles.detailLabel, { color: isDarkMode ? colors.textLight : colors.textDark }]}>
            Sleeve: {bodyData.sleeve} cm
          </Text>
        )}
        {bodyData.neck && (
          <Text style={[styles.detailLabel, { color: isDarkMode ? colors.textLight : colors.textDark }]}>
            Neck: {bodyData.neck} cm
          </Text>
        )}
        {bodyData.waist && (
          <Text style={[styles.detailLabel, { color: isDarkMode ? colors.textLight : colors.textDark }]}>
            Waist: {bodyData.waist} cm
          </Text>
        )}
        {bodyData.hip && (
          <Text style={[styles.detailLabel, { color: isDarkMode ? colors.textLight : colors.textDark }]}>
            Hip: {bodyData.hip} cm
          </Text>
        )}
        {bodyData.inseam && (
          <Text style={[styles.detailLabel, { color: isDarkMode ? colors.textLight : colors.textDark }]}>
            Inseam: {bodyData.inseam} cm
          </Text>
        )}
        {bodyData.thigh && (
          <Text style={[styles.detailLabel, { color: isDarkMode ? colors.textLight : colors.textDark }]}>
            Thigh: {bodyData.thigh} cm
          </Text>
        )}
        {bodyData.shoeSize && (
          <Text style={[styles.detailLabel, { color: isDarkMode ? colors.textLight : colors.textDark }]}>
            Shoe Size: EU {bodyData.shoeSize}
          </Text>
        )}
        <Text style={[styles.detailLabel, { color: isDarkMode ? colors.textLight : colors.textDark }]}>
          Preferred Fit: {bodyData.preferredFit.charAt(0).toUpperCase() + bodyData.preferredFit.slice(1)}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[
          isDarkMode ? colors.dark.surface : colors.light.surface,
          isDarkMode ? colors.dark.background : colors.light.background,
        ]}
        style={styles.gradient}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : isEditing ? renderEditForm() : renderProfileView()}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  radioButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  radioButtonSelected: {
    backgroundColor: '#007AFF',
  },
  radioButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  saveButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileView: {
    flex: 1,
    padding: 20,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#007AFF',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    padding: 8,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F5F5F5',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
  },
  detailsContainer: {
    backgroundColor: '#F5F5F5',
    padding: 20,
    borderRadius: 15,
  },
  detailLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#007AFF',
  },
  editProfileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#007AFF',
  },
  profileImageSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  editAvatarContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#007AFF',
  },
  imageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 15,
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    gap: 5,
  },
  imageButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 