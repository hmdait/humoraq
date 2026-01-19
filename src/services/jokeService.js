import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  query, 
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  increment,
  updateDoc
} from 'firebase/firestore';
import { db } from './firebase';

const jokesCollection = collection(db, 'jokes');

// ============================================================================
// BASIC JOKE RETRIEVAL
// ============================================================================

export const getAllJokes = async () => {
  try {
    const q = query(jokesCollection, where('status', '==', 'published'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching jokes:', error);
    return [];
  }
};

export const getJokeById = async (id) => {
  try {
    const jokeDoc = doc(db, 'jokes', id);
    const jokeSnapshot = await getDoc(jokeDoc);
    
    if (jokeSnapshot.exists()) {
      const jokeData = {
        id: jokeSnapshot.id,
        ...jokeSnapshot.data()
      };
      
      const viewedJokes = JSON.parse(localStorage.getItem('viewedJokes') || '[]');
      const hasViewed = viewedJokes.includes(id);
      
      if (!hasViewed) {
        updateDoc(jokeDoc, {
          views: increment(1),
          updatedAt: serverTimestamp()
        }).catch(error => {
          console.error('Error incrementing views:', error);
        });
        
        viewedJokes.push(id);
        localStorage.setItem('viewedJokes', JSON.stringify(viewedJokes));
        
        return {
          ...jokeData,
          views: (jokeData.views || 0) + 1
        };
      }
      
      return jokeData;
    }
    return null;
  } catch (error) {
    console.error('Error fetching joke by ID:', error);
    return null;
  }
};

export const getRandomJoke = async (filters = {}) => {
  try {
    let q = query(
      collection(db, 'jokes'),
      where('status', '==', 'published')
    );

    if (filters.language) {
      q = query(q, where('language', '==', filters.language));
    }

    // FIXED: Use array-contains for categories array
    if (filters.category) {
      q = query(q, where('categories', 'array-contains', filters.category));
    }

    const querySnapshot = await getDocs(q);
    const jokes = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    if (jokes.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * jokes.length);
    const selectedJoke = jokes[randomIndex];
    
    const viewedJokes = JSON.parse(localStorage.getItem('viewedJokes') || '[]');
    const hasViewed = viewedJokes.includes(selectedJoke.id);
    
    if (!hasViewed) {
      const jokeDoc = doc(db, 'jokes', selectedJoke.id);
      
      updateDoc(jokeDoc, {
        views: increment(1),
        updatedAt: serverTimestamp()
      }).catch(error => {
        console.error('Error incrementing views:', error);
      });
      
      viewedJokes.push(selectedJoke.id);
      localStorage.setItem('viewedJokes', JSON.stringify(viewedJokes));
      
      return {
        ...selectedJoke,
        views: (selectedJoke.views || 0) + 1
      };
    }
    
    return selectedJoke;
  } catch (error) {
    console.error('Error fetching random joke:', error);
    return null;
  }
};

// ============================================================================
// CATEGORY-BASED RETRIEVAL (FIXED FOR CATEGORIES ARRAY)
// ============================================================================

/**
 * FIXED: Get jokes by category using array-contains
 * Supports categories array field: { categories: ['General', 'Work'] }
 * 
 * @param {string} categoryValue - Category value (e.g., "General", "Tech")
 * @param {string} language - Language code (optional)
 * @returns {Promise<Array>} Array of jokes
 */
export const getJokesByCategory = async (categoryValue, language = null) => {
  try {
    console.log(`📚 Fetching jokes for category: ${categoryValue}, language: ${language || 'all'}`);
    
    let q;
    
    if (language) {
      // Query with both language and category (array-contains)
      q = query(
        collection(db, 'jokes'),
        where('status', '==', 'published'),
        where('language', '==', language),
        where('categories', 'array-contains', categoryValue)
      );
    } else {
      // Query with just category (array-contains)
      q = query(
        collection(db, 'jokes'),
        where('status', '==', 'published'),
        where('categories', 'array-contains', categoryValue)
      );
    }

    const querySnapshot = await getDocs(q);
    
    const jokes = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Sort by createdAt locally
    jokes.sort((a, b) => {
      const aTime = a.createdAt && typeof a.createdAt.toMillis === 'function' 
        ? a.createdAt.toMillis() 
        : 0;
      const bTime = b.createdAt && typeof b.createdAt.toMillis === 'function' 
        ? b.createdAt.toMillis() 
        : 0;
      return bTime - aTime;
    });

    console.log(`✅ Found ${jokes.length} jokes for category: ${categoryValue}`);
    return jokes;
  } catch (error) {
    console.error('Error fetching jokes by category:', error);
    return [];
  }
};

/**
 * FIXED: Get count of jokes in a category using array-contains
 * 
 * @param {string} categoryValue - Category value (e.g., "General", "Tech")
 * @param {string} language - Language code
 * @returns {Promise<number>} Count of jokes
 */
export const getCategoryCount = async (categoryValue, language) => {
  try {
    console.log(`📊 Counting: categories array-contains "${categoryValue}", language="${language}"`);
    
    const q = query(
      collection(db, 'jokes'),
      where('status', '==', 'published'),
      where('language', '==', language),
      where('categories', 'array-contains', categoryValue)
    );

    const querySnapshot = await getDocs(q);
    const count = querySnapshot.size;
    
    console.log(`✅ Found ${count} jokes for ${categoryValue} (${language})`);
    return count;
  } catch (error) {
    console.error(`❌ Error counting jokes for ${categoryValue}:`, error);
    
    // Fallback: if composite index is missing, try without language filter
    if (error.code === 'failed-precondition' || error.message.includes('index')) {
      console.warn('⚠️ Missing composite index, trying without language filter');
      
      try {
        const q = query(
          collection(db, 'jokes'),
          where('status', '==', 'published'),
          where('categories', 'array-contains', categoryValue)
        );
        
        const querySnapshot = await getDocs(q);
        
        // Filter by language in memory
        let count = 0;
        querySnapshot.forEach((doc) => {
          if (doc.data().language === language) {
            count++;
          }
        });
        
        console.log(`✅ Found ${count} jokes (filtered in memory)`);
        return count;
      } catch (innerError) {
        console.error('❌ Fallback query also failed:', innerError);
        return 0;
      }
    }
    
    return 0;
  }
};

/**
 * OPTIMIZED: Batch get all category counts
 * Fetches all jokes per language once, counts categories in memory
 * Much faster than individual queries per category
 * 
 * @param {Array<string>} categoryValues - Array of category values
 * @param {Array<string>} languages - Array of language codes
 * @returns {Promise<Object>} Object with category counts { 'Tech': 10, 'Work': 5, ... }
 */
export const getBatchCategoryCounts = async (categoryValues, languages) => {
  try {
    console.log('📊 Fetching batch category counts (array-based)');
    console.time('⏱️ Batch category counts');
    
    // Fetch all jokes per language in parallel
    const languagePromises = languages.map(async (language) => {
      const q = query(
        jokesCollection,
        where('status', '==', 'published'),
        where('language', '==', language)
      );
      
      const snapshot = await getDocs(q);
      
      // Count jokes by category in memory
      const counts = {};
      
      snapshot.forEach((doc) => {
        const jokeCategories = doc.data().categories || [];
        
        // A joke can be in multiple categories
        jokeCategories.forEach(cat => {
          counts[cat] = (counts[cat] || 0) + 1;
        });
      });
      
      return counts;
    });
    
    // Execute all language queries in parallel
    const languageResults = await Promise.all(languagePromises);
    
    // Aggregate counts across all languages
    const totalCounts = {};
    
    for (const categoryValue of categoryValues) {
      totalCounts[categoryValue] = 0;
      
      for (const langCounts of languageResults) {
        totalCounts[categoryValue] += langCounts[categoryValue] || 0;
      }
    }
    
    console.timeEnd('⏱️ Batch category counts');
    console.log('✅ Batch counts loaded:', totalCounts);
    
    return totalCounts;
  } catch (error) {
    console.error('❌ Error fetching batch category counts:', error);
    return {};
  }
};

// ============================================================================
// LANGUAGE-BASED RETRIEVAL
// ============================================================================

export const getJokesByLanguage = async (language) => {
  try {
    const q = query(
      jokesCollection,
      where('status', '==', 'published'),
      where('language', '==', language)
    );

    const querySnapshot = await getDocs(q);
    const jokes = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    jokes.sort((a, b) => {
      const aTime = a.createdAt && typeof a.createdAt.toMillis === 'function' 
        ? a.createdAt.toMillis() 
        : 0;
      const bTime = b.createdAt && typeof b.createdAt.toMillis === 'function' 
        ? b.createdAt.toMillis() 
        : 0;
      return bTime - aTime;
    });

    return jokes;
  } catch (error) {
    console.error('Error fetching jokes by language:', error);
    return [];
  }
};

// ============================================================================
// JOKE CREATION
// ============================================================================

/**
 * FIXED: Create a new joke with categories array
 * Expects jokeData.categories to be an array
 * 
 * @param {Object} jokeData - Joke data with categories array
 * @returns {Promise<Object>} Created joke
 */
export const createJoke = async (jokeData) => {
  try {
    // Validate categories array
    if (!Array.isArray(jokeData.categories) || jokeData.categories.length === 0) {
      throw new Error('At least one category is required');
    }

    // Validate required fields
    if (!jokeData.text || jokeData.text.trim().length === 0) {
      throw new Error('Joke text is required');
    }

    if (!jokeData.language) {
      throw new Error('Language is required');
    }

    const newJoke = {
      title: jokeData.title || '',
      text: jokeData.text.trim(),
      language: jokeData.language,
      categories: jokeData.categories, // Array of categories
      author: {
        type: 'user',
        name: jokeData.authorName || 'Anonymous',
        email: jokeData.email || null,
        uid: null
      },
      likes: 0,
      views: 0,
      shares: 0,
      status: 'published',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(jokesCollection, newJoke);
    
    console.log('✅ Joke created successfully with categories:', jokeData.categories);
    
    return {
      id: docRef.id,
      ...newJoke
    };
  } catch (error) {
    console.error('Error creating joke:', error);
    throw error;
  }
};

// ============================================================================
// INTERACTIONS (LIKES, SHARES, VIEWS)
// ============================================================================

export const likeJoke = async (jokeId) => {
  try {
    const jokeDoc = doc(db, 'jokes', jokeId);
    await updateDoc(jokeDoc, {
      likes: increment(1),
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error liking joke:', error);
    throw error;
  }
};

export const trackJokeInteraction = async (jokeId, interactionType = 'view') => {
  try {
    const jokeRef = doc(db, 'jokes', jokeId);
    
    const updates = {
      updatedAt: serverTimestamp()
    };
    
    switch (interactionType) {
      case 'like':
        updates.likes = increment(1);
        break;
      case 'share':
        updates.shares = increment(1);
        break;
      case 'view':
        updates.views = increment(1);
        break;
    }
    
    await updateDoc(jokeRef, updates);
    console.log(`✅ Tracked ${interactionType} for joke ${jokeId}`);
  } catch (error) {
    console.error(`Error tracking ${interactionType}:`, error);
    throw error;
  }
};

// ============================================================================
// FEED FUNCTIONS (PAGINATION)
// ============================================================================

export const getJokesFeed = async (pageSize = 10, lastDoc = null) => {
  try {
    let q = query(
      jokesCollection,
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );

    if (lastDoc) {
      q = query(
        jokesCollection,
        where('status', '==', 'published'),
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),
        limit(pageSize)
      );
    }

    const querySnapshot = await getDocs(q);
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    
    const jokes = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      _doc: doc
    }));

    return {
      jokes,
      lastDoc: lastVisible,
      hasMore: jokes.length === pageSize
    };
  } catch (error) {
    console.error('Error fetching jokes feed:', error);
    return {
      jokes: [],
      lastDoc: null,
      hasMore: false
    };
  }
};

export const getJokesFeedByLanguage = async (language, pageSize = 10, lastDoc = null) => {
  try {
    let q = query(
      jokesCollection,
      where('status', '==', 'published'),
      where('language', '==', language),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );

    if (lastDoc) {
      q = query(
        jokesCollection,
        where('status', '==', 'published'),
        where('language', '==', language),
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),
        limit(pageSize)
      );
    }

    const querySnapshot = await getDocs(q);
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    
    const jokes = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      _doc: doc
    }));

    return {
      jokes,
      lastDoc: lastVisible,
      hasMore: jokes.length === pageSize
    };
  } catch (error) {
    console.error('Error fetching jokes feed by language:', error);
    return {
      jokes: [],
      lastDoc: null,
      hasMore: false
    };
  }
};

export const getJokesFeedByInteraction = async (pageSize = 10, lastDoc = null) => {
  try {
    let q = query(
      jokesCollection,
      where('status', '==', 'published'),
      orderBy('updatedAt', 'desc'),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );

    if (lastDoc) {
      q = query(
        jokesCollection,
        where('status', '==', 'published'),
        orderBy('updatedAt', 'desc'),
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),
        limit(pageSize)
      );
    }

    const querySnapshot = await getDocs(q);
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    
    const jokes = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        _doc: doc,
        sortDate: data.updatedAt || data.createdAt
      };
    });

    return {
      jokes,
      lastDoc: lastVisible,
      hasMore: jokes.length === pageSize
    };
  } catch (error) {
    console.error('Error fetching jokes feed by interaction:', error);
    return {
      jokes: [],
      lastDoc: null,
      hasMore: false
    };
  }
};

export const getJokesFeedByLanguageInteraction = async (language, pageSize = 10, lastDoc = null) => {
  try {
    let q = query(
      jokesCollection,
      where('status', '==', 'published'),
      where('language', '==', language),
      orderBy('updatedAt', 'desc'),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );

    if (lastDoc) {
      q = query(
        jokesCollection,
        where('status', '==', 'published'),
        where('language', '==', language),
        orderBy('updatedAt', 'desc'),
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),
        limit(pageSize)
      );
    }

    const querySnapshot = await getDocs(q);
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    
    const jokes = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        _doc: doc,
        sortDate: data.updatedAt || data.createdAt
      };
    });

    return {
      jokes,
      lastDoc: lastVisible,
      hasMore: jokes.length === pageSize
    };
  } catch (error) {
    console.error('Error fetching jokes feed by language:', error);
    return {
      jokes: [],
      lastDoc: null,
      hasMore: false
    };
  }
};

// ============================================================================
// DEPRECATED / LEGACY SUPPORT
// ============================================================================

/**
 * DEPRECATED: Use getCategoryCount instead
 * Kept for backward compatibility with existing code
 */
export const getCategoryJokesCount = async (category, language) => {
  console.warn('getCategoryJokesCount is deprecated. Use getCategoryCount instead.');
  return getCategoryCount(category, language);
};

/**
 * DEPRECATED: Old categories list
 * Use src/config/categories.js instead
 */
export const getCategories = () => {
  console.warn('getCategories from jokeService is deprecated. Use src/config/categories.js instead.');
  return [
    { slug: 'General', name: 'General', icon: '😄' },
    { slug: 'Relationships', name: 'Relationships', icon: '💑' },
    { slug: 'Family', name: 'Family', icon: '👨‍👩‍👧‍👦' },
    { slug: 'Work', name: 'Work', icon: '💼' },
    { slug: 'School', name: 'School', icon: '🎓' },
    { slug: 'Friends', name: 'Friends', icon: '👥' },
    { slug: 'Adult', name: 'Adult', icon: '🔞' },
    { slug: 'Animals', name: 'Animals', icon: '🐶' },
    { slug: 'Food', name: 'Food', icon: '🍕' },
    { slug: 'Tech', name: 'Tech', icon: '💻' },
    { slug: 'Sports', name: 'Sports', icon: '⚽' },
    { slug: 'Old People', name: 'Old People', icon: '👴' },
    { slug: 'Women', name: 'Women', icon: '👩' },
    { slug: 'Men', name: 'Men', icon: '👨' }
  ];
};

// ============================================================================
// CACHING (OPTIONAL PERFORMANCE ENHANCEMENT)
// ============================================================================

const categoryCountCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * OPTIONAL: Get category count with in-memory caching
 * Cache expires after 5 minutes
 */
export const getCategoryCountCached = async (categoryValue, language) => {
  const cacheKey = `${categoryValue}-${language}`;
  const cached = categoryCountCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log('📦 Using cached count for:', cacheKey);
    return cached.count;
  }
  
  const count = await getCategoryCount(categoryValue, language);
  
  categoryCountCache.set(cacheKey, {
    count,
    timestamp: Date.now()
  });
  
  return count;
};

/**
 * Clear the category count cache
 * Call this when a new joke is submitted
 */
export const clearCategoryCountCache = () => {
  categoryCountCache.clear();
  console.log('🗑️ Category count cache cleared');
};