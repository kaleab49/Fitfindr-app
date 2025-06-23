import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { supabase } from '../../lib/supabase';
import { useTheme } from '../context/ThemeContext';

type AnalysisResult = {
  size: string;
  confidence: number;
  recommendations: string[];
  resultImage?: string;
  originalImage?: string;
  itemName?: string;
  category?: string;
  brand?: string;
};

type UserProfile = {
  height?: string;
  weight?: string;
  age?: string;
  gender?: string;
  chest?: string;
  waist?: string;
  hip?: string;
  inseam?: string;
  shoeSize?: string;
  preferredFit?: string;
};

export default function ResultScreen() {
  const { isDarkMode, colors } = useTheme();
  const params = useLocalSearchParams();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadResultData();
  }, []);

  const loadResultData = async () => {
    try {
      setIsLoading(true);
      
      // Load user profile for context
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (profileData) {
          setUserProfile(profileData);
        }
      }

      // Parse result data from navigation params
      if (params.resultData) {
        const parsedResult = JSON.parse(params.resultData as string);
        setResult(parsedResult);
      } else {
        // Fallback for testing
        setResult({
          size: 'M',
          confidence: 85,
          recommendations: [
            'Based on your measurements, size M should fit you well',
            'Consider trying this size in-store if possible',
            'This recommendation is based on your body proportions',
          ],
          itemName: 'Test Item',
          category: 'Clothing',
          brand: 'Test Brand',
        });
      }
    } catch (error) {
      console.error('Error loading result data:', error);
      Alert.alert('Error', 'Failed to load analysis results');
    } finally {
      setIsLoading(false);
    }
  };

  const saveToHistory = async () => {
    if (!result || !userProfile) return;

    try {
      setIsSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // TODO: Replace with actual AI analysis results
      const { error } = await supabase
        .from('analysis_results')
        .insert({
          user_id: user.id,
          item_name: result.itemName || 'Unknown Item',
          recommended_size: result.size,
          confidence_score: result.confidence,
          category: result.category || 'Clothing',
          brand: result.brand,
          result_image: result.resultImage,
          original_image: result.originalImage,
          created_at: new Date().toISOString(),
        });

      if (error) throw error;
      
      Alert.alert('Success', 'Analysis saved to history');
    } catch (error) {
      console.error('Error saving to history:', error);
      Alert.alert('Error', 'Failed to save analysis to history');
    } finally {
      setIsSaving(false);
    }
  };

  const shareResult = () => {
    // TODO: Implement sharing functionality
    Alert.alert('Share', 'Sharing functionality coming soon!');
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return '#4CAF50';
    if (confidence >= 75) return '#FF9800';
    return '#F44336';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 90) return 'Very High';
    if (confidence >= 75) return 'High';
    if (confidence >= 60) return 'Medium';
    return 'Low';
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[
            isDarkMode ? colors.dark.surface : colors.light.surface,
            isDarkMode ? colors.dark.background : colors.light.background,
          ]}
          style={styles.gradient}
        >
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { color: isDarkMode ? colors.textLight : colors.textDark }]}>
              Analyzing your photo...
            </Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[
          isDarkMode ? colors.dark.surface : colors.light.surface,
          isDarkMode ? colors.dark.background : colors.light.background,
        ]}
        style={styles.gradient}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <Ionicons 
                  name="arrow-back" 
                  size={24} 
                  color={isDarkMode ? colors.textLight : colors.textDark} 
                />
              </TouchableOpacity>
              <Text style={[styles.headerTitle, { color: isDarkMode ? colors.textLight : colors.textDark }]}>
                Size Recommendation
              </Text>
              <TouchableOpacity 
                style={styles.shareButton}
                onPress={shareResult}
              >
                <Ionicons 
                  name="share-outline" 
                  size={24} 
                  color={colors.primary} 
                />
              </TouchableOpacity>
            </View>

            {/* Result Card */}
            <View style={[styles.resultCard, { backgroundColor: isDarkMode ? colors.dark.surface : colors.light.surface }]}>
              <View style={styles.resultHeader}>
                <View style={styles.sizeContainer}>
                  <Text style={styles.sizeText}>{result?.size}</Text>
                </View>
                <View style={styles.confidenceContainer}>
                  <View style={[styles.confidenceBadge, { backgroundColor: getConfidenceColor(result?.confidence || 0) }]}>
                    <Text style={styles.confidenceText}>{result?.confidence}%</Text>
                  </View>
                  <Text style={[styles.confidenceLabel, { color: isDarkMode ? colors.textLight : colors.textDark }]}>
                    {getConfidenceText(result?.confidence || 0)} Confidence
                  </Text>
                </View>
              </View>

              {result?.itemName && (
                <Text style={[styles.itemName, { color: isDarkMode ? colors.textLight : colors.textDark }]}>
                  {result.itemName}
                </Text>
              )}

              {result?.brand && (
                <Text style={[styles.brandName, { color: colors.accent3 }]}>
                  {result.brand}
                </Text>
              )}
            </View>

            {/* Recommendations */}
            <View style={[styles.recommendationsCard, { backgroundColor: isDarkMode ? colors.dark.surface : colors.light.surface }]}>
              <Text style={[styles.sectionTitle, { color: isDarkMode ? colors.textLight : colors.textDark }]}>
                Recommendations
              </Text>
              {result?.recommendations.map((recommendation, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <View style={styles.bulletPoint}>
                    <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
                  </View>
                  <Text style={[styles.recommendationText, { color: isDarkMode ? colors.textLight : colors.textDark }]}>
                    {recommendation}
                  </Text>
                </View>
              ))}
            </View>

            {/* User Measurements Context */}
            {userProfile && (
              <View style={[styles.measurementsCard, { backgroundColor: isDarkMode ? colors.dark.surface : colors.light.surface }]}>
                <Text style={[styles.sectionTitle, { color: isDarkMode ? colors.textLight : colors.textDark }]}>
                  Based on Your Measurements
                </Text>
                <View style={styles.measurementsGrid}>
                  {userProfile.height && (
                    <View style={styles.measurementItem}>
                      <Text style={[styles.measurementLabel, { color: colors.accent3 }]}>Height</Text>
                      <Text style={[styles.measurementValue, { color: isDarkMode ? colors.textLight : colors.textDark }]}>
                        {userProfile.height} cm
                      </Text>
                    </View>
                  )}
                  {userProfile.weight && (
                    <View style={styles.measurementItem}>
                      <Text style={[styles.measurementLabel, { color: colors.accent3 }]}>Weight</Text>
                      <Text style={[styles.measurementValue, { color: isDarkMode ? colors.textLight : colors.textDark }]}>
                        {userProfile.weight} kg
                      </Text>
                    </View>
                  )}
                  {userProfile.chest && (
                    <View style={styles.measurementItem}>
                      <Text style={[styles.measurementLabel, { color: colors.accent3 }]}>Chest</Text>
                      <Text style={[styles.measurementValue, { color: isDarkMode ? colors.textLight : colors.textDark }]}>
                        {userProfile.chest} cm
                      </Text>
                    </View>
                  )}
                  {userProfile.waist && (
                    <View style={styles.measurementItem}>
                      <Text style={[styles.measurementLabel, { color: colors.accent3 }]}>Waist</Text>
                      <Text style={[styles.measurementValue, { color: isDarkMode ? colors.textLight : colors.textDark }]}>
                        {userProfile.waist} cm
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.primaryButton, { backgroundColor: colors.primary }]}
                onPress={saveToHistory}
                disabled={isSaving}
              >
                <Text style={styles.primaryButtonText}>
                  {isSaving ? 'Saving...' : 'Save to History'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.secondaryButton, { borderColor: colors.primary }]}
                onPress={() => router.push('/(tabs)/upload')}
              >
                <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>
                  Analyze Another Item
                </Text>
              </TouchableOpacity>
            </View>

            {/* AI Integration Note */}
            <View style={[styles.aiNote, { backgroundColor: isDarkMode ? colors.dark.surface : colors.light.surface }]}>
              <Ionicons name="information-circle" size={20} color={colors.accent3} />
              <Text style={[styles.aiNoteText, { color: isDarkMode ? colors.textLight : colors.textDark }]}>
                This recommendation is based on your measurements. AI-powered analysis coming soon!
              </Text>
            </View>
          </View>
        </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontFamily: 'playsans',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'playsans',
  },
  shareButton: {
    padding: 8,
  },
  resultCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  sizeContainer: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sizeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'playsans',
  },
  confidenceContainer: {
    alignItems: 'center',
  },
  confidenceBadge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 4,
  },
  confidenceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'playsans',
  },
  confidenceLabel: {
    fontSize: 12,
    fontFamily: 'Sora-Regular',
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'playsans',
    marginBottom: 5,
  },
  brandName: {
    fontSize: 14,
    fontFamily: 'Sora-Regular',
  },
  recommendationsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    fontFamily: 'playsans',
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bulletPoint: {
    marginRight: 12,
    marginTop: 2,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Sora-Regular',
  },
  measurementsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  measurementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  measurementItem: {
    width: '48%',
    marginBottom: 12,
  },
  measurementLabel: {
    fontSize: 12,
    fontFamily: 'Sora-Regular',
    marginBottom: 4,
  },
  measurementValue: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'playsans',
  },
  actionButtons: {
    marginBottom: 20,
  },
  primaryButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'playsans',
  },
  secondaryButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'playsans',
  },
  aiNote: {
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  aiNoteText: {
    flex: 1,
    fontSize: 14,
    marginLeft: 10,
    fontFamily: 'Sora-Regular',
    lineHeight: 20,
  },
}); 