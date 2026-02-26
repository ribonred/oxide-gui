<template>
    <div class="space-y-4">
        <div>
            <label class="block text-gh-text text-sm font-medium mb-2">
                Items to Order <span class="text-red-400">*</span>
            </label>
            <div 
                class="border border-gh-accent rounded-lg p-4 mb-4"
                style="background-color: color-mix(in srgb, var(--color-gh-accent) 10%, transparent); border-color: color-mix(in srgb, var(--color-gh-accent) 30%, transparent);"
            >
                <p class="text-sm text-gh-accent font-medium mb-2">⚠️ How it works:</p>
                <ul class="text-sm text-gh-text space-y-1 list-disc list-inside">
                    <li>The <strong>Label</strong> is used as the answer key - use random/unique values (avoid A,B,C or 1,2,3)</li>
                    <li>The <strong>Content</strong> is what users see and need to order</li>
                    <li>Enter items in the <strong>correct order</strong> here - they will be shuffled for users</li>
                </ul>
            </div>
            <div v-for="(item, index) in options" :key="index" class="mb-2">
                <div class="flex gap-2">
                    <span class="flex items-center justify-center w-12 h-10 bg-gh-bg border-2 border-gh-accent rounded-md text-gh-accent font-bold">
                        #{{ index + 1 }}
                    </span>
                    <input 
                        :value="item.label"
                        @input="updateOption(index, 'label', $event.target.value)"
                        type="text" 
                        required 
                        class="w-32 px-4 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text focus:outline-none focus:ring-2 focus:ring-gh-accent" 
                        :placeholder="`step${index + 1}`" 
                    />
                    <input 
                        :value="item.value"
                        @input="updateOption(index, 'value', $event.target.value)"
                        type="text" 
                        required 
                        class="flex-1 px-4 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text focus:outline-none focus:ring-2 focus:ring-gh-accent" 
                        :placeholder="`Item content (e.g., 'Mix dry ingredients')`" 
                    />
                    <Button 
                        v-if="options.length > 2" 
                        variant="danger"
                        size="sm"
                        @click="removeOption(index)" 
                    >
                        Remove
                    </Button>
                </div>
            </div>
            <Button 
                variant="secondary"
                @click="addOption" 
            >
                + Add Item
            </Button>
        </div>
    </div>
</template>

<script setup>
import Button from '~/components/ui/Button.vue'

const props = defineProps({
    options: {
        type: Array,
        required: true
    }
})

const emit = defineEmits(['update:options'])

const addOption = () => {
    emit('update:options', [...props.options, { label: '', value: '' }])
}

const removeOption = (index) => {
    const newOptions = [...props.options]
    newOptions.splice(index, 1)
    emit('update:options', newOptions)
}

const updateOption = (index, field, value) => {
    const newOptions = [...props.options]
    newOptions[index] = { ...newOptions[index], [field]: value }
    emit('update:options', newOptions)
}
</script>
