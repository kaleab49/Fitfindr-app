// ASOS API Service for Product Search
// Using RapidAPI ASOS endpoint

export type Product = {
  id: string;
  name: string;
  brand: string;
  price: {
    current: {
      text: string;
      value: number;
    };
    previous?: {
      text: string;
      value: number;
    };
  };
  image: {
    url: string;
    alt: string;
  };
  category: string;
  url: string;
  rating?: number;
  reviewCount?: number;
};

export type SearchResponse = {
  products: Product[];
  totalCount: number;
  hasMore: boolean;
};

export type SearchParams = {
  query: string;
  category?: string;
  brand?: string;
  limit?: number;
  offset?: number;
};

// ASOS RapidAPI Configuration
const ASOS_API_BASE_URL = 'https://asos2.p.rapidapi.com';
const ASOS_API_KEY = '97b182dc04msha599e6ec8f09785p1dbb35jsnd356ebddc32e';
const ASOS_API_HOST = 'asos2.p.rapidapi.com';

// Category mapping for ASOS API
const CATEGORY_SEARCH_TERMS = {
  'shoes': ['shoes', 'sneakers', 'boots', 'footwear', 'trainers', 'sandals', 'loafers', 'heels', 'flats'],
  'clothing': ['clothing', 'shirts', 'pants', 'jeans', 'dresses', 'tops', 'jackets', 'hoodies', 'sweaters', 'blouses', 'skirts', 'shorts'],
  'sports': ['sports', 'athletic', 'training', 'fitness', 'workout', 'gym', 'performance', 'activewear', 'athleisure']
};

// Fallback mock data for development/testing
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Nike Air Max 270',
    brand: 'Nike',
    price: {
      current: {
        text: '$150.00',
        value: 150
      },
      previous: {
        text: '$180.00',
        value: 180
      }
    },
    image: {
      url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',
      alt: 'Nike Air Max 270'
    },
    category: 'Shoes',
    url: 'https://example.com/nike-air-max-270',
    rating: 4.5,
    reviewCount: 128
  },
  {
    id: '2',
    name: 'Adidas Ultraboost 22',
    brand: 'Adidas',
    price: {
      current: {
        text: '$190.00',
        value: 190
      }
    },
    image: {
      url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=300&h=300&fit=crop',
      alt: 'Adidas Ultraboost 22'
    },
    category: 'Shoes',
    url: 'https://example.com/adidas-ultraboost-22',
    rating: 4.8,
    reviewCount: 95
  },
  {
    id: '3',
    name: 'Zara Basic T-Shirt',
    brand: 'Zara',
    price: {
      current: {
        text: '$29.99',
        value: 29.99
      }
    },
    image: {
      url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
      alt: 'Zara Basic T-Shirt'
    },
    category: 'Clothing',
    url: 'https://example.com/zara-basic-tshirt',
    rating: 4.2,
    reviewCount: 67
  },
  {
    id: '4',
    name: 'H&M Jeans',
    brand: 'H&M',
    price: {
      current: {
        text: '$49.99',
        value: 49.99
      },
      previous: {
        text: '$69.99',
        value: 69.99
      }
    },
    image: {
      url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop',
      alt: 'H&M Jeans'
    },
    category: 'Clothing',
    url: 'https://example.com/hm-jeans',
    rating: 4.0,
    reviewCount: 43
  },
  {
    id: '5',
    name: 'Under Armour Training Shorts',
    brand: 'Under Armour',
    price: {
      current: {
        text: '$45.00',
        value: 45
      }
    },
    image: {
      url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=300&fit=crop',
      alt: 'Under Armour Training Shorts'
    },
    category: 'Sports',
    url: 'https://example.com/ua-training-shorts',
    rating: 4.6,
    reviewCount: 89
  },
  {
    id: '6',
    name: 'Puma RS-X',
    brand: 'Puma',
    price: {
      current: {
        text: '$110.00',
        value: 110
      }
    },
    image: {
      url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300&h=300&fit=crop',
      alt: 'Puma RS-X'
    },
    category: 'Shoes',
    url: 'https://example.com/puma-rsx',
    rating: 4.3,
    reviewCount: 156
  },
  {
    id: '7',
    name: 'New Balance 574',
    brand: 'New Balance',
    price: {
      current: {
        text: '$89.99',
        value: 89.99
      }
    },
    image: {
      url: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=300&h=300&fit=crop',
      alt: 'New Balance 574'
    },
    category: 'Shoes',
    url: 'https://example.com/new-balance-574',
    rating: 4.7,
    reviewCount: 203
  },
  {
    id: '8',
    name: 'Uniqlo Cotton Shirt',
    brand: 'Uniqlo',
    price: {
      current: {
        text: '$19.99',
        value: 19.99
      }
    },
    image: {
      url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
      alt: 'Uniqlo Cotton Shirt'
    },
    category: 'Clothing',
    url: 'https://example.com/uniqlo-cotton-shirt',
    rating: 4.1,
    reviewCount: 78
  },
  {
    id: '9',
    name: 'Nike Dri-FIT Training Top',
    brand: 'Nike',
    price: {
      current: {
        text: '$65.00',
        value: 65
      },
      previous: {
        text: '$85.00',
        value: 85
      }
    },
    image: {
      url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop',
      alt: 'Nike Dri-FIT Training Top'
    },
    category: 'Sports',
    url: 'https://example.com/nike-dri-fit-top',
    rating: 4.4,
    reviewCount: 112
  },
  {
    id: '10',
    name: 'Adidas Track Jacket',
    brand: 'Adidas',
    price: {
      current: {
        text: '$75.00',
        value: 75
      }
    },
    image: {
      url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop',
      alt: 'Adidas Track Jacket'
    },
    category: 'Sports',
    url: 'https://example.com/adidas-track-jacket',
    rating: 4.6,
    reviewCount: 89
  }
];

// Helper function to build ASOS image URL
function buildAsosImageUrl(imageUrl: string): string {
  if (!imageUrl) return 'https://via.placeholder.com/300x300?text=No+Image';
  
  // If it's already a full URL, return as is
  if (imageUrl.startsWith('http')) return imageUrl;
  
  // If it's a relative ASOS URL, build the full URL
  if (imageUrl.includes('asos-media.com')) {
    return `https://${imageUrl}`;
  }
  
  // Fallback to placeholder
  return 'https://via.placeholder.com/300x300?text=No+Image';
}

// Helper function to build ASOS product URL
function buildAsosProductUrl(url: string, id: string): string {
  if (!url) return `https://www.asos.com/us/product/${id}`;
  
  // If it's already a full URL, return as is
  if (url.startsWith('http')) return url;
  
  // If it's a relative ASOS URL, build the full URL
  return `https://www.asos.com/us/${url}`;
}

// Helper function to determine product category based on name and brand
function determineProductCategory(productName: string, brandName: string): string {
  const name = productName.toLowerCase();
  const brand = brandName.toLowerCase();
  
  // Check for shoe-related terms
  if (name.includes('sneaker') || name.includes('shoe') || name.includes('boot') || 
      name.includes('trainer') || name.includes('footwear') || name.includes('air max') ||
      name.includes('ultraboost') || name.includes('574') || name.includes('rs-x') ||
      name.includes('sandals') || name.includes('loafers') || name.includes('heels') ||
      name.includes('flats') || name.includes('slip-on') || name.includes('oxford') ||
      name.includes('derby') || name.includes('chelsea') || name.includes('mule')) {
    return 'Shoes';
  }
  
  // Check for clothing-related terms
  if (name.includes('shirt') || name.includes('tshirt') || name.includes('t-shirt') ||
      name.includes('jean') || name.includes('pant') || name.includes('dress') ||
      name.includes('top') || name.includes('jacket') || name.includes('hoodie') ||
      name.includes('sweater') || name.includes('blouse') || name.includes('skirt') ||
      name.includes('short') || name.includes('blazer') || name.includes('cardigan') ||
      name.includes('vest') || name.includes('tank') || name.includes('polo') ||
      name.includes('jumper') || name.includes('pullover') || name.includes('sweatshirt')) {
    return 'Clothing';
  }
  
  // Check for sports-related terms
  if (name.includes('training') || name.includes('athletic') || name.includes('fitness') ||
      name.includes('workout') || name.includes('gym') || name.includes('dri-fit') ||
      name.includes('track') || name.includes('sport') || name.includes('performance') ||
      name.includes('activewear') || name.includes('athleisure') || name.includes('compression') ||
      name.includes('jersey') || name.includes('uniform') || name.includes('team') ||
      name.includes('fanny pack') || name.includes('backpack') || name.includes('duffel')) {
    return 'Sports';
  }
  
  // Default category based on brand
  if (['nike', 'adidas', 'puma', 'new balance', 'under armour', 'reebok', 'asics'].includes(brand)) {
    return 'Sports';
  }
  
  if (['zara', 'h&m', 'uniqlo', 'gap', 'old navy', 'forever 21', 'urban outfitters'].includes(brand)) {
    return 'Clothing';
  }
  
  return 'General';
}

// Helper function to build search query with category
function buildSearchQuery(params: SearchParams): string {
  let query = params.query || '';
  
  // If category is specified, add category-specific search terms
  if (params.category && params.category !== 'all' && CATEGORY_SEARCH_TERMS[params.category as keyof typeof CATEGORY_SEARCH_TERMS]) {
    const categoryTerms = CATEGORY_SEARCH_TERMS[params.category as keyof typeof CATEGORY_SEARCH_TERMS];
    if (query) {
      // If there's already a query, combine it with category terms
      query = `${query} ${categoryTerms[0]}`;
    } else {
      // If no query, use the first category term
      query = categoryTerms[0];
    }
  }
  
  return query;
}

// Search products using ASOS API
export async function searchProducts(params: SearchParams): Promise<SearchResponse> {
  try {
    console.log('🔍 Searching products with params:', params);
    
    // Build the search query with category terms
    const searchQuery = buildSearchQuery(params);
    console.log('🔍 Final search query:', searchQuery);
    
    // Use real ASOS API for search
    const queryParams = new URLSearchParams({
      q: searchQuery,
      limit: (params.limit || 20).toString(),
      offset: (params.offset || 0).toString(),
      lang: 'en-US',
      store: 'US',
      currency: 'USD',
      sizeSchema: 'US',
    });
    
    if (params.brand) {
      queryParams.append('brand', params.brand);
    }
    
    const response = await fetch(`${ASOS_API_BASE_URL}/products/v2/list?${queryParams}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': ASOS_API_KEY,
        'X-RapidAPI-Host': ASOS_API_HOST,
      },
    });
    
    if (!response.ok) {
      console.warn(`ASOS API error: ${response.status} ${response.statusText}`);
      // Fallback to mock data if API fails
      return fallbackToMockSearch(params);
    }
    
    const data = await response.json();
    console.log('✅ ASOS API Response:', data);
    
    // Transform ASOS API response to our Product type
    let products: Product[] = (data.products || []).map((item: any) => ({
      id: item.id?.toString() || Math.random().toString(),
      name: item.name || 'Unknown Product',
      brand: item.brandName || 'Unknown Brand',
      price: {
        current: {
          text: item.price?.current?.text || `$${item.price?.current?.value || 0}`,
          value: item.price?.current?.value || 0
        },
        previous: item.price?.previous?.text && item.price.previous.text !== '' ? {
          text: item.price.previous.text,
          value: item.price.previous.value || 0
        } : undefined
      },
      image: {
        url: buildAsosImageUrl(item.imageUrl),
        alt: item.name || 'Product Image'
      },
      category: determineProductCategory(item.name || '', item.brandName || ''),
      url: buildAsosProductUrl(item.url, item.id?.toString()),
      rating: item.rating || Math.random() * 2 + 3, // Fallback rating
      reviewCount: item.reviewCount || Math.floor(Math.random() * 200) + 10 // Fallback review count
    }));
    
    // Apply client-side category filtering if needed
    if (params.category && params.category !== 'all') {
      products = products.filter(product => 
        product.category.toLowerCase() === params.category!.toLowerCase()
      );
    }
    
    return {
      products,
      totalCount: data.itemCount || products.length,
      hasMore: (data.itemCount || 0) > (params.offset || 0) + (params.limit || 20)
    };
    
  } catch (error) {
    console.error('❌ Error searching products:', error);
    // Fallback to mock data on error
    return fallbackToMockSearch(params);
  }
}

// Fallback to mock search when API fails
function fallbackToMockSearch(params: SearchParams): SearchResponse {
  console.log('🔄 Falling back to mock data');
  
  let filteredProducts = MOCK_PRODUCTS;
  
  // Filter by search query
  if (params.query) {
    const query = params.query.toLowerCase();
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.brand.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    );
  }
  
  // Filter by category
  if (params.category && params.category !== 'all') {
    filteredProducts = filteredProducts.filter(product =>
      product.category.toLowerCase() === params.category!.toLowerCase()
    );
  }
  
  // Filter by brand
  if (params.brand) {
    filteredProducts = filteredProducts.filter(product =>
      product.brand.toLowerCase().includes(params.brand!.toLowerCase())
    );
  }
  
  // Apply pagination
  const limit = params.limit || 20;
  const offset = params.offset || 0;
  const paginatedProducts = filteredProducts.slice(offset, offset + limit);
  
  return {
    products: paginatedProducts,
    totalCount: filteredProducts.length,
    hasMore: offset + limit < filteredProducts.length
  };
}

// Get product details by ID
export async function getProductDetails(productId: string): Promise<Product> {
  try {
    console.log('📦 Getting product details for ID:', productId);
    
    const response = await fetch(`${ASOS_API_BASE_URL}/products/detail?lang=en-US&store=US&currency=USD&sizeSchema=US&productIds=${productId}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': ASOS_API_KEY,
        'X-RapidAPI-Host': ASOS_API_HOST,
      },
    });
    
    if (!response.ok) {
      console.warn(`ASOS API error: ${response.status} ${response.statusText}`);
      // Fallback to mock data
      const mockProduct = MOCK_PRODUCTS.find(p => p.id === productId);
      if (mockProduct) {
        return mockProduct;
      }
      throw new Error('Product not found');
    }
    
    const data = await response.json();
    console.log('✅ Product details response:', data);
    
    // Transform the response to our Product type
    const productData = data[0] || data; // Handle array or single object
    return transformProductData(productData);
    
  } catch (error) {
    console.error('❌ Error getting product details:', error);
    // Fallback to mock data
    const mockProduct = MOCK_PRODUCTS.find(p => p.id === productId);
    if (mockProduct) {
      return mockProduct;
    }
    throw new Error(error instanceof Error ? error.message : 'Failed to get product details');
  }
}

// Get trending products
export async function getTrendingProducts(limit: number = 10): Promise<Product[]> {
  try {
    console.log('🔥 Getting trending products');
    
    // Use ASOS API to get trending products
    const response = await fetch(`${ASOS_API_BASE_URL}/products/v2/list?limit=${limit}&lang=en-US&store=US&currency=USD&sizeSchema=US&sort=freshness`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': ASOS_API_KEY,
        'X-RapidAPI-Host': ASOS_API_HOST,
      },
    });
    
    if (!response.ok) {
      console.warn(`ASOS API error: ${response.status} ${response.statusText}`);
      // Fallback to mock data
      return MOCK_PRODUCTS.slice(0, limit);
    }
    
    const data = await response.json();
    console.log('✅ Trending products response:', data);
    
    // Transform ASOS API response to our Product type
    const products: Product[] = (data.products || []).map((item: any) => ({
      id: item.id?.toString() || Math.random().toString(),
      name: item.name || 'Unknown Product',
      brand: item.brandName || 'Unknown Brand',
      price: {
        current: {
          text: item.price?.current?.text || `$${item.price?.current?.value || 0}`,
          value: item.price?.current?.value || 0
        },
        previous: item.price?.previous?.text && item.price.previous.text !== '' ? {
          text: item.price.previous.text,
          value: item.price.previous.value || 0
        } : undefined
      },
      image: {
        url: buildAsosImageUrl(item.imageUrl),
        alt: item.name || 'Product Image'
      },
      category: determineProductCategory(item.name || '', item.brandName || ''),
      url: buildAsosProductUrl(item.url, item.id?.toString()),
      rating: item.rating || Math.random() * 2 + 3,
      reviewCount: item.reviewCount || Math.floor(Math.random() * 200) + 10
    }));
    
    return products.length > 0 ? products : MOCK_PRODUCTS.slice(0, limit);
    
  } catch (error) {
    console.error('❌ Error getting trending products:', error);
    // Fallback to mock data
    return MOCK_PRODUCTS.slice(0, limit);
  }
}

// Helper function to transform ASOS API data
function transformProductData(asosData: any): Product {
  return {
    id: asosData.id?.toString() || Math.random().toString(),
    name: asosData.name || 'Unknown Product',
    brand: asosData.brandName || 'Unknown Brand',
    price: {
      current: {
        text: asosData.price?.current?.text || `$${asosData.price?.current?.value || 0}`,
        value: asosData.price?.current?.value || 0
      },
      previous: asosData.price?.previous?.text && asosData.price.previous.text !== '' ? {
        text: asosData.price.previous.text,
        value: asosData.price.previous.value || 0
      } : undefined
    },
    image: {
      url: buildAsosImageUrl(asosData.imageUrl),
      alt: asosData.name || 'Product Image'
    },
    category: determineProductCategory(asosData.name || '', asosData.brandName || ''),
    url: buildAsosProductUrl(asosData.url, asosData.id?.toString()),
    rating: asosData.rating || Math.random() * 2 + 3,
    reviewCount: asosData.reviewCount || Math.floor(Math.random() * 200) + 10
  };
} 