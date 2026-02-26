<template>
    <div>
        <p class="text-sm text-gh-muted font-medium mb-4">
            <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
            Drag items to arrange them in the correct order
        </p>

        <div class="space-y-2">
            <div v-if="items.length === 0"
                class="text-gh-text-muted italic p-4 text-center border border-dashed border-gh-border rounded-lg">
                No items to order
            </div>
            <div v-for="(item, index) in items" :key="item.value" :draggable="true" @dragstart="dragStart(index)"
                @dragend="dragEnd" @dragover.prevent="dragOver(index)" @drop.prevent="drop(index)" class="ordering-item"
                :class="{
                    'ordering-item--dragging': draggingIndex === index,
                    'ordering-item--over': dragOverIndex === index
                }">
                <div class="ordering-item__handle">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </div>

                <div class="ordering-item__content">
                    {{ item.value }}
                </div>

                <div class="ordering-item__controls">
                    <button @click="moveUp(index)" :disabled="index === 0" class="ordering-btn" type="button"
                        title="Move up">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                        </svg>
                    </button>
                    <button @click="moveDown(index)" :disabled="index === items.length - 1" class="ordering-btn"
                        type="button" title="Move down">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    options: {
        type: Array,
        required: true
    }
})

const emit = defineEmits(['update:modelValue'])

const items = ref([])
const draggingIndex = ref(null)
const dragOverIndex = ref(null)

// Initialize items from options or modelValue
const initializeItems = () => {
    // Guard: don't initialize if options is empty
    if (!props.options || props.options.length === 0) {
        items.value = []
        return
    }

    const trimmedValue = (props.modelValue || '').trim()
    if (!trimmedValue) {
        // Shuffle items initially if no answer yet
        items.value = shuffleArray([...props.options])
        // Set the initial shuffled order as the answer
        updateValue()
    } else {
        // Restore order from modelValue (labels like A,B,C)
        const order = trimmedValue.split(',')
        const orderedItems = order
            .map(lbl => props.options.find(opt => opt.label === lbl))
            .filter(Boolean)

        // If we couldn't restore all items (e.g., options changed), add missing ones
        if (orderedItems.length !== props.options.length) {
            const missingItems = props.options.filter(opt =>
                !orderedItems.find(item => item.label === opt.label)
            )
            items.value = [...orderedItems, ...missingItems]
        } else {
            items.value = orderedItems
        }
    }
}

// Shuffle array helper
const shuffleArray = (array) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
}

// Update the modelValue when items change - sends labels (A, B, C, etc.)
const updateValue = () => {
    const orderString = items.value.map(item => item.label).join(',')
    emit('update:modelValue', orderString)
}

// Drag and drop handlers
const dragStart = (index) => {
    draggingIndex.value = index
}

const dragEnd = () => {
    draggingIndex.value = null
    dragOverIndex.value = null
}

const dragOver = (index) => {
    if (draggingIndex.value !== null && draggingIndex.value !== index) {
        dragOverIndex.value = index
    }
}

const drop = (dropIndex) => {
    if (draggingIndex.value !== null && draggingIndex.value !== dropIndex) {
        const itemsCopy = [...items.value]
        const draggedItem = itemsCopy[draggingIndex.value]

        // Remove from old position
        itemsCopy.splice(draggingIndex.value, 1)

        // Insert at new position
        itemsCopy.splice(dropIndex, 0, draggedItem)

        items.value = itemsCopy
        updateValue()
    }

    draggingIndex.value = null
    dragOverIndex.value = null
}

// Button controls
const moveUp = (index) => {
    if (index > 0) {
        const itemsCopy = [...items.value];
        [itemsCopy[index - 1], itemsCopy[index]] = [itemsCopy[index], itemsCopy[index - 1]]
        items.value = itemsCopy
        updateValue()
    }
}

const moveDown = (index) => {
    if (index < items.value.length - 1) {
        const itemsCopy = [...items.value];
        [itemsCopy[index], itemsCopy[index + 1]] = [itemsCopy[index + 1], itemsCopy[index]]
        items.value = itemsCopy
        updateValue()
    }
}

// Initialize on mount and when options change
onMounted(() => {
    initializeItems()
})

watch(() => props.options, (newOptions) => {
    if (newOptions && newOptions.length > 0) {
        initializeItems()
    }
}, { deep: true, immediate: true })
</script>

<style scoped>
.ordering-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: var(--color-gh-card);
    border: 2px solid var(--color-gh-border);
    border-radius: 0.75rem;
    transition: all 0.2s ease;
    cursor: move;
}

.ordering-item:hover {
    border-color: var(--color-gh-accent);
    box-shadow: 0 0 20px rgba(47, 129, 247, 0.15);
    transform: translateY(-2px);
}

.ordering-item--dragging {
    opacity: 0.5;
    transform: scale(0.95);
}

.ordering-item--over {
    border-color: var(--color-gh-accent);
    background: color-mix(in srgb, var(--color-gh-accent) 10%, var(--color-gh-card));
    box-shadow: 0 0 25px rgba(47, 129, 247, 0.3);
    transform: translateY(0);
}

.ordering-item__handle {
    display: flex;
    align-items: center;
    color: var(--color-gh-muted);
    cursor: grab;
    transition: color 0.2s ease;
}

.ordering-item:hover .ordering-item__handle {
    color: var(--color-gh-accent);
}

.ordering-item--dragging .ordering-item__handle {
    cursor: grabbing;
}

.ordering-item__number {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    background: color-mix(in srgb, var(--color-gh-accent) 15%, transparent);
    color: var(--color-gh-accent);
    font-weight: bold;
    font-size: 1.125rem;
    border-radius: 0.5rem;
    flex-shrink: 0;
    transition: all 0.2s ease;
}

.ordering-item:hover .ordering-item__number {
    background: color-mix(in srgb, var(--color-gh-accent) 25%, transparent);
    box-shadow: 0 0 15px rgba(47, 129, 247, 0.3);
}

.ordering-item__content {
    flex: 1;
    color: var(--color-gh-text);
    font-size: 1rem;
    line-height: 1.5;
    min-width: 0;
    overflow-wrap: break-word;
    word-break: break-word;
}

.ordering-item__controls {
    display: flex;
    gap: 0.25rem;
    flex-shrink: 0;
}

.ordering-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    background: transparent;
    border: 1px solid var(--color-gh-border);
    border-radius: 0.375rem;
    color: var(--color-gh-text-muted);
    cursor: pointer;
    transition: all 0.2s ease;
}

.ordering-btn:hover:not(:disabled) {
    background: color-mix(in srgb, var(--color-gh-accent) 10%, transparent);
    border-color: var(--color-gh-accent);
    color: var(--color-gh-accent);
}

.ordering-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

@media (max-width: 640px) {
    .ordering-item {
        gap: 0.5rem;
        padding: 0.75rem;
    }

    .ordering-item__handle {
        display: none;
    }

    .ordering-item__number {
        width: 2rem;
        height: 2rem;
        font-size: 0.875rem;
    }

    .ordering-item__content {
        font-size: 0.875rem;
    }
}
</style>
