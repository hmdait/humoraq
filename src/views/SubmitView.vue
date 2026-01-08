<template>
  <DefaultLayout>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <h1 class="display-5 mb-4">Submit Your Joke</h1>
          
          <div class="card">
            <div class="card-body">
              <form @submit.prevent="handleSubmit">
                <div class="mb-3">
                  <label for="authorName" class="form-label">Your Pseudonym</label>
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

                <div class="mb-3">
                  <label for="title" class="form-label">Joke Title (optional)</label>
                  <input 
                    id="title"
                    v-model="formData.title"
                    type="text"
                    class="form-control"
                    placeholder="Give your joke a catchy title"
                    maxlength="100"
                  />
                </div>

                <div class="mb-3">
                  <label for="jokeText" class="form-label">Joke Text *</label>
                  <textarea 
                    id="jokeText"
                    v-model="formData.text"
                    class="form-control"
                    rows="4"
                    placeholder="Enter your joke here..."
                    required
                    maxlength="500"
                  ></textarea>
                </div>

                <div class="mb-3">
                  <label for="category" class="form-label">Category *</label>
                  <select 
                    id="category"
                    v-model="formData.category"
                    class="form-select"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="tech">Tech</option>
                    <option value="work">Work</option>
                    <option value="animals">Animals</option>
                    <option value="food">Food</option>
                    <option value="general">General</option>
                  </select>
                </div>

                <div class="mb-3">
                  <label for="language" class="form-label">Language *</label>
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

                <div class="d-grid gap-2">
                  <button 
                    type="submit" 
                    class="btn btn-primary btn-lg"
                    :disabled="submitting || submitted"
                  >
                    <span v-if="submitting">
                      <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                      Submitting...
                    </span>
                    <span v-else-if="submitted">
                      ✓ Submitted!
                    </span>
                    <span v-else>
                      Submit Joke
                    </span>
                  </button>
                </div>
              </form>

              <div v-if="submitted" class="alert alert-success mt-4">
                <strong>Thank you!</strong> Your joke has been published successfully.
              </div>

              <div v-if="errorMessage" class="alert alert-danger mt-4">
                <strong>Error:</strong> {{ errorMessage }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import { createJoke } from '../services/jokeService';
import { updateSEO } from '../utils/seo';
import { trackJokeSubmit } from '../services/analyticsService';

const formData = reactive({
  authorName: '',
  title: '',
  text: '',
  category: '',
  language: 'en'
});

const submitting = ref(false);
const submitted = ref(false);
const errorMessage = ref('');

const handleSubmit = async () => {
  if (!formData.text.trim() || !formData.category || !formData.language) {
    errorMessage.value = 'Please fill in all required fields.';
    return;
  }

  submitting.value = true;
  errorMessage.value = '';

  try {
    await createJoke({
      authorName: formData.authorName.trim() || 'Anonymous',
      title: formData.title.trim(),
      text: formData.text.trim(),
      category: formData.category,
      language: formData.language
    });

    //Track joke submission
    trackJokeSubmit(formData.category, formData.language, 'user');

    submitted.value = true;
    
    setTimeout(() => {
      submitted.value = false;
      formData.authorName = '';
      formData.title = '';
      formData.text = '';
      formData.category = '';
      formData.language = 'en';
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