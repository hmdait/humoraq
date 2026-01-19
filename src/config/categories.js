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
    icon: '😄',
    color: 'info',
    description: 'General humor for everyone'
  },
  { 
    value: 'Relationships', 
    label: 'Relationships', 
    slug: 'relationships',
    icon: '💑',
    color: 'danger',
    description: 'Love, dating, and relationship humor'
  },
  { 
    value: 'Family', 
    label: 'Family', 
    slug: 'family',
    icon: '👨‍👩‍👧‍👦',
    color: 'success',
    description: 'Family life and parenting jokes'
  },
  { 
    value: 'Work', 
    label: 'Work', 
    slug: 'work',
    icon: '💼',
    color: 'primary',
    description: 'Office and workplace humor'
  },
  { 
    value: 'School', 
    label: 'School', 
    slug: 'school',
    icon: '🎓',
    color: 'warning',
    description: 'Education and student life'
  },
  { 
    value: 'Friends', 
    label: 'Friends', 
    slug: 'friends',
    icon: '👥',
    color: 'info',
    description: 'Friendship and social humor'
  },
  { 
    value: 'Adult', 
    label: 'Adult', 
    slug: 'adult',
    icon: '🔞',
    color: 'dark',
    description: 'Mature audience humor'
  },
  { 
    value: 'Animals', 
    label: 'Animals', 
    slug: 'animals',
    icon: '🐶',
    color: 'warning',
    description: 'Pets and animal jokes'
  },
  { 
    value: 'Food', 
    label: 'Food', 
    slug: 'food',
    icon: '🍕',
    color: 'danger',
    description: 'Cooking and dining humor'
  },
  { 
    value: 'Tech', 
    label: 'Tech', 
    slug: 'tech',
    icon: '💻',
    color: 'primary',
    description: 'Technology and programming jokes'
  },
  { 
    value: 'Sports', 
    label: 'Sports', 
    slug: 'sports',
    icon: '⚽',
    color: 'success',
    description: 'Sports and fitness humor'
  },
  { 
    value: 'Old People', 
    label: 'Old People', 
    slug: 'old-people',
    icon: '👴',
    color: 'secondary',
    description: 'Senior and aging humor'
  },
  { 
    value: 'Women', 
    label: 'Women', 
    slug: 'women',
    icon: '♀️',
    color: 'danger',
    description: 'Women-related humor'
  },
  { 
    value: 'Men', 
    label: 'Men', 
    slug: 'men',
    icon: '♂️',
    color: 'primary',
    description: 'Men-related humor'
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
 * @returns {string} Category icon emoji
 */
export const getCategoryIcon = (value) => {
  const category = getCategoryByValue(value);
  return category ? category.icon : '📁';
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