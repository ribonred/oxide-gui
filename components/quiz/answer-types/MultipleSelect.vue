<template>
    <div>
        <p class="text-sm sm:text-base text-gh-muted font-medium mb-3">Select all that apply:</p>
        <div class="options-grid">
            <OptionCard 
                v-for="(option, index) in options"
                :key="index"
                :selected="isSelected(option.label)"
                @click="toggleOption(option.label)"
            >
                <template #badge>
                    {{ option.label }}
                </template>
                
                <template #action>
                    <div class="checkbox-wrapper">
                        <input
                            type="checkbox"
                            :checked="isSelected(option.label)"
                            class="option-checkbox"
                        />
                        <svg v-if="isSelected(option.label)" class="option-check" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                        </svg>
                    </div>
                </template>

                <div class="option-value">
                    <TiptapRenderer
                        v-if="shouldRenderWithTiptap(option.value)"
                        :content="toTiptapContent(option.value)"
                    />
                    <span v-else>{{ option.value }}</span>
                </div>
            </OptionCard>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import OptionCard from '~/components/ui/OptionCard.vue'
import TiptapRenderer from '~/components/editor/TiptapRenderer.vue'

const { shouldRenderWithTiptap, toTiptapContent } = useRichContent()

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

const selectedValues = computed(() => {
    if (!props.modelValue) return []
    return props.modelValue.split(',').filter(v => v)
})

const isSelected = (value) => selectedValues.value.includes(value)

const toggleOption = (value) => {
    const values = [...selectedValues.value]
    const index = values.indexOf(value)
    
    if (index > -1) {
        values.splice(index, 1)
    } else {
        values.push(value)
    }
    
    emit('update:modelValue', values.join(','))
}
</script>

<style scoped>
.options-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
}

@media (max-width: 900px) {
    .options-grid {
        grid-template-columns: 1fr;
    }
}

.checkbox-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
}

.option-checkbox {
    appearance: none;
    width: 1.5rem;
    height: 1.5rem;
    border: 2px solid var(--color-gh-border);
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.2s ease;
    background: transparent;
}

.option-checkbox:checked {
    border-color: var(--color-gh-accent);
    background: var(--color-gh-accent);
}

.option-check {
    position: absolute;
    width: 1.25rem;
    height: 1.25rem;
    color: white;
    pointer-events: none;
}

.option-value :deep(p) {
    margin: 0;
}

.option-value {
    font-size: 1rem;
}
</style>
