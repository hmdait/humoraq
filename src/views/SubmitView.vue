<template>
  <DefaultLayout>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <h1 class="display-5 mb-4">Submit Your Joke</h1>

          <div class="card">
            <div class="card-body">
              <form @submit.prevent="handleSubmit">
                
                <!-- Author Name -->
                <div class="mb-3">
                  <label for="authorName" class="form-label">
                    Your Pseudonym
                  </label>
                  <input 
                    id="authorName" 
                    v-model="formData.authorName" 
                    type="text" 
                    class="form-control"
                    placeholder="Enter your username (or leave empty for Anonymous)" 
                    maxlength="50" 
                  />
                  <small class="form-text text-muted">
                    Leave empty to post as "Anonymous"
                  </small>
                </div>

                <!-- Email -->
                <div class="mb-3">
                  <label for="email" class="form-label">
                    Email <span class="text-muted">(optional)</span>
                  </label>
                  <input 
                    id="email" 
                    v-model="formData.email" 
                    type="email" 
                    class="form-control"
                    :class="{ 'is-invalid': emailError }" 
                    placeholder="your@email.com" 
                    @input="validateEmail" 
                  />

                  <!-- Monetization Message -->
                  <div class="email-info-box mt-2">
                    <div class="d-flex align-items-start">
                      <i class="bi bi-cash-coin text-success me-2" style="font-size: 1.2rem;"></i>
                      <div>
                        <small class="text-muted">
                          <strong>Earn money from your jokes!</strong>
                          If your joke performs well, you can receive:
                        </small>
                        <ul class="reward-list mb-1">
                          <li><strong>$5</strong> when your joke reaches <strong>5,000 views</strong></li>
                          <li><strong>$5</strong> when your joke reaches <strong>1,000 likes</strong></li>
                        </ul>
                        <small class="text-muted">
                          We'll contact you via email to send your reward.
                          <span class="text-primary">Your email stays private</span> and won't be used for spam.
                        </small>
                      </div>
                    </div>
                  </div>

                  <!-- Email Validation Error -->
                  <div v-if="emailError" class="invalid-feedback d-block">
                    {{ emailError }}
                  </div>
                </div>

                <!-- Joke Title (Optional) -->
                <div class="mb-3">
                  <label for="title" class="form-label">
                    Joke Title <span class="text-muted">(optional)</span>
                  </label>
                  <input 
                    id="title" 
                    v-model="formData.title" 
                    type="text" 
                    class="form-control"
                    placeholder="Give your joke a catchy title" 
                    maxlength="100" 
                  />
                </div>

                <!-- Joke Text -->
                <div class="mb-3">
                  <label for="jokeText" class="form-label">
                    Joke Text <span class="text-danger">*</span>
                  </label>
                  <textarea 
                    id="jokeText" 
                    ref="jokeTextarea" 
                    v-model="formData.text" 
                    class="form-control joke-textarea"
                    :class="{ 
                      'is-invalid': showValidationError,
                      'is-valid': isTextValid && formData.text.length > 0
                    }" 
                    rows="6" 
                    placeholder="Write your joke here… longer jokes are welcome 😄

You can write multiple lines, add emojis 🎭, and tell longer stories.

Example:
A programmer's wife tells him: 'Go to the store and buy a loaf of bread. If they have eggs, buy a dozen.'

He comes back with 12 loaves of bread.

'Why did you buy 12 loaves of bread?' she asks.

He replies: 'They had eggs.'" 
                    @input="handleTextInput" 
                    required
                  ></textarea>

                  <!-- Character Counter -->
                  <div class="d-flex justify-content-between align-items-center mt-2">
                    <small 
                      class="form-text" 
                      :class="{
                        'text-danger': characterCount < minLength || characterCount > maxLength,
                        'text-warning': characterCount >= maxLength - 100 && characterCount <= maxLength,
                        'text-success': isTextValid,
                        'text-muted': characterCount === 0
                      }"
                    >
                      {{ characterCount }} / {{ maxLength }} characters
                      <span v-if="characterCount < minLength">
                        (minimum {{ minLength }})
                      </span>
                      <span v-if="characterCount >= maxLength - 100 && characterCount <= maxLength">
                        ({{ maxLength - characterCount }} remaining)
                      </span>
                    </small>

                    <button 
                      v-if="formData.text.length > 0"
                      type="button" 
                      class="btn btn-sm btn-outline-secondary" 
                      @click="clearText"
                    >
                      Clear
                    </button>
                  </div>

                  <!-- Validation Messages -->
                  <div v-if="showValidationError" class="invalid-feedback d-block">
                    <span v-if="characterCount < minLength">
                      ⚠️ Your joke must be at least {{ minLength }} characters long.
                      ({{ minLength - characterCount }} more needed)
                    </span>
                    <span v-else-if="characterCount > maxLength">
                      ⚠️ Your joke is too long! Maximum {{ maxLength }} characters allowed.
                      ({{ characterCount - maxLength }} over limit)
                    </span>
                  </div>

                  <div v-if="isTextValid && formData.text.length > 0" class="valid-feedback d-block">
                    ✓ Perfect length!
                  </div>
                </div>

                <!-- Categories (Tag-style Multi-select) -->
                <div class="mb-3">
                  <label class="form-label">
                    Categories <span class="text-danger">*</span>
                  </label>
                  <p class="form-text text-muted mb-3">
                    Select one or more categories that best describe your joke
                  </p>

                  <!-- Category Tags Grid -->
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
                        <span class="category-name">{{ category.label }}</span>
                      </label>
                    </div>
                  </div>

                  <!-- Categories Validation Error -->
                  <div v-if="showCategoriesError" class="invalid-feedback d-block mt-2">
                    ⚠️ Please select at least one category
                  </div>

                  <!-- Selected Categories Display -->
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
                    <option value="ar">العربية</option>
                  </select>
                </div>

                <!-- Submit Button -->
                <div class="d-grid gap-2">
                  <button 
                    type="submit" 
                    class="btn btn-primary btn-lg"
                    :disabled="submitting || submitted || !isFormValid"
                  >
                    <span v-if="submitting">
                      <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                      Submitting...
                    </span>
                    <span v-else-if="submitted">
                      ✓ Submitted!
                    </span>
                    <span v-else>
                      🚀 Submit Joke
                    </span>
                  </button>
                </div>

                <!-- Submission Guidelines -->
                <div class="mt-3">
                  <small class="text-muted">
                    <strong>Guidelines:</strong>
                    <ul class="mb-0 mt-2">
                      <li>Keep it funny and appropriate for all audiences</li>
                      <li>Original jokes are preferred</li>
                      <li>Multi-line jokes and stories are welcome</li>
                      <li>Use emojis to enhance your joke 😄</li>
                      <li>Select categories that accurately describe your joke</li>
                    </ul>
                  </small>
                </div>
              </form>

              <!-- Success Message -->
              <div v-if="submitted" class="alert alert-success mt-4">
                <strong>🎉 Thank you!</strong> Your joke has been published successfully.
              </div>

              <!-- Error Message -->
              <div v-if="errorMessage" class="alert alert-danger mt-4">
                <strong>❌ Error:</strong> {{ errorMessage }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { createJoke } from '../services/jokeService';
import { updateSEO } from '../utils/seo';
import { trackJokeSubmit } from '../services/analyticsService';
import DefaultLayout from '@/layouts/DefaultLayout.vue';

// ========================================
// Constants
// ========================================
const minLength = 20;
const maxLength = 2000;

// Available categories - matches Firestore schema
const availableCategories = [
  { value: 'General', label: 'General' },
  { value: 'Relationships', label: 'Relationships' },
  { value: 'Family', label: 'Family' },
  { value: 'Work', label: 'Work' },
  { value: 'School', label: 'School' },
  { value: 'Friends', label: 'Friends' },
  { value: 'Adult', label: 'Adult' },
  { value: 'Animals', label: 'Animals' },
  { value: 'Food', label: 'Food' },
  { value: 'Tech', label: 'Tech' },
  { value: 'Sports', label: 'Sports' },
  { value: 'Old People', label: 'Old People' },
  { value: 'Women', label: 'Women' },
  { value: 'Men', label: 'Men' }
];

// ========================================
// Reactive State
// ========================================
const formData = reactive({
  authorName: '',
  email: '',
  title: '',
  text: '',
  categories: [], // Array of category strings
  language: 'en'
});

const submitting = ref(false);
const submitted = ref(false);
const errorMessage = ref('');
const emailError = ref('');
const jokeTextarea = ref(null);
const showValidationError = ref(false);
const showCategoriesError = ref(false);

// ========================================
// Computed Properties
// ========================================
const characterCount = computed(() => formData.text.length);

const isTextValid = computed(() => {
  return characterCount.value >= minLength && characterCount.value <= maxLength;
});

const isFormValid = computed(() => {
  return (
    isTextValid.value &&
    formData.categories.length > 0 &&
    formData.language !== '' &&
    !emailError.value
  );
});

const selectedCategoriesText = computed(() => {
  return formData.categories.join(', ');
});

// ========================================
// Methods
// ========================================

/**
 * Validate email format
 */
const validateEmail = () => {
  emailError.value = '';

  if (formData.email.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      emailError.value = 'Please enter a valid email address';
    }
  }
};

/**
 * Handle text input and auto-resize textarea
 */
const handleTextInput = () => {
  showValidationError.value = false;

  if (jokeTextarea.value) {
    jokeTextarea.value.style.height = 'auto';
    jokeTextarea.value.style.height = jokeTextarea.value.scrollHeight + 'px';
  }
};

/**
 * Clear joke text
 */
const clearText = () => {
  formData.text = '';
  showValidationError.value = false;

  if (jokeTextarea.value) {
    jokeTextarea.value.style.height = 'auto';
  }
};

/**
 * Reset form to initial state
 */
const resetForm = () => {
  formData.authorName = '';
  formData.email = '';
  formData.title = '';
  formData.text = '';
  formData.categories = [];
  formData.language = 'en';
  showValidationError.value = false;
  showCategoriesError.value = false;
  emailError.value = '';

  if (jokeTextarea.value) {
    jokeTextarea.value.style.height = 'auto';
  }
};

/**
 * Handle form submission
 */
const handleSubmit = async () => {
  // Reset errors
  errorMessage.value = '';
  showValidationError.value = false;
  showCategoriesError.value = false;

  // Validate text length
  if (!isTextValid.value) {
    showValidationError.value = true;
    jokeTextarea.value?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  // Validate categories
  if (formData.categories.length === 0) {
    showCategoriesError.value = true;
    errorMessage.value = 'Please select at least one category';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  // Validate language
  if (!formData.language) {
    errorMessage.value = 'Please select a language';
    return;
  }

  // Validate email if provided
  if (formData.email.trim()) {
    validateEmail();
    if (emailError.value) {
      return;
    }
  }

  submitting.value = true;

  try {
    // Create joke with categories array
    await createJoke({
      authorName: formData.authorName.trim() || 'Anonymous',
      email: formData.email.trim() || null,
      title: formData.title.trim(),
      text: formData.text.trim(),
      categories: formData.categories, // Send categories array
      language: formData.language
    });

    // Track submission (use first category for analytics)
    trackJokeSubmit(formData.categories[0], formData.language, 'user');

    submitted.value = true;

    // Reset form after 3 seconds
    setTimeout(() => {
      submitted.value = false;
      resetForm();
    }, 3000);
  } catch (error) {
    console.error('Error submitting joke:', error);
    errorMessage.value = error.message || 'Failed to submit joke. Please try again.';
  } finally {
    submitting.value = false;
  }
};

// ========================================
// Lifecycle
// ========================================
onMounted(() => {
  updateSEO({
    title: 'Submit a Joke - Humoraq',
    description: 'Share your best jokes with the Humoraq community. Submit jokes in multiple languages and categories.'
  });
});
</script>

<style scoped>
/* ========================================
   Textarea Styling
   ======================================== */
.joke-textarea {
  resize: vertical;
  min-height: 150px;
  max-height: 500px;
  font-size: 1rem;
  line-height: 1.6;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.joke-textarea:focus {
  border-color: #86b7fe;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.joke-textarea.is-valid:focus {
  border-color: #198754;
  box-shadow: 0 0 0 0.25rem rgba(25, 135, 84, 0.25);
}

.joke-textarea.is-invalid:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);
}

/* ========================================
   Email Info Box
   ======================================== */
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
  font-size: 0.9rem;
}

.reward-list li {
  padding: 0.25rem 0;
  color: #198754;
}

.reward-list li:before {
  content: "💰 ";
  margin-right: 0.25rem;
}

/* ========================================
   Categories - Tag Style
   ======================================== */
.categories-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.category-checkbox-wrapper {
  position: relative;
}

/* Hide checkbox */
.category-checkbox-input {
  display: none;
}

/* Tag-style labels */
.category-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.85rem;
  border-radius: 999px;
  border: 1.5px solid #dee2e6;
  background: transparent;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  user-select: none;
}

.category-tag:hover {
  border-color: #0d6efd;
  background: rgba(13, 110, 253, 0.08);
  transform: translateY(-1px);
}

.category-tag.selected {
  background: #0d6efd;
  border-color: #0d6efd;
  color: #fff;
  box-shadow: 0 2px 8px rgba(13, 110, 253, 0.3);
}

.category-name {
  font-weight: 500;
  white-space: nowrap;
}

/* ========================================
   Selected Categories Display
   ======================================== */
.selected-categories {
  padding: 0.75rem;
  background-color: rgba(13, 110, 253, 0.05);
  border-left: 3px solid #0d6efd;
  border-radius: 0.375rem;
}

/* ========================================
   Dark Mode
   ======================================== */
.dark-mode .joke-textarea {
  background-color: var(--card-bg);
  color: var(--text-color);
  border-color: var(--border-color);
}

.dark-mode .email-info-box {
  background-color: rgba(25, 135, 84, 0.15);
  border-left-color: #198754;
}

.dark-mode .reward-list li {
  color: #75b798;
}

.dark-mode .category-tag {
  border-color: #495057;
  color: var(--text-color);
}

.dark-mode .category-tag:hover {
  border-color: #0d6efd;
  background: rgba(13, 110, 253, 0.15);
}

.dark-mode .category-tag.selected {
  background: #0d6efd;
  border-color: #0d6efd;
  color: #fff;
}

.dark-mode .selected-categories {
  background-color: rgba(13, 110, 253, 0.1);
  border-left-color: #0d6efd;
}

/* ========================================
   Misc Styles
   ======================================== */
.form-text {
  transition: color 0.3s ease;
  font-weight: 500;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

ul {
  padding-left: 1.5rem;
}

ul li {
  margin-bottom: 0.25rem;
}

/* ========================================
   Responsive
   ======================================== */
@media (max-width: 576px) {
  .categories-grid {
    gap: 0.5rem;
  }

  .category-tag {
    font-size: 0.8rem;
    padding: 0.4rem 0.7rem;
  }
}
</style>