<template>
    <div>
        <label v-if="label" class="block text-gh-text text-sm font-medium mb-2">
            {{ label }}
            <span v-if="required" class="text-red-400">*</span>
            <span v-if="optional" class="text-gh-muted text-xs">(Optional)</span>
        </label>
        <div class="relative">
            <div v-if="$slots.prefix" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <slot name="prefix"></slot>
            </div>
            <input 
                :type="type"
                :value="modelValue"
                :required="required"
                :placeholder="placeholder"
                :disabled="disabled"
                :min="min"
                :max="max"
                :class="[inputClasses, $slots.prefix ? 'pl-10' : '']"
                @input="$emit('update:modelValue', type === 'number' ? Number($event.target.value) : $event.target.value)"
            />
            <div v-if="$slots.suffix" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <slot name="suffix"></slot>
            </div>
        </div>
        <p v-if="error" class="mt-1 text-sm text-red-400">{{ error }}</p>
        <p v-if="hint" class="mt-1 text-sm text-gh-muted">{{ hint }}</p>
    </div>
</template>

<script setup>
const props = defineProps({
    modelValue: [String, Number],
    label: String,
    type: {
        type: String,
        default: 'text'
    },
    placeholder: String,
    required: Boolean,
    optional: Boolean,
    disabled: Boolean,
    error: String,
    hint: String,
    min: [String, Number],
    max: [String, Number]
})

defineEmits(['update:modelValue'])

const inputClasses = computed(() => {
    const base = 'w-full px-4 py-2 bg-gh-bg border rounded-md text-gh-text focus:outline-none focus:ring-2 focus:ring-gh-accent transition-colors'
    const errorClass = props.error ? 'border-red-500' : 'border-gh-border'
    const disabledClass = props.disabled ? 'opacity-50 cursor-not-allowed' : ''
    
    return `${base} ${errorClass} ${disabledClass}`
})
</script>
