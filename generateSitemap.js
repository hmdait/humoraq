const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(require('./serviceAccountKey.json'))
});

const db = admin.firestore();
const BASE_URL = 'https://humoraq.com';
const OUTPUT_PATH = path.join(__dirname, 'public', 'sitemap.xml');

// Categories configuration (matching src/config/categories.js)
const CATEGORIES = [
  { slug: 'general', value: 'General' },
  { slug: 'relationships', value: 'Relationships' },
  { slug: 'family', value: 'Family' },
  { slug: 'work', value: 'Work' },
  { slug: 'school', value: 'School' },
  { slug: 'friends', value: 'Friends' },
  { slug: 'adult', value: 'Adult' },
  { slug: 'animals', value: 'Animals' },
  { slug: 'food', value: 'Food' },
  { slug: 'tech', value: 'Tech' },
  { slug: 'sports', value: 'Sports' },
  { slug: 'old-people', value: 'Old People' },
  { slug: 'women', value: 'Women' },
  { slug: 'men', value: 'Men' }
];

// Comedians configuration (matching src/data/comedians.js)
const COMEDIANS = [
  { slug: 'eddie-murphy', name: 'Eddie Murphy' },
  { slug: 'charlie-chaplin', name: 'Charlie Chaplin' },
  { slug: 'jim-carrey', name: 'Jim Carrey' },
  { slug: 'robin-williams', name: 'Robin Williams' },
  { slug: 'lucille-ball', name: 'Lucille Ball' },
  { slug: 'richard-pryor', name: 'Richard Pryor' },
  { slug: 'george-carlin', name: 'George Carlin' },
  { slug: 'whoopi-goldberg', name: 'Whoopi Goldberg' },
  { slug: 'steve-martin', name: 'Steve Martin' },
  { slug: 'chris-rock', name: 'Chris Rock' }
];

// Static routes configuration
const staticRoutes = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/feed', changefreq: 'hourly', priority: '0.9' },
  { path: '/spotlight', changefreq: 'daily', priority: '0.8' },
  { path: '/videos', changefreq: 'daily', priority: '0.8' },
  { path: '/blogs', changefreq: 'weekly', priority: '0.8' }, // NEW: Blog home
  { path: '/categories', changefreq: 'weekly', priority: '0.7' },
  { path: '/submit', changefreq: 'monthly', priority: '0.5' },
  { path: '/about', changefreq: 'monthly', priority: '0.4' },
  { path: '/legal', changefreq: 'monthly', priority: '0.3' }
];

/**
 * Get category slug from category value
 */
function getCategorySlug(categoryValue) {
  const category = CATEGORIES.find(function(cat) {
    return cat.value === categoryValue;
  });
  return category ? category.slug : 'general';
}

/**
 * Slugify text for URL (same logic as frontend)
 */
function slugify(text, maxLength) {
  if (!text) return 'untitled';
  if (maxLength === undefined) maxLength = 60;

  let slug = text
    .toString()
    .toLowerCase()
    .trim();

  // Replace French accented characters
  const replacements = {
    'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a',
    'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e',
    'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',
    'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o',
    'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u',
    'ý': 'y', 'ÿ': 'y',
    'ñ': 'n', 'ç': 'c',
    'œ': 'oe', 'æ': 'ae'
  };

  Object.keys(replacements).forEach(function(char) {
    slug = slug.replace(new RegExp(char, 'g'), replacements[char]);
  });

  // Remove emojis and special characters
  slug = slug.replace(/[^\w\s-]/g, ' ');
  slug = slug.replace(/[\s_-]+/g, '-');
  slug = slug.replace(/^-+|-+$/g, '');

  // Truncate to max length at word boundary
  if (slug.length > maxLength) {
    slug = slug.substring(0, maxLength);
    const lastHyphen = slug.lastIndexOf('-');
    if (lastHyphen > maxLength * 0.7) {
      slug = slug.substring(0, lastHyphen);
    }
  }

  slug = slug.replace(/-+$/g, '');

  return slug || 'untitled';
}

/**
 * Generate joke slug from title or text
 */
function generateJokeSlug(joke) {
  if (!joke) return 'untitled';

  // Use title if available
  if (joke.title && joke.title.trim()) {
    return slugify(joke.title);
  }

  // Fallback to first 80 characters of joke text
  if (joke.text && joke.text.trim()) {
    const preview = joke.text.substring(0, 80).trim();
    return slugify(preview);
  }

  return 'untitled';
}

/**
 * Format date to ISO 8601 format (YYYY-MM-DD)
 */
function formatDate(timestamp) {
  if (!timestamp) return new Date().toISOString().split('T')[0];
  
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toISOString().split('T')[0];
}

/**
 * Generate XML for a single URL entry
 */
function generateUrlEntry(loc, lastmod, changefreq, priority) {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

/**
 * Fetch all jokes from Firestore
 */
async function fetchAllJokes() {
  try {
    const jokesSnapshot = await db.collection('jokes')
      .where('status', '==', 'published')
      .get();
    
    const jokes = [];
    
    jokesSnapshot.forEach(function(doc) {
      const data = doc.data();
      jokes.push({
        id: doc.id,
        title: data.title,
        text: data.text,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        language: data.language,
        categories: data.categories || (data.category ? [data.category] : ['General'])
      });
    });
    
    console.log('✅ Fetched ' + jokes.length + ' jokes from Firestore');
    return jokes;
  } catch (error) {
    console.error('❌ Error fetching jokes:', error);
    throw error;
  }
}

/**
 * Fetch all videos from Firestore
 */
async function fetchAllVideos() {
  try {
    const videosSnapshot = await db.collection('videos').get();
    const videos = [];
    
    videosSnapshot.forEach(function(doc) {
      const data = doc.data();
      videos.push({
        id: doc.id,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      });
    });
    
    console.log('✅ Fetched ' + videos.length + ' videos from Firestore');
    return videos;
  } catch (error) {
    console.error('Warning: Error fetching videos (collection may not exist):', error.message);
    return [];
  }
}

/**
 * Get the most recent update date for a category
 */
async function getCategoryLastmod(categoryValue) {
  try {
    const snapshot = await db.collection('jokes')
      .where('status', '==', 'published')
      .where('categories', 'array-contains', categoryValue)
      .orderBy('updatedAt', 'desc')
      .limit(1)
      .get();
    
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      return formatDate(data.updatedAt || data.createdAt);
    }
    
    return formatDate(new Date());
  } catch (error) {
    console.error('Warning: Error fetching lastmod for category ' + categoryValue + ':', error.message);
    return formatDate(new Date());
  }
}

/**
 * Generate sitemap XML content
 */
async function generateSitemap() {
  console.log('🚀 Starting sitemap generation...\n');
  console.log('🎯 New SEO-friendly URL format: /{category}-jokes/{title-slug}-{id}\n');
  
  // Start XML
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Add static routes
  console.log('📄 Adding static routes...');
  staticRoutes.forEach(function(route) {
    xml += generateUrlEntry(
      BASE_URL + route.path,
      formatDate(new Date()),
      route.changefreq,
      route.priority
    );
    xml += '\n';
  });
  console.log('   ✓ Added ' + staticRoutes.length + ' static routes\n');
  
  // Add category routes
  console.log('📚 Adding category routes...');
  let categoryCount = 0;
  for (let i = 0; i < CATEGORIES.length; i++) {
    const category = CATEGORIES[i];
    const lastmod = await getCategoryLastmod(category.value);
    xml += generateUrlEntry(
      BASE_URL + '/category/' + category.slug,
      lastmod,
      'weekly',
      '0.7'
    );
    xml += '\n';
    categoryCount++;
  }
  console.log('   ✓ Added ' + categoryCount + ' category routes\n');
  
  // NEW: Add blog routes
  console.log('📝 Adding blog comedian routes...');
  let blogCount = 0;
  COMEDIANS.forEach(function(comedian) {
    xml += generateUrlEntry(
      BASE_URL + '/blogs/' + comedian.slug,
      formatDate(new Date()),
      'monthly',
      '0.7'
    );
    xml += '\n';
    blogCount++;
  });
  console.log('   ✓ Added ' + blogCount + ' blog routes\n');
  
  console.log('📝 Blog URLs generated:');
  COMEDIANS.slice(0, 3).forEach(function(comedian, index) {
    console.log('   ' + (index + 1) + '. ' + comedian.name);
    console.log('      → ' + BASE_URL + '/blogs/' + comedian.slug);
  });
  console.log('   ... and ' + (COMEDIANS.length - 3) + ' more\n');
  
  // Fetch and add dynamic joke routes with TITLE SLUGS
  console.log('🎭 Adding joke routes with title slugs...');
  const jokes = await fetchAllJokes();
  const categoryStats = {};
  const exampleUrls = [];
  
  jokes.forEach(function(joke) {
    const lastmod = formatDate(joke.updatedAt || joke.createdAt);
    
    // Get the first category from the joke
    const primaryCategory = joke.categories && joke.categories.length > 0 
      ? joke.categories[0] 
      : 'General';
    const categorySlug = getCategorySlug(primaryCategory);
    
    // Generate title slug
    const titleSlug = generateJokeSlug(joke);
    
    // Track statistics
    if (!categoryStats[categorySlug]) {
      categoryStats[categorySlug] = 0;
    }
    categoryStats[categorySlug]++;
    
    // Generate SEO-friendly URL: /{category}-jokes/{title-slug}-{id}
    const jokeUrl = BASE_URL + '/' + categorySlug + '-jokes/' + titleSlug + '-' + joke.id;
    
    xml += generateUrlEntry(
      jokeUrl,
      lastmod,
      'monthly',
      '0.6'
    );
    xml += '\n';
    
    // Save first 3 examples for display
    if (exampleUrls.length < 3) {
      exampleUrls.push({
        category: categorySlug,
        title: joke.title || joke.text.substring(0, 40),
        url: jokeUrl
      });
    }
  });
  console.log('   ✓ Added ' + jokes.length + ' joke routes\n');
  
  // Display example URLs
  console.log('📝 Example URLs generated:');
  exampleUrls.forEach(function(example, index) {
    const truncatedTitle = example.title.length > 40 
      ? example.title.substring(0, 40) + '...' 
      : example.title;
    console.log('   ' + (index + 1) + '. ' + truncatedTitle);
    console.log('      → ' + example.url);
  });
  console.log('');
  
  // Display category breakdown
  console.log('📊 Jokes by category:');
  const sortedCategories = Object.entries(categoryStats).sort(function(a, b) {
    return b[1] - a[1];
  });
  sortedCategories.forEach(function(entry) {
    const category = entry[0];
    const count = entry[1];
    console.log('   • ' + category.padEnd(15) + ': ' + String(count).padStart(4) + ' jokes');
  });
  console.log('');
  
  // Fetch and add video routes (if any)
  console.log('📹 Adding video routes...');
  const videos = await fetchAllVideos();
  if (videos.length > 0) {
    videos.forEach(function(video) {
      const lastmod = formatDate(video.updatedAt || video.createdAt);
      xml += generateUrlEntry(
        BASE_URL + '/video/' + video.id,
        lastmod,
        'monthly',
        '0.5'
      );
      xml += '\n';
    });
    console.log('   ✓ Added ' + videos.length + ' video routes\n');
  } else {
    console.log('   ⚠️  No videos found, skipping video routes\n');
  }
  
  // Close XML
  xml += '</urlset>';
  
  return { 
    xml, 
    stats: { 
      jokes: jokes.length, 
      videos: videos.length, 
      categories: categoryCount,
      blogs: blogCount
    } 
  };
}

/**
 * Save sitemap to file
 */
function saveSitemap(content) {
  try {
    // Ensure public directory exists
    const publicDir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    fs.writeFileSync(OUTPUT_PATH, content, 'utf8');
    console.log(`✅ Sitemap saved to: ${OUTPUT_PATH}`);
    console.log(`🌐 Accessible at: ${BASE_URL}/sitemap.xml\n`);
  } catch (error) {
    console.error('❌ Error saving sitemap:', error);
    throw error;
  }
}

/**
 * Validate sitemap XML
 */
function validateSitemap(xml) {
  const urlCount = (xml.match(/<url>/g) || []).length;
  const locCount = (xml.match(/<loc>/g) || []).length;
  const lastmodCount = (xml.match(/<lastmod>/g) || []).length;
  
  if (urlCount !== locCount || urlCount !== lastmodCount) {
    throw new Error('Sitemap structure validation failed: mismatched tags');
  }
  
  if (urlCount > 50000) {
    console.warn('⚠️  Warning: Sitemap contains more than 50,000 URLs. Consider creating a sitemap index.');
  }
  
  console.log('✓ Sitemap XML structure validated\n');
  return true;
}

/**
 * Main execution
 */
async function main() {
  try {
    const { xml, stats } = await generateSitemap();
    
    // Validate before saving
    validateSitemap(xml);
    
    saveSitemap(xml);
    
    console.log('🎉 Sitemap generation complete!\n');
    console.log('📊 Statistics:');
    console.log('   • Static routes:    ' + staticRoutes.length);
    console.log('   • Category routes:  ' + stats.categories);
    console.log('   • Blog routes:      ' + stats.blogs); // NEW
    console.log('   • Joke routes:      ' + stats.jokes);
    console.log('   • Video routes:     ' + stats.videos);
    console.log('   • Total URLs:       ' + (xml.match(/<url>/g) || []).length);
    console.log('');
    console.log('💡 SEO-optimized URL formats:');
    console.log('   ✅ Jokes:  https://humoraq.com/{category}-jokes/{title-slug}-{id}');
    console.log('   ✅ Blogs:  https://humoraq.com/blogs/{comedian-slug}');
    console.log('');
    console.log('📝 Next steps:');
    console.log('   1. Deploy the sitemap to production');
    console.log('   2. Submit to Google Search Console: https://search.google.com/search-console');
    console.log('   3. Verify robots.txt references sitemap: https://humoraq.com/robots.txt');
    console.log('   4. Monitor indexing progress in Search Console');
    console.log('');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Sitemap generation failed:', error);
    process.exit(1);
  }
}

// Run the script
main();