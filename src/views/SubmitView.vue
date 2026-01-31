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
                    placeholder="Write your joke here…"
                    @input="handleTextInput" 
                    required
                  ></textarea>

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

                  <div v-if="showValidationError" class="invalid-feedback d-block">
                    ⚠️ Your joke must be between {{ minLength }} and {{ maxLength }} characters.
                  </div>
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
                        <span class="category-name">{{ category.label }}</span>
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

                <!-- Privacy & Terms Agreement -->
                <div class="mb-3">
                  <div class="form-check">
                    <input 
                      type="checkbox" 
                      class="form-check-input" 
                      id="agreeTerms"
                      v-model="formData.agreeTerms"
                      :class="{ 'is-invalid': showTermsError }"
                    />
                    <label class="form-check-label" for="agreeTerms">
                      I agree to the 
                      <a href="/legal" target="_blank" class="privacy-link">Privacy Policy</a>
                      and 
                      <a href="/legal" target="_blank" class="privacy-link">Terms of Service</a>
                      <span class="text-danger">*</span>
                    </label>
                  </div>
                  <div v-if="showTermsError" class="invalid-feedback d-block">
                    ⚠️ You must agree to the Privacy Policy and Terms of Service to submit
                  </div>
                </div>

                <!-- Submit Button -->
                <div class="d-grid gap-2">
                  <button 
                    type="submit" 
                    class="btn btn-primary btn-lg"
                    :disabled="submitting || submitted || !isFormValid"
                  >
                    <span v-if="submitting">
                      <span class="spinner-border spinner-border-sm me-2"></span>
                      Submitting...
                    </span>
                    <span v-else-if="submitted">
                      ✓ Submitted!
                    </span>
                    <span v-else>
                      <i class="bi bi-send me-1"></i> Submit Joke
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

              <div v-if="submitted" class="alert alert-success mt-4">
                <strong>🎉 Thank you!</strong> Your joke has been published successfully.
              </div>

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
import { getCategoriesForSelect } from '../config/categories';
import DefaultLayout from '@/layouts/DefaultLayout.vue';

const minLength = 20;
const maxLength = 2000;

const availableCategories = getCategoriesForSelect();

const formData = reactive({
  authorName: '',
  email: '',
  title: '',
  text: '',
  categories: [],
  language: 'en',
  agreeTerms: false
});

const submitting = ref(false);
const submitted = ref(false);
const errorMessage = ref('');
const emailError = ref('');
const jokeTextarea = ref(null);
const showValidationError = ref(false);
const showCategoriesError = ref(false);
const showTermsError = ref(false);

const characterCount = computed(() => formData.text.length);
const isTextValid = computed(() => 
  characterCount.value >= minLength && characterCount.value <= maxLength
);
const isFormValid = computed(() => 
  isTextValid.value && 
  formData.categories.length > 0 && 
  formData.language !== '' && 
  formData.agreeTerms && 
  !emailError.value
);
const selectedCategoriesText = computed(() => formData.categories.join(', '));

const validateEmail = () => {
  emailError.value = '';
  if (formData.email.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      emailError.value = 'Please enter a valid email address';
    }
  }
};

const handleTextInput = () => {
  showValidationError.value = false;
  if (jokeTextarea.value) {
    jokeTextarea.value.style.height = 'auto';
    jokeTextarea.value.style.height = jokeTextarea.value.scrollHeight + 'px';
  }
};

const clearText = () => {
  formData.text = '';
  showValidationError.value = false;
  if (jokeTextarea.value) {
    jokeTextarea.value.style.height = 'auto';
  }
};

const resetForm = () => {
  formData.authorName = '';
  formData.email = '';
  formData.title = '';
  formData.text = '';
  formData.categories = [];
  formData.language = 'en';
  formData.agreeTerms = false;
  showValidationError.value = false;
  showCategoriesError.value = false;
  showTermsError.value = false;
  emailError.value = '';
  if (jokeTextarea.value) {
    jokeTextarea.value.style.height = 'auto';
  }
};

const handleSubmit = async () => {
  errorMessage.value = '';
  showValidationError.value = false;
  showCategoriesError.value = false;
  showTermsError.value = false;

  if (!isTextValid.value) {
    showValidationError.value = true;
    jokeTextarea.value?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  if (formData.categories.length === 0) {
    showCategoriesError.value = true;
    errorMessage.value = 'Please select at least one category';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  if (!formData.agreeTerms) {
    showTermsError.value = true;
    errorMessage.value = 'You must agree to the Privacy Policy and Terms of Service';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  if (formData.email.trim()) {
    validateEmail();
    if (emailError.value) return;
  }

  submitting.value = true;

  try {
    await createJoke({
      authorName: formData.authorName.trim() || 'Anonymous',
      email: formData.email.trim() || null,
      title: formData.title.trim(),
      text: formData.text.trim(),
      categories: formData.categories,
      language: formData.language
    });

    trackJokeSubmit(formData.categories[0], formData.language, 'user');
    submitted.value = true;

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