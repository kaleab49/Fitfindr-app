import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { theme } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

type Category = 'clothes' | 'shoes' | 'sports';

export default function SearchScreen() {
  const { isDarkMode } = useTheme();
  const colors = isDarkMode ? theme.dark : theme.light;
  const [selectedCategory, setSelectedCategory] = useState<Category>('clothes');
  const [searchQuery, setSearchQuery] = useState('');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: theme.spacing.md,
    },
    searchInput: {
      backgroundColor: colors.card,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      color: colors.text,
      marginBottom: theme.spacing.md,
    },
    categoryContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.lg,
    },
    categoryButton: {
      flex: 1,
      padding: theme.spacing.sm,
      margin: theme.spacing.xs,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
    },
    categoryText: {
      color: colors.text,
      ...theme.typography.body,
    },
    selectedCategory: {
      backgroundColor: colors.primary,
    },
    selectedCategoryText: {
      color: '#FFFFFF',
    },
    resultContainer: {
      backgroundColor: colors.card,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.md,
    },
    resultTitle: {
      ...theme.typography.h3,
      color: colors.text,
      marginBottom: theme.spacing.sm,
    },
    resultText: {
      ...theme.typography.body,
      color: colors.text,
    },
  });

  const handleSearch = () => {
    // TODO: Implement search functionality
    console.log('Searching for:', searchQuery, 'in category:', selectedCategory);
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for a product..."
        placeholderTextColor={colors.text}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <View style={styles.categoryContainer}>
        {(['clothes', 'shoes', 'sports'] as Category[]).map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategory,
            ]}
            onPress={() => setSelectedCategory(category)}>
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.selectedCategoryText,
              ]}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sample results - replace with actual search results */}
      <View style={styles.resultContainer}>
        <Text style={styles.resultTitle}>Nike T-Shirt</Text>
        <Text style={styles.resultText}>Recommended size: M</Text>
      </View>

      <View style={styles.resultContainer}>
        <Text style={styles.resultTitle}>Adidas Shorts</Text>
        <Text style={styles.resultText}>Recommended size: L</Text>
      </View>
    </ScrollView>
  );
} 