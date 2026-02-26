<template>
    <div class="fill-blank-container">
        <p class="text-sm text-gh-muted font-medium mb-3">Fill in the blanks:</p>

        <!-- Inline Text with Inputs -->
        <div ref="containerRef" class="prose prose-invert max-w-none text-gh-text leading-loose tiptap-content"
            v-html="formattedContent"></div>

        <!-- Image Zoom Modal -->
        <Teleport to="body">
            <div v-if="showZoom" class="image-zoom-overlay" @click="closeZoom">
                <div class="image-zoom-container">
                    <button @click="closeZoom" class="zoom-close-btn">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <img :src="zoomedImageSrc" alt="Zoomed image" class="zoomed-image" />
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script setup>
import { computed, ref, watch, onMounted, nextTick } from 'vue'
import 'katex/dist/katex.min.css'
import katex from 'katex'

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    questionContent: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['update:modelValue'])
const containerRef = ref(null)
const showZoom = ref(false)
const zoomedImageSrc = ref('')

const handleImageClick = (event) => {
    if (event.target.tagName === 'IMG') {
        zoomedImageSrc.value = event.target.src
        showZoom.value = true
    }
}

const closeZoom = () => {
    showZoom.value = false
    zoomedImageSrc.value = ''
}

const renderMath = (html) => {
    if (!html) return ''

    // Replace inline math $...$ with rendered KaTeX
    html = html.replace(/\$([^\$]+)\$/g, (match, formula) => {
        try {
            return katex.renderToString(formula, {
                throwOnError: false,
                displayMode: false
            })
        } catch (e) {
            return match
        }
    })

    // Replace block math $$...$$ with rendered KaTeX
    html = html.replace(/\$\$([^\$]+)\$\$/g, (match, formula) => {
        try {
            return `<div class="math-display">${katex.renderToString(formula, {
                throwOnError: false,
                displayMode: true
            })}</div>`
        } catch (e) {
            return match
        }
    })

    return html
}

// Generate HTML with inputs replacing blanks
const formattedContent = computed(() => {
    if (!props.questionContent) return ''

    // First render math
    const contentWithMath = renderMath(props.questionContent)

    let i = 0
    // Match underscores (single or multiple) possibly separated by dots, used as words
    // Replace with input element
    return contentWithMath.replace(/\b_+(?:\.+_+)*\b/g, (match) => {
        const index = i++
        // We render the input without value initially to avoid reactivity loops with v-html
        // Values are synced via DOM manipulation
        return `<input type="text" class="fill-blank-input inline-block mx-1 px-2 py-1 border-b-2 border-gh-border bg-transparent focus:border-gh-accent focus:outline-none min-w-[120px] text-center transition-colors text-gh-accent font-medium" data-index="${index}" placeholder="___" autocomplete="off" />`
    })
})

// Sync model -> DOM inputs
const syncInputs = () => {
    if (!containerRef.value) return

    const values = props.modelValue ? props.modelValue.split('<>') : []
    const inputs = containerRef.value.querySelectorAll('.fill-blank-input')

    inputs.forEach((input) => {
        const index = parseInt(input.dataset.index)
        const expectedValue = values[index] || ''

        // Only update if different to preserve cursor position if focused
        if (input.value !== expectedValue) {
            input.value = expectedValue
        }
    })
}

// Handle input events (delegated)
const setupEventListeners = () => {
    if (!containerRef.value) return

    // Remove old listeners if any (though Vue handles component lifecycle)
    containerRef.value.removeEventListener('input', handleInput)
    containerRef.value.addEventListener('input', handleInput)

    // Image zoom listener
    containerRef.value.removeEventListener('click', handleImageClick)
    containerRef.value.addEventListener('click', handleImageClick)
}

const handleInput = (e) => {
    if (e.target.classList.contains('fill-blank-input')) {
        const index = parseInt(e.target.dataset.index)
        const val = e.target.value
        updateBlank(index, val)
    }
}

const updateBlank = (index, value) => {
    const currentValues = props.modelValue ? props.modelValue.split('<>') : []

    // Ensure array has enough slots
    // Find total blanks to know size
    const totalBlanks = containerRef.value ? containerRef.value.querySelectorAll('.fill-blank-input').length : index + 1

    while (currentValues.length < totalBlanks) {
        currentValues.push('')
    }

    currentValues[index] = value
    emit('update:modelValue', currentValues.join('<>'))
}

// Watchers and Lifecycle
watch(() => props.modelValue, () => {
    nextTick(syncInputs)
})

watch(() => props.questionContent, () => {
    nextTick(() => {
        syncInputs()
        setupEventListeners()
    })
})

onMounted(() => {
    nextTick(() => {
        syncInputs()
        setupEventListeners()
    })
})
</script>

<style scoped>
.tiptap-content {
    color: var(--color-gh-text);
    line-height: 1.6;
}

.tiptap-content :deep(h2) {
    font-size: 1.5rem;
    font-weight: bold;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    color: var(--color-gh-text);
}

.tiptap-content :deep(h3) {
    font-size: 1.25rem;
    font-weight: bold;
    margin-top: 0.75rem;
    margin-bottom: 0.5rem;
    color: var(--color-gh-text);
}

.tiptap-content :deep(p) {
    margin-bottom: 0.5rem;
}

.tiptap-content :deep(code) {
    background: color-mix(in srgb, var(--color-gh-accent) 10%, transparent);
    color: var(--color-gh-accent);
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    font-family: 'Courier New', monospace;
    font-size: 0.875em;
}

.tiptap-content :deep(pre) {
    background: var(--color-gh-bg);
    border: 1px solid var(--color-gh-border);
    border-radius: 0.5rem;
    padding: 1rem;
    margin: 0.5rem 0;
    overflow-x: auto;
}

.tiptap-content :deep(pre code) {
    background: transparent;
    color: var(--color-gh-text);
    padding: 0;
    font-size: 0.875rem;
    line-height: 1.5;
}

.tiptap-content :deep(ul),
.tiptap-content :deep(ol) {
    padding-left: 1.5rem;
    margin: 0.5rem 0;
}

.tiptap-content :deep(li) {
    margin-bottom: 0.25rem;
}

.tiptap-content :deep(a) {
    color: var(--color-gh-accent);
    text-decoration: underline;
}

.tiptap-content :deep(a:hover) {
    text-decoration: none;
}

.tiptap-content :deep(img) {
    max-width: 100%;
    height: auto;
    border-radius: 0.5rem;
    margin: 0.5rem 0;
}

.tiptap-content :deep(strong) {
    font-weight: bold;
}

.tiptap-content :deep(em) {
    font-style: italic;
}

.tiptap-content :deep(.math-inline) {
    display: inline-block;
    padding: 0.125rem 0.25rem;
    background: color-mix(in srgb, var(--color-gh-accent) 5%, transparent);
    border-radius: 0.25rem;
}

.tiptap-content :deep(.math-display) {
    display: block;
    margin: 1rem 0;
    padding: 1rem;
    background: var(--color-gh-bg);
    border: 1px solid var(--color-gh-border);
    border-radius: 0.5rem;
    overflow-x: auto;
    text-align: center;
}

.tiptap-content :deep(.katex) {
    color: var(--color-gh-text);
}

.tiptap-content :deep(.katex-display) {
    margin: 0;
}

/* Image Zoom Modal */
.image-zoom-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.95);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    animation: fadeIn 0.2s ease;
    cursor: zoom-out;
}

.image-zoom-container {
    position: relative;
    max-width: 95vw;
    max-height: 95vh;
    padding: 2rem;
}

.zoom-close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: var(--color-gh-card);
    border: 2px solid var(--color-gh-border);
    border-radius: 0.5rem;
    padding: 0.5rem;
    color: var(--color-gh-text);
    cursor: pointer;
    transition: all 0.2s ease;
    z-index: 10001;
}

.zoom-close-btn:hover {
    background: var(--color-gh-accent);
    border-color: var(--color-gh-accent);
    box-shadow: 0 0 20px rgba(47, 129, 247, 0.5);
    transform: scale(1.1);
}

.zoomed-image {
    max-width: 100%;
    max-height: 90vh;
    border-radius: 0.5rem;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    animation: zoomIn 0.3s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes zoomIn {
    from {
        transform: scale(0.8);
        opacity: 0;
    }

    to {
        transform: scale(1);
        opacity: 1;
    }
}
</style>

<style>
/* Global styles for the injected inputs since they are v-html */
.fill-blank-input::placeholder {
    color: var(--color-gh-muted);
    opacity: 0.5;
}
</style>
