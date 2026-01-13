<template>
    <DefaultLayout>
        <div class="videos-view">
            <div class="container">
                <!-- Page Header -->
                

                <!-- Category Filter (Multi-Select) -->
                <VideoCategoryFilter />

                <!-- Info Badge: Show active filters -->
                <div v-if="selectedLanguages.length > 0 || selectedCategories.length > 0"
                    class="alert alert-info d-flex align-items-center mb-4">
                    <i class="bi bi-info-circle me-2"></i>
                    <div class="filter-summary">
                        <div v-if="selectedLanguages.length > 0">
                            <strong>Languages:</strong> {{ languageNames }}
                        </div>
                        <div v-if="selectedCategories.length > 0">
                            <strong>Categories:</strong> {{ categoryNames }}
                        </div>
                        <div v-if="selectedCategories.length === 0">
                            <strong>Categories:</strong> All
                        </div>
                    </div>
                </div>

                <!-- Results count -->
                <div v-if="!loading && videos.length > 0" class="results-count mb-3">
                    <small class="text-muted">
                        Showing <strong>{{ videos.length }}</strong>
                        {{ videos.length === 1 ? 'video' : 'videos' }}
                    </small>
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
                <VideoGrid v-else-if="videos.length > 0" :videos="videos" :loading="loading" />

                <!-- Empty State -->
                <div v-else class="empty-state text-center py-5">
                    <i class="bi bi-camera-video-off display-1 text-muted mb-3"></i>
                    <h4 class="text-muted">No videos found</h4>
                    <div class="text-muted">
                        <p v-if="selectedCategories.length > 0">
                            No videos available in the selected categories
                            <strong>({{ categoryNames }})</strong>
                            for your language preferences.
                        </p>
                        <p v-else>
                            No videos available for your selected languages.
                        </p>
                        <p class="small mt-3">
                            <strong>Try:</strong>
                        </p>
                        <ul class="list-unstyled small">
                            <li v-if="selectedCategories.length > 0">
                                <i class="bi bi-arrow-right me-1"></i>
                                Clear category filters above
                            </li>
                            <li>
                                <i class="bi bi-arrow-right me-1"></i>
                                Change language selection in the header
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </DefaultLayout>
</template>

<script setup>
    import { computed, onMounted, watch } from 'vue';
    import { useStore } from 'vuex';
    import VideoGrid from '@/components/VideoGrid.vue';
    import VideoCategoryFilter from '@/components/VideoCategoryFilter.vue';
    import { getVideoCategories } from '@/services/videoService';
    import DefaultLayout from '@/layouts/DefaultLayout.vue';

    const store = useStore();

    // Vuex state - uses filteredVideos getter which applies both language and category filters
    const videos = computed(() => store.getters['videos/filteredVideos']);
    const loading = computed(() => store.getters['videos/isLoading']);
    const hasError = computed(() => store.getters['videos/hasError']);
    const errorMessage = computed(() => store.getters['videos/errorMessage']);
    const selectedCategories = computed(() => store.getters['videos/selectedCategories']);

    // Get selected languages from global preferences (HeaderNav)
    const selectedLanguages = computed(() => store.getters['preferences/selectedLanguages']);

    // Display helpers
    const languageNames = computed(() => {
        const names = { en: 'English', fr: 'Français', ar: 'العربية' };
        return selectedLanguages.value.map(l => names[l] || l).join(', ');
    });

    const categoryNames = computed(() => {
        const categories = getVideoCategories();
        return selectedCategories.value
            .map(slug => {
                const cat = categories.find(c => c.slug === slug);
                return cat ? cat.name : slug;
            })
            .join(', ');
    });

    // Fetch videos on mount
    onMounted(async () => {
        // Set page title
        document.title = 'Funny Videos | Humoraq';

        // Set meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', 'Watch hilarious videos filtered by language and category. Discover the funniest content curated by Humoraq.');
        }

        // Fetch videos (language filtered in Firestore, category filtered client-side)
        await store.dispatch('videos/fetchVideos');
    });

    // Watch for language changes from HeaderNav (global filter)
    // Category changes don't need watching - they use computed property
    watch(selectedLanguages, async (newLanguages, oldLanguages) => {
        // Only refetch if languages actually changed
        if (JSON.stringify(newLanguages) !== JSON.stringify(oldLanguages)) {
            console.log('Languages changed, refetching videos:', newLanguages);
            await store.dispatch('videos/fetchVideos');
        }
    }, { deep: true });
</script>

<style scoped>
    .videos-view {
        min-height: calc(100vh - 200px);
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

    .alert-info {
        border-radius: 8px;
        border-left: 4px solid #0d6efd;
    }

    .filter-summary {
        line-height: 1.6;
    }

    .filter-summary div {
        margin-bottom: 0.25rem;
    }

    .filter-summary div:last-child {
        margin-bottom: 0;
    }

    .results-count {
        text-align: center;
    }

    .loading-container {
        padding: 3rem 0;
    }

    .spinner-border {
        width: 3rem;
        height: 3rem;
    }

    .empty-state {
        padding: 4rem 2rem;
        max-width: 600px;
        margin: 0 auto;
    }

    .empty-state i {
        font-size: 5rem;
        opacity: 0.3;
    }

    .empty-state h4 {
        font-weight: 600;
        margin-bottom: 1rem;
    }

    .empty-state p {
        font-size: 1rem;
        margin: 0.5rem 0;
    }

    .empty-state ul {
        text-align: left;
        display: inline-block;
        margin-top: 1rem;
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

    .dark-mode .alert-info {
        background-color: rgba(13, 110, 253, 0.1);
        border-color: rgba(13, 110, 253, 0.3);
        color: #6ea8fe;
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

        .empty-state {
            padding: 3rem 1rem;
        }

        .empty-state i {
            font-size: 4rem;
        }
    }
</style>