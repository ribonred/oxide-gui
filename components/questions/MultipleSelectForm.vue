<template>
    <div class="space-y-4">
        <div>
            <label class="block text-gh-text text-sm font-medium mb-2">
                Options <span class="text-red-400">*</span>
            </label>
            <LabelValueInput
                v-for="(option, index) in options"
                :key="index"
                v-model="options[index]"
                :label-placeholder="`Label ${index + 1} (e.g., A, B, C)`"
                :value-placeholder="`Value ${index + 1} (e.g., red, blue)`"
                :show-remove="options.length > 2"
                @remove="removeOption(index)"
            />
            <Button 
                variant="secondary"
                @click="addOption" 
                class="mt-2"
            >
                Add Option
            </Button>
        </div>
        <div>
            <label class="block text-gh-text text-sm font-medium mb-2">
                Correct Answers <span class="text-red-400">*</span> <span class="text-gh-muted text-xs">(Select multiple)</span>
            </label>
            <div class="space-y-2">
                <label 
                    v-for="(option, index) in options.filter(o => o.label)" 
                    :key="index" 
                    class="flex items-center gap-2 cursor-pointer"
                >
                    <input
                        type="checkbox"
                        :value="option.value"
                        :checked="selectedAnswers.includes(option.value)"
                        @change="toggleAnswer(option.value)"
                        class="w-4 h-4 bg-gh-bg border-gh-border rounded focus:ring-2 focus:ring-gh-accent"
                    />
                    <span class="text-gh-text">{{ option.label }} → {{ option.value }}</span>
                </label>
            </div>
        </div>
    </div>
</template>

<script setup>
import LabelValueInput from './LabelValueInput.vue'
import Button from '~/components/ui/Button.vue'

const props = defineProps({
    options: {
        type: Array,
        required: true
    },
    selectedAnswers: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits(['update:options', 'update:selectedAnswers'])

const addOption = () => {
    emit('update:options', [...props.options, { label: '', value: '' }])
}

const removeOption = (index) => {
    const newOptions = [...props.options]
    newOptions.splice(index, 1)
    emit('update:options', newOptions)
}

const toggleAnswer = (value) => {
    const newAnswers = [...props.selectedAnswers]
    const index = newAnswers.indexOf(value)
    if (index > -1) {
        newAnswers.splice(index, 1)
    } else {
        newAnswers.push(value)
    }
    emit('update:selectedAnswers', newAnswers)
}
</script>

<style scoped>
input[type="checkbox"] {
    accent-color: var(--color-gh-accent);
}
</style>
