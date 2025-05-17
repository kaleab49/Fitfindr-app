import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function SearchScreen() {
  const { isDarkMode, colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    gradient: {
      flex: 1,
    },
    searchContainer: {
      padding: 15,
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDarkMode ? colors.dark.surface : colors.accent1,
      borderRadius: 12,
      padding: 10,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    searchInput: {
      flex: 1,
      marginLeft: 10,
      fontSize: 16,
      color: isDarkMode ? colors.textLight : colors.textDark,
    },
    content: {
      padding: 15,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: '600',
      marginBottom: 15,
      color: isDarkMode ? colors.textLight : colors.textDark,
    },
    categoriesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: 10,
    },
    categoryCard: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      padding: 15,
      width: '48%',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    categoryText: {
      color: colors.textLight,
      fontSize: 16,
      fontWeight: '500',
    },
  });

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    // TODO: Implement search functionality
    console.log('Searching for:', text);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[
          isDarkMode ? colors.dark.surface : colors.light.surface,
          isDarkMode ? colors.dark.background : colors.light.background,
        ]}
        style={styles.gradient}
      >
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons 
              name="search" 
              size={24} 
              color={isDarkMode ? colors.textLight : colors.textDark} 
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for fitness activities..."
              placeholderTextColor={colors.accent3}
              value={searchQuery}
              onChangeText={handleSearch}
            />
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>
            Popular Categories
          </Text>
          <View style={styles.categoriesContainer}>
            {['Gym', 'Yoga', 'Running', 'Swimming'].map((category) => (
              <TouchableOpacity 
                key={category} 
                style={styles.categoryCard}
                onPress={() => handleSearch(category)}
              >
                <Text style={styles.categoryText}>{category}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </LinearGradient>
    </View>
  );
} 