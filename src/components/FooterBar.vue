<template>
  <footer class="footer-bar py-4 mt-5">
    <div class="container">
      <div class="row g-4">
        
        <!-- About Section -->
        <div class="col-lg-4 col-md-6">
          <h5 class="fw-bold mb-3">About Humoraq</h5>
          <p class="text-muted small mb-3">
            A multilingual platform for sharing jokes and spreading joy across cultures.
          </p>
          <router-link to="/about" class="btn btn-sm btn-outline-primary">
            Learn More →
          </router-link>
        </div>

        <!-- Quick Links -->
        <div class="col-lg-2 col-md-6">
          <h5 class="fw-bold mb-3">Quick Links</h5>
          <ul class="list-unstyled">
            <li class="mb-2">
              <router-link to="/" class="text-muted text-decoration-none footer-link">
                Feed
              </router-link>
            </li>
            <li class="mb-2">
              <router-link to="/spotlight" class="text-muted text-decoration-none footer-link">
                Spotlight
              </router-link>
            </li>
            <li class="mb-2">
              <router-link to="/categories" class="text-muted text-decoration-none footer-link">
                Categories
              </router-link>
            </li>
            <li class="mb-2">
              <router-link to="/submit" class="text-muted text-decoration-none footer-link">
                Submit Joke
              </router-link>
            </li>
            <li class="mb-2">
              <router-link to="/about" class="text-muted text-decoration-none footer-link">
                About Us
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div class="col-lg-3 col-md-6">
          <h5 class="fw-bold mb-3">Contact Us</h5>
          <ul class="list-unstyled">
            <li class="mb-2">
              <a 
                href="mailto:humoraq.jk@gmail.com" 
                class="text-muted text-decoration-none footer-link"
              >
                <i class="bi bi-envelope me-2"></i>
                humoraq.jk@gmail.com
              </a>
            </li>
            <li class="mb-2 text-muted small">
              <i class="bi bi-clock me-2"></i>
              Response time: 24-48 hours
            </li>
          </ul>
        </div>

        <!-- Social Networks -->
        <div class="col-lg-3 col-md-6">
          <h5 class="fw-bold mb-3">Follow Us</h5>
          <div class="d-flex gap-3 mb-3">
            <a 
              href="https://facebook.com/humoraq" 
              target="_blank" 
              rel="noopener noreferrer"
              class="social-icon"
              aria-label="Facebook"
            >
              <i class="bi bi-facebook fs-4"></i>
            </a>
            <a 
              href="https://www.instagram.com/humoraq_ar/" 
              target="_blank" 
              rel="noopener noreferrer"
              class="social-icon"
              aria-label="Instagram"
            >
              <i class="bi bi-instagram fs-4"></i>
            </a>
            <a 
              href="https://www.tiktok.com/@humoraq" 
              target="_blank" 
              rel="noopener noreferrer"
              class="social-icon"
              aria-label="TikTok"
            >
              <i class="bi bi-tiktok fs-4"></i>
            </a>
            <a 
              href="https://x.com/Humoraq_jk" 
              target="_blank" 
              rel="noopener noreferrer"
              class="social-icon"
              aria-label="X"
            >
              <i class="bi bi-twitter fs-4"></i>
            </a>
          </div>
          <p class="text-muted small mb-0">
            Join our community and stay updated!
          </p>
        </div>

      </div>

      <!-- Bottom Bar -->
      <hr class="my-4">
      <div class="row">
        <div class="col-md-6 text-center text-md-start mb-3 mb-md-0">
          <p class="mb-0 text-muted small">
            &copy; {{ currentYear }} Humoraq. All rights reserved.
          </p>
        </div>
        <div class="col-md-6 text-center text-md-end">
          <p class="mb-0 text-muted small">
            Made with ❤️ for laughter
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue';

const currentYear = computed(() => new Date().getFullYear());
</script>

<style scoped>
.footer-bar {
  background-color: var(--bg-light);
  border-top: 1px solid #dee2e6;
}

.dark-mode .footer-bar {
  background-color: #1a1d20;
  border-top-color: #495057;
}

.footer-link {
  transition: color 0.2s ease;
  font-size: 0.9rem;
}

.footer-link:hover {
  color: var(--primary-color) !important;
}

.social-icon {
  color: #6c757d;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: transparent;
}

.social-icon:hover {
  color: var(--primary-color);
  background-color: rgba(13, 110, 253, 0.1);
  transform: translateY(-2px);
}

.dark-mode .social-icon {
  color: #adb5bd;
}

.dark-mode .social-icon:hover {
  color: var(--primary-color);
  background-color: rgba(13, 110, 253, 0.2);
}

h5 {
  font-size: 1rem;
  color: var(--text-color);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .footer-bar {
    text-align: center;
  }

  .social-icon {
    width: 36px;
    height: 36px;
  }
}
</style>