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

              <!-- Joke Text (Main Field) -->
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
                    type="button"
                    class="btn btn-sm btn-outline-secondary"
                    @click="clearText"
                    v-if="formData.text.length > 0"
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

              <!-- Category -->
              <div class="mb-3">
                <label for="category" class="form-label">
                  Category <span class="text-danger">*</span>
                </label>
                <select 
                  id="category"
                  v-model="formData.category"
                  class="form-select"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="general">😄 General</option>
                  <option value="tech">💻 Tech</option>
                  <option value="work">💼 Work</option>
                  <option value="animals">🐶 Animals</option>
                  <option value="food">🍕 Food</option>
                </select>
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
import { ref, reactive, computed, onMounted, nextTick } from 'vue';
import { createJoke } from '../services/jokeService';
import { updateSEO } from '../utils/seo';
import { trackJokeSubmit } from '../services/analyticsService';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { getTextDirection, getDirectionClass } from '../utils/rtl';

// Validation constants
const minLength = 20;
const maxLength = 2000; // Increased to 2000 characters

// Form data
const formData = reactive({
  authorName: '',
  title: '',
  text: '',
  category: '',
  language: 'en'
});

// Component state
const submitting = ref(false);
const submitted = ref(false);
const errorMessage = ref('');
const jokeTextarea = ref(null);
const showValidationError = ref(false);

// Computed properties
const characterCount = computed(() => formData.text.length);

const isTextValid = computed(() => {
  return characterCount.value >= minLength && characterCount.value <= maxLength;
});

const isFormValid = computed(() => {
  return (
    isTextValid.value &&
    formData.category !== '' &&
    formData.language !== ''
  );
});

// Auto-grow textarea
const handleTextInput = () => {
  showValidationError.value = false;
  
  // Auto-resize textarea
  if (jokeTextarea.value) {
    jokeTextarea.value.style.height = 'auto';
    jokeTextarea.value.style.height = jokeTextarea.value.scrollHeight + 'px';
  }
};

// Clear text
const clearText = () => {
  formData.text = '';
  showValidationError.value = false;
  
  if (jokeTextarea.value) {
    jokeTextarea.value.style.height = 'auto';
  }
};



// Handle form submission
const handleSubmit = async () => {
  // Validate text length
  if (!isTextValid.value) {
    showValidationError.value = true;
    errorMessage.value = '';
    
    // Scroll to textarea
    jokeTextarea.value?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  // Validate required fields
  if (!formData.category || !formData.language) {
    errorMessage.value = 'Please fill in all required fields.';
    return;
  }

  submitting.value = true;
  errorMessage.value = '';
  showValidationError.value = false;

  try {
    await createJoke({
      authorName: formData.authorName.trim() || 'Anonymous',
      title: formData.title.trim(),
      text: formData.text.trim(),
      category: formData.category,
      language: formData.language
    });

    // Track submission
    trackJokeSubmit(formData.category, formData.language, 'user');

    submitted.value = true;
    
    // Reset form after 3 seconds
    setTimeout(() => {
      submitted.value = false;
      formData.authorName = '';
      formData.title = '';
      formData.text = '';
      formData.category = '';
      formData.language = 'en';
      showValidationError.value = false;
      
      if (jokeTextarea.value) {
        jokeTextarea.value.style.height = 'auto';
      }
    }, 3000);
  } catch (error) {
    console.error('Error submitting joke:', error);
    errorMessage.value = 'Failed to submit joke. Please try again.';
  } finally {
    submitting.value = false;
  }
};

onMounted(() => {
  updateSEO({
    title: 'Submit a Joke - Humoraq',
    description: 'Share your best jokes with the Humoraq community. Submit jokes in multiple languages and categories.'
  });
});
</script>

<style scoped>
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

/* Dark mode adjustments */
.dark-mode .joke-textarea {
  background-color: var(--card-bg);
  color: var(--text-color);
  border-color: var(--border-color);
}

.dark-mode .joke-textarea:focus {
  background-color: var(--card-bg);
  color: var(--text-color);
}

/* Character counter animation */
.form-text {
  transition: color 0.3s ease;
  font-weight: 500;
}

/* Submit button disabled state */
.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Guidelines list */
ul {
  padding-left: 1.5rem;
}

ul li {
  margin-bottom: 0.25rem;
}
</style>