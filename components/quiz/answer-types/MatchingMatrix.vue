<template>
    <div class="space-y-4">
        <p class="text-sm text-gh-muted font-medium">
            <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            For each item, select all that match
        </p>

        <div v-if="leftOptions.length > 0 && rightOptions.length > 0" class="space-y-3">
            <div
                v-for="row in leftOptions"
                :key="`row-${row.label}`"
                class="row-section"
            >
                <div class="row-header">
                    <span class="row-badge">{{ row.label }}</span>
                    <span class="row-text">{{ row.value }}</span>
                </div>
                <div class="row-options">
                    <button
                        v-for="col in rightOptions"
                        :key="`cell-${row.label}-${col.label}`"
                        type="button"
                        class="col-chip"
                        :class="{ 'col-chip--active': isCellChecked(row.label, col.label) }"
                        @click="toggleCell(row.label, col.label)"
                    >
                        <span class="col-chip__badge">{{ col.label }}</span>
                        <span class="col-chip__text">{{ col.value }}</span>
                        <svg v-if="isCellChecked(row.label, col.label)" class="col-chip__check" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <!-- Selected pairs summary -->
        <div v-if="pairs.length > 0" class="summary">
            <h3 class="text-xs font-semibold text-gh-text-muted uppercase tracking-wide mb-2">Your Selections</h3>
            <div class="flex flex-wrap gap-2">
                <span
                    v-for="pair in pairs"
                    :key="`${pair.left}:${pair.right}`"
                    class="summary-tag"
                >
                    {{ pair.left }}
                    <svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    {{ pair.right }}
                </span>
            </div>
        </div>

        <div v-else class="text-sm text-gh-muted italic">
            No pairs selected yet. Tap the options above.
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    modelValue: { type: String, default: '' },
    options: { type: Array, required: true }
})

const emit = defineEmits(['update:modelValue'])

const leftOptions = computed(() => props.options.filter(o => o.position === 'left'))
const rightOptions = computed(() => props.options.filter(o => o.position === 'right'))

const pairs = computed(() => {
    if (!props.modelValue) return []
    return props.modelValue.split(',').filter(Boolean).map(p => {
        const [left, right] = p.split(':')
        return { left, right }
    }).filter(p => p.left && p.right)
})

const checkedSet = computed(() => new Set(
    pairs.value.map(p => `${p.left}:${p.right}`)
))

const isCellChecked = (row, col) => checkedSet.value.has(`${row}:${col}`)

const toggleCell = (row, col) => {
    const key = `${row}:${col}`
    const current = new Set(checkedSet.value)
    if (current.has(key)) {
        current.delete(key)
    } else {
        current.add(key)
    }
    emit('update:modelValue', [...current].join(','))
}
</script>

<style scoped>
.row-section {
    background: var(--color-gh-card);
    border: 2px solid var(--color-gh-border);
    border-radius: 0.75rem;
    overflow: hidden;
    transition: border-color 0.2s ease;
}

.row-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1rem;
    border-bottom: 1px solid var(--color-gh-border);
    background: var(--color-gh-bg);
}

.row-badge {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 2rem;
    height: 2rem;
    padding: 0 0.5rem;
    background: var(--color-gh-accent);
    color: white;
    border-radius: 0.5rem;
    font-weight: 700;
    font-size: 0.875rem;
    box-shadow: 0 2px 8px rgba(47, 129, 247, 0.3);
}

.row-text {
    color: var(--color-gh-text);
    font-weight: 500;
    font-size: 0.9375rem;
    line-height: 1.4;
    word-break: break-word;
}

.row-options {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
}

.col-chip {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.875rem;
    background: var(--color-gh-bg);
    border: 2px solid var(--color-gh-border);
    border-radius: 0.625rem;
    cursor: pointer;
    transition: all 0.2s ease;
    color: var(--color-gh-text);
    font-size: 0.875rem;
    line-height: 1.4;
    text-align: left;
    max-width: 100%;
}

.col-chip:hover {
    border-color: var(--color-gh-accent-hover);
    background: var(--color-gh-card-hover);
    transform: translateY(-1px);
}

.col-chip--active {
    background: rgba(47, 129, 247, 0.08);
    border-color: var(--color-gh-accent);
    box-shadow: 0 0 12px rgba(47, 129, 247, 0.25);
}

.col-chip--active:hover {
    background: rgba(47, 129, 247, 0.12);
}

.col-chip__badge {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1.5rem;
    height: 1.5rem;
    padding: 0 0.25rem;
    background: var(--color-gh-border);
    border-radius: 0.375rem;
    font-weight: 700;
    font-size: 0.75rem;
    color: var(--color-gh-text);
}

.col-chip--active .col-chip__badge {
    background: var(--color-gh-accent);
    color: white;
}

.col-chip__text {
    word-break: break-word;
    min-width: 0;
}

.col-chip__check {
    flex-shrink: 0;
    width: 1rem;
    height: 1rem;
    color: var(--color-gh-accent);
}

.summary {
    padding-top: 0.5rem;
    border-top: 1px solid var(--color-gh-border);
}

.summary-tag {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.375rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.8125rem;
    font-weight: 500;
    background: rgba(47, 129, 247, 0.1);
    color: var(--color-gh-accent);
    border: 1px solid rgba(47, 129, 247, 0.2);
}

@media (max-width: 640px) {
    .row-options {
        flex-direction: column;
    }

    .col-chip {
        width: 100%;
    }

    .row-header {
        padding: 0.75rem 0.875rem;
    }

    .row-options {
        padding: 0.625rem 0.875rem;
    }
}
</style>
