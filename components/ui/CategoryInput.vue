<template>
    <div class="relative">
        <label class="block text-gh-text text-sm font-medium mb-2">
            Category <span class="text-red-400">*</span>
        </label>
        <div class="relative">
            <input
                ref="inputRef"
                v-model="inputValue"
                type="text"
                :placeholder="placeholder"
                required
                class="w-full px-4 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text focus:outline-none focus:ring-2 focus:ring-gh-accent"
                @input="handleInput"
                @blur="handleBlur"
                @keydown.down.prevent="navigateDown"
                @keydown.up.prevent="navigateUp"
                @keydown.enter.prevent="selectHighlighted"
                @keydown.escape="showDropdown = false"
            />
            
            <!-- Dropdown -->
            <div
                v-if="showDropdown && filteredCategories.length > 0"
                class="absolute z-10 w-full mt-1 bg-gh-bg border border-gh-border rounded-md shadow-lg max-h-60 overflow-y-auto"
            >
                <button
                    v-for="(category, index) in filteredCategories"
                    :key="category"
                    type="button"
                    class="w-full px-4 py-2 text-left transition-colors"
                    :class="index === highlightedIndex 
                        ? 'bg-gh-accent text-white' 
                        : 'text-gh-text hover:bg-gh-bg-secondary hover:text-gh-accent'"
                    @mousedown.prevent="selectCategory(category)"
                    @mouseenter="highlightedIndex = index"
                >
                    <span v-html="highlightMatch(category, inputValue)"></span>
                </button>
            </div>
        </div>
        
        <!-- Helper text -->
        <p class="mt-1 text-xs text-gh-muted">
            Type to filter existing categories or create a new one
        </p>
    </div>
</template>

<script setup>
import Fuse from 'fuse.js'

const props = defineProps({
    modelValue: {
        type: String,
        required: true
    },
    placeholder: {
        type: String,
        default: 'e.g., Math, Science, History'
    }
})

const emit = defineEmits(['update:modelValue'])

const { questionInfo } = useQuestionInfo()

const inputRef = ref(null)
const inputValue = ref(props.modelValue)
const showDropdown = ref(false)
const highlightedIndex = ref(0)

// Initialize Fuse.js for fuzzy search
const fuse = computed(() => {
    return new Fuse(questionInfo.value.categories || [], {
        threshold: 0.3, // Lower = stricter matching (0 = exact, 1 = match anything)
        minMatchCharLength: 2, // Need at least 2 characters to match
        ignoreLocation: true, // Match anywhere in string, not just beginning
        keys: ['$self'] // Search the string itself
    })
})

// Compute filtered categories based on input with fuzzy search
const filteredCategories = computed(() => {
    // Only show suggestions if user has typed something
    if (!inputValue.value.trim()) {
        return []
    }
    
    const searchTerm = inputValue.value.trim()
    const results = fuse.value.search(searchTerm)
    
    // Return top 10 matches
    return results.slice(0, 10).map(result => result.item)
})

// Watch for external changes to modelValue
watch(() => props.modelValue, (newVal) => {
    inputValue.value = newVal
})

// Update parent when input changes
watch(inputValue, (newVal) => {
    emit('update:modelValue', newVal)
})

const handleInput = () => {
    showDropdown.value = true
    highlightedIndex.value = 0
}

const handleBlur = () => {
    // Delay to allow click event to fire
    setTimeout(() => {
        showDropdown.value = false
    }, 200)
}

const selectCategory = (category) => {
    inputValue.value = category
    showDropdown.value = false
    inputRef.value?.blur()
}

const navigateDown = () => {
    if (highlightedIndex.value < filteredCategories.value.length - 1) {
        highlightedIndex.value++
    }
}

const navigateUp = () => {
    if (highlightedIndex.value > 0) {
        highlightedIndex.value--
    }
}

const selectHighlighted = () => {
    if (filteredCategories.value.length > 0 && highlightedIndex.value >= 0) {
        selectCategory(filteredCategories.value[highlightedIndex.value])
    }
}

// Highlight matching characters in the category
const highlightMatch = (category, search) => {
    if (!search.trim()) return category
    
    const searchTerm = search.trim()
    const regex = new RegExp(`(${searchTerm})`, 'gi')
    // Use inline style for the mark to ensure it works with theme colors
    return category.replace(regex, '<mark style="background-color: color-mix(in srgb, var(--color-gh-accent) 20%, transparent); color: var(--color-gh-accent); font-weight: 600; padding: 0 2px; border-radius: 2px;">$1</mark>')
}
</script>
