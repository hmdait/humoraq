<template>
  <DefaultLayout>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="card shadow-sm">
            <div class="card-body p-4">
              <h1 class="h2 mb-4">Submit Your Joke</h1>
              
              <form @submit.prevent="handleSubmit">
                <!-- Joke Text -->
                <div class="mb-3">
                  <label for="jokeText" class="form-label">
                    Your Joke <span class="text-danger">*</span>
                  </label>
                  <textarea
                    id="jokeText"
                    v-model="formData.text"
                    class="form-control joke-textarea"
                    :class="{ 'is-invalid': showJokeError }"
                    rows="5"
                    placeholder="Enter your hilarious joke here..."
                    required
                  ></textarea>
                  <div v-if="showJokeError" class="invalid-feedback">
                    ⚠️ Please enter your joke (minimum 10 characters)
                  </div>
                </div>

                <!-- Joke Title (Optional) -->
                <div class="mb-3">
                  <label for="jokeTitle" class="form-label">
                    Joke Title <small class="text-muted">(Optional)</small>
                  </label>
                  <input
                    id="jokeTitle"
                    v-model="formData.title"
                    type="text"
                    class="form-control"
                    placeholder="Give your joke a catchy title"
                  />
                </div>

                <!-- Categories -->
                <div class="mb-3">
                  <label class="form-label">
                    Categories <span class="text-danger">*</span>
                  </label>
                  <p class="form-text text-muted mb-3">
                    Select one or more categories that best describe your joke
                  </p>

                  <div class="categories-grid">
                    <div 
                      v-for="category in availableCategories" 
                      :key="category.value"
                      class="category-checkbox-wrapper"
                    >
                      <input 
                        type="checkbox" 
                        :id="`cat-${category.value}`" 
                        :value="category.value"
                        v-model="formData.categories" 
                        class="category-checkbox-input" 
                      />
                      <label 
                        :for="`cat-${category.value}`" 
                        class="category-tag"
                        :class="{ selected: formData.categories.includes(category.value) }"
                      >
                        <i :class="['bi', category.icon, 'category-icon']"></i>
                        <span class="category-name">{{ t(`categoryNames.${category.value}`) }}</span>
                      </label>
                    </div>
                  </div>

                  <div v-if="showCategoriesError" class="invalid-feedback d-block mt-2">
                    ⚠️ Please select at least one category
                  </div>

                  <div v-if="formData.categories.length > 0" class="selected-categories mt-3">
                    <small class="text-muted">
                      <strong>Selected ({{ formData.categories.length }}):</strong>
                      {{ selectedCategoriesText }}
                    </small>
                  </div>
                </div>

                <!-- Language -->
                <div class="mb-3">
                  <label for="language" class="form-label">
                    Language <span class="text-danger">*</span>
                  </label>
                  <select 
                    id="language" 
                    v-model="formData.language" 
                    class="form-select" 
                    required
                  >
                    <option value="en">English</option>
                    <option value="fr">Français</option>
                    <option value="es">Español</option>
                    <option value="ar">العربية</option>
                  </select>
                </div>

                <!-- Display Name (Optional) -->
                <div class="mb-3">
                  <label for="displayName" class="form-label">
                    Display Name <small class="text-muted">(Optional)</small>
                  </label>
                  <input
                    id="displayName"
                    v-model="formData.displayName"
                    type="text"
                    class="form-control"
                    placeholder="Your name or pseudonym"
                  />
                  <small class="form-text text-muted">
                    This will be shown as the author of your joke
                  </small>
                </div>

                <!-- Email (Optional) -->
                <div class="mb-3">
                  <label for="email" class="form-label">
                    Email <small class="text-muted">(Optional)</small>
                  </label>
                  <input
                    id="email"
                    v-model="formData.email"
                    type="email"
                    class="form-control"
                    placeholder="your@email.com"
                  />
                  <div class="email-info-box mt-2">
                    <small class="text-muted">
                      <strong>💰 Why provide email?</strong>
                      <ul class="reward-list mt-1 mb-0">
                        <li>Get notified if your joke goes viral</li>
                        <li>Receive updates on community engagement</li>
                        <li>Optional rewards for top contributors</li>
                      </ul>
                      We'll never spam or share your email. You can also submit anonymously by leaving this blank.
                    </small>
                  </div>
                </div>

                <!-- Privacy & Terms Agreement -->
                <div class="mb-3">
                  <div class="form-check">
                    <input 
                      type="checkbox" 
                      id="agreeToTerms" 
                      v-model="formData.agreeToTerms" 
                      class="form-check-input"
                      :class="{ 'is-invalid': showTermsError }"
                      required
                    />
                    <label class="form-check-label" for="agreeToTerms">
                      I agree to the 
                      <router-link to="/legal" class="privacy-link" target="_blank">
                        Privacy Policy & Terms of Service
                      </router-link>
                    </label>
                    <div v-if="showTermsError" class="invalid-feedback">
                      ⚠️ Please agree to the terms to continue
                    </div>
                  </div>
                </div>

                <!-- Success Message -->
                <div v-if="successMessage" class="alert alert-success" role="alert">
                  <i class="bi bi-check-circle-fill me-2"></i>
                  {{ successMessage }}
                </div>

                <!-- Error Message -->
                <div v-if="errorMessage" class="alert alert-danger" role="alert">
                  <i class="bi bi-exclamation-triangle-fill me-2"></i>
                  {{ errorMessage }}
                </div>

                <!-- Submit Button -->
                <div class="d-grid">
                  <button 
                    type="submit" 
                    class="btn btn-primary btn-lg"
                    :disabled="submitting"
                  >
                    <span v-if="submitting">
                      <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                      Submitting...
                    </span>
                    <span v-else>
                      <i class="bi bi-send-fill me-2"></i>
                      Submit Joke
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Guidelines Card -->
          <div class="card shadow-sm mt-4">
            <div class="card-body">
              <h5 class="card-title">
                <i class="bi bi-info-circle-fill text-info me-2"></i>
                Submission Guidelines
              </h5>
              <ul class="mb-0">
                <li>Keep jokes family-friendly (except in Adult category)</li>
                <li>No hate speech, discrimination, or offensive content</li>
                <li>Original jokes or proper attribution required</li>
                <li>Jokes are reviewed before publishing</li>
                <li>All submissions must comply with our community standards</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { t } from '@/i18n';
import { getAllCategories } from '@/config/categories';
import { submitJoke } from '@/services/jokeService';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { updateSEO } from '@/utils/seo';

const store = useStore();
const router = useRouter();

// Get available categories
const availableCategories = getAllCategories();

// Form data
const formData = ref({
  text: '',
  title: '',
  categories: [],
  language: 'en',
  displayName: '',
  email: '',
  agreeToTerms: false
});

// UI state
const submitting = ref(false);
const successMessage = ref('');
const errorMessage = ref('');
const showJokeError = ref(false);
const showCategoriesError = ref(false);
const showTermsError = ref(false);

// Computed
const selectedCategoriesText = computed(() => {
  return formData.value.categories
    .map(value => {
      const category = availableCategories.find(cat => cat.value === value);
      return category ? t(`categoryNames.${category.value}`) : value;
    })
    .join(', ');
});

// Validate form
const validateForm = () => {
  let isValid = true;
  
  // Reset errors
  showJokeError.value = false;
  showCategoriesError.value = false;
  showTermsError.value = false;
  errorMessage.value = '';

  // Validate joke text
  if (!formData.value.text || formData.value.text.trim().length < 10) {
    showJokeError.value = true;
    isValid = false;
  }

  // Validate categories
  if (formData.value.categories.length === 0) {
    showCategoriesError.value = true;
    isValid = false;
  }

  // Validate terms agreement
  if (!formData.value.agreeToTerms) {
    showTermsError.value = true;
    isValid = false;
  }

  return isValid;
};

// Handle form submission
const handleSubmit = async () => {
  console.log('=== Submit form submitted ===');
  
  // Validate
  if (!validateForm()) {
    errorMessage.value = 'Please fix the errors above before submitting.';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  submitting.value = true;
  successMessage.value = '';
  errorMessage.value = '';

  try {
    // Prepare joke data
    const jokeData = {
      text: formData.value.text.trim(),
      title: formData.value.title.trim() || null,
      categories: formData.value.categories,
      language: formData.value.language,
      displayName: formData.value.displayName.trim() || 'Anonymous',
      email: formData.value.email.trim() || null,
      status: 'pending' // Will be reviewed before publishing
    };

    console.log('Submitting joke:', jokeData);

    // Submit to Firestore
    const jokeId = await submitJoke(jokeData);

    console.log('✅ Joke submitted successfully:', jokeId);

    // Show success message
    successMessage.value = '🎉 Thank you! Your joke has been submitted and is pending review. You\'ll see it published soon!';
    
    // Reset form
    formData.value = {
      text: '',
      title: '',
      categories: [],
      language: 'en',
      displayName: '',
      email: '',
      agreeToTerms: false
    };

    // Scroll to top to show success message
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Redirect after 3 seconds
    setTimeout(() => {
      router.push('/');
    }, 3000);

  } catch (error) {
    console.error('❌ Error submitting joke:', error);
    errorMessage.value = 'Sorry, there was an error submitting your joke. Please try again.';
  } finally {
    submitting.value = false;
  }
};

onMounted(() => {
  updateSEO({
    title: 'Submit a Joke - Humoraq',
    description: 'Share your best jokes with the Humoraq community.'
  });
});
</script>

<style scoped>
.joke-textarea {
  resize: vertical;
  min-height: 150px;
  max-height: 500px;
}

.email-info-box {
  background-color: rgba(25, 135, 84, 0.05);
  border-left: 3px solid #198754;
  padding: 0.75rem;
  border-radius: 0.375rem;
}

.reward-list {
  list-style: none;
  padding-left: 0;
  margin: 0.5rem 0;
}

.reward-list li:before {
  content: "💰 ";
  margin-right: 0.25rem;
}

.categories-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.category-checkbox-input {
  display: none;
}

.category-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  border-radius: 12px;
  border: 2px solid #dee2e6;
  background: transparent;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  user-select: none;
}

.category-tag:hover {
  border-color: #0d6efd;
  background: rgba(13, 110, 253, 0.05);
  transform: translateY(-2px);
}

.category-tag.selected {
  background: linear-gradient(135deg, rgba(13, 110, 253, 0.15), rgba(13, 110, 253, 0.08));
  border-color: #0d6efd;
  color: #0d6efd;
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.2);
}

.category-icon {
  font-size: 1.2rem;
  transition: transform 0.2s ease;
}

.category-tag.selected .category-icon {
  color: #0d6efd;
  transform: scale(1.1);
}

.category-name {
  font-weight: 500;
}

.selected-categories {
  padding: 0.75rem;
  background-color: rgba(13, 110, 253, 0.05);
  border-left: 3px solid #0d6efd;
  border-radius: 0.375rem;
}

.privacy-link {
  color: #0d6efd;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.privacy-link:hover {
  color: #0a58ca;
  text-decoration: underline;
}

.form-check-label {
  font-size: 0.9rem;
  user-select: none;
}

.form-check-input.is-invalid {
  border-color: #dc3545;
}

.form-check-input.is-invalid:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);
}

/* Dark mode adjustments */
.dark-mode .category-tag {
  border-color: #495057;
}

.dark-mode .category-tag:hover {
  background: rgba(13, 110, 253, 0.1);
}

.dark-mode .category-tag.selected {
  background: linear-gradient(135deg, rgba(13, 110, 253, 0.25), rgba(13, 110, 253, 0.15));
  border-color: #6ea8fe;
  color: #6ea8fe;
}

.dark-mode .category-tag.selected .category-icon {
  color: #6ea8fe;
}

.dark-mode .email-info-box {
  background-color: rgba(25, 135, 84, 0.15);
}

.dark-mode .selected-categories {
  background-color: rgba(13, 110, 253, 0.15);
}

.dark-mode .privacy-link {
  color: #6ea8fe;
}

.dark-mode .privacy-link:hover {
  color: #9ec5fe;
}
</style>