<template>
    <div class="mb-2">
        <div class="flex gap-2">
            <input 
                :value="modelValue.label" 
                @input="$emit('update:modelValue', { ...modelValue, label: $event.target.value })"
                type="text" 
                required 
                class="flex-1 px-4 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text focus:outline-none focus:ring-2 focus:ring-gh-accent" 
                :placeholder="labelPlaceholder" 
            />
            <input 
                :value="modelValue.value" 
                @input="$emit('update:modelValue', { ...modelValue, value: $event.target.value })"
                type="text" 
                required 
                class="flex-1 px-4 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text focus:outline-none focus:ring-2 focus:ring-gh-accent" 
                :placeholder="valuePlaceholder" 
            />
            <button 
                v-if="showRemove" 
                type="button" 
                @click="$emit('remove')" 
                class="px-3 py-2 bg-red-500 bg-opacity-20 border border-red-500 rounded-md text-red-400 hover:bg-opacity-30 transition-colors"
            >
                Remove
            </button>
        </div>
    </div>
</template>

<script setup>
defineProps({
    modelValue: {
        type: Object,
        required: true
    },
    labelPlaceholder: {
        type: String,
        default: 'Label'
    },
    valuePlaceholder: {
        type: String,
        default: 'Value'
    },
    showRemove: {
        type: Boolean,
        default: false
    }
})

defineEmits(['update:modelValue', 'remove'])
</script>
