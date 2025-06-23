import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
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
  { id: '1', name: 'Nike', category: 'Sports', productCount: 1240 },
  { id: '2', name: 'Adidas', category: 'Sports', productCount: 980 },
  { id: '3', name: 'Zara', category: 'Fashion', productCount: 2100 },
  { id: '4', name: 'H&M', category: 'Fashion', productCount: 1850 },
  { id: '5', name: 'Under Armour', category: 'Sports', productCount: 650 },
  { id: '6', name: 'Puma', category: 'Sports', productCount: 720 },
  { id: '7', name: 'Uniqlo', category: 'Fashion', productCount: 890 },
  { id: '8', name: 'New Balance', category: 'Sports', productCount: 430 },
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

  const handleBrandPress = (brand: typeof MOCK_BRANDS[0]) => {
    // Navigate to ProductSearchScreen with brand filter
    router.push({
      pathname: '/screens/ProductSearchScreen',
      params: {
        searchQuery: brand.name,
        category: brand.category.toLowerCase(),
      },
    });
  };

  const handleProductSearch = () => {
    if (searchQuery.trim()) {
      router.push({
        pathname: '/screens/ProductSearchScreen',
        params: {
          searchQuery: searchQuery.trim(),
        },
      });
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  const renderBrandItem = ({ item }: { item: typeof MOCK_BRANDS[0] }) => (
    <TouchableOpacity 
      style={styles.brandCard}
      onPress={() => handleBrandPress(item)}
    >
      <View style={styles.brandHeader}>
        <Text style={styles.brandName}>{item.name}</Text>
        <View style={styles.brandBadge}>
          <Text style={styles.brandBadgeText}>{item.category}</Text>
        </View>
      </View>
      <Text style={styles.brandProductCount}>
        {item.productCount.toLocaleString()} products available
      </Text>
      <View style={styles.brandArrow}>
        <Ionicons name="chevron-forward" size={16} color={colors.accent3} />
      </View>
    </TouchableOpacity>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    gradient: {
      flex: 1,
    },
    searchContainer: {
      padding: 16,
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDarkMode ? colors.dark.surface : colors.light.surface,
      borderRadius: 12,
      padding: 12,
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
      fontFamily: 'playsans',
    },
    searchButton: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 8,
      marginLeft: 8,
    },
    searchButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
      fontFamily: 'playsans',
    },
    content: {
      padding: 16,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: '600',
      marginBottom: 16,
      color: isDarkMode ? colors.textLight : colors.textDark,
      fontFamily: 'playsans',
    },
    quickSearchSection: {
      marginBottom: 24,
    },
    quickSearchTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 12,
      color: isDarkMode ? colors.textLight : colors.textDark,
      fontFamily: 'playsans',
    },
    quickSearchGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    quickSearchButton: {
      backgroundColor: colors.accent1 + '20',
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderWidth: 1,
      borderColor: colors.accent1 + '30',
    },
    quickSearchButtonText: {
      color: colors.accent1,
      fontSize: 14,
      fontWeight: '500',
      fontFamily: 'playsans',
    },
    categoriesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: 10,
      marginBottom: 24,
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
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '500',
      fontFamily: 'playsans',
    },
    brandCard: {
      backgroundColor: isDarkMode ? colors.dark.surface : colors.light.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    brandHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    brandName: {
      fontSize: 18,
      fontWeight: '600',
      color: isDarkMode ? colors.textLight : colors.textDark,
      fontFamily: 'playsans',
    },
    brandBadge: {
      backgroundColor: colors.accent1 + '20',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    brandBadgeText: {
      fontSize: 12,
      fontWeight: '500',
      color: colors.accent1,
      fontFamily: 'playsans',
    },
    brandProductCount: {
      fontSize: 14,
      color: colors.accent3,
      fontFamily: 'Sora-Regular',
      marginBottom: 8,
    },
    brandArrow: {
      alignSelf: 'flex-end',
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
      color: colors.accent3,
      fontFamily: 'Sora-Regular',
      textAlign: 'center',
      lineHeight: 20,
    },
  });

  const handleSearch = (text: string) => {
    setSearchQuery(text);
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
              placeholder="Search for products, brands..."
              placeholderTextColor={colors.accent3}
              value={searchQuery}
              onChangeText={handleSearch}
              returnKeyType="search"
              onSubmitEditing={handleProductSearch}
            />
            {searchQuery.trim() && (
              <TouchableOpacity 
                style={styles.searchButton}
                onPress={handleProductSearch}
              >
                <Text style={styles.searchButtonText}>Search</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.content}>
          {/* Quick Search Options */}
          <View style={styles.quickSearchSection}>
            <Text style={styles.quickSearchTitle}>Quick Search</Text>
            <View style={styles.quickSearchGrid}>
              {['Nike', 'Adidas', 'Zara', 'H&M', 'Shoes', 'Clothing'].map((term) => (
                <TouchableOpacity
                  key={term}
                  style={styles.quickSearchButton}
                  onPress={() => {
                    router.push({
                      pathname: '/screens/ProductSearchScreen',
                      params: { searchQuery: term },
                    });
                  }}
                >
                  <Text style={styles.quickSearchButtonText}>{term}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Text style={styles.sectionTitle}>
            Browse by Category
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

          <Text style={styles.sectionTitle}>
            Popular Brands
          </Text>
          
          {filteredBrands.length > 0 ? (
            <FlatList
              data={filteredBrands}
              renderItem={renderBrandItem}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Ionicons name="search" size={40} color={colors.accent1} />
              </View>
              <Text style={styles.emptyTitle}>No brands found</Text>
              <Text style={styles.emptySubtitle}>
                Try adjusting your search terms or browse all categories
              </Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </View>
  );
} 