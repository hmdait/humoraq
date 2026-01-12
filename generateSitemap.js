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

// Static routes configuration
const staticRoutes = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/feed', changefreq: 'hourly', priority: '0.9' },
  { path: '/spotlight', changefreq: 'daily', priority: '0.8' },
  { path: '/categories', changefreq: 'weekly', priority: '0.7' },
  { path: '/submit', changefreq: 'monthly', priority: '0.5' },
  { path: '/about-us', changefreq: 'monthly', priority: '0.4' }
];

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
    const jokesSnapshot = await db.collection('jokes').get();
    const jokes = [];
    
    jokesSnapshot.forEach(doc => {
      const data = doc.data();
      jokes.push({
        id: doc.id,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        language: data.language,
        category: data.category
      });
    });
    
    console.log(`✅ Fetched ${jokes.length} jokes from Firestore`);
    return jokes;
  } catch (error) {
    console.error('❌ Error fetching jokes:', error);
    throw error;
  }
}

/**
 * Generate sitemap XML content
 */
async function generateSitemap() {
  console.log('🚀 Starting sitemap generation...');
  
  // Start XML
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Add static routes
  console.log('📄 Adding static routes...');
  staticRoutes.forEach(route => {
    xml += generateUrlEntry(
      `${BASE_URL}${route.path}`,
      formatDate(new Date()),
      route.changefreq,
      route.priority
    );
    xml += '\n';
  });
  
  // Fetch and add dynamic joke routes
  console.log('🎭 Fetching jokes from Firestore...');
  const jokes = await fetchAllJokes();
  
  jokes.forEach(joke => {
    const lastmod = formatDate(joke.updatedAt || joke.createdAt);
    xml += generateUrlEntry(
      `${BASE_URL}/joke/${joke.id}`,
      lastmod,
      'monthly',
      '0.6'
    );
    xml += '\n';
  });
  
  // Close XML
  xml += '</urlset>';
  
  return xml;
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
    console.log(`🌐 Accessible at: ${BASE_URL}/sitemap.xml`);
  } catch (error) {
    console.error('❌ Error saving sitemap:', error);
    throw error;
  }
}

/**
 * Main execution
 */
async function main() {
  try {
    const sitemapContent = await generateSitemap();
    saveSitemap(sitemapContent);
    
    console.log('\n🎉 Sitemap generation complete!');
    console.log('📊 Statistics:');
    console.log(`   - Static routes: ${staticRoutes.length}`);
    console.log(`   - Total URLs in sitemap: ${(sitemapContent.match(/<url>/g) || []).length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Sitemap generation failed:', error);
    process.exit(1);
  }
}

// Run the script
main();