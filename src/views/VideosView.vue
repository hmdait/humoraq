<template>
    <DefaultLayout>
        <div class="videos-view">
            <div class="container py-4">
                <!-- Page Header -->
                <div class="page-header mb-4">
                    <h1 class="page-title">
                        <i class="bi bi-play-circle-fill me-2"></i>
                        Videos
                    </h1>
                    <p class="page-subtitle text-muted">
                        Watch funny videos from YouTube and TikTok
                    </p>
                </div>

                <!-- Loading State -->
                <div v-if="loading" class="loading-container text-center py-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading videos...</span>
                    </div>
                    <p class="mt-3 text-muted">Loading videos...</p>
                </div>

                <!-- Error State -->
                <div v-else-if="hasError" class="alert alert-danger" role="alert">
                    <i class="bi bi-exclamation-triangle-fill me-2"></i>
                    {{ errorMessage }}
                </div>

                <!-- Videos Grid -->
                <VideoGrid v-else :videos="videos" :loading="loading" />
            </div>
        </div>
    </DefaultLayout>
</template>

<script setup>
    import { computed, onMounted } from 'vue';
    import { useStore } from 'vuex';
    import VideoGrid from '@/components/VideoGrid.vue';
    import DefaultLayout from '@/layouts/DefaultLayout.vue';

    const store = useStore();

    // Vuex state
    const videos = computed(() => store.getters['videos/allVideos']);
    const loading = computed(() => store.getters['videos/isLoading']);
    const hasError = computed(() => store.getters['videos/hasError']);
    const errorMessage = computed(() => store.getters['videos/errorMessage']);

    // Fetch videos on mount
    onMounted(async () => {
        // Set page title
        document.title = 'Funny Videos | Humoraq';

        // Set meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', 'Watch hilarious videos from YouTube and TikTok. Discover the funniest content curated by Humoraq.');
        }

        // Fetch videos from Firestore
        await store.dispatch('videos/fetchVideos');
    });
</script>

<style scoped>
    .videos-view {
        min-height: calc(100vh - 200px);
        padding-top: 80px;
        /* Account for fixed header */
    }

    .page-header {
        text-align: center;
        margin-bottom: 2rem;
    }

    .page-title {
        font-size: 2.5rem;
        font-weight: bold;
        color: var(--text-color, #333);
        margin-bottom: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .page-title i {
        color: var(--primary-color, #0d6efd);
    }

    .page-subtitle {
        font-size: 1.1rem;
        margin: 0;
    }

    .loading-container {
        padding: 3rem 0;
    }

    .spinner-border {
        width: 3rem;
        height: 3rem;
    }

    /* Dark mode */
    .dark-mode .page-title {
        color: var(--text-color);
    }

    .dark-mode .alert-danger {
        background-color: rgba(220, 53, 69, 0.1);
        border-color: rgba(220, 53, 69, 0.3);
        color: #ff6b6b;
    }

    /* Responsive */
    @media (max-width: 768px) {
        .videos-view {
            padding-top: 70px;
        }

        .page-title {
            font-size: 2rem;
        }

        .page-subtitle {
            font-size: 1rem;
        }
    }
</style>