<template>
    <div>
        <div class="tiptap-renderer" ref="rendererEl"></div>
        
        <!-- Image Zoom Modal -->
        <Teleport to="body">
            <div v-if="showZoom" class="image-zoom-overlay" @click="closeZoom">
                <div class="image-zoom-container">
                    <button @click="closeZoom" class="zoom-close-btn">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                    <img :src="zoomedImageSrc" alt="Zoomed image" class="zoomed-image" />
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script setup>
import 'katex/dist/katex.min.css'
import katex from 'katex'

const props = defineProps({
    content: {
        type: String,
        default: ''
    }
})

const rendererEl = ref(null)
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

    // Normalize MathJax delimiters into $ / $$ to keep a single rendering pipeline
    html = html
        .replace(/\\\[([\s\S]+?)\\\]/g, (_match, formula) => `$$${formula}$$`)
        .replace(/\\\(([\s\S]+?)\\\)/g, (_match, formula) => `$${formula}$`)
    
    // Replace block math $$...$$ with rendered KaTeX (do this first)
    html = html.replace(/\$\$([\s\S]+?)\$\$/g, (match, formula) => {
        try {
            return `<div class="math-display">${katex.renderToString(formula, {
                throwOnError: false,
                displayMode: true
            })}</div>`
        } catch (e) {
            return match
        }
    })

    // Replace inline math $...$ with rendered KaTeX (avoid $$...$$)
    html = html.replace(/\$(?!\$)([\s\S]+?)\$(?!\$)/g, (match, formula) => {
        try {
            return katex.renderToString(formula, {
                throwOnError: false,
                displayMode: false
            })
        } catch (e) {
            return match
        }
    })
    
    return html
}

watch(() => props.content, (newContent) => {
    if (rendererEl.value) {
        rendererEl.value.innerHTML = renderMath(newContent)
    }
}, { immediate: true })

onMounted(() => {
    if (rendererEl.value && props.content) {
        rendererEl.value.innerHTML = renderMath(props.content)
    }
    
    // Add click listener for image zoom
    if (rendererEl.value) {
        rendererEl.value.addEventListener('click', handleImageClick)
    }
})

onBeforeUnmount(() => {
    if (rendererEl.value) {
        rendererEl.value.removeEventListener('click', handleImageClick)
    }
})
</script>

<style scoped>
.tiptap-renderer {
    color: var(--color-gh-text);
    line-height: 1.6;
    max-width: 100%;
    overflow-wrap: anywhere;
    word-break: break-word;
    width: 100%;
}

.tiptap-renderer :deep(*) {
    max-width: 100%;
}

.tiptap-renderer :deep(h2) {
    font-size: 1.5rem;
    font-weight: bold;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    color: var(--color-gh-text);
    overflow-wrap: anywhere;
    word-break: break-word;
}

.tiptap-renderer :deep(h3) {
    font-size: 1.25rem;
    font-weight: bold;
    margin-top: 0.75rem;
    margin-bottom: 0.5rem;
    color: var(--color-gh-text);
    overflow-wrap: anywhere;
    word-break: break-word;
}

.tiptap-renderer :deep(p) {
    margin-bottom: 0.5rem;
    overflow-wrap: anywhere;
    word-break: break-word;
}

.tiptap-renderer :deep(code) {
    background: color-mix(in srgb, var(--color-gh-accent) 10%, transparent);
    color: var(--color-gh-accent);
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    font-family: 'Courier New', monospace;
    font-size: 0.875em;
    word-break: break-all;
}

.tiptap-renderer :deep(pre) {
    background: var(--color-gh-bg);
    border: 1px solid var(--color-gh-border);
    border-radius: 0.5rem;
    padding: 1rem;
    margin: 0.5rem 0;
    overflow-x: auto;
    max-width: 100%;
}

.tiptap-renderer :deep(pre code) {
    background: transparent;
    color: var(--color-gh-text);
    padding: 0;
    font-size: 0.875rem;
    line-height: 1.5;
    white-space: pre-wrap;
    word-break: break-word;
}

.tiptap-renderer :deep(ul),
.tiptap-renderer :deep(ol) {
    padding-left: 1.5rem;
    margin: 0.5rem 0;
    max-width: 100%;
}

.tiptap-renderer :deep(li) {
    margin-bottom: 0.25rem;
    overflow-wrap: anywhere;
    word-break: break-word;
}

.tiptap-renderer :deep(a) {
    color: var(--color-gh-accent);
    text-decoration: underline;
}

.tiptap-renderer :deep(a:hover) {
    text-decoration: none;
}

.tiptap-renderer :deep(img) {
    max-width: 100%;
    height: auto;
    border-radius: 0.5rem;
    margin: 0.5rem 0;
    cursor: zoom-in;
    transition: all 0.2s ease;
}

.tiptap-renderer :deep(table) {
    width: 100%;
    max-width: 100%;
    display: block;
    overflow-x: auto;
}

.tiptap-renderer :deep(th),
.tiptap-renderer :deep(td) {
    word-break: break-word;
    overflow-wrap: anywhere;
}

.tiptap-renderer :deep(img:hover) {
    opacity: 0.9;
    box-shadow: 0 0 20px rgba(47, 129, 247, 0.3);
}

.tiptap-renderer :deep(strong) {
    font-weight: bold;
}

.tiptap-renderer :deep(em) {
    font-style: italic;
}

.tiptap-renderer :deep(.math-inline) {
    display: inline-block;
    padding: 0.125rem 0.25rem;
    background: color-mix(in srgb, var(--color-gh-accent) 5%, transparent);
    border-radius: 0.25rem;
}

.tiptap-renderer :deep(.math-display) {
    display: block;
    margin: 1rem 0;
    padding: 1rem;
    background: var(--color-gh-bg);
    border: 1px solid var(--color-gh-border);
    border-radius: 0.5rem;
    overflow-x: auto;
    text-align: center;
}

.tiptap-renderer :deep(.katex) {
    color: var(--color-gh-text);
    max-width: 100%;
    overflow-x: auto;
}

.tiptap-renderer :deep(.katex-display) {
    margin: 0;
    overflow-x: auto;
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

@media (max-width: 640px) {
    .tiptap-renderer {
        font-size: 0.95rem;
        line-height: 1.55;
    }

    .tiptap-renderer :deep(h2) {
        font-size: 1.25rem;
    }

    .tiptap-renderer :deep(h3) {
        font-size: 1.1rem;
    }

    .tiptap-renderer :deep(pre) {
        padding: 0.75rem;
        font-size: 0.85rem;
    }

    .tiptap-renderer :deep(pre code) {
        font-size: 0.8rem;
    }
}
</style>
