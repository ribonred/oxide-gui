<template>
    <div class="space-y-4">
        <p class="text-sm text-gh-muted font-medium mb-3">Fill in the blanks:</p>
        <OptionCard v-for="(blank, index) in blankCount" :key="index" :selected="false" class="cursor-default">
            <template #badge>
                {{ index + 1 }}
            </template>

            <div class="blank-content">
                <Input :model-value="getBlankValue(index)" @update:model-value="updateBlank(index, $event)"
                    placeholder="Enter answer..." class="w-full" />
            </div>
        </OptionCard>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import Input from '~/components/ui/Input.vue'
import OptionCard from '~/components/ui/OptionCard.vue'

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

const blankCount = computed(() => {
    if (!props.questionContent) return 1
    // Match underscores (single or multiple) possibly separated by dots, used as words
    const matches = props.questionContent.match(/\b_+(?:\.+_+)*\b/g)
    return matches ? matches.length : 1
})

const getBlankValue = (index) => {
    if (!props.modelValue) return ''
    const values = props.modelValue.split('<>')
    return values[index] || ''
}

const updateBlank = (index, value) => {
    const currentValues = props.modelValue ? props.modelValue.split('<>') : []
    // Ensure array has enough slots
    while (currentValues.length <= index) {
        currentValues.push('')
    }
    currentValues[index] = value
    emit('update:modelValue', currentValues.join('<>'))
}
</script>

<style scoped>
.blank-content {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    flex: 1;
}

.blank-label {
    font-size: 0.875rem;
    color: var(--gh-muted);
    font-weight: 500;
}
</style>
