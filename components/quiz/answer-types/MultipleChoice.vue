<template>
    <div>
        <p class="text-sm sm:text-base text-gh-muted font-medium mb-3">Select one answer:</p>
        <div class="options-grid">
            <OptionCard 
                v-for="(option, index) in options"
                :key="index"
                :selected="isSelected(option.label)"
                @click="selectOption(option.label)"
            >
                <template #badge>
                    {{ option.label }}
                </template>
                
                <template #action>
                    <div class="radio-wrapper">
                        <input
                            type="radio"
                            :checked="isSelected(option.label)"
                            class="option-radio"
                        />
                        <svg v-if="isSelected(option.label)" class="option-check" fill="currentColor" viewBox="0 0 16 16">
                            <circle cx="8" cy="8" r="3"/>
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

const isSelected = (label) => props.modelValue === label
const selectOption = (label) => emit('update:modelValue', label)
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

.radio-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
}

.option-radio {
    appearance: none;
    width: 1.5rem;
    height: 1.5rem;
    border: 2px solid var(--color-gh-border);
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease;
    background: transparent;
}

.option-radio:checked {
    border-color: var(--color-gh-accent);
    background: var(--color-gh-accent);
}

.option-check {
    position: absolute;
    width: 1rem;
    height: 1rem;
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
