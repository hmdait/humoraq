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

// ... (keep existing getAllJokes, getJokeById, getRandomJoke functions) ...

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

    // UPDATED: Use array-contains if category filter provided
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
    
    // View tracking logic (keep your existing code here)
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

/**
 * UPDATED: Get jokes by category (supports categories array)
 * Fetches all jokes and filters client-side where category is in categories array
 */
export const getJokesByCategory = async (category, language = null) => {
  try {
    let q;
    
    if (language) {
      // Query with both language and category
      q = query(
        collection(db, 'jokes'),
        where('status', '==', 'published'),
        where('language', '==', language),
        where('categories', 'array-contains', category)
      );
    } else {
      // Query with just category
      q = query(
        collection(db, 'jokes'),
        where('status', '==', 'published'),
        where('categories', 'array-contains', category)
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

    console.log(`Found ${jokes.length} jokes for category: ${category}, language: ${language || 'all'}`);
    return jokes;
  } catch (error) {
    console.error('Error fetching jokes by category:', error);
    return [];
  }
};

/**
 * NEW: Get count of jokes in a category
 * Counts jokes where the category appears in the categories array
 */
export const getCategoryJokesCount = async (category, language) => {
  try {
    const q = query(
      collection(db, 'jokes'),
      where('status', '==', 'published'),
      where('language', '==', language),
      where('categories', 'array-contains', category)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error('Error counting jokes:', error);
    return 0;
  }
};

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

/**
 * DEPRECATED: Old function - kept for backward compatibility
 * Use getCategoryJokesCount instead
 */
export const getCategoryCount = async (categorySlug, language) => {
  console.warn('getCategoryCount is deprecated. Use getCategoryJokesCount instead.');
  return getCategoryJokesCount(categorySlug, language);
};

/**
 * UPDATED: Create a new joke with categories array
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
      categories: jokeData.categories, // CHANGED: Array of categories
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

    // IMPORTANT: Do NOT include 'category' field

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

/**
 * UPDATED: Get categories list
 */
export const getCategories = () => {
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

// Feed functions (keep existing implementations)
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