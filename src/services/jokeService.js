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
      
      // Check if user has already viewed this joke
      const viewedJokes = JSON.parse(localStorage.getItem('viewedJokes') || '[]');
      const hasViewed = viewedJokes.includes(id);
      
      // Only increment if not viewed before
      if (!hasViewed) {
        // Increment views and update updatedAt timestamp in background
        updateDoc(jokeDoc, {
          views: increment(1),
          updatedAt: serverTimestamp() // Track interaction
        }).catch(error => {
          console.error('Error incrementing views:', error);
        });
        
        // Mark as viewed
        viewedJokes.push(id);
        localStorage.setItem('viewedJokes', JSON.stringify(viewedJokes));
        
        // Return with incremented view count
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
    let q = query(jokesCollection, where('status', '==', 'published'));

    if (filters.language) {
      q = query(q, where('language', '==', filters.language));
    }

    if (filters.category) {
      q = query(q, where('category', '==', filters.category));
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
    
    // Check if user has already viewed this joke
    const viewedJokes = JSON.parse(localStorage.getItem('viewedJokes') || '[]');
    const hasViewed = viewedJokes.includes(selectedJoke.id);
    
    // Only increment if not viewed before
    if (!hasViewed) {
      const jokeDoc = doc(db, 'jokes', selectedJoke.id);
      
      // Increment views and update updatedAt in background
      updateDoc(jokeDoc, {
        views: increment(1),
        updatedAt: serverTimestamp() // Track interaction
      }).catch(error => {
        console.error('Error incrementing views:', error);
      });
      
      // Mark as viewed
      viewedJokes.push(selectedJoke.id);
      localStorage.setItem('viewedJokes', JSON.stringify(viewedJokes));
      
      // Return with incremented view count
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

export const getJokesByCategory = async (category, language = null) => {
  try {
    let q = query(
      jokesCollection,
      where('status', '==', 'published'),
      where('category', '==', category)
    );

    if (language) {
      q = query(q, where('language', '==', language));
    }

    const querySnapshot = await getDocs(q);
    
    const jokes = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Sort by createdAt locally with proper null/undefined handling
    jokes.sort((a, b) => {
      // Handle missing or invalid createdAt
      const aTime = a.createdAt && typeof a.createdAt.toMillis === 'function' 
        ? a.createdAt.toMillis() 
        : 0;
      const bTime = b.createdAt && typeof b.createdAt.toMillis === 'function' 
        ? b.createdAt.toMillis() 
        : 0;
      return bTime - aTime; // Descending order (newest first)
    });

    return jokes;
  } catch (error) {
    console.error('Error fetching jokes by category:', error);
    return [];
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

    // Sort by createdAt locally with proper null/undefined handling
    jokes.sort((a, b) => {
      const aTime = a.createdAt && typeof a.createdAt.toMillis === 'function' 
        ? a.createdAt.toMillis() 
        : 0;
      const bTime = b.createdAt && typeof b.createdAt.toMillis === 'function' 
        ? b.createdAt.toMillis() 
        : 0;
      return bTime - aTime; // Descending order
    });

    return jokes;
  } catch (error) {
    console.error('Error fetching jokes by language:', error);
    return [];
  }
};

export const getCategoryCount = async (categorySlug, language) => {
  try {
    const q = query(
      jokesCollection,
      where('status', '==', 'published'),
      where('category', '==', categorySlug),
      where('language', '==', language)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error('Error counting jokes:', error);
    return 0;
  }
};

/**
 * Like a joke and update updatedAt timestamp
 * @param {string} jokeId - The joke ID
 * @returns {Promise<boolean>}
 */
export const likeJoke = async (jokeId) => {
  try {
    const jokeDoc = doc(db, 'jokes', jokeId);
    await updateDoc(jokeDoc, {
      likes: increment(1),
      updatedAt: serverTimestamp() // Track interaction
    });
    return true;
  } catch (error) {
    console.error('Error liking joke:', error);
    throw error;
  }
};

/**
 * Track joke interaction and update updatedAt timestamp
 * @param {string} jokeId - The joke ID
 * @param {string} interactionType - Type of interaction (like, share, view)
 * @returns {Promise<void>}
 */
export const trackJokeInteraction = async (jokeId, interactionType = 'view') => {
  try {
    const jokeRef = doc(db, 'jokes', jokeId);
    
    const updates = {
      updatedAt: serverTimestamp() // Always update the interaction timestamp
    };
    
    // Increment counters based on interaction type
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

export const createJoke = async (jokeData) => {
  try {
    const newJoke = {
      title: jokeData.title || '',
      text: jokeData.text,
      language: jokeData.language,
      category: jokeData.category,
      author: {
        type: 'user',
        name: jokeData.authorName || 'Anonymous',
        email: jokeData.email || null, // Store email (null if not provided)
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
    return {
      id: docRef.id,
      ...newJoke
    };
  } catch (error) {
    console.error('Error creating joke:', error);
    throw error;
  }
};

export const getCategories = () => {
  return [
    { slug: 'general', name: 'General', icon: '😄' },
    { slug: 'tech', name: 'Tech', icon: '💻' },
    { slug: 'work', name: 'Work', icon: '💼' },
    { slug: 'animals', name: 'Animals', icon: '🐶' },
    { slug: 'food', name: 'Food', icon: '🍕' }
  ];
};

// Fetch jokes feed with pagination (sorted by createdAt)
export const getJokesFeed = async (pageSize = 10, lastDoc = null) => {
  try {
    let q = query(
      jokesCollection,
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );

    // If lastDoc is provided, start after it (pagination)
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
    
    // Get the last document for pagination
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    
    const jokes = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      _doc: doc // Store the document reference for pagination
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

// Fetch jokes feed filtered by language (sorted by createdAt)
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

/**
 * NEW: Fetch jokes feed ordered by updatedAt (most recently interacted)
 * Falls back to createdAt if updatedAt doesn't exist
 * @param {number} pageSize - Number of jokes per page
 * @param {object} lastDoc - Last document for pagination
 * @returns {Promise<{jokes: Array, lastDoc: object, hasMore: boolean}>}
 */
export const getJokesFeedByInteraction = async (pageSize = 10, lastDoc = null) => {
  try {
    let q = query(
      jokesCollection,
      where('status', '==', 'published'),
      orderBy('updatedAt', 'desc'), // Order by most recently interacted
      orderBy('createdAt', 'desc'), // Secondary sort by creation
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
        // Fallback to createdAt if updatedAt doesn't exist
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

/**
 * NEW: Fetch jokes feed by language ordered by updatedAt
 * @param {string} language - Language code (en, fr, ar)
 * @param {number} pageSize - Number of jokes per page
 * @param {object} lastDoc - Last document for pagination
 * @returns {Promise<{jokes: Array, lastDoc: object, hasMore: boolean}>}
 */
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