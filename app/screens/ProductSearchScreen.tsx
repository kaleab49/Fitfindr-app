import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { getTrendingProducts, searchProducts, type Product, type SearchParams } from '../../lib/asosApi';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

export default function ProductSearchScreen() {
  const { isDarkMode, theme, colors } = useTheme();
  const params = useLocalSearchParams();
  
  // Initialize with route params if available
  const [searchQuery, setSearchQuery] = useState(params.searchQuery as string || '');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    params.category as string || null
  );
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const categories = [
    { key: 'all', label: 'All', icon: 'grid' },
    { key: 'shoes', label: 'Shoes', icon: 'footsteps' },
    { key: 'clothing', label: 'Clothing', icon: 'shirt' },
    { key: 'sports', label: 'Sports', icon: 'fitness' },
  ];

  // Load trending products on mount or perform initial search
  useEffect(() => {
    if (searchQuery.trim() || selectedCategory) {
      performSearch(0);
    } else {
      loadTrendingProducts();
    }
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch();
      } else if (!params.searchQuery) {
        // Only load trending if no initial search query from params
        loadTrendingProducts();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedCategory]);

  const loadTrendingProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const trendingProducts = await getTrendingProducts(20);
      setProducts(trendingProducts);
      setHasMore(false);
      setCurrentPage(0);
    } catch (err) {
      setError('Failed to load trending products');
      console.error('Error loading trending products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const performSearch = async (page: number = 0) => {
    try {
      setIsSearching(true);
      setError(null);

      const searchParams: SearchParams = {
        query: searchQuery.trim(),
        limit: 20,
        offset: page * 20,
      };

      if (selectedCategory && selectedCategory !== 'all') {
        searchParams.category = selectedCategory;
      }

      const response = await searchProducts(searchParams);
      
      if (page === 0) {
        setProducts(response.products);
      } else {
        setProducts(prev => [...prev, ...response.products]);
      }
      
      setHasMore(response.hasMore);
      setCurrentPage(page);
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (searchQuery.trim()) {
      await performSearch(0);
    } else {
      await loadTrendingProducts();
    }
    setRefreshing(false);
  };

  const loadMore = () => {
    if (hasMore && !isSearching) {
      performSearch(currentPage + 1);
    }
  };

  const handleProductPress = (product: Product) => {
    // TODO: Navigate to product detail screen
    Alert.alert(
      product.name,
      `${product.brand}\n${product.price.current.text}\n\n${product.category}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'View Details', onPress: () => console.log('Navigate to product details') }
      ]
    );
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  const handleBackPress = () => {
    router.back();
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => handleProductPress(item)}
    >
      <Image 
        source={{ uri: item.image.url }} 
        style={styles.productImage}
        resizeMode="cover"
      />
      
      <View style={styles.productInfo}>
        <Text style={styles.productBrand} numberOfLines={1}>
          {item.brand}
        </Text>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        
        <View style={styles.priceContainer}>
          <Text style={styles.currentPrice}>
            {item.price.current.text}
          </Text>
          {item.price.previous && (
            <Text style={styles.previousPrice}>
              {item.price.previous.text}
            </Text>
          )}
        </View>
        
        <View style={styles.productMeta}>
          <Text style={styles.categoryText}>
            {item.category}
          </Text>
          {item.rating && (
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={12} color="#FFD700" />
              <Text style={styles.ratingText}>
                {item.rating.toFixed(1)}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>
        {searchQuery.trim() ? 'Search Results' : 'Trending Products'}
        {selectedCategory && selectedCategory !== 'all' && (
          <Text style={styles.categoryFilter}> • {selectedCategory}</Text>
        )}
      </Text>
      
      {/* Category Filter */}
      <View style={styles.categoryContainer}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === item.key && styles.selectedCategoryButton,
              ]}
              onPress={() => handleCategorySelect(item.key)}
            >
              <Ionicons 
                name={item.icon as any} 
                size={16} 
                color={selectedCategory === item.key ? '#FFFFFF' : colors.primary} 
              />
              <Text style={[
                styles.categoryButtonText,
                selectedCategory === item.key && styles.selectedCategoryButtonText,
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.key}
          contentContainerStyle={styles.categoryList}
        />
      </View>
      
      {/* Active Filter Info */}
      {selectedCategory && selectedCategory !== 'all' && (
        <View style={styles.filterInfo}>
          <Ionicons name="filter" size={14} color={colors.accent3} />
          <Text style={styles.filterInfoText}>
            Filtering by {selectedCategory}
          </Text>
          <TouchableOpacity onPress={() => setSelectedCategory(null)}>
            <Ionicons name="close-circle" size={16} color={colors.accent3} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Ionicons 
          name={searchQuery.trim() ? "search" : "trending-up"} 
          size={48} 
          color={colors.accent3} 
        />
      </View>
      <Text style={styles.emptyTitle}>
        {searchQuery.trim() ? 'No products found' : 'No trending products'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery.trim() 
          ? 'Try adjusting your search terms or browse trending products'
          : 'Check back later for new trending items'
        }
      </Text>
      {searchQuery.trim() && (
        <TouchableOpacity 
          style={styles.emptyButton}
          onPress={() => {
            setSearchQuery('');
            setSelectedCategory(null);
          }}
        >
          <Text style={styles.emptyButtonText}>Browse Trending</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderFooter = () => {
    if (!hasMore) return null;
    
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={styles.loadingText}>Loading more products...</Text>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    gradient: {
      flex: 1,
    },
    searchContainer: {
      padding: 16,
      paddingBottom: 8,
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDarkMode ? colors.dark.surface : colors.light.surface,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    searchInput: {
      flex: 1,
      marginLeft: 12,
      fontSize: 16,
      color: isDarkMode ? colors.textLight : colors.textDark,
      fontFamily: 'playsans',
    },
    header: {
      paddingHorizontal: 16,
      paddingBottom: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDarkMode ? colors.textLight : colors.textDark,
      fontFamily: 'playsans',
      marginBottom: 16,
    },
    categoryContainer: {
      marginBottom: 8,
    },
    categoryList: {
      paddingRight: 16,
    },
    categoryButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDarkMode ? colors.dark.surface : colors.light.surface,
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 8,
      marginRight: 12,
      borderWidth: 1,
      borderColor: colors.primary + '30',
    },
    selectedCategoryButton: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    categoryButtonText: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.primary,
      fontFamily: 'playsans',
      marginLeft: 6,
    },
    selectedCategoryButtonText: {
      color: '#FFFFFF',
    },
    productCard: {
      backgroundColor: isDarkMode ? colors.dark.surface : colors.light.surface,
      borderRadius: 16,
      marginHorizontal: 16,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
      overflow: 'hidden',
    },
    productImage: {
      width: '100%',
      height: 200,
    },
    productInfo: {
      padding: 16,
    },
    productBrand: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.accent3,
      fontFamily: 'playsans',
      marginBottom: 4,
      textTransform: 'uppercase',
    },
    productName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: isDarkMode ? colors.textLight : colors.textDark,
      fontFamily: 'playsans',
      marginBottom: 8,
      lineHeight: 20,
    },
    priceContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    currentPrice: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.primary,
      fontFamily: 'playsans',
      marginRight: 8,
    },
    previousPrice: {
      fontSize: 14,
      color: colors.accent3,
      fontFamily: 'playsans',
      textDecorationLine: 'line-through',
    },
    productMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    categoryText: {
      fontSize: 12,
      color: colors.accent3,
      fontFamily: 'Sora-Regular',
      backgroundColor: colors.accent1 + '20',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    ratingText: {
      fontSize: 12,
      color: colors.accent3,
      fontFamily: 'Sora-Regular',
      marginLeft: 4,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 32,
    },
    emptyIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.accent1 + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 24,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: isDarkMode ? colors.textLight : colors.textDark,
      fontFamily: 'playsans',
      marginBottom: 8,
      textAlign: 'center',
    },
    emptySubtitle: {
      fontSize: 14,
      color: colors.accent3,
      fontFamily: 'Sora-Regular',
      textAlign: 'center',
      lineHeight: 20,
      marginBottom: 24,
    },
    emptyButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
    },
    emptyButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: 'bold',
      fontFamily: 'playsans',
    },
    loadingFooter: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 20,
    },
    loadingText: {
      fontSize: 14,
      color: colors.accent3,
      fontFamily: 'Sora-Regular',
      marginLeft: 8,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 32,
    },
    errorText: {
      fontSize: 16,
      color: '#F44336',
      fontFamily: 'playsans',
      textAlign: 'center',
      marginBottom: 16,
    },
    retryButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
    },
    retryButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: 'bold',
      fontFamily: 'playsans',
    },
    categoryFilter: {
      fontSize: 14,
      color: colors.accent3,
      fontFamily: 'Sora-Regular',
      marginLeft: 8,
    },
    filterInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.accent1 + '20',
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 8,
      marginTop: 8,
    },
    filterInfoText: {
      fontSize: 12,
      color: colors.accent3,
      fontFamily: 'Sora-Regular',
      marginLeft: 6,
      flex: 1,
    },
  });

  if (error && products.length === 0) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={[theme.surface, theme.background]} style={styles.gradient}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={() => {
                setError(null);
                if (searchQuery.trim()) {
                  performSearch(0);
                } else {
                  loadTrendingProducts();
                }
              }}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={[theme.surface, theme.background]} style={styles.gradient}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons 
              name="search" 
              size={20} 
              color={colors.accent3} 
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for products, brands..."
              placeholderTextColor={colors.accent3}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            /> 
            {isSearching && (
              <ActivityIndicator size="small" color={colors.primary} />
            )}
          </View>
        </View>

        {/* Product List */}
        <FlatList
          data={products}
          renderItem={renderProductItem}
          keyExtractor={item => item.id}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={!isLoading ? renderEmptyState : null}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.1}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ 
            paddingBottom: 20,
            minHeight: '100%'
          }}
        />

        {/* Loading Overlay */}
        {isLoading && products.length === 0 && (
          <View style={[StyleSheet.absoluteFill, { 
            justifyContent: 'center', 
            alignItems: 'center',
            backgroundColor: isDarkMode ? colors.dark.background + '80' : colors.light.background + '80'
          }]}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { marginTop: 16 }]}>
              Loading products...
            </Text>
          </View>
        )}
      </LinearGradient>
    </View>
  );
} 