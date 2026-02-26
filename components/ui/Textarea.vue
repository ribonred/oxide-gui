<template>
    <div>
        <label v-if="label" class="block text-gh-text text-sm font-medium mb-2">
            {{ label }}
            <span v-if="required" class="text-red-400">*</span>
            <span v-if="optional" class="text-gh-muted text-xs">(Optional)</span>
        </label>
        <textarea 
            :value="modelValue"
            :required="required"
            :placeholder="placeholder"
            :disabled="disabled"
            :rows="rows"
            :class="textareaClasses"
            @input="$emit('update:modelValue', $event.target.value)"
        ></textarea>
        <p v-if="error" class="mt-1 text-sm text-red-400">{{ error }}</p>
        <p v-if="hint" class="mt-1 text-sm text-gh-muted">{{ hint }}</p>
    </div>
</template>

<script setup>
const props = defineProps({
    modelValue: String,
    label: String,
    placeholder: String,
    required: Boolean,
    optional: Boolean,
    disabled: Boolean,
    error: String,
    hint: String,
    rows: {
        type: Number,
        default: 3
    }
})

defineEmits(['update:modelValue'])

const textareaClasses = computed(() => {
    const base = 'w-full px-4 py-2 bg-gh-bg border rounded-md text-gh-text focus:outline-none focus:ring-2 focus:ring-gh-accent transition-colors resize-vertical'
    const errorClass = props.error ? 'border-red-500' : 'border-gh-border'
    const disabledClass = props.disabled ? 'opacity-50 cursor-not-allowed' : ''
    
    return `${base} ${errorClass} ${disabledClass}`
})
</script>
