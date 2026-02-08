// src/config/categories.js
// SINGLE SOURCE OF TRUTH for all categories across the app

/**
 * Master categories configuration
 * Used by: submit/, category/, videos/, and all components
 */
export const CATEGORIES = [
  {
    value: 'General',
    label: 'General',
    slug: 'general',  
    icon: 'bi-chat-square-text',
    color: 'info',
    title: '100+ General Jokes to Make Anyone Laugh Out Loud',    
    description: 'Discover the funniest general jokes, trending one-liners, and classic humor that everyone loves. Perfect for any occasion, these jokes are great for sharing laughs with friends and family.'
  },
  {
    value: 'Relationships',
    label: 'Relationships',
    slug: 'relationships',  
    icon: 'bi-heart',
    color: 'danger',
    title: 'Top 20 Funny Relationship Jokes That Will Make Your Partner Laugh',
    description: 'Hilarious dating jokes, couple humor, romantic one-liners, and love comedy. Perfect for sharing with your partner, friends, or on date nights to spark laughter and joy.'
  },
  {
    value: 'Family',
    label: 'Family',
    slug: 'family',  
    icon: 'bi-people',
    color: 'success',
    title: '100 Family Jokes Everyone Will Relate To',
    description: 'Relatable jokes about parents, kids, siblings, marriage, and home life. Clean, family-friendly humor that brings laughter to dinner tables, family gatherings, and everyday moments.'
  },
  {
    value: 'Work',
    label: 'Work',
    slug: 'work',  
    icon: 'bi-briefcase',
    color: 'primary',
    title: 'Top 20 Office Jokes to Survive Your 9-to-5 with Laughter',
    description: 'Office humor, funny work stories, coworker jokes, and boss comedy. Ideal for Monday motivation, team meetings, or sharing laughs during the workday.'
  },
  {
    value: 'School',
    label: 'School',
    slug: 'school',  
    icon: 'bi-mortarboard',
    color: 'warning',
    title: '100 School Jokes Every Student and Teacher Will Love',
    description: 'Classroom humor, student jokes, teacher comedy, and exam laughs. Perfect for students, educators, and anyone who wants to relive school days with a smile.'
  },
  {
    value: 'Friends',
    label: 'Friends',
    slug: 'friends',  
    icon: 'bi-person-hearts',
    color: 'info',
    title: '100 Friend Jokes Perfect for Sharing with Your Squad',
    description: 'Best friend jokes, social life humor, friend group comedy, and funny memories. Share with your squad or post on social media for guaranteed laughs.'
  },
  {
    value: 'Adult',
    label: 'Adult',
    slug: 'adult',  
    icon: 'bi-shield-exclamation',
    color: 'dark',
    title: '100+ Adult Jokes for Mature Audiences and Grown-Up Laughs',
    description: 'Mature humor, edgy jokes, uncensored comedy, and risqué stories. Perfect for adult parties, nights out, or sharing laughs with friends who enjoy bold humor.'
  },
  {
    value: 'Animals',
    label: 'Animals',
    slug: 'animals',  
    icon: 'bi-bug',
    color: 'warning',
    title: '20+ Hilarious Animal Jokes Every Pet Owner Will Love',
    description: 'Funny pet jokes, dog and cat humor, wildlife comedy, and hilarious animal stories. Perfect for animal lovers and anyone who enjoys creature comedy.'
  },
  {
    value: 'Food',
    label: 'Food',
    slug: 'food',  
    icon: 'bi-cup-hot',
    color: 'danger',
    title: '100 Food Jokes to Spice Up Your Meal Times with Laughter',
    description: 'Delicious food jokes, kitchen humor, restaurant fails, and foodie comedy. From cooking disasters to restaurant stories, enjoy tasty laughs for all food lovers.'
  },
  {
    value: 'Tech',
    label: 'Tech',
    slug: 'tech',  
    icon: 'bi-code-slash',
    color: 'primary',
    title: '100 Tech Jokes Only Programmers and Geek Fans Will Get',
    description: 'Programming jokes, developer humor, tech memes, and computer comedy. Perfect for coders, IT professionals, and anyone fluent in geek culture.'
  },
  {
    value: 'Sports',
    label: 'Sports',
    slug: 'sports',  
    icon: 'bi-trophy',
    color: 'success',
    title: '100 Sports Jokes That Score Big with Fans and Athletes',
    description: 'Football, basketball, fitness humor, athlete jokes, and sports fan comedy. Whether you play or watch, enjoy hilarious sports-themed laughs.'
  },
  {
    value: 'Old People',
    label: 'Old People',
    slug: 'senior',  
    icon: 'bi-clock-history',
    color: 'secondary',
    title: '100 Senior Jokes About Aging with Humor and Grace',
    description: 'Funny aging jokes, senior humor, retirement comedy, and golden years laughs. Lighthearted jokes about getting older while keeping a sense of humor.'
  },
  {
    value: 'Women',
    label: 'Women',
    slug: 'women',  
    icon: 'bi-person-standing-dress',
    color: 'danger',
    title: 'Top 20 Women Jokes About Modern Life and Everyday Situations',
    description: 'Women lifestyle jokes, female humor, daily life comedy, and girl power laughs. Relatable jokes about friendships, work, and life as a modern woman.'
  },
  {
    value: 'Men',
    label: 'Men',
    slug: 'men', 
    icon: 'bi-person-standing',
    color: 'primary',
    title: '100+ Men Jokes About Guy Stuff and Everyday Life',
    description: 'Men lifestyle jokes, guy humor, male bonding comedy, and everyday life laughs. From relationships to hobbies, enjoy jokes that resonate with modern men.'
  },
  {
    value: 'Kids',
    label: 'Kids',
    slug: 'kids', 
    icon: 'bi-emoji-smile',
    color: 'success',
    title: '20+ Clean Kids Jokes Perfect for Children and Parents',
    description: 'Clean jokes for kids, children humor, family-friendly comedy, and school-appropriate laughs. Perfect for parents, teachers, and kids of all ages.'
  }
];



/**
 * Get all categories
 * @returns {Array} Array of category objects
 */
export const getAllCategories = () => {
  return CATEGORIES;
};

/**
 * Get category by value (for Firestore queries)
 * @param {string} value - Category value (e.g., "Tech")
 * @returns {Object|null} Category object or null
 */
export const getCategoryByValue = (value) => {
  return CATEGORIES.find(cat => cat.value === value) || null;
};

/**
 * Get category by slug (for URL routing)
 * @param {string} slug - Category slug (e.g., "tech")
 * @returns {Object|null} Category object or null
 */
export const getCategoryBySlug = (slug) => {
  return CATEGORIES.find(cat => cat.slug === slug.toLowerCase()) || null;
};

/**
 * Get category label from value
 * @param {string} value - Category value
 * @returns {string} Category label or value as fallback
 */
export const getCategoryLabel = (value) => {
  const category = getCategoryByValue(value);
  return category ? category.label : value;
};

/**
 * Get category icon from value
 * @param {string} value - Category value
 * @returns {string} Bootstrap icon class
 */
export const getCategoryIcon = (value) => {
  const category = getCategoryByValue(value);
  return category ? category.icon : 'bi-folder';
};

/**
 * Get category color from value (for Bootstrap badges)
 * @param {string} value - Category value
 * @returns {string} Bootstrap color class
 */
export const getCategoryColor = (value) => {
  const category = getCategoryByValue(value);
  return category ? category.color : 'secondary';
};

/**
 * Get category description from value
 * @param {string} value - Category value
 * @returns {string} Category description
 */
export const getCategoryDescription = (value) => {
  const category = getCategoryByValue(value);
  return category ? category.description : '';
};

/**
 * Get category title from value
 * @param {string} value - Category value
 * @returns {string} Category title
 */
export const getCategoryTitle = (value) => {
  const category = getCategoryByValue(value);
  return category ? category.title : '';
};

/**
 * Validate if a category value exists
 * @param {string} value - Category value to validate
 * @returns {boolean} True if category exists
 */
export const isValidCategory = (value) => {
  return CATEGORIES.some(cat => cat.value === value);
};

/**
 * Validate if a category slug exists
 * @param {string} slug - Category slug to validate
 * @returns {boolean} True if category exists
 */
export const isValidCategorySlug = (slug) => {
  return CATEGORIES.some(cat => cat.slug === slug.toLowerCase());
};

/**
 * Convert slug to value (for Firestore queries)
 * @param {string} slug - Category slug
 * @returns {string|null} Category value or null
 */
export const slugToValue = (slug) => {
  const category = getCategoryBySlug(slug);
  return category ? category.value : null;
};

/**
 * Convert value to slug (for URLs)
 * @param {string} value - Category value
 * @returns {string|null} Category slug or null
 */
export const valueToSlug = (value) => {
  const category = getCategoryByValue(value);
  return category ? category.slug : null;
};

/**
 * Get categories formatted for select/dropdown
 * @returns {Array} Array of {value, label} objects
 */
export const getCategoriesForSelect = () => {
  return CATEGORIES.map(cat => ({
    value: cat.value,
    label: cat.label,
    icon: cat.icon
  }));
};

/**
 * Get categories formatted for display (with icons)
 * @returns {Array} Array of category display objects
 */
export const getCategoriesForDisplay = () => {
  return CATEGORIES.map(cat => ({
    value: cat.value,
    label: cat.label,
    icon: cat.icon,
    color: cat.color
  }));
};

/**
 * Get all category values (for validation)
 * @returns {Array<string>} Array of category values
 */
export const getAllCategoryValues = () => {
  return CATEGORIES.map(cat => cat.value);
};

/**
 * Get all category slugs (for routing)
 * @returns {Array<string>} Array of category slugs
 */
export const getAllCategorySlugs = () => {
  return CATEGORIES.map(cat => cat.slug);
};

// Export as default for convenience
export default {
  CATEGORIES,
  getAllCategories,
  getCategoryByValue,
  getCategoryBySlug,
  getCategoryLabel,
  getCategoryIcon,
  getCategoryColor,
  getCategoryDescription,
  isValidCategory,
  isValidCategorySlug,
  slugToValue,
  valueToSlug,
  getCategoriesForSelect,
  getCategoriesForDisplay,
  getAllCategoryValues,
  getAllCategorySlugs
};