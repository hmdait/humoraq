# 🎭 Humoraq

A modern, multilingual joke-sharing platform built with Vue 3 and Firebase. Share laughs across languages and cultures!

![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=flat-square&logo=vue.js)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=flat-square&logo=firebase)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.x-7952B3?style=flat-square&logo=bootstrap)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

## ✨ Features

### 🌍 Multilingual Support
- **English** (EN)
- **French** (FR) 
- **Arabic** (AR)
- Easily extensible for additional languages

### 📚 Category System
- 💻 **Tech** - Programming and technology jokes
- 💼 **Work** - Office and workplace humor
- 🐶 **Animals** - Funny animal stories
- 🍕 **Food** - Culinary comedy
- 😄 **General** - Everything else

### 🎨 User Experience
- **Dark/Light Mode** - Toggle between themes with preference persistence
- **Responsive Design** - Works seamlessly on mobile, tablet, and desktop
- **Random Jokes** - Get surprise jokes with smart filtering
- **View Tracking** - Track joke popularity with view counts
- **Like System** - Users can like their favorite jokes
- **Submit Jokes** - Community-driven content with user submissions

### 🔥 Firebase Integration
- Real-time data with **Firestore**
- Automatic view and like counters
- Secure data validation with Firestore Security Rules
- Optimized queries with composite indexes

### 🎯 Smart Features
- LocalStorage-based like/view tracking (prevents duplicate counts)
- SEO-friendly meta tags
- Optimistic UI updates
- Error handling and loading states
- Keyboard-accessible navigation

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Firebase account

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/humoraq.git
cd humoraq
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure Firebase**

Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)

Update `src/services/firebase.js` with your Firebase config:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

4. **Set up Firestore**

Create a `jokes` collection in Firestore with the following structure:
```json
{
  "title": "string (optional)",
  "text": "string (required)",
  "language": "en | fr | ar",
  "category": "tech | food | work | animals | general",
  "author": {
    "type": "admin | user",
    "name": "string",
    "uid": null
  },
  "likes": 0,
  "views": 0,
  "status": "published",
  "createdAt": "Firestore Timestamp"
}
```

5. **Configure Firestore Security Rules**
```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /jokes/{jokeId} {
      allow read: if resource.data.status == 'published';
      
      allow create: if request.auth == null 
                    && request.resource.data.author.type == 'user'
                    && request.resource.data.author.uid == null
                    && request.resource.data.status == 'published';
      
      allow update: if request.auth == null
                    && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['views', 'likes']);
    }
  }
}
```

6. **Create Firestore Indexes**

Navigate to Firestore → Indexes and create composite indexes for:

**Index 1: Category + Language Query**
- Collection: `jokes`
- Fields: `status` (Ascending), `category` (Ascending), `language` (Ascending)

**Index 2: Language Query**
- Collection: `jokes`
- Fields: `status` (Ascending), `language` (Ascending)

**Index 3: Category Query**
- Collection: `jokes`
- Fields: `status` (Ascending), `category` (Ascending)

7. **Run the development server**
```bash
npm run serve
```

Visit [http://localhost:8080](http://localhost:8080)

## 📁 Project Structure
```
humoraq/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   ├── logo.png
│   │   └── styles.css
│   ├── components/
│   │   ├── CategoryFilter.vue
│   │   ├── FooterBar.vue
│   │   ├── HeaderNav.vue
│   │   ├── JokeButton.vue
│   │   ├── JokeCard.vue
│   │   └── ThemeToggle.vue
│   ├── composables/
│   │   ├── useJokes.js
│   │   └── useTheme.js
│   ├── layouts/
│   │   └── DefaultLayout.vue
│   ├── router/
│   │   └── index.js
│   ├── services/
│   │   ├── firebase.js
│   │   └── jokeService.js
│   ├── utils/
│   │   └── seo.js
│   ├── views/
│   │   ├── CategoriesView.vue
│   │   ├── CategoryView.vue
│   │   ├── HomeView.vue
│   │   ├── JokeView.vue
│   │   ├── NotFoundView.vue
│   │   └── SubmitView.vue
│   ├── App.vue
│   └── main.js
├── .gitignore
├── package.json
└── README.md
```

## 🛠️ Tech Stack

- **Frontend Framework**: Vue 3 (Composition API)
- **Routing**: Vue Router 4
- **UI Framework**: Bootstrap 5
- **Backend**: Firebase Firestore
- **State Management**: Vue Composables
- **Build Tool**: Vue CLI
- **Icons**: Bootstrap Icons / Emoji

## 📱 Routes

| Route | Description |
|-------|-------------|
| `/` | Home page with random jokes |
| `/categories` | Browse all joke categories |
| `/category/:slug` | View jokes by category |
| `/joke/:id` | View single joke details |
| `/submit` | Submit a new joke |
| `*` | 404 Not Found page |

## 🎨 Customization

### Adding a New Language

1. Update language options in `CategoryFilter.vue`
2. Add language mapping in `JokeCard.vue`
3. Add jokes with the new language code to Firestore

### Adding a New Category

1. Add category to `jokeService.js` `getCategories()` function
2. Update category options in forms
3. Add color mapping in `JokeCard.vue`

### Changing Theme Colors

Edit CSS variables in `src/assets/styles.css`:
```css
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --bg-light: #f8f9fa;
}
```

## 🔒 Security

- Firestore Security Rules restrict write access
- View and like counters prevent manipulation
- LocalStorage prevents duplicate interactions
- No authentication required for reading/submitting jokes

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### Deploy to Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy!

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

## 🧪 Testing
```bash
# Run unit tests
npm run test:unit

# Run e2e tests
npm run test:e2e

# Lint and fix files
npm run lint
```

## 📊 Performance Optimizations

- Lazy loading routes
- Optimistic UI updates
- Background Firestore updates
- LocalStorage caching
- Image optimization
- Code splitting

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow Vue 3 Composition API best practices
- Use Bootstrap 5 classes for styling
- Write clean, documented code
- Test your changes thoroughly
- Update README if needed

## 📝 Future Enhancements

- [*] User authentication
- [ ] Joke moderation system
- [*] Comment system
- [ ] Share to social media
- [ ] Joke of the day
- [ ] Advanced search and filters
- [*] User profiles
- [ ] Favorite jokes collection
- [*] Video jokes support
- [*] Audio jokes / TTS
- [ ] Progressive Web App (PWA)
- [ ] Admin dashboard

## 🐛 Known Issues

- None at the moment! Report issues [here](https://github.com/hmdait/humoraq/issues)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@hmdait](https://github.com/hmdait)
- Email: hmdaitbjj@example.com

## 🙏 Acknowledgments

- Vue.js team for the amazing framework
- Firebase team for the backend infrastructure
- Bootstrap team for the UI components
- All contributors and joke submitters

## 📞 Support

For support, open an issue on GitHub.

---

Made with ❤️ and lots of laughter

**Remember**: Laughter is the best medicine! 😄
```

---

## **Optional: Add LICENSE File**

### **LICENSE** (MIT License)
```
MIT License

Copyright (c) 2024 H.AIT-BAJJA

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---
