<template>
    <div class="tiptap-editor" :class="{ 'fullscreen-mode': isFullscreen }">
        <!-- Toolbar -->
        <div v-if="editor" class="editor-toolbar">
            <div class="toolbar-group">
                <button @click="editor.chain().focus().toggleBold().run()"
                    :class="{ 'is-active': editor.isActive('bold') }" class="toolbar-btn" type="button">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 12h8a4 4 0 110 8H6V4h7a4 4 0 110 8"></path>
                    </svg>
                </button>
                <button @click="editor.chain().focus().toggleItalic().run()"
                    :class="{ 'is-active': editor.isActive('italic') }" class="toolbar-btn" type="button">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M10 20l4-16m0 0l4 0m-4 0H6"></path>
                    </svg>
                </button>
                <button @click="editor.chain().focus().toggleCode().run()"
                    :class="{ 'is-active': editor.isActive('code') }" class="toolbar-btn" type="button">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M10 20l4-16m4 4l3 3-3 3M4 12l3 3-3 3"></path>
                    </svg>
                </button>
            </div>

            <div class="toolbar-divider"></div>

            <div class="toolbar-group">
                <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
                    :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }" class="toolbar-btn"
                    type="button">
                    H2
                </button>
                <button @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
                    :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }" class="toolbar-btn"
                    type="button">
                    H3
                </button>
            </div>

            <div class="toolbar-divider"></div>

            <div class="toolbar-group">
                <button @click="editor.chain().focus().toggleBulletList().run()"
                    :class="{ 'is-active': editor.isActive('bulletList') }" class="toolbar-btn" type="button">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>
                <button @click="editor.chain().focus().toggleOrderedList().run()"
                    :class="{ 'is-active': editor.isActive('orderedList') }" class="toolbar-btn" type="button">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M3 4h18M3 8h18M3 12h18M3 16h18M3 20h18"></path>
                    </svg>
                </button>
                <button @click="editor.chain().focus().toggleCodeBlock().run()"
                    :class="{ 'is-active': editor.isActive('codeBlock') }" class="toolbar-btn" type="button">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z">
                        </path>
                    </svg>
                </button>
            </div>

            <div class="toolbar-divider"></div>

            <div class="toolbar-group">
                <button @click="setLink" :class="{ 'is-active': editor.isActive('link') }" class="toolbar-btn"
                    type="button" title="Add Link">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1">
                        </path>
                    </svg>
                </button>
                <button @click="addImage" class="toolbar-btn" type="button" title="Insert Image">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z">
                        </path>
                    </svg>
                </button>
            </div>

            <div class="toolbar-divider"></div>

            <div class="toolbar-group">
                <button @click="addInlineMath" :class="{ 'is-active': editor.isActive('math_inline') }"
                    class="toolbar-btn" type="button" title="Inline Math ($...$)">
                    <span class="font-serif font-bold text-sm">ƒ(x)</span>
                </button>
                <button @click="addBlockMath" :class="{ 'is-active': editor.isActive('math_display') }"
                    class="toolbar-btn" type="button" title="Block Math ($$...$$)">
                    <span class="font-serif font-bold text-base">∑</span>
                </button>
            </div>

            <div class="toolbar-divider"></div>

            <div class="toolbar-group">
                <button @click="insertBlank" class="toolbar-btn toolbar-btn--blank" type="button" title="Insert Blank">
                    <span class="text-[10px] font-semibold">BLANK</span>
                </button>
            </div>

            <div class="toolbar-divider"></div>

            <div class="toolbar-group">
                <button @click="editor.chain().focus().undo().run()" :disabled="!editor.can().undo()"
                    class="toolbar-btn" type="button">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path>
                    </svg>
                </button>
                <button @click="editor.chain().focus().redo().run()" :disabled="!editor.can().redo()"
                    class="toolbar-btn" type="button">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6"></path>
                    </svg>
                </button>
            </div>

            <div class="toolbar-divider"></div>

            <!-- Fullscreen Toggle -->
            <div class="toolbar-group ml-auto">
                <button @click="toggleFullscreen" class="toolbar-btn fullscreen-btn" :class="{ 'is-fullscreen': isFullscreen }" type="button" :title="isFullscreen ? 'Exit Fullscreen (ESC)' : 'Enter Fullscreen'">
                    <svg v-if="!isFullscreen" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
                    </svg>
                    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>
        </div>

        <!-- Split View Container -->
        <div class="editor-split-container" :class="{ 'split-view': isFullscreen }">
            <!-- Editor Content -->
            <div class="editor-panel">
                <editor-content :editor="editor" class="editor-content" />
            </div>

            <!-- Preview Panel (only visible in fullscreen) -->
            <ClientOnly>
                <div v-if="isFullscreen" class="preview-panel">
                    <div class="preview-header">
                        <h3 class="text-sm font-semibold text-gh-text">Preview</h3>
                    </div>
                    <div class="preview-content">
                        <TiptapRenderer :content="editor?.getHTML() || ''" />
                    </div>
                </div>
            </ClientOnly>
        </div>

        <!-- Dialogs (Client-only to prevent hydration mismatch) -->
        <ClientOnly>
            <!-- Link Dialog -->
            <LinkDialog
                :is-open="showLinkDialog"
                title="Insert Link"
                placeholder="https://example.com"
                :default-value="currentLinkUrl"
                confirm-text="Insert"
                @close="showLinkDialog = false"
                @confirm="handleLinkConfirm"
            />

            <!-- Image Dialog -->
            <LinkDialog
                :is-open="showImageDialog"
                title="Insert Image"
                placeholder="https://example.com/image.jpg"
                confirm-text="Insert"
                @close="showImageDialog = false"
                @confirm="handleImageConfirm"
            />
        </ClientOnly>
    </div>
</template>

<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import ResizableImageExtension from 'tiptap-extension-resize-image'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Mathematics from '@tiptap/extension-mathematics'
import TiptapRenderer from '~/components/editor/TiptapRenderer.vue'
import LinkDialog from '~/components/editor/LinkDialog.vue'
import { common, createLowlight } from 'lowlight'
import 'katex/dist/katex.min.css'

const lowlight = createLowlight(common)

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    placeholder: {
        type: String,
        default: 'Start typing...'
    }
})

const emit = defineEmits(['update:modelValue'])

const isFullscreen = ref(false)
const showLinkDialog = ref(false)
const showImageDialog = ref(false)
const currentLinkUrl = ref('')

const toggleFullscreen = () => {
    isFullscreen.value = !isFullscreen.value
    if (isFullscreen.value) {
        document.body.style.overflow = 'hidden'
    } else {
        document.body.style.overflow = ''
    }
}

// Close fullscreen on escape key
onMounted(() => {
    const handleEscape = (e) => {
        if (e.key === 'Escape' && isFullscreen.value) {
            toggleFullscreen()
        }
    }
    window.addEventListener('keydown', handleEscape)
    
    onBeforeUnmount(() => {
        window.removeEventListener('keydown', handleEscape)
        document.body.style.overflow = ''
    })
})

const editor = useEditor({
    content: props.modelValue,
    extensions: [
        StarterKit.configure({
            codeBlock: false, // Disable default code block
            dropcursor: {
                color: '#2f81f7',
                width: 3,
            },
        }),
        Placeholder.configure({
            placeholder: props.placeholder,
        }),
        ResizableImageExtension,
        CodeBlockLowlight.configure({
            lowlight,
        }),
        Mathematics,
    ],
    editorProps: {
        attributes: {
            class: 'prose prose-invert max-w-none focus:outline-none',
            spellcheck: 'false',
        },
        handleDOMEvents: {
            drop: (view, event) => {
                const hasFiles = event.dataTransfer?.files?.length
                if (hasFiles) {
                    event.preventDefault()
                    return true
                }
                return false
            },
        },
    },
    onUpdate: ({ editor }) => {
        emit('update:modelValue', editor.getHTML())
    },
})

// Watch for external changes
watch(() => props.modelValue, (value) => {
    const isSame = editor.value?.getHTML() === value
    if (!isSame && editor.value) {
        editor.value.commands.setContent(value, false)
    }
})

// Link management
const setLink = () => {
    currentLinkUrl.value = editor.value?.getAttributes('link').href || ''
    showLinkDialog.value = true
}

const handleLinkConfirm = (url) => {
    showLinkDialog.value = false
    
    if (!url || url.trim() === '') {
        editor.value?.chain().focus().extendMarkRange('link').unsetLink().run()
        return
    }

    editor.value?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}

// Image management
const addImage = () => {
    showImageDialog.value = true
}

const handleImageConfirm = (url) => {
    showImageDialog.value = false
    
    if (url && url.trim() !== '') {
        editor.value?.chain().focus().setImage({ 
            src: url,
            width: '250px'
        }).run()
    }
}

// Math formula management
const addInlineMath = () => {
    const latex = window.prompt('Enter LaTeX formula (inline):', 'x^2 + y^2 = z^2')

    if (latex !== null && latex !== '') {
        editor.value?.chain().focus().insertContent(`$${latex}$`).run()
    }
}

const addBlockMath = () => {
    const latex = window.prompt('Enter LaTeX formula (block):', '\\sum_{i=1}^{n} x_i')

    if (latex !== null && latex !== '') {
        editor.value?.chain().focus().insertContent(`$$${latex}$$`).run()
    }
}

// Insert blank placeholder
const insertBlank = () => {
    const blankText = ' _._._._._._ '
    editor.value?.chain().focus().insertContent(blankText).run()
}

// Cleanup
onBeforeUnmount(() => {
    editor.value?.destroy()
    document.body.style.overflow = ''
})
</script>

<style scoped>
.tiptap-editor {
    border: 2px solid var(--color-gh-border);
    border-radius: 0.75rem;
    background: var(--color-gh-card);
    transition: all 0.2s ease;
}

.tiptap-editor:focus-within {
    border-color: var(--color-gh-accent);
    box-shadow: 0 0 20px rgba(47, 129, 247, 0.15);
}

.editor-toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 0.75rem;
    border-bottom: 1px solid var(--color-gh-border);
    background: color-mix(in srgb, var(--color-gh-bg) 50%, var(--color-gh-card));
}

.toolbar-group {
    display: flex;
    gap: 0.25rem;
}

.toolbar-divider {
    width: 1px;
    background: var(--color-gh-border);
    margin: 0 0.25rem;
}

.toolbar-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    border: 1px solid transparent;
    border-radius: 0.375rem;
    background: transparent;
    color: var(--color-gh-text-muted);
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.875rem;
    font-weight: 600;
    min-width: 2rem;
}

.toolbar-btn:hover:not(:disabled) {
    background: color-mix(in srgb, var(--color-gh-accent) 10%, transparent);
    color: var(--color-gh-accent);
    border-color: color-mix(in srgb, var(--color-gh-accent) 30%, transparent);
}

.toolbar-btn.is-active {
    background: color-mix(in srgb, var(--color-gh-accent) 15%, transparent);
    color: var(--color-gh-accent);
    border-color: var(--color-gh-accent);
}

.toolbar-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.toolbar-btn.toolbar-btn--blank {
    background: color-mix(in srgb, var(--color-gh-warning) 10%, transparent);
    border-color: color-mix(in srgb, var(--color-gh-warning) 30%, transparent);
    color: var(--color-gh-warning);
}

.toolbar-btn.toolbar-btn--blank:hover:not(:disabled) {
    background: color-mix(in srgb, var(--color-gh-warning) 20%, transparent);
    color: var(--color-gh-warning);
    border-color: var(--color-gh-warning);
    box-shadow: 0 0 15px rgba(251, 191, 36, 0.3);
}

.toolbar-btn.fullscreen-btn {
    position: relative;
    background: color-mix(in srgb, var(--color-gh-accent) 10%, transparent);
    border-color: color-mix(in srgb, var(--color-gh-accent) 40%, transparent);
    box-shadow: 0 0 10px rgba(47, 129, 247, 0.3);
    animation: subtle-pulse 3s ease-in-out infinite;
}

.toolbar-btn.fullscreen-btn:hover:not(:disabled) {
    background: color-mix(in srgb, var(--color-gh-accent) 20%, transparent);
    box-shadow: 0 0 20px rgba(47, 129, 247, 0.6), 0 0 30px rgba(255, 255, 255, 0.2);
    animation: none;
}

.toolbar-btn.fullscreen-btn.is-fullscreen {
    background: color-mix(in srgb, var(--color-gh-accent) 20%, transparent);
    border-color: var(--color-gh-accent);
    box-shadow: 0 0 25px rgba(47, 129, 247, 0.8), 0 0 35px rgba(255, 255, 255, 0.3);
    animation: none;
}

@keyframes subtle-pulse {
    0%, 100% {
        box-shadow: 0 0 10px rgba(47, 129, 247, 0.3);
    }
    50% {
        box-shadow: 0 0 15px rgba(47, 129, 247, 0.5), 0 0 20px rgba(47, 129, 247, 0.2);
    }
}

@keyframes pulse-glow {
    0%, 100% {
        box-shadow: 0 0 15px rgba(47, 129, 247, 0.5);
    }
    50% {
        box-shadow: 0 0 25px rgba(47, 129, 247, 0.8), 0 0 35px rgba(255, 255, 255, 0.3);
    }
}

.ml-auto {
    margin-left: auto;
}

.editor-split-container {
    display: flex;
    flex-direction: column;
}

.editor-split-container.split-view {
    flex-direction: row;
    height: calc(100vh - 60px);
}

.editor-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.preview-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    border-left: 2px solid var(--color-gh-border);
    background: var(--color-gh-bg);
}

.preview-header {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--color-gh-border);
    background: color-mix(in srgb, var(--color-gh-bg) 50%, var(--color-gh-card));
}

.preview-content {
    flex: 1;
    padding: 1rem;
    overflow-y: auto;
}

.editor-content {
    padding: 1rem;
    min-height: 150px;
    max-height: 500px;
    overflow-y: auto;
}

.split-view .editor-content {
    max-height: none;
    height: 100%;
    background: var(--color-gh-card);
}

.split-view .editor-panel {
    background: var(--color-gh-card);
}

/* Fullscreen mode */
.tiptap-editor.fullscreen-mode {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
    border-radius: 0;
    max-height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--color-gh-bg);
}

.tiptap-editor.fullscreen-mode .editor-toolbar {
    border-radius: 0;
    background: var(--color-gh-bg-secondary);
}

.tiptap-editor.fullscreen-mode .editor-split-container {
    flex: 1;
    overflow: hidden;
    background: var(--color-gh-bg);
}

.tiptap-editor.fullscreen-mode .editor-panel {
    background: var(--color-gh-bg);
}

.tiptap-editor.fullscreen-mode .editor-content {
    background: var(--color-gh-bg);
}

.tiptap-editor.fullscreen-mode .editor-content :deep(.ProseMirror) {
    background: var(--color-gh-bg);
}

/* Editor Content Styles */
.editor-content :deep(.ProseMirror) {
    outline: none;
    color: var(--color-gh-text);
    background: var(--color-gh-card);
    min-height: 100%;
}

/* Drag and Drop Cursor */
.editor-content :deep(.ProseMirror .ProseMirror-dropcursor) {
    border-color: var(--color-gh-accent);
    border-width: 3px;
}

.editor-content :deep(.ProseMirror p.is-editor-empty:first-child::before) {
    content: attr(data-placeholder);
    color: var(--color-gh-muted);
    pointer-events: none;
    height: 0;
    float: left;
}

.editor-content :deep(.ProseMirror h2) {
    font-size: 1.5rem;
    font-weight: bold;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    color: var(--color-gh-text);
}

.editor-content :deep(.ProseMirror h3) {
    font-size: 1.25rem;
    font-weight: bold;
    margin-top: 0.75rem;
    margin-bottom: 0.5rem;
    color: var(--color-gh-text);
}

.editor-content :deep(.ProseMirror p) {
    margin-bottom: 0.5rem;
    line-height: 1.6;
}

.editor-content :deep(.ProseMirror code) {
    background: color-mix(in srgb, var(--color-gh-accent) 10%, transparent);
    color: var(--color-gh-accent);
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    font-family: 'Courier New', monospace;
    font-size: 0.875em;
}

.editor-content :deep(.ProseMirror pre) {
    background: var(--color-gh-bg);
    border: 1px solid var(--color-gh-border);
    border-radius: 0.5rem;
    padding: 1rem;
    margin: 0.5rem 0;
    overflow-x: auto;
}

.editor-content :deep(.ProseMirror pre code) {
    background: transparent;
    color: var(--color-gh-text);
    padding: 0;
    font-size: 0.875rem;
    line-height: 1.5;
}

.editor-content :deep(.ProseMirror ul),
.editor-content :deep(.ProseMirror ol) {
    padding-left: 1.5rem;
    margin: 0.5rem 0;
    color: var(--color-gh-text);
}

.editor-content :deep(.ProseMirror ul) {
    list-style-type: disc;
}

.editor-content :deep(.ProseMirror ol) {
    list-style-type: decimal;
}

.editor-content :deep(.ProseMirror li) {
    margin-bottom: 0.25rem;
    color: var(--color-gh-text);
}

.editor-content :deep(.ProseMirror li::marker) {
    color: var(--color-gh-accent);
}

.editor-content :deep(.ProseMirror .editor-link) {
    color: var(--color-gh-accent);
    text-decoration: underline;
    cursor: pointer;
}

.editor-content :deep(.ProseMirror .editor-link:hover) {
    text-decoration: none;
}

.editor-content :deep(.ProseMirror img) {
    border-radius: 0.5rem;
    margin: 0.5rem 0;
    transition: all 0.2s ease;
}

.editor-content :deep(.ProseMirror img.ProseMirror-selectednode) {
    outline: 2px solid var(--color-gh-accent);
    outline-offset: 2px;
    box-shadow: 0 0 20px rgba(47, 129, 247, 0.5);
}


.editor-content :deep(.ProseMirror strong) {
    font-weight: bold;
    color: var(--color-gh-text);
}

.editor-content :deep(.ProseMirror em) {
    font-style: italic;
}

.editor-content :deep(.ProseMirror .math-inline) {
    display: inline-block;
    padding: 0.125rem 0.25rem;
    background: color-mix(in srgb, var(--color-gh-accent) 5%, transparent);
    border-radius: 0.25rem;
}

.editor-content :deep(.ProseMirror .math-display) {
    display: block;
    margin: 1rem 0;
    padding: 1rem;
    background: var(--color-gh-bg);
    border: 1px solid var(--color-gh-border);
    border-radius: 0.5rem;
    overflow-x: auto;
    text-align: center;
}

.editor-content :deep(.katex) {
    color: var(--color-gh-text);
}

.editor-content :deep(.katex-display) {
    margin: 0;
}
</style>
