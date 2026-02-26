<template>
    <div class="mb-8">
        <!-- Mobile Toggle Button -->
        <button @click="showFilters = !showFilters"
            class="md:hidden w-full flex items-center justify-between p-4 bg-gh-card border border-gh-border rounded-xl mb-4">
            <span class="flex items-center gap-2 text-gh-text font-medium">
                <svg class="w-5 h-5 text-gh-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Browse Filters
                <span v-if="hasActiveFilters" class="px-2 py-0.5 bg-gh-accent text-white text-xs rounded-full">
                    {{ activeFilterCount }}
                </span>
            </span>
            <svg :class="['w-5 h-5 text-gh-muted transition-transform', showFilters ? 'rotate-180' : '']" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
        </button>

        <!-- Filter Panel -->
        <div :class="['filter-panel', showFilters ? 'filter-panel--open' : 'filter-panel--closed md:filter-panel--open']">
            <div class="bg-gh-card border border-gh-border rounded-xl p-4 md:p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <!-- Category Filter -->
                    <div class="filter-section">
                        <label class="block text-sm font-medium text-gh-text mb-2">Category</label>
                        <div class="relative">
                            <input v-model="categoryInput" type="text" placeholder="Type to filter categories..."
                                class="filter-input" />
                            <!-- Category Suggestions Dropdown - only show when typing >= 2 chars -->
                            <div v-if="categoryInput.trim().length >= 2 && filteredCategories.length > 0"
                                class="suggestions-dropdown">
                                <button v-for="cat in filteredCategories" :key="cat" @mousedown.prevent="selectCategory(cat)"
                                    class="suggestion-item">
                                    {{ cat }}
                                </button>
                            </div>
                        </div>
                        <!-- Selected Category -->
                        <div v-if="selectedCategory" class="mt-3">
                            <span class="selected-pill">
                                {{ selectedCategory }}
                                <button @click="selectedCategory = ''" class="ml-1.5 hover:text-red-400">
                                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </span>
                        </div>
                        <!-- Suggested Categories -->
                        <div v-if="!selectedCategory && suggestedCategories.length > 0" class="mt-3">
                            <p class="text-xs text-gh-muted mb-2">Popular:</p>
                            <div class="flex flex-wrap gap-2">
                                <button v-for="cat in suggestedCategories.slice(0, 5)" :key="cat" @click="selectCategory(cat)"
                                    class="suggestion-pill">
                                    {{ cat }}
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Tags Filter -->
                    <div class="filter-section">
                        <label class="block text-sm font-medium text-gh-text mb-2">Tags</label>
                        <div class="relative">
                            <input v-model="tagInput" type="text" placeholder="Type to filter tags..." class="filter-input"
                                @keydown.enter.prevent="addTagFromInput" />
                            <!-- Tag Suggestions Dropdown - only show when typing >= 2 chars -->
                            <div v-if="tagInput.trim().length >= 2 && filteredTags.length > 0" class="suggestions-dropdown">
                                <button v-for="tag in filteredTags" :key="tag" @mousedown.prevent="addTag(tag)"
                                    class="suggestion-item">
                                    {{ tag }}
                                </button>
                            </div>
                        </div>
                        <!-- Selected Tags -->
                        <div v-if="selectedTags.length > 0" class="mt-3 flex flex-wrap gap-2">
                            <span v-for="tag in selectedTags" :key="tag" class="selected-pill">
                                {{ tag }}
                                <button @click="removeTag(tag)" class="ml-1.5 hover:text-red-400">
                                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </span>
                        </div>
                        <!-- Suggested Tags -->
                        <div v-if="selectedTags.length === 0 && suggestedTags.length > 0" class="mt-3">
                            <p class="text-xs text-gh-muted mb-2">Popular:</p>
                            <div class="flex flex-wrap gap-2">
                                <button v-for="tag in suggestedTags.slice(0, 8)" :key="tag" @click="addTag(tag)"
                                    class="suggestion-pill">
                                    {{ tag }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Filter Actions -->
                <div class="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t border-gh-border">
                    <Button variant="primary" @click="applyFilters" :disabled="!hasActiveFilters && !filtersApplied"
                        class="flex-1 sm:flex-none">
                        <span class="flex items-center justify-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            Apply Filters
                        </span>
                    </Button>
                    <Button v-if="hasActiveFilters || filtersApplied" variant="secondary" @click="clearFilters"
                        class="flex-1 sm:flex-none">
                        <span class="flex items-center justify-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Clear All
                        </span>
                    </Button>
                </div>
            </div>
        </div>

        <!-- Active Filters Summary (shown when panel is closed on mobile) -->
        <div v-if="filtersApplied && !showFilters"
            class="md:hidden mt-4 p-3 bg-gh-accent/10 border border-gh-accent/20 rounded-lg">
            <p class="text-sm text-gh-text">
                <span class="font-medium">Filtering by:</span>
                <span v-if="appliedCategory" class="ml-2">Category: <strong>{{ appliedCategory }}</strong></span>
                <span v-if="appliedTags.length > 0" class="ml-2">Tags: <strong>{{ appliedTags.join(', ') }}</strong></span>
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import Button from '~/components/ui/Button.vue'
import { useQuizInfo } from '~/composables/useQuizInfo'

const props = defineProps({
    availableCategories: {
        type: Array as PropType<string[]>,
        default: () => []
    },
    availableTags: {
        type: Array as PropType<string[]>,
        default: () => []
    }
})

const emit = defineEmits<{
    (event: 'apply', payload: { category: string; tags: string[] }): void
    (event: 'clear'): void
}>()

const { getRecommendations, createDebouncedAutocomplete } = useQuizInfo()

const showFilters = ref(false)
const categoryInput = ref('')
const tagInput = ref('')

const selectedCategory = ref('')
const selectedTags = ref<string[]>([])

const appliedCategory = ref('')
const appliedTags = ref<string[]>([])
const filtersApplied = ref(false)

const recommendedCategories = ref<string[]>([])
const recommendedTags = ref<string[]>([])
const autocompleteCategoryResults = ref<string[]>([])
const autocompleteTagResults = ref<string[]>([])

const suggestedCategories = computed(() => {
    if (categoryInput.value.trim()) {
        return autocompleteCategoryResults.value || []
    }

    if (recommendedCategories.value.length > 0) {
        return recommendedCategories.value.slice(0, 5)
    }

    return (props.availableCategories || []).slice(0, 5)
})

const suggestedTags = computed(() => {
    if (tagInput.value.trim()) {
        return autocompleteTagResults.value || []
    }

    if (recommendedTags.value.length > 0) {
        return recommendedTags.value.slice(0, 8)
    }

    return (props.availableTags || []).slice(0, 8)
})

const debouncedCategoryAutocomplete = createDebouncedAutocomplete('categories', 300)
const debouncedTagAutocomplete = createDebouncedAutocomplete('tags', 300)

watch(categoryInput, (newVal) => {
    if (newVal.trim().length >= 2) {
        debouncedCategoryAutocomplete(newVal, (results) => {
            autocompleteCategoryResults.value = results.slice(0, 3)
        }, 3)
    } else {
        autocompleteCategoryResults.value = []
    }
})

watch(tagInput, (newVal) => {
    if (newVal.trim().length >= 2) {
        debouncedTagAutocomplete(newVal, (results) => {
            autocompleteTagResults.value = results.filter(
                tag => !selectedTags.value.includes(tag)
            ).slice(0, 3)
        }, 3)
    } else {
        autocompleteTagResults.value = []
    }
})

const filteredCategories = computed(() => {
    if (categoryInput.value.trim().length >= 2) {
        return (autocompleteCategoryResults.value || []).slice(0, 3)
    }
    return []
})

const filteredTags = computed(() => {
    if (tagInput.value.trim().length >= 2) {
        return (autocompleteTagResults.value || []).filter(
            tag => !selectedTags.value.includes(tag)
        ).slice(0, 3)
    }
    return []
})

const hasActiveFilters = computed(() => {
    return selectedCategory.value !== '' || selectedTags.value.length > 0
})

const activeFilterCount = computed(() => {
    let count = 0
    if (selectedCategory.value) count++
    count += selectedTags.value.length
    return count
})

const selectCategory = (cat: string) => {
    selectedCategory.value = cat
    categoryInput.value = ''
}

const addTag = (tag: string) => {
    if (!selectedTags.value.includes(tag)) {
        selectedTags.value.push(tag)
    }
    tagInput.value = ''
}

const addTagFromInput = () => {
    const tag = tagInput.value.trim()
    if (tag && !selectedTags.value.includes(tag)) {
        selectedTags.value.push(tag)
    }
    tagInput.value = ''
}

const removeTag = (tag: string) => {
    selectedTags.value = selectedTags.value.filter(t => t !== tag)
}

const applyFilters = () => {
    appliedCategory.value = selectedCategory.value
    appliedTags.value = [...selectedTags.value]
    filtersApplied.value = hasActiveFilters.value
    emit('apply', {
        category: appliedCategory.value,
        tags: appliedTags.value
    })
    showFilters.value = false
}

const clearFilters = () => {
    selectedCategory.value = ''
    selectedTags.value = []
    appliedCategory.value = ''
    appliedTags.value = []
    filtersApplied.value = false
    categoryInput.value = ''
    tagInput.value = ''
    emit('clear')
}

const fetchRecommendations = async () => {
    const result = await getRecommendations(10)
    if (result.success && result.data) {
        recommendedCategories.value = result.data.data.categories || []
        recommendedTags.value = result.data.data.tags || []
    }
}

onMounted(() => {
    fetchRecommendations()
})
</script>

<style scoped>
.filter-panel--closed {
    display: none;
}

.filter-panel--open {
    display: block;
}

@media (min-width: 768px) {
    .filter-panel--closed {
        display: block;
    }
}

.filter-input {
    width: 100%;
    padding: 0.75rem 1rem;
    background: var(--color-gh-bg);
    border: 1px solid var(--color-gh-border);
    border-radius: 0.75rem;
    color: var(--color-gh-text);
    font-size: 0.875rem;
    transition: all 0.2s ease;
}

.filter-input:focus {
    outline: none;
    border-color: var(--color-gh-accent);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-gh-accent) 20%, transparent);
}

.filter-input::placeholder {
    color: var(--color-gh-muted);
}

.suggestions-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 0.25rem;
    background: var(--color-gh-card);
    border: 1px solid var(--color-gh-border);
    border-radius: 0.75rem;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
    z-index: 50;
    max-height: 200px;
    overflow-y: auto;
}

.suggestion-item {
    display: block;
    width: 100%;
    padding: 0.625rem 1rem;
    text-align: left;
    color: var(--color-gh-text);
    font-size: 0.875rem;
    transition: background 0.15s ease;
}

.suggestion-item:hover {
    background: color-mix(in srgb, var(--color-gh-accent) 10%, transparent);
}

.suggestion-item:first-child {
    border-radius: 0.75rem 0.75rem 0 0;
}

.suggestion-item:last-child {
    border-radius: 0 0 0.75rem 0.75rem;
}

.suggestion-pill {
    padding: 0.25rem 0.75rem;
    background: color-mix(in srgb, var(--color-gh-muted) 10%, transparent);
    color: var(--color-gh-text-muted);
    border: 1px solid color-mix(in srgb, var(--color-gh-muted) 20%, transparent);
    border-radius: 9999px;
    font-size: 0.75rem;
    transition: all 0.2s ease;
}

.suggestion-pill:hover {
    background: color-mix(in srgb, var(--color-gh-accent) 10%, transparent);
    color: var(--color-gh-accent);
    border-color: color-mix(in srgb, var(--color-gh-accent) 30%, transparent);
}

.selected-pill {
    display: inline-flex;
    align-items: center;
    padding: 0.375rem 0.75rem;
    background: color-mix(in srgb, var(--color-gh-accent) 15%, transparent);
    color: var(--color-gh-accent);
    border: 1px solid color-mix(in srgb, var(--color-gh-accent) 30%, transparent);
    border-radius: 9999px;
    font-size: 0.8rem;
    font-weight: 500;
}
</style>
