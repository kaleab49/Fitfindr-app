import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

// Mock data for brands - replace with actual data from your backend
const MOCK_BRANDS = [
  { id: '1', name: 'Nike', category: 'Sports' },
  { id: '2', name: 'Adidas', category: 'Sports' },
  { id: '3', name: 'Zara', category: 'Fashion' },
  { id: '4', name: 'H&M', category: 'Fashion' },
  { id: '5', name: 'Under Armour', category: 'Sports' },
  { id: '6', name: 'Puma', category: 'Sports' },
  { id: '7', name: 'Uniqlo', category: 'Fashion' },
  { id: '8', name: 'New Balance', category: 'Sports' },
];

export default function SearchScreen() {
  const { isDarkMode, colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredBrands = MOCK_BRANDS.filter(brand => {
    const matchesSearch = brand.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || brand.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
      marginBottom: 20,
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
    brandCard: {
      backgroundColor: isDarkMode ? colors.dark.surface : colors.accent1,
      borderRadius: 12,
      padding: 15,
      marginBottom: 10,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    brandName: {
      fontSize: 18,
      fontWeight: '600',
      color: isDarkMode ? colors.textLight : colors.textDark,
      marginBottom: 5,
    },
    brandCategory: {
      fontSize: 14,
      color: colors.accent3,
    },
  });

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  const renderBrandItem = ({ item }: { item: typeof MOCK_BRANDS[0] }) => (
    <TouchableOpacity style={styles.brandCard}>
      <Text style={styles.brandName}>{item.name}</Text>
      <Text style={styles.brandCategory}>{item.category}</Text>
    </TouchableOpacity>
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
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons 
              name="search" 
              size={24} 
              color={isDarkMode ? colors.textLight : colors.textDark} 
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for brands..."
              placeholderTextColor={colors.accent3}
              value={searchQuery}
              onChangeText={handleSearch}
            />
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>
            Categories
          </Text>
          <View style={styles.categoriesContainer}>
            {['Sports', 'Fashion'].map((category) => (
              <TouchableOpacity 
                key={category} 
                style={[
                  styles.categoryCard,
                  selectedCategory === category && { opacity: 0.7 }
                ]}
                onPress={() => handleCategorySelect(category)}
              >
                <Text style={styles.categoryText}>{category}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <FlatList
            data={filteredBrands}
            renderItem={renderBrandItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </LinearGradient>
    </View>
  );
} 