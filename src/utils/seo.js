export const updateSEO = ({ title, description }) => {
  if (title) {
    document.title = title;
  }

  if (description) {
    let metaDescription = document.querySelector('meta[name="description"]');
    
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    
    metaDescription.setAttribute('content', description);
  }
};

export const setDefaultSEO = () => {
  updateSEO({
    title: 'Humoraq - Jokes in Multiple Languages',
    description: 'Discover funny jokes in English, French, and Arabic. Browse by category and enjoy daily humor!'
  });
};