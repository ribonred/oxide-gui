<template>
    <Input
        :model-value="modelValue"
        @update:modelValue="$emit('update:modelValue', $event)"
        :placeholder="placeholder"
        :class="wrapperClass"
    >
        <template #prefix>
            <svg class="w-5 h-5 text-gh-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </template>
        <template #suffix>
            <slot name="suffix"></slot>
        </template>
    </Input>
</template>

<script setup>
import Input from './Input.vue'

defineProps({
    modelValue: [String, Number],
    placeholder: {
        type: String,
        default: 'Search...'
    },
    wrapperClass: {
        type: String,
        default: ''
    }
})

defineEmits(['update:modelValue'])
</script>
