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
    title: '+100 Hilarious All-Purpose Jokes That Work for Any Occasion',    
    description: 'Discover the funniest jokes of all time! Our collection features trending jokes, classic humor, and popular one-liners that everyone loves to share. Perfect for any occasion.'
  },
  {
    value: 'Relationships',
    label: 'Relationships',
    slug: 'relationships',
    icon: 'bi-heart',
    color: 'danger',
    title: 'The best 10 Funny Relationship Jokes That Will Make Your Partner Laugh',
    description: 'Hilarious dating jokes, funny couple humor, and romantic comedy one-liners. Perfect for sharing with your partner, friends, or on date nights. Love jokes that make everyone smile!'
  },
  {
    value: 'Family',
    label: 'Family',
    slug: 'family',
    icon: 'bi-people',
    color: 'success',
    title: '100 Relatable Family Jokes Perfect for Dinner Table Laughs',
    description: 'Relatable family jokes about parents, kids, marriage, siblings, and home life. Clean family-friendly humor perfect for sharing at dinner tables and family gatherings.'
  },
  {
    value: 'Work',
    label: 'Work',
    slug: 'work',
    icon: 'bi-briefcase',
    color: 'primary',
    title: 'Top 10 Office Jokes to Survive Your 9-to-5 with Laughter',
    description: 'Office jokes, funny work stories, boss humor, and coworker comedy. Perfect for Monday motivation, team meetings, or surviving the 9-to-5 grind with laughter.'
  },
  {
    value: 'School',
    label: 'School',
    slug: 'school',
    icon: 'bi-mortarboard',
    color: 'warning',
    title: '100 Classroom Jokes Every Student and Teacher Will Love',
    description: 'Funny classroom jokes, student humor, teacher comedy, and exam jokes. Great for students, educators, and anyone who remembers their school days with a smile.'
  },
  {
    value: 'Friends',
    label: 'Friends',
    slug: 'friends',
    icon: 'bi-person-hearts',
    color: 'info',
    title: '100 Friend Jokes Perfect for Sharing with Your Squad',
    description: 'Best friend jokes, social life humor, friend group comedy, and hilarious memories. Perfect for sharing with your squad or posting on social media.'
  },
  {
    value: 'Adult',
    label: 'Adult',
    slug: 'adult',
    icon: 'bi-shield-exclamation',
    color: 'dark',
    title: 'More than 100 Adult Jokes for Mature Audiences and Grown-Up Laughs',
    description: 'Mature jokes, edgy humor, and uncensored comedy for adults only. Bold jokes perfect for parties, nights out, and grown-up laughter sessions.'
  },
  {
    value: 'Animals',
    label: 'Animals',
    slug: 'animals',
    icon: 'bi-bug',
    color: 'warning',
    title: '+20 Animal Jokes That Every Pet Owner Will Find Hilarious',
    description: 'Funny pet jokes, hilarious animal stories, dog and cat humor, and wildlife comedy. Perfect for animal lovers, pet owners, and anyone who enjoys creature comedy.'
  },
  {
    value: 'Food',
    label: 'Food',
    slug: 'food',
    icon: 'bi-cup-hot',
    color: 'danger',
    title: '100 Food Jokes to Spice Up Your Meal Times with Laughter',
    description: 'Delicious food jokes, cooking humor, restaurant comedy, and foodie laughs. From kitchen disasters to restaurant fails, we serve up the best food comedy.'
  },
  {
    value: 'Tech',
    label: 'Tech',
    slug: 'tech',
    icon: 'bi-code-slash',
    color: 'primary',
    title: '100 Tech Jokes That Only Programmers Will Truly Understand',
    description: 'Programming jokes, developer humor, computer comedy, and tech meme laughs. Perfect for coders, IT professionals, and anyone who speaks geek.'
  },
  {
    value: 'Sports',
    label: 'Sports',
    slug: 'sports',
    icon: 'bi-trophy',
    color: 'success',
    title: 'Top 100 Sports Jokes That Score Big with Fans and Athletes',
    description: 'Football jokes, fitness humor, athlete comedy, and sports fan laughs. Whether you play or watch, these jokes score big on the humor field.'
  },
  {
    value: 'Old People',
    label: 'Old People',
    slug: 'old-people',
    icon: 'bi-clock-history',
    color: 'secondary',
    title: '100 Senior Jokes About Aging with Humor and Grace',
    description: 'Funny aging jokes, senior citizen humor, retirement comedy, and golden years laughs. Lighthearted jokes about getting older with grace and humor.'
  },
  {
    value: 'Women',
    label: 'Women',
    slug: 'women',
    icon: 'bi-person-standing-dress',
    color: 'danger',
    title: 'The best 10 Women Jokes About Modern Life and Everyday Situations',
    description: 'Women\'s lifestyle jokes, female humor, daily life comedy, and girl power laughs. Relatable jokes about modern womanhood, friendships, and life.'
  },
  {
    value: 'Men',
    label: 'Men',
    slug: 'men',
    icon: 'bi-person-standing',
    color: 'primary',
    title: '100+ Men Jokes About Guy Stuff and Everyday Man Life',
    description: 'Men\'s lifestyle jokes, guy humor, male bonding comedy, and everyday man laughs. From relationships to hobbies, jokes that speak to the modern man.'
  },
  {
    value: 'Kids',
    label: 'Kids',
    slug: 'kids',
    icon: 'bi-emoji-smile',
    color: 'success',
    title: '18 Clean Kids Jokes Perfect for Children and Parents',
    description: 'Clean kids jokes, children\'s humor, family-friendly comedy, and school-appropriate laughs. Perfect for parents, teachers, and children of all ages.'
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