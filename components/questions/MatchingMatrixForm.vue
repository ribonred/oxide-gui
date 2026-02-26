<template>
    <div class="space-y-6">
        <!-- Row Items (Left) -->
        <div>
            <label class="block text-gh-text text-sm font-medium mb-2">
                Row Items (Left Side) <span class="text-red-400">*</span>
            </label>
            <p class="text-gh-muted text-xs mb-3">
                Define the items that appear as rows in the matrix.
            </p>
            <div v-for="(item, index) in leftItems" :key="`left-${index}`" class="flex gap-2 mb-2">
                <input
                    :value="item.label"
                    @input="updateLeft(index, 'label', $event.target.value)"
                    type="text"
                    required
                    class="w-20 px-4 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text focus:outline-none focus:ring-2 focus:ring-gh-accent"
                    placeholder="Label"
                />
                <input
                    :value="item.value"
                    @input="updateLeft(index, 'value', $event.target.value)"
                    type="text"
                    required
                    class="flex-1 px-4 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text focus:outline-none focus:ring-2 focus:ring-gh-accent"
                    placeholder="Row item text (e.g., Apple, France)"
                />
                <Button v-if="leftItems.length > 2" variant="danger" size="sm" @click="removeLeft(index)">
                    Remove
                </Button>
            </div>
            <Button variant="secondary" @click="addLeft">Add Row Item</Button>
        </div>

        <!-- Column Items (Right) -->
        <div>
            <label class="block text-gh-text text-sm font-medium mb-2">
                Column Items (Right Side) <span class="text-red-400">*</span>
            </label>
            <p class="text-gh-muted text-xs mb-3">
                Define the items that appear as columns in the matrix.
            </p>
            <div v-for="(item, index) in rightItems" :key="`right-${index}`" class="flex gap-2 mb-2">
                <input
                    :value="item.label"
                    @input="updateRight(index, 'label', $event.target.value)"
                    type="text"
                    required
                    class="w-20 px-4 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text focus:outline-none focus:ring-2 focus:ring-gh-accent"
                    placeholder="Label"
                />
                <input
                    :value="item.value"
                    @input="updateRight(index, 'value', $event.target.value)"
                    type="text"
                    required
                    class="flex-1 px-4 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text focus:outline-none focus:ring-2 focus:ring-gh-accent"
                    placeholder="Column item text (e.g., Vitamin A, Paris)"
                />
                <Button v-if="rightItems.length > 2" variant="danger" size="sm" @click="removeRight(index)">
                    Remove
                </Button>
            </div>
            <Button variant="secondary" @click="addRight">Add Column Item</Button>
        </div>

        <!-- Matrix Grid -->
        <div v-if="validLeft.length > 0 && validRight.length > 0">
            <label class="block text-gh-text text-sm font-medium mb-2">
                Correct Answer Matrix <span class="text-red-400">*</span>
            </label>
            <p class="text-gh-muted text-xs mb-3">
                For each row item, select the column items it should match with.
            </p>
            <div class="space-y-3">
                <div v-for="row in validLeft" :key="`row-${row.label}`" class="matrix-row">
                    <div class="matrix-row__header">
                        <span class="matrix-row__badge">{{ row.label }}</span>
                        <span class="matrix-row__text">{{ row.value }}</span>
                    </div>
                    <div class="matrix-row__options">
                        <label
                            v-for="col in validRight"
                            :key="`cell-${row.label}-${col.label}`"
                            class="matrix-option"
                            :class="{ 'matrix-option--checked': isCellChecked(row.label, col.label) }"
                        >
                            <input
                                type="checkbox"
                                :checked="isCellChecked(row.label, col.label)"
                                @change="toggleCell(row.label, col.label)"
                                class="sr-only"
                            />
                            <span class="matrix-option__badge">{{ col.label }}</span>
                            <span class="matrix-option__text">{{ col.value }}</span>
                            <svg v-if="isCellChecked(row.label, col.label)" class="matrix-option__check" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                            </svg>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Button from '~/components/ui/Button.vue'

const props = defineProps({
    leftItems: { type: Array, required: true },
    rightItems: { type: Array, required: true },
    cells: { type: Set, required: true }
})

const emit = defineEmits(['update:leftItems', 'update:rightItems', 'update:cells'])

const validLeft = computed(() => props.leftItems.filter(i => i.label.trim()))
const validRight = computed(() => props.rightItems.filter(i => i.label.trim()))

const isCellChecked = (rowLabel, colLabel) => props.cells.has(`${rowLabel}:${colLabel}`)

const toggleCell = (rowLabel, colLabel) => {
    const key = `${rowLabel}:${colLabel}`
    const next = new Set(props.cells)
    if (next.has(key)) {
        next.delete(key)
    } else {
        next.add(key)
    }
    emit('update:cells', next)
}

// Left items management
const addLeft = () => {
    emit('update:leftItems', [...props.leftItems, { label: '', value: '' }])
}

const removeLeft = (index) => {
    const removed = props.leftItems[index]
    const next = [...props.leftItems]
    next.splice(index, 1)
    emit('update:leftItems', next)
    // Clean cells referencing removed label
    if (removed.label) {
        const nextCells = new Set([...props.cells].filter(c => !c.startsWith(`${removed.label}:`)))
        emit('update:cells', nextCells)
    }
}

const updateLeft = (index, field, value) => {
    const oldLabel = props.leftItems[index].label
    const next = [...props.leftItems]
    next[index] = { ...next[index], [field]: value }
    emit('update:leftItems', next)
    // Update cells if label changed
    if (field === 'label' && oldLabel && oldLabel !== value) {
        const nextCells = new Set(
            [...props.cells].map(c => {
                const [left, right] = c.split(':')
                return left === oldLabel ? `${value}:${right}` : c
            })
        )
        emit('update:cells', nextCells)
    }
}

// Right items management
const addRight = () => {
    emit('update:rightItems', [...props.rightItems, { label: '', value: '' }])
}

const removeRight = (index) => {
    const removed = props.rightItems[index]
    const next = [...props.rightItems]
    next.splice(index, 1)
    emit('update:rightItems', next)
    if (removed.label) {
        const nextCells = new Set([...props.cells].filter(c => !c.endsWith(`:${removed.label}`)))
        emit('update:cells', nextCells)
    }
}

const updateRight = (index, field, value) => {
    const oldLabel = props.rightItems[index].label
    const next = [...props.rightItems]
    next[index] = { ...next[index], [field]: value }
    emit('update:rightItems', next)
    if (field === 'label' && oldLabel && oldLabel !== value) {
        const nextCells = new Set(
            [...props.cells].map(c => {
                const [left, right] = c.split(':')
                return right === oldLabel ? `${left}:${value}` : c
            })
        )
        emit('update:cells', nextCells)
    }
}
</script>

<style scoped>
.matrix-row {
    background: var(--color-gh-card);
    border: 2px solid var(--color-gh-border);
    border-radius: 0.75rem;
    overflow: hidden;
}

.matrix-row__header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--color-gh-border);
    background: var(--color-gh-bg);
}

.matrix-row__badge {
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
}

.matrix-row__text {
    color: var(--color-gh-text);
    font-weight: 500;
    font-size: 0.875rem;
    line-height: 1.4;
    word-break: break-word;
}

.matrix-row__options {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
}

.matrix-option {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background: var(--color-gh-bg);
    border: 2px solid var(--color-gh-border);
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    max-width: 100%;
}

.matrix-option:hover {
    border-color: var(--color-gh-accent-hover);
    background: var(--color-gh-card-hover);
}

.matrix-option--checked {
    background: rgba(47, 129, 247, 0.08);
    border-color: var(--color-gh-accent);
}

.matrix-option__badge {
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

.matrix-option--checked .matrix-option__badge {
    background: var(--color-gh-accent);
    color: white;
}

.matrix-option__text {
    color: var(--color-gh-text);
    font-size: 0.8125rem;
    word-break: break-word;
    min-width: 0;
}

.matrix-option__check {
    flex-shrink: 0;
    width: 1rem;
    height: 1rem;
    color: var(--color-gh-accent);
}

.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
}

@media (max-width: 640px) {
    .matrix-row__options {
        flex-direction: column;
    }

    .matrix-option {
        width: 100%;
    }
}
</style>
