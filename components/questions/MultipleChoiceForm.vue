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
                Correct Answer <span class="text-red-400">*</span>
            </label>
            <select 
                :value="correctAnswer" 
                @input="$emit('update:correctAnswer', $event.target.value)"
                required 
                class="w-full px-4 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text focus:outline-none focus:ring-2 focus:ring-gh-accent"
            >
                <option value="">Select correct answer</option>
                <option 
                    v-for="(option, index) in options.filter(o => o.label)" 
                    :key="index" 
                    :value="option.label"
                >
                    {{ option.label }} → {{ option.value }}
                </option>
            </select>
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
    correctAnswer: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['update:options', 'update:correctAnswer'])

const addOption = () => {
    emit('update:options', [...props.options, { label: '', value: '' }])
}

const removeOption = (index) => {
    const newOptions = [...props.options]
    newOptions.splice(index, 1)
    emit('update:options', newOptions)
}
</script>
