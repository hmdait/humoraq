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
            </li><li class="mb-2">
              <router-link to="/videos" class="text-muted text-decoration-none footer-link">
                Videos
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
            <li class="mb-2">
              <router-link to="/legal" class="text-muted text-decoration-none footer-link">
                Privacy & Terms
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div class="col-lg-3 col-md-6">
          <h5 class="fw-bold mb-3">Contact Us</h5>
          <ul class="list-unstyled">
            <li class="mb-2">
              <a href="mailto:humoraq.jk@gmail.com" class="text-muted text-decoration-none footer-link">
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

        <!-- Social Networks - UPDATED -->
        <div class="col-lg-3 col-md-6">
          <h5 class="fw-bold mb-3">Follow Us</h5>
          <div class="d-flex gap-2 flex-wrap mb-3">
            <!-- Facebook -->
            <a href="https://facebook.com/humoraq" target="_blank" rel="noopener noreferrer" class="social-icon"
              aria-label="Facebook" title="Facebook">
              <i class="bi bi-facebook fs-4"></i>
            </a>

            <!-- Instagram -->
            <a href="https://instagram.com/humoraq_jks" target="_blank" rel="noopener noreferrer" class="social-icon"
              aria-label="Instagram" title="Instagram">
              <i class="bi bi-instagram fs-4"></i>
            </a>

            <!-- TikTok -->
            <a href="https://tiktok.com/@humoraq" target="_blank" rel="noopener noreferrer" class="social-icon"
              aria-label="TikTok" title="TikTok">
              <i class="bi bi-tiktok fs-4"></i>
            </a>

            <!-- X (Twitter) - UPDATED WITH CUSTOM X LOGO -->
            <a href="https://x.com/Humoraq_jk" target="_blank" rel="noopener noreferrer"
              class="social-icon social-icon-x" aria-label="X (Twitter)" title="X (formerly Twitter)">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            <!-- Pinterest - NEW -->
            <a href="https://fr.pinterest.com/humoraq_jk/" target="_blank" rel="noopener noreferrer" class="social-icon"
              aria-label="Pinterest" title="Pinterest">
              <i class="bi bi-pinterest fs-4"></i>
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

  /* Social Icons Styling */
  .social-icon {
    color: #6c757d;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.05);
    text-decoration: none;
  }

  .social-icon:hover {
    color: #fff;
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  /* Individual Social Icon Hover Colors */
  .social-icon:hover:has(.bi-facebook) {
    background-color: #1877f2;
  }

  .social-icon:hover:has(.bi-instagram) {
    background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
  }

  .social-icon:hover:has(.bi-tiktok) {
    background-color: #000000;
  }

  .social-icon:hover:has(.bi-pinterest) {
    background-color: #e60023;
  }

  /* X (Twitter) Custom Styling */
  .social-icon-x:hover {
    background-color: #000000;
  }

  .social-icon-x svg {
    transition: transform 0.3s ease;
  }

  .social-icon-x:hover svg {
    transform: scale(1.1);
  }

  /* Dark Mode Social Icons */
  .dark-mode .social-icon {
    color: #adb5bd;
    background-color: rgba(255, 255, 255, 0.05);
  }

  .dark-mode .social-icon:hover {
    color: #fff;
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
      width: 40px;
      height: 40px;
    }
  }
</style>