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
    description: 'Enjoy the best funny jokes of all kinds, from classic humor to trending jokes loved by everyone.'
  },
  {
    value: 'Relationships',
    label: 'Relationships',
    slug: 'relationships',
    icon: 'bi-heart',
    color: 'danger',
    description: 'Funny relationship jokes about love, dating, couples, and the ups and downs of romantic life.'
  },
  {
    value: 'Family',
    label: 'Family',
    slug: 'family',
    icon: 'bi-people',
    color: 'success',
    description: 'Relatable family jokes about parents, kids, marriage, and everyday family life moments.'
  },
  {
    value: 'Work',
    label: 'Work',
    slug: 'work',
    icon: 'bi-briefcase',
    color: 'primary',
    description: 'Hilarious work jokes about office life, coworkers, bosses, meetings, and workplace struggles.'
  },
  {
    value: 'School',
    label: 'School',
    slug: 'school',
    icon: 'bi-mortarboard',
    color: 'warning',
    description: 'Funny school jokes about students, teachers, exams, homework, and classroom life.'
  },
  {
    value: 'Friends',
    label: 'Friends',
    slug: 'friends',
    icon: 'bi-person-hearts',
    color: 'info',
    description: 'Laugh with funny friends jokes about friendship, social life, best friends, and shared memories.'
  },
  {
    value: 'Adult',
    label: 'Adult',
    slug: 'adult',
    icon: 'bi-shield-exclamation',
    color: 'dark',
    description: 'Adult humor jokes for mature audiences, featuring bold, edgy, and uncensored comedy.'
  },
  {
    value: 'Animals',
    label: 'Animals',
    slug: 'animals',
    icon: 'bi-bug',
    color: 'warning',
    description: 'Cute and funny animal jokes about pets, dogs, cats, and hilarious animal behavior.'
  },
  {
    value: 'Food',
    label: 'Food',
    slug: 'food',
    icon: 'bi-cup-hot',
    color: 'danger',
    description: 'Delicious food jokes about cooking, eating, restaurants, snacks, and foodie life.'
  },
  {
    value: 'Tech',
    label: 'Tech',
    slug: 'tech',
    icon: 'bi-code-slash',
    color: 'primary',
    description: 'Tech jokes about programming, developers, coding bugs, computers, and modern technology.'
  },
  {
    value: 'Sports',
    label: 'Sports',
    slug: 'sports',
    icon: 'bi-trophy',
    color: 'success',
    description: 'Funny sports jokes about football, fitness, athletes, competitions, and sports fans.'
  },
  {
    value: 'Old People',
    label: 'Old People',
    slug: 'old-people',
    icon: 'bi-clock-history',
    color: 'secondary',
    description: 'Lighthearted jokes about aging, seniors, retirement, and funny moments of getting older.'
  },
  {
    value: 'Women',
    label: 'Women',
    slug: 'women',
    icon: 'bi-person-standing-dress',
    color: 'danger',
    description: 'Humorous jokes inspired by women, daily life situations, and modern lifestyle humor.'
  },
  {
    value: 'Men',
    label: 'Men',
    slug: 'men',
    icon: 'bi-person-standing',
    color: 'primary',
    description: 'Funny jokes about men, everyday struggles, relationships, and modern man life.'
  },
  {
    value: 'Kids',
    label: 'Kids',
    slug: 'kids',
    icon: 'bi-emoji-smile',
    color: 'success',
    description: 'Fun, clean, and family-friendly kids jokes perfect for children, parents, and all ages.'
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