<template>
    <div class="space-y-6">
        <p class="text-sm text-gh-muted font-medium">
            <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Click a card to select, then click another card to pair them
        </p>

        <!-- Available Options (Unpaired) -->
        <div v-if="!selectedNode" class="space-y-3">
            <h3 class="text-xs font-semibold text-gh-text-muted uppercase tracking-wide">Available Options</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <OptionCard v-for="item in availableOptions" :key="item.label" @click="selectNode(item.label)">
                    {{ item.value }}
                </OptionCard>
            </div>
        </div>

        <!-- Pairing Mode: Selected + Options -->
        <div v-else class="space-y-4">
            <h3 class="text-xs font-semibold text-gh-text-muted uppercase tracking-wide">Select a card to pair with</h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <!-- Selected Item (Left) -->
                <div class="space-y-2">
                    <p class="text-xs text-gh-muted">Selected</p>
                    <OptionCard :selected="true" @click.prevent>
                        <template #action>
                            <button @click="cancelSelection" class="cancel-btn" type="button">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </template>
                        {{ getOptionByLabel(selectedNode)?.value }}
                    </OptionCard>
                </div>

                <!-- Pairing Options (Right) -->
                <div class="space-y-2">
                    <p class="text-xs text-gh-muted">Pair with</p>
                    <div class="space-y-2">
                        <OptionCard v-for="item in pairingOptions" :key="item.label" @click="createPair(item.label)">
                            {{ item.value }}
                        </OptionCard>
                    </div>
                </div>
            </div>
        </div>

        <!-- Completed Pairs -->
        <div v-if="pairs.length > 0" class="space-y-3">
            <h3 class="text-xs font-semibold text-gh-text-muted uppercase tracking-wide">Paired Items</h3>
            <div class="space-y-2">
                <div v-for="(pair, idx) in pairs" :key="`pair-${idx}`" class="pair-item">
                    <div class="pair-item__left">
                        {{ getOptionByLabel(pair.left)?.value }}
                    </div>
                    <div class="pair-item__arrow">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </div>
                    <div class="pair-item__right">
                        {{ getOptionByLabel(pair.right)?.value }}
                    </div>
                    <button @click="removePair(idx)" class="pair-item__remove" type="button" title="Remove pair">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import OptionCard from '~/components/ui/OptionCard.vue'

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

// State
const selectedNode = ref(null)
const pairs = ref([]) // Array of { left: label, right: label }

// Get paired labels
const pairedLabels = computed(() => {
    const labels = new Set()
    pairs.value.forEach(p => {
        labels.add(p.left)
        labels.add(p.right)
    })
    return labels
})

// Available options (not yet paired)
const availableOptions = computed(() => {
    return props.options.filter(opt => !pairedLabels.value.has(opt.label))
})

// Pairing options (available options except selected)
const pairingOptions = computed(() => {
    return availableOptions.value.filter(opt => opt.label !== selectedNode.value)
})

// Get option by label
const getOptionByLabel = (label) => {
    return props.options.find(opt => opt.label === label)
}

// Select a node
const selectNode = (label) => {
    selectedNode.value = label
}

// Cancel selection
const cancelSelection = () => {
    selectedNode.value = null
}

// Create a pair
const createPair = (label) => {
    if (!selectedNode.value) return

    pairs.value.push({
        left: selectedNode.value,
        right: label
    })

    selectedNode.value = null
    updateValue()
}

// Remove a pair
const removePair = (index) => {
    pairs.value.splice(index, 1)
    updateValue()
}

// Update modelValue
const updateValue = () => {
    const pairStrings = pairs.value.map(p => `${p.left}:${p.right}`)
    emit('update:modelValue', pairStrings.join(','))
}

// Initialize from modelValue
const initializeFromModel = () => {
    if (!props.modelValue) {
        pairs.value = []
        return
    }

    try {
        const pairStrings = props.modelValue.split(',').filter(Boolean)
        pairs.value = pairStrings.map(pairStr => {
            const parts = pairStr.split(':')
            if (parts.length < 2) return null
            return { left: parts[0], right: parts[1] }
        }).filter(p => p && p.left && p.right)
    } catch (e) {
        console.error('Failed to parse matching pairs:', e)
        pairs.value = []
    }
}

// Lifecycle
onMounted(() => {
    initializeFromModel()
})

watch(() => props.modelValue, (newVal) => {
    const currentStr = pairs.value.map(p => `${p.left}:${p.right}`).join(',')
    if (newVal !== currentStr) {
        initializeFromModel()
    }
})

watch(() => props.options, () => {
    selectedNode.value = null
    initializeFromModel()
}, { deep: true })
</script>

<style scoped>
.cancel-btn {
    padding: 0.25rem;
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
    border: 1px solid rgba(239, 68, 68, 0.2);
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.2s ease;
}

.cancel-btn:hover {
    background: rgba(239, 68, 68, 0.2);
    transform: scale(1.1);
}

.pair-item {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    padding: 0.875rem 1.125rem;
    background: var(--color-gh-card-hover);
    border: 3px solid var(--color-gh-accent-hover);
    border-radius: 0.75rem;
    transition: all 0.3s ease;
    box-shadow: 0 4px 20px rgba(47, 129, 247, 0.3);
}

.pair-item:hover {
    border-color: var(--gh-accent-hover);
    box-shadow: 0 4px 20px rgba(47, 129, 247, 0.35);
    transform: translateY(-2px);
}

.pair-item__left,
.pair-item__right {
    flex: 1;
    color: var(--gh-text);
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.pair-item__arrow {
    flex-shrink: 0;
    color: var(--gh-arrow-accent);
    filter: drop-shadow(0 0 4px rgba(88, 166, 255, 0.5));
    animation: arrow-pulse 2s ease-in-out infinite;
}

@keyframes arrow-pulse {

    0%,
    100% {
        transform: translateX(0);
        opacity: 0.8;
    }

    50% {
        transform: translateX(4px);
        opacity: 1;
    }
}

.pair-item__remove {
    flex-shrink: 0;
    padding: 0.375rem;
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
    border: 1px solid rgba(239, 68, 68, 0.2);
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.2s ease;
}

.pair-item__remove:hover {
    background: rgba(239, 68, 68, 0.2);
    transform: scale(1.1);
}

@media (max-width: 768px) {
    .pair-item {
        padding: 0.625rem 0.875rem;
        gap: 0.5rem;
        flex-direction: column;
        align-items: stretch;
        text-align: center;
    }

    .pair-item__arrow {
        transform: rotate(90deg);
        margin: 0.25rem 0;
        align-self: center;
    }

    .pair-item__remove {
        align-self: center;
        margin-top: 0.5rem;
        width: 100%;
    }

    .pair-item__left,
    .pair-item__right {
        font-size: 0.8125rem;
        white-space: normal;
        text-overflow: clip;
    }
}
</style>
