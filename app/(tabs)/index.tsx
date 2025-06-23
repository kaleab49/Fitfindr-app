import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { supabase } from '../../lib/supabase';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

type UserProfile = {
  height?: string;
  weight?: string;
  age?: string;
  gender?: string;
  profile_image?: string;
  email?: string;
  full_name?: string;
};

type RecentAnalysis = {
  id: string;
  item: string;
  size: string;
  confidence: number;
  date: string;
  image?: string;
  category?: string;
  brand?: string;
};

type AnalysisResult = {
  id: string;
  user_id: string;
  item_name: string;
  recommended_size: string;
  confidence_score: number;
  category: string;
  brand?: string;
  result_image?: string;
  original_image?: string;
  created_at: string;
  updated_at: string;
};

export default function TabOneScreen() {
  const { isDarkMode, theme, colors } = useTheme();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [recentAnalyses, setRecentAnalyses] = useState<RecentAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Load user profile
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Profile error:', profileError);
        }

        if (profileData) {
          setUserProfile(profileData);
          // Extract name from email or use full_name if available
          const name = profileData.full_name || profileData.email?.split('@')[0] || 'User';
          setUserName(name);
        } else {
          // Set default user name from email
          const name = user.email?.split('@')[0] || 'User';
          setUserName(name);
        }

        // Load recent analyses from database
        await loadRecentAnalyses(user.id);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'Failed to load user data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadRecentAnalyses = async (userId: string) => {
    try {
      // First, try to get from analysis_results table if it exists
      const { data: analysisData, error: analysisError } = await supabase
        .from('analysis_results')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(3);

      if (analysisError) {
        console.log('Analysis results table not found, using mock data');
        // If table doesn't exist, use mock data
        setRecentAnalyses([
          {
            id: '1',
            item: 'Levi\'s 501 Jeans',
            size: '32x30',
            confidence: 95,
            date: '2 days ago',
            category: 'Clothing',
            brand: 'Levi\'s',
          },
          {
            id: '2',
            item: 'Nike Air Max',
            size: 'US 10',
            confidence: 92,
            date: '1 week ago',
            category: 'Shoes',
            brand: 'Nike',
          },
        ]);
      } else if (analysisData && analysisData.length > 0) {
        // Convert database data to RecentAnalysis format
        const formattedAnalyses: RecentAnalysis[] = analysisData.map((analysis: AnalysisResult) => ({
          id: analysis.id,
          item: analysis.item_name,
          size: analysis.recommended_size,
          confidence: analysis.confidence_score,
          date: formatDate(analysis.created_at),
          image: analysis.result_image,
          category: analysis.category,
          brand: analysis.brand,
        }));
        setRecentAnalyses(formattedAnalyses);
      } else {
        // No analyses found, show empty state
        setRecentAnalyses([]);
      }
    } catch (error) {
      console.error('Error loading recent analyses:', error);
      // Fallback to mock data
      setRecentAnalyses([
        {
          id: '1',
          item: 'Levi\'s 501 Jeans',
          size: '32x30',
          confidence: 95,
          date: '2 days ago',
          category: 'Clothing',
          brand: 'Levi\'s',
        },
      ]);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserData();
    setRefreshing(false);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'find-size':
        router.push('/(tabs)/upload');
        break;
      case 'profile':
        router.push('/(tabs)/profile');
        break;
      case 'history':
        // TODO: Implement history screen
        Alert.alert('Coming Soon', 'History screen will be available soon!');
        break;
      case 'search':
        router.push('/(tabs)/search');
        break;
      case 'new-analysis':
        router.push('/(tabs)/upload');
        break;
    }
  };

  const handleAnalysisPress = (analysis: RecentAnalysis) => {
    // Navigate to result screen with analysis data
    const resultData = {
      size: analysis.size,
      confidence: analysis.confidence,
      recommendations: [
        `Based on your measurements, ${analysis.size} should fit you well`,
        'Consider trying this size in-store if possible',
        'This recommendation is based on your body proportions',
      ],
      resultImage: analysis.image,
    };

    router.push({
      pathname: '/screens/ResultScreen',
      params: {
        resultData: JSON.stringify(resultData),
      },
    });
  };

  const getProfileCompletion = () => {
    if (!userProfile) return 0;
    const fields = ['height', 'weight', 'age', 'gender'];
    const completed = fields.filter(field => userProfile[field as keyof UserProfile]).length;
    return Math.round((completed / fields.length) * 100);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    let greeting = '';
    if (hour < 12) greeting = 'Good morning';
    else if (hour < 18) greeting = 'Good afternoon';
    else greeting = 'Good evening';
    
    // Get the user's first name for personalization
    let firstName = 'there';
    if (userProfile?.full_name) {
      firstName = userProfile.full_name.split(' ')[0]; // Get first name
    } else if (userProfile?.email) {
      firstName = userProfile.email.split('@')[0]; // Fallback to email username
    }
    
    return `${greeting}, ${firstName}! 👋`;
  };

  const getProfileDisplayName = () => {
    if (userProfile?.full_name) return userProfile.full_name;
    if (userProfile?.email) return userProfile.email.split('@')[0];
    return userName;
  };

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
      padding: 16,
    },
    header: {
      marginBottom: 20,
    },
    greeting: {
      fontSize: 22,
      fontWeight: 'bold',
      color: isDarkMode ? colors.textLight : colors.textDark,
      fontFamily: 'playsans',
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 14,
      color: isDarkMode ? colors.textLight + '80' : colors.textDark + '80',
      fontFamily: 'Sora-Regular',
    },
    profileCard: {
      backgroundColor: isDarkMode ? colors.dark.surface : colors.light.surface,
      borderRadius: 16,
      padding: 16,
      marginBottom: 20,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    profileImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 12,
    },
    profileInfo: {
      flex: 1,
    },
    profileName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: isDarkMode ? colors.textLight : colors.textDark,
      fontFamily: 'playsans',
      marginBottom: 4,
    },
    profileStats: {
      flexDirection: 'row',
      gap: 12,
    },
    statItem: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: 14,
      fontWeight: 'bold',
      color: colors.primary,
      fontFamily: 'playsans',
    },
    statLabel: {
      fontSize: 11,
      color: isDarkMode ? colors.textLight + '80' : colors.textDark + '80',
      fontFamily: 'Sora-Regular',
    },
    completionBar: {
      height: 3,
      backgroundColor: isDarkMode ? colors.dark.surface : colors.light.surface,
      borderRadius: 2,
      marginTop: 8,
    },
    completionFill: {
      height: '100%',
      backgroundColor: colors.primary,
      borderRadius: 2,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDarkMode ? colors.textLight : colors.textDark,
      fontFamily: 'playsans',
      marginBottom: 12,
    },
    quickActionsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      marginBottom: 20,
    },
    actionCard: {
      width: (width - 42) / 2,
      backgroundColor: isDarkMode ? colors.dark.surface : colors.light.surface,
      borderRadius: 14,
      padding: 16,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    actionIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
    },
    actionTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      color: isDarkMode ? colors.textLight : colors.textDark,
      fontFamily: 'playsans',
      textAlign: 'center',
      marginBottom: 4,
    },
    actionSubtitle: {
      fontSize: 11,
      color: isDarkMode ? colors.textLight + '80' : colors.textDark + '80',
      fontFamily: 'Sora-Regular',
      textAlign: 'center',
    },
    recentSection: {
      marginBottom: 20,
    },
    recentCard: {
      backgroundColor: isDarkMode ? colors.dark.surface : colors.light.surface,
      borderRadius: 14,
      padding: 14,
      marginBottom: 10,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    recentImage: {
      width: 50,
      height: 50,
      borderRadius: 8,
      backgroundColor: colors.accent1 + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 15,
    },
    recentInfo: {
      flex: 1,
    },
    recentItem: {
      fontSize: 16,
      fontWeight: 'bold',
      color: isDarkMode ? colors.textLight : colors.textDark,
      fontFamily: 'playsans',
      marginBottom: 3,
    },
    recentSize: {
      fontSize: 14,
      color: colors.primary,
      fontFamily: 'Sora-Regular',
      marginBottom: 3,
    },
    recentDate: {
      fontSize: 12,
      color: isDarkMode ? colors.textLight + '80' : colors.textDark + '80',
      fontFamily: 'Sora-Regular',
    },
    confidenceBadge: {
      backgroundColor: colors.accent1,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    confidenceText: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#FFFFFF',
      fontFamily: 'playsans',
    },
    tipsSection: {
      marginBottom: 25,
    },
    tipCard: {
      backgroundColor: isDarkMode ? colors.dark.surface : colors.light.surface,
      borderRadius: 16,
      padding: 20,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    tipHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    tipIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.accent1 + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    tipTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: isDarkMode ? colors.textLight : colors.textDark,
      fontFamily: 'playsans',
    },
    tipDescription: {
      fontSize: 14,
      color: isDarkMode ? colors.textLight + '80' : colors.textDark + '80',
      fontFamily: 'Sora-Regular',
      lineHeight: 20,
    },
    emptyState: {
      alignItems: 'center',
      padding: 40,
    },
    emptyIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.accent1 + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDarkMode ? colors.textLight : colors.textDark,
      fontFamily: 'playsans',
      marginBottom: 10,
      textAlign: 'center',
    },
    emptySubtitle: {
      fontSize: 14,
      color: isDarkMode ? colors.textLight + '80' : colors.textDark + '80',
      fontFamily: 'Sora-Regular',
      textAlign: 'center',
      lineHeight: 20,
    },
    emptyButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 8,
      marginTop: 15,
    },
    emptyButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: 'bold',
      fontFamily: 'playsans',
    },
    apiStatusCard: {
      backgroundColor: isDarkMode ? colors.dark.surface : colors.light.surface,
      borderRadius: 14,
      padding: 14,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    apiStatusHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    apiStatusTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      color: isDarkMode ? colors.textLight : colors.textDark,
      fontFamily: 'playsans',
      marginLeft: 8,
    },
    apiStatusText: {
      fontSize: 12,
      color: colors.accent3,
      fontFamily: 'Sora-Regular',
    },
  });

  if (isLoading) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[theme.surface, theme.background]}
          style={styles.gradient}
        >
          <View style={[styles.content, { justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={styles.greeting}>Loading...</Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.surface, theme.background]}
        style={styles.gradient}
      >
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.subtitle}>
                {userProfile ? 'Ready to find your perfect fit?' : 'Let\'s get started with your measurements'}
              </Text>
            </View>

            {/* Profile Card */}
            {userProfile && (
              <TouchableOpacity 
                style={styles.profileCard}
                onPress={() => handleQuickAction('profile')}
              >
                {userProfile.profile_image ? (
                  <Image 
                    source={{ uri: userProfile.profile_image }} 
                    style={styles.profileImage}
                  />
                ) : (
                  <View style={styles.profileImage}>
                    <Ionicons 
                      name="person" 
                      size={30} 
                      color={isDarkMode ? colors.textLight : colors.textDark} 
                    />
                  </View>
                )}
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>
                    {userProfile.height && userProfile.weight 
                      ? `${userProfile.height}cm • ${userProfile.weight}kg`
                      : 'Complete your profile'
                    }
                  </Text>
                  <View style={styles.profileStats}>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>
                        {userProfile.height || '-'}
                      </Text>
                      <Text style={styles.statLabel}>Height</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>
                        {userProfile.weight || '-'}
                      </Text>
                      <Text style={styles.statLabel}>Weight</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>
                        {getProfileCompletion()}%
                      </Text>
                      <Text style={styles.statLabel}>Complete</Text>
                    </View>
                  </View>
                  <View style={styles.completionBar}>
                    <View 
                      style={[
                        styles.completionFill, 
                        { width: `${getProfileCompletion()}%` }
                      ]} 
                    />
                  </View>
                </View>
              </TouchableOpacity>
            )}

            {/* Quick Actions */}
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsContainer}>
              <TouchableOpacity 
                style={styles.actionCard}
                onPress={() => handleQuickAction('find-size')}
              >
                <View style={styles.actionIcon}>
                  <Ionicons name="camera" size={24} color={colors.primary} />
                </View>
                <Text style={styles.actionTitle}>Find My Size</Text>
                <Text style={styles.actionSubtitle}>Upload photo & analyze</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionCard}
                onPress={() => handleQuickAction('search')}
              >
                <View style={styles.actionIcon}>
                  <Ionicons name="search" size={24} color={colors.primary} />
                </View>
                <Text style={styles.actionTitle}>Browse Brands</Text>
                <Text style={styles.actionSubtitle}>Find your perfect fit</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionCard}
                onPress={() => handleQuickAction('profile')}
              >
                <View style={styles.actionIcon}>
                  <Ionicons name="person" size={24} color={colors.primary} />
                </View>
                <Text style={styles.actionTitle}>My Profile</Text>
                <Text style={styles.actionSubtitle}>Manage measurements</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionCard}
                onPress={() => handleQuickAction('history')}
              >
                <View style={styles.actionIcon}>
                  <Ionicons name="time" size={24} color={colors.primary} />
                </View>
                <Text style={styles.actionTitle}>History</Text>
                <Text style={styles.actionSubtitle}>Past recommendations</Text>
              </TouchableOpacity>
            </View>

            {/* API Status Indicator */}
            <View style={styles.apiStatusCard}>
              <View style={styles.apiStatusHeader}>
                <Ionicons name="cloud" size={16} color={colors.accent3} />
                <Text style={styles.apiStatusTitle}>
                  Try-It-On API Status
                </Text>
              </View>
              <Text style={styles.apiStatusText}>
                🔄 Mock Mode - Ready for Google's API integration
              </Text>
            </View>

            {/* Recent Analyses */}
            {recentAnalyses.length > 0 && (
              <View style={styles.recentSection}>
                <Text style={styles.sectionTitle}>Recent Analyses</Text>
                {recentAnalyses.map((analysis) => (
                  <TouchableOpacity 
                    key={analysis.id} 
                    style={styles.recentCard}
                    onPress={() => handleAnalysisPress(analysis)}
                  >
                    <View style={styles.recentImage}>
                      <Ionicons 
                        name={analysis.category === 'Shoes' ? 'footsteps' : 'shirt'} 
                        size={24} 
                        color={colors.accent1} 
                      />
                    </View>
                    <View style={styles.recentInfo}>
                      <Text style={styles.recentItem}>{analysis.item}</Text>
                      <Text style={styles.recentSize}>Size: {analysis.size}</Text>
                      <Text style={styles.recentDate}>{analysis.date}</Text>
                    </View>
                    <View style={styles.confidenceBadge}>
                      <Text style={styles.confidenceText}>{analysis.confidence}%</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Tips Section */}
            <View style={styles.tipsSection}>
              <Text style={styles.sectionTitle}>Pro Tips</Text>
              <View style={styles.tipCard}>
                <View style={styles.tipHeader}>
                  <View style={styles.tipIcon}>
                    <Ionicons name="sunny" size={20} color={colors.accent1} />
                  </View>
                  <Text style={styles.tipTitle}>Good Lighting</Text>
                </View>
                <Text style={styles.tipDescription}>
                  Ensure you have good lighting when taking photos for more accurate size recommendations.
                </Text>
              </View>
              
              <View style={styles.tipCard}>
                <View style={styles.tipHeader}>
                  <View style={styles.tipIcon}>
                    <Ionicons name="body" size={20} color={colors.accent1} />
                  </View>
                  <Text style={styles.tipTitle}>Full Body Shot</Text>
                </View>
                <Text style={styles.tipDescription}>
                  Make sure your full body is visible in the frame for the best analysis results.
                </Text>
              </View>
            </View>

            {/* Empty State for New Users */}
            {!userProfile && recentAnalyses.length === 0 && (
              <View style={styles.emptyState}>
                <View style={styles.emptyIcon}>
                  <Ionicons name="camera" size={40} color={colors.accent1} />
                </View>
                <Text style={styles.emptyTitle}>Ready to find your perfect fit?</Text>
                <Text style={styles.emptySubtitle}>
                  Start by uploading a full-body photo or setting up your profile with measurements.
                </Text>
                <TouchableOpacity 
                  style={styles.emptyButton}
                  onPress={() => handleQuickAction('new-analysis')}
                >
                  <Text style={styles.emptyButtonText}>Get Started</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}
